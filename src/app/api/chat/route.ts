import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

// Company knowledge base
const COMPANY_CONTEXT = `
You are ZeroBot, an AI assistant for Zero Point Labs. Give SHORT, CONCISE answers - 2-3 sentences max unless specifically asked for details.

SERVICES & PRICING:
• **Landing Page** - €350 (7 days, single page, responsive, SEO, hosting)
• **Business Website** - €500 (14 days, multi-page, CMS, analytics, hosting)
• **Web App** - Custom pricing (full functionality, database, auth, APIs)
• **Automations** - €100+ (Zapier, email campaigns, CRM, AI integration)

PROCESS: Design → Develop → Deploy

TECH STACK: Next.js, React, TypeScript, Tailwind CSS, Node.js, AI integration

WHY US: ✨ Expert developers, 🤖 AI solutions, ⚡ Fast delivery, 💰 Fair pricing

Keep responses brief and friendly. Use **bold** for key terms. If they want details, ask what specifically they'd like to know more about.
`;

export async function POST(req: NextRequest) {
  let message = "";
  
  try {
    const body = await req.json();
    message = body.message;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "Hi! I'm ZeroBot, but I need an API key to function. Contact our team directly - we offer **web development** starting at €350!"
      });
    }

    // Initialize OpenAI client only when API key is available
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('Making OpenAI API call...');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: COMPANY_CONTEXT
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 
      "I'm sorry, I couldn't process that request. Could you please try asking again?";

    console.log('OpenAI response received:', response);

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Only return error message, no fallback responses
    return NextResponse.json({
      response: "I'm having technical difficulties right now. Please try again in a moment!"
    });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Chat API is running',
    status: 'OK',
    hasApiKey: !!process.env.OPENAI_API_KEY
  });
} 