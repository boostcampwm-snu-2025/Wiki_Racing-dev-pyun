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
  /**
   * 상세 브랜치 트래킹을 위해 각 방문 기록이 어떤 브랜치/인덱스에 대응하는지 저장합니다.
   */
  pathRefs: { branchId: string; index: number }[];
  /**
   * git branch 스타일 시각화를 위한 브랜치 트리 구조
   */
  branches: {
    id: string;
    parentId?: string;
    parentIndex: number;
    nodes: string[];
    nodeOrders?: number[]; // 각 노드가 생성된 글로벌 순서 (moves 기준)
    color: string;
  }[];
  activeBranchId: string | null;
  moves: number;
  startTime: number | null;
  endTime?: number;
  score?: number;
  status: 'idle' | 'playing' | 'finished';
  allowBacktracking: boolean;
}

export interface NavigationStep {
  docId: string;
  viaBacktrack: boolean;
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
