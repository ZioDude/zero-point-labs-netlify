import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, ChatSession, Content, Part } from '@google/generative-ai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // For conversation_id

export const runtime = 'edge';

const MODEL_NAME = "gemini-1.5-flash-latest";
const EMBEDDING_MODEL_NAME = "embedding-001";

const API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // For calling internal API

if (!API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing environment variables for Gemini or Supabase.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "MISSING_API_KEY");
const supabase: SupabaseClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL_NAME });

const generationConfig = { temperature: 0.7, topK: 1, topP: 1, maxOutputTokens: 2048 };
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

interface ClientMessage { id: string; text: string; sender: 'user' | 'bot'; timestamp: Date | string; }
interface ConversationState {
  currentStep: string; // e.g., 'initial', 'qualification_project_type', 'qualification_industry', ...
  collectedInfo: {
    projectType?: string; // Website, Landing Page, Web App
    industry?: string;
    goals?: string;
    timeline?: string;
    name?: string;
    email?: string;
    phone?: string;
    conversationId?: string;
    hubspotContactId?: string; // Store after successful CRM submission
    upsellInterest?: string;
    // Mappings for /api/submit-form
    mainChoice?: string; // 'website', 'webapp', 'custom'
    websiteType?: string; // 'simple', 'ecommerce', 'complex'
    appPlatform?: string; // 'mobile', 'web', 'both'
    appDescription?: string;
    customDescription?: string;
    customTemplate?: string;
    budget?: string; // This is not in business-info.txt qualification flow, might need to ask or make default
    existingPresence?: string; // Also not in qualification flow
    inspiration?: string; // Also not in qualification flow
    preferredPlatform?: string; // Also not in qualification flow
  };
  geminiChatSession: ChatSession;
}

const activeConversations = new Map<string, ConversationState>();

function getOrCreateConversation(sessionId: string): ConversationState {
  if (!activeConversations.has(sessionId)) {
    const geminiChatSession = genAI.getGenerativeModel({ model: MODEL_NAME }).startChat({
      generationConfig, safetySettings, history: [],
    });
    activeConversations.set(sessionId, {
      currentStep: 'initial',
      collectedInfo: { conversationId: uuidv4() },
      geminiChatSession,
    });
  }
  return activeConversations.get(sessionId)!;
}

async function getEmbeddingValues(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

async function handleLeadSubmission(conversation: ConversationState) {
  const { collectedInfo } = conversation;

  let mainChoice = collectedInfo.mainChoice || '';
  let websiteType = collectedInfo.websiteType || '';
  let appPlatform = collectedInfo.appPlatform || '';

  if (mainChoice === 'website' && !websiteType) {
    websiteType = 'simple'; // Default if not specified
  }
  if (mainChoice === 'webapp' && !appPlatform) {
    appPlatform = 'web'; // Default if not specified
  }

  const crmPayload = {
    mainChoice: mainChoice,
    websiteType: websiteType,
    appPlatform: appPlatform,
    appDescription: mainChoice === 'webapp' ? collectedInfo.goals : '', // Only send if webapp
    customDescription: mainChoice === 'custom' ? collectedInfo.goals : '', // Only send if custom
    customTemplate: collectedInfo.customTemplate || '', // Needs to be collected
    budget: collectedInfo.budget || '', // Needs to be collected
    timeline: collectedInfo.timeline || '',
    existingPresence: collectedInfo.existingPresence || '', // Needs to be collected
    inspiration: collectedInfo.inspiration || '', // Needs to be collected
    preferredPlatform: collectedInfo.preferredPlatform || '', // Needs to be collected
    name: collectedInfo.name || '',
    email: collectedInfo.email || '',
    phone: collectedInfo.phone || '',
  };

  // Filter out empty strings for cleaner payload, though /api/submit-form might handle them
  const filteredPayload = Object.fromEntries(Object.entries(crmPayload).filter(([_, v]) => v !== ''));
  
  const submitUrl = `${NEXT_PUBLIC_APP_URL}/api/submit-form`;
  console.log(`Attempting to POST lead data to: ${submitUrl}`);
  console.log(`Payload for /api/submit-form:`, JSON.stringify(filteredPayload, null, 2));

  try {
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filteredPayload),
    });
    const result = await response.json();
    if (response.ok && result.success) {
      console.log("Lead submitted to HubSpot successfully:", result);
      collectedInfo.hubspotContactId = result.hubspotContactId; // Save HubSpot ID
      return { success: true, message: "Thanks! We'll be in touch soon.", hubspotData: result };
    } else {
      console.error("Failed to submit lead to HubSpot:", result);
      return { success: false, message: "There was an issue submitting your information. Please try again or contact us directly." };
    }
  } catch (error) {
    console.error("Error calling /api/submit-form:", error);
    return { success: false, message: "A technical error occurred while submitting your information." };
  }
}


export async function POST(request: Request) {
  if (!API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const { message, history: clientHistory = [], sessionId = uuidv4() }: { message: string; history: ClientMessage[]; sessionId?: string } = await request.json();
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

  const conversation = getOrCreateConversation(sessionId);
  const { collectedInfo, geminiChatSession } = conversation;
  let botReply = "";

  // --- RAG Functionality (Simplified for flow steps) ---
  const getRAGResponse = async (userQuery: string, instructionOverride?: string) => {
    const queryEmbedding = await getEmbeddingValues(userQuery);
    const { data: documents, error: dbError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding, match_threshold: 0.5, match_count: 3,
    });
    if (dbError) { console.error('Supabase error:', dbError); /* Handle error */ }
    const contextText = (documents && documents.length > 0) ? documents.map((doc: any) => doc.content).join("\n---\n") : "No relevant context found.";
    
    const ragPrompt = instructionOverride || `
      You are Zero Point Labs' AI Consulting Agent.
      Context: """${contextText}"""
      User's Question: "${userQuery}"
      Based *only* on the provided context, your answer is:`;
    const result = await geminiChatSession.sendMessage(ragPrompt);
    return result.response.text();
  };

  // --- Conversation Flow Logic ---
  // This is a simplified state machine. More complex logic might be needed.
  // The AI's responses should guide the user to provide the next piece of info.

  if (conversation.currentStep === 'initial') {
    botReply = "Hello! I'm Zero Point Labs' AI Consulting Agent. Are you looking to build a Website, a Landing Page, or a Web App?";
    conversation.currentStep = 'qualification_project_type';
  } else if (conversation.currentStep === 'qualification_project_type') {
    // TODO: Validate user's message for project type
    collectedInfo.projectType = message; // Simplistic, assumes user answers directly
    // Map to mainChoice for HubSpot
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("website")) collectedInfo.mainChoice = "website";
    else if (lowerMessage.includes("web app") || lowerMessage.includes("webapp")) collectedInfo.mainChoice = "webapp";
    else if (lowerMessage.includes("landing page")) {
        collectedInfo.mainChoice = "website"; // Assuming landing page is a type of website
        collectedInfo.websiteType = "simple"; // Or a specific type for landing pages
    } else collectedInfo.mainChoice = "custom"; // Fallback

    botReply = `Great! And what industry are you in (e.g., Gym, Restaurant, E-commerce)?`;
    conversation.currentStep = 'qualification_industry';
  } else if (conversation.currentStep === 'qualification_industry') {
    collectedInfo.industry = message;
    botReply = `Understood. What are the main goals for your ${collectedInfo.projectType || 'project'} in the ${collectedInfo.industry} industry, and who is your target audience?`;
    conversation.currentStep = 'qualification_goals';
  } else if (conversation.currentStep === 'qualification_goals') {
    collectedInfo.goals = message; // This might also capture target audience
    botReply = `Thanks! What's your preferred timeline for this project? (e.g., ASAP, 1-2 months, flexible)`;
    conversation.currentStep = 'qualification_timeline';
  } else if (conversation.currentStep === 'qualification_timeline') {
    collectedInfo.timeline = message;
    // Portfolio Showcase (simplified: show all examples for now, or use RAG for industry)
    // For a more targeted showcase, we'd use RAG here based on collectedInfo.industry and collectedInfo.projectType
    const portfolioInfo = await getRAGResponse(`Show portfolio examples for ${collectedInfo.industry} ${collectedInfo.projectType}`);
    botReply = `Okay, that helps. Here's some of our work that might be relevant:\n${portfolioInfo}\n\nTo move forward, could I get your name, email, and phone number?`;
    conversation.currentStep = 'lead_capture_details';
  } else if (conversation.currentStep === 'lead_capture_details') {
    // Rudimentary parsing of contact details. A real system would ask for each separately.
    // For now, assume user provides "Name, Email, Phone" or similar.
    // This needs to be more robust.
    const parts = message.split(/,|\n/).map(s => s.trim());
    collectedInfo.name = parts[0] || "Not Provided";
    collectedInfo.email = parts[1] || "Not Provided";
    collectedInfo.phone = parts[2] || "Not Provided";

    const submissionResult = await handleLeadSubmission(conversation);
    if (submissionResult.success) {
        // Upsell logic
        const upsellData = await getRAGResponse(`What is the AI upsell feature for the ${collectedInfo.industry} industry?`);
        // Extract feature description (this is brittle, depends on RAG output format)
        const featureDescription = upsellData.split(/\(.*\)/)[0].trim() || "an advanced AI feature"; 
        
        botReply = `${submissionResult.message} We've saved your details. By the way, for ${collectedInfo.industry} projects, many clients are interested in ${featureDescription}. Would you like to add this to your project discussion? (Yes/No)`;
        conversation.currentStep = 'upsell_decision';
    } else {
        botReply = submissionResult.message || "Sorry, there was an issue saving your details.";
        // Potentially loop back or end conversation
        conversation.currentStep = 'handoff'; // Or an error state
    }
  } else if (conversation.currentStep === 'upsell_decision') {
    if (message.toLowerCase().startsWith('yes')) {
      collectedInfo.upsellInterest = "Accepted"; // Or the specific feature
      // TODO: Call PATCH to CRM if endpoint supports it or re-POST with updated notes
      // For now, just log and proceed
      console.log(`User ${collectedInfo.email} accepted upsell for ${collectedInfo.industry}`);
      botReply = "Great! We've noted your interest in the AI feature. We'll discuss all this with you shortly. What are the best times for a brief call?";
    } else {
      collectedInfo.upsellInterest = "Declined";
      botReply = "No problem at all. We'll focus on the core project for now. What are the best times for a brief call to discuss your project?";
    }
    conversation.currentStep = 'handoff_scheduling';
  } else if (conversation.currentStep === 'handoff_scheduling') {
    // Collect scheduling info, or just provide a closing message
    botReply = "Thanks! We'll reach out soon to confirm a time. We're excited to learn more about your project!";
    conversation.currentStep = 'ended'; // Or reset to 'initial' for a new interaction
  } else { // Default RAG for general queries if not in a specific flow step
    botReply = await getRAGResponse(message);
  }

  activeConversations.set(sessionId, conversation); // Save updated state
  return NextResponse.json({ reply: botReply, conversationState: { currentStep: conversation.currentStep, collectedInfo: conversation.collectedInfo } });

}
