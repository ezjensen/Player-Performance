export interface Player {
  name: string;
  team: string;
}

export interface LogEntry {
  timestamp: string;
  playerName: string;
  team: string;
  status: 'success' | 'skip' | 'error';
  message: string;
  pdfLink?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  companyLogo?: string;
  companyName?: string;
}

export interface ProcessingProgress {
  current: number;
  total: number;
  currentPlayer?: string;
  isComplete: boolean;
}