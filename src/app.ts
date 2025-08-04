import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import * as fs from 'fs';
import pdf from 'pdf-parse';
import { 
  ToolCall, 
  Message, 
  ChatResponse
} from './types';
import { tools, toolFunctions } from './tools';

// Load environment variables
dotenv.config({ override: true });

/**
 * Profile and Chat Management Class
 * Handles AI conversation and profile data
 */
class Me {
  private openai: OpenAI;
  private name: string;
  private linkedin: string;
  private summary: string;
  private initialized: boolean;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.name = "Bryan Chan";
    this.linkedin = "";
    this.summary = "";
    this.initialized = false;
  }

  private async init(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Try to read PDF file first, fallback to text file
      let linkedinContent = "";
      try {
        const pdfBuffer = fs.readFileSync('me/linkedin.pdf');
        const pdfData = await pdf(pdfBuffer);
        linkedinContent = pdfData.text;
      } catch (pdfError) {
        // Fallback to text file if PDF doesn't exist
        try {
          linkedinContent = fs.readFileSync('me/linkedin.txt', 'utf-8');
        } catch (txtError) {
          linkedinContent = "LinkedIn profile not available";
        }
      }
      this.linkedin = linkedinContent;

      // Read summary file
      try {
        this.summary = fs.readFileSync('me/summary.txt', 'utf-8');
      } catch (summaryError) {
        this.summary = "Professional summary not available";
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Me class:', error);
      // Set default values if files don't exist
      this.linkedin = "LinkedIn profile not available";
      this.summary = "Professional summary not available";
      this.initialized = true;
    }
  }

  private handleToolCall(toolCalls: ToolCall[]): Message[] {
    const results: Message[] = [];
    
    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name;
      const arguments_ = JSON.parse(toolCall.function.arguments);
      console.log(`Tool called: ${toolName}`);
      
      const tool = toolFunctions[toolName];
      let result = {};
      
      if (tool) {
        // Handle different function signatures
        if (toolName === 'record_user_details') {
          result = tool(arguments_.email, arguments_.name, arguments_.notes);
        } else if (toolName === 'record_unknown_question') {
          result = tool(arguments_.question);
        }
      }
      
      results.push({
        role: "tool",
        content: JSON.stringify(result),
        tool_call_id: toolCall.id
      });
    }
    
    return results;
  }

  private systemPrompt(): string {
    let systemPrompt = `You are acting as ${this.name}. You are answering questions on ${this.name}'s website, particularly questions related to ${this.name}'s career, background, skills and experience. Your responsibility is to represent ${this.name} for interactions on the website as faithfully as possible. You are given a summary of ${this.name}'s background and LinkedIn profile which you can use to answer questions. Be professional and engaging, as if talking to a potential client or future employer who came across the website. If you don't know the answer to any question, use your record_unknown_question tool to record the question that you couldn't answer, even if it's about something trivial or unrelated to career. If the user is engaging in discussion, try to steer them towards getting in touch via email; ask for their email and record it using your record_user_details tool. `;

    systemPrompt += `\n\n## Summary:\n${this.summary}\n\n## LinkedIn Profile:\n${this.linkedin}\n\n`;
    systemPrompt += `With this context, please chat with the user, always staying in character as ${this.name}.`;
    
    return systemPrompt;
  }

  async chat(message: string, history: Message[]): Promise<string> {
    // Ensure initialization is complete
    await this.init();
    
    const messages: Message[] = [
      { role: "system", content: this.systemPrompt() },
      ...history,
      { role: "user", content: message }
    ];

    let done = false;
    
    while (!done) {
      try {
        const response = await this.openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: messages as any,
          tools: tools as any
        }) as ChatResponse;

        if (response.choices[0].finish_reason === "tool_calls") {
          const assistantMessage = response.choices[0].message;
          const toolCalls = assistantMessage.tool_calls!;
          const results = this.handleToolCall(toolCalls);
          
          // Add the assistant message with tool_calls (this is the format OpenAI expects)
          messages.push(assistantMessage as any);
          
          // Add the tool results
          messages.push(...results);
        } else {
          done = true;
          return response.choices[0].message.content || "";
        }
      } catch (error) {
        console.error('Error in chat:', error);
        return "Sorry, I encountered an error. Please try again.";
      }
    }
    
    return "";
  }
}

// Export for use in other modules or web frameworks
export { Me };

// For direct execution (similar to Python's if __name__ == "__main__")
if (require.main === module) {
  const me = new Me();
  console.log("TypeScript version of the chat bot is ready!");
  // Note: You'll need to implement a web framework integration here
  // This could be Express.js, Fastify, or another Node.js web framework
  // since Gradio is Python-specific
}
