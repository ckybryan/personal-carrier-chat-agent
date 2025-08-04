export interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
      tool_calls?: ToolCall[];
    };
    finish_reason: string;
  }>;
}

export interface ChatRequest {
  message: string;
  history: Message[];
}

export interface ApiResponse {
  response: string;
}

export interface ToolFunction {
  (...args: any[]): { recorded: string };
}

export interface ToolRegistry {
  [key: string]: ToolFunction;
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, any>;
      required: string[];
      additionalProperties: boolean;
    };
  };
}
