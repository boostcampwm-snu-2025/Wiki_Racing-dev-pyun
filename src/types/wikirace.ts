export interface WikiDocument {
  id: string;
  title: string;
  links: string[]; // IDs of linked documents
  content?: string;
}

export interface GameState {
  startDocId: string | null;
  goalDocId: string | null;
  currentDocId: string | null;
  path: string[]; // Stack of document IDs visited
  moves: number;
  startTime: number | null;
  endTime?: number;
  score?: number;
  status: 'idle' | 'playing' | 'finished';
}

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  startDoc: string;
  goalDoc: string;
  difficulty: string;
  score: number;
  moves: number;
  time: number;
  path: string[];
  isCurrentUser?: boolean;
}

export interface VisualNode {
  id: string;
  title: string;
  x: number;
  y: number;
  depth: number;
  isInPath: boolean;
  isStart: boolean;
  isGoal: boolean;
  isCurrent: boolean;
}
