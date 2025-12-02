import React from 'react';

export interface SessionConfig {
  id: string;
  name: string;
  os: 'debian' | 'ubuntu' | 'centos';
  ipAddress: string;
  hostname: string;
  username: string;
  domain: string;
  port: number;
}

export interface CommandStep {
  id: string;
  title: string;
  description: string;
  commandTemplate: string; // Contains placeholders like {{IP}}
  highlightedVars: string[]; // Variables that the user needs to pay attention to
}

export interface Topic {
  id: string;
  category: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: CommandStep[];
  aiPromptContext: string; // Context for AI when asking about this topic
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}