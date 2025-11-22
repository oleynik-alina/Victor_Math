export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isThinking?: boolean;
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  label: string; // e.g., "Task Sheet", "Handwriting"
}