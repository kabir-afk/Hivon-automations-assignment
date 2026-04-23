import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function generateBlogSummary(contentBody) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  if (!contentBody) {
    throw new Error('Content body is required for summary generation');
  }
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following blog post in exactly 200 words.

        Output requirements:
        - Plain text only
        - Do NOT use markdown
        - Do NOT use bold, italics, bullet points, or symbols like ** or *
        - Do NOT include headings
        - Write as a single paragraph

        Blog post:
        ${contentBody}`,
  });
  console.log(response.text);
  return response.text
}