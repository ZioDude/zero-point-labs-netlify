import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Explicitly load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// --- Configuration ---
const BUSINESS_INFO_PATH = path.join(process.cwd(), 'src', 'data', 'business-info.txt');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL_NAME = "embedding-001";
const DB_TABLE_NAME = "documents";
// Max words per chunk. Approx 300 words ~ 400-500 tokens. Adjust as needed.
const MAX_WORDS_PER_CHUNK = 300; 

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GEMINI_API_KEY) {
  console.error("Error: Missing required environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY).");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL_NAME });

// --- Helper Functions ---
function chunkByNumberedSections(text) {
  const chunks = [];
  // Regex to split by "N. Section Title:" pattern
  // It will capture the "N. Section Title" as part of the chunk content.
  const sections = text.split(/\n(?=\d+\.\s+[A-Za-z\s]+:\s*\n)/);

  let currentSectionNumber = 0;
  for (const sectionText of sections) {
    if (sectionText.trim() === "Zero Point AI Consulting Bot - Business Details") { // Skip the main title if it's separated
        chunks.push({content: sectionText.trim(), metadata: { source_section: "Main Title" }});
        continue;
    }
    
    const sectionHeaderMatch = sectionText.match(/^(\d+)\.\s+([^:\n]+):/);
    let sectionTitle = `Section ${currentSectionNumber + 1}`; // Fallback title
    if (sectionHeaderMatch) {
      currentSectionNumber = parseInt(sectionHeaderMatch[1], 10);
      sectionTitle = `${sectionHeaderMatch[1]}. ${sectionHeaderMatch[2]}`;
    }

    const words = sectionText.trim().split(/\s+/);
    if (words.length <= MAX_WORDS_PER_CHUNK) {
      chunks.push({ content: sectionText.trim(), metadata: { source_section: sectionTitle } });
    } else {
      // If a section is too long, split it further by paragraphs or word count
      const paragraphs = sectionText.trim().split(/\n\s*\n/).filter(p => p.trim() !== '');
      let currentSubChunk = "";
      for (const para of paragraphs) {
        const paraWords = para.split(/\s+/);
        if ((currentSubChunk.split(/\s+/).length + paraWords.length) > MAX_WORDS_PER_CHUNK && currentSubChunk) {
          chunks.push({ content: currentSubChunk.trim(), metadata: { source_section: `${sectionTitle} (part)` } });
          currentSubChunk = para;
        } else {
          currentSubChunk = currentSubChunk ? `${currentSubChunk}\n\n${para}` : para;
        }
      }
      if (currentSubChunk) {
        chunks.push({ content: currentSubChunk.trim(), metadata: { source_section: `${sectionTitle} (part)` } });
      }
    }
  }
  return chunks.filter(chunk => chunk.content.length > 10); // Filter out very small/empty chunks
}


async function getEmbedding(text) {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error(`Failed to get embedding for text chunk: "${text.substring(0, 50)}..."`, error);
    throw error;
  }
}

// --- Main Ingestion Logic ---
async function main() {
  console.log("Starting data ingestion process with new chunking strategy...");

  let fileContent;
  try {
    fileContent = await fs.readFile(BUSINESS_INFO_PATH, 'utf-8');
    console.log(`Successfully read ${BUSINESS_INFO_PATH}`);
  } catch (error) {
    console.error(`Error reading file ${BUSINESS_INFO_PATH}:`, error);
    process.exit(1);
  }

  const chunkObjects = chunkByNumberedSections(fileContent);
  if (chunkObjects.length === 0) {
    console.log("No content chunks found. Exiting.");
    return;
  }
  console.log(`Content split into ${chunkObjects.length} chunks based on sections.`);
  // chunkObjects.forEach((c, i) => console.log(`Chunk ${i+1} (${c.metadata.source_section}):\n${c.content.substring(0,100)}...\n`));


  const CLEAR_TABLE = true;
  if (CLEAR_TABLE) {
    console.log(`Clearing existing documents from table "${DB_TABLE_NAME}"...`);
    const { error: deleteError } = await supabase.from(DB_TABLE_NAME).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
      console.error("Error clearing table:", deleteError);
    } else {
      console.log("Table cleared successfully.");
    }
  }

  console.log("Generating embeddings and inserting into Supabase...");
  let successfulInserts = 0;
  for (let i = 0; i < chunkObjects.length; i++) {
    const chunkObj = chunkObjects[i];
    console.log(`Processing chunk ${i + 1}/${chunkObjects.length} (Source: ${chunkObj.metadata.source_section})...`);
    try {
      const embedding = await getEmbedding(chunkObj.content);
      // Ensure your 'documents' table in Supabase has a 'metadata' column of type JSONB
      // If not, you'll need to alter the table or remove metadata from the insert.
      // For now, assuming 'metadata' column exists. If not, remove it from the insert object.
      const { error } = await supabase
        .from(DB_TABLE_NAME)
        .insert({ content: chunkObj.content, embedding: embedding, metadata: chunkObj.metadata });

      if (error) {
        console.error(`Error inserting chunk ${i + 1} into Supabase:`, error);
         if (error.message.includes("column \"metadata\" of relation \"documents\" does not exist")) {
            console.warn("  Hint: Your 'documents' table might be missing a 'metadata' column (type JSONB). Try adding it or remove metadata from the script.");
        }
      } else {
        successfulInserts++;
      }
    } catch (embeddingError) {
      console.error(`Skipping chunk ${i + 1} due to embedding error.`);
    }
    if ((i + 1) % 5 === 0 && i < chunkObjects.length -1) { // Delay every 5 chunks
        await new Promise(resolve => setTimeout(resolve, 1000)); 
    }
  }

  console.log("\n--- Ingestion Summary ---");
  console.log(`Total chunks processed: ${chunkObjects.length}`);
  console.log(`Successfully inserted into Supabase: ${successfulInserts}`);
  console.log(`Failed or skipped: ${chunkObjects.length - successfulInserts}`);
  console.log("Data ingestion process finished.");
}

main().catch(error => {
  console.error("An unexpected error occurred during the ingestion process:", error);
  process.exit(1);
});
