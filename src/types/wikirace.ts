export interface WikiDocument {
  id: string;
  title: string;
  links: string[]; // IDs of linked documents
  content?: string;
}

export interface GameState {
  startDocId: string;
  goalDocId: string;
  currentDocId: string;
  path: string[]; // Stack of document IDs visited
  moves: number;
  startTime: number;
  endTime?: number;
  isComplete: boolean;
  score?: number;
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
