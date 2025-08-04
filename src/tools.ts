import axios from 'axios';
import { ToolFunction, ToolDefinition, ToolRegistry } from './types';

/**
 * Send a push notification via Pushover
 * @param text - Message to send
 */
async function push(text: string): Promise<void> {
  try {
    await axios.post('https://api.pushover.net/1/messages.json', {
      token: process.env.PUSHOVER_TOKEN,
      user: process.env.PUSHOVER_USER,
      message: text,
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

/**
 * Record user contact details
 */
function record_user_details(
  email: string, 
  name: string = "Name not provided", 
  notes: string = "not provided"
): { recorded: string } {
  push(`Recording ${name} with email ${email} and notes ${notes}`);
  return { recorded: "ok" };
}

/**
 * Record unknown questions for future reference
 */
function record_unknown_question(question: string): { recorded: string } {
  push(`Recording ${question}`);
  return { recorded: "ok" };
}

// Tool definitions for OpenAI API
export const record_user_details_json: ToolDefinition = {
  type: "function",
  function: {
    name: "record_user_details",
    description: "Use this tool to record that a user is interested in being in touch and provided an email address",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "The email address of this user"
        },
        name: {
          type: "string",
          description: "The user's name, if they provided it"
        },
        notes: {
          type: "string",
          description: "Any additional information about the conversation that's worth recording to give context"
        }
      },
      required: ["email"],
      additionalProperties: false
    }
  }
};

export const record_unknown_question_json: ToolDefinition = {
  type: "function",
  function: {
    name: "record_unknown_question",
    description: "Always use this tool to record any question that couldn't be answered as you didn't know the answer",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "The question that couldn't be answered"
        }
      },
      required: ["question"],
      additionalProperties: false
    }
  }
};

// Available tools for OpenAI
export const tools: ToolDefinition[] = [
  record_user_details_json,
  record_unknown_question_json
];

// Function registry for tool execution
export const toolFunctions: ToolRegistry = {
  record_user_details,
  record_unknown_question
};
