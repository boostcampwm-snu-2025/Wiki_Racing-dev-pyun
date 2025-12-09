import { create } from 'zustand';
import type { GameState, NavigationStep } from './types/wikirace';
import { getRandomScenario, mockWikiDocuments } from './data/mockWikiData';

/**
 * 게임 설정 상태
 */
interface GameSettings {
  allowBacktracking: boolean;
  gameMode: 'easy' | 'challenge';
}

/**
 * 상태를 변경하는 액션을 정의합니다.
 */
interface GameActions {
  startNewGame: () => void;
  navigateTo: (nodeId: string) => void;
  goBack: () => void;
  jumpToNode: (nodeId: string) => void;
  branchFromHistory: (branchId: string, nodeIndex: number) => void;
  returnToMenu: () => void;
  setAllowBacktracking: (allow: boolean) => void;
  setGameMode: (mode: 'easy' | 'challenge') => void;
}

const initialState: GameState & GameSettings = {
  startDocId: null,
  goalDocId: null,
  currentDocId: null,
  path: [],
  pathRefs: [],
  branches: [],
  activeBranchId: null,
  moves: 0,
  startTime: null,
  status: 'idle',
  allowBacktracking: true,
  gameMode: 'challenge',
  endTime: undefined,
  score: undefined,
};

const branchPalette = ['#6366f1', '#f97316', '#22c55e', '#ec4899', '#06b6d4', '#14b8a6'];

const createBranchId = (suffix?: string) =>
  `branch-${suffix ?? `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`}`;

const buildPathToNode = (
  branches: GameState['branches'],
  branchId: string,
  nodeIndex: number
) => {
  const branchMap = Object.fromEntries(branches.map(branch => [branch.id, branch]));
  let current = branchMap[branchId];
  let cursor = nodeIndex;
  const stack: { branch: (typeof branches)[number]; index: number }[] = [];

  while (current) {
    stack.unshift({ branch: current, index: cursor });
    if (!current.parentId) break;
    const parent = branchMap[current.parentId];
    if (!parent) break;
    cursor = current.parentIndex;
    current = parent;
  }

  const path: string[] = [];
  const pathRefs: { branchId: string; index: number }[] = [];

  stack.forEach((segment, segmentIdx) => {
    const startIdx = segmentIdx === 0 ? 0 : 1; // avoid duplicating the fork node
    for (let i = startIdx; i <= segment.index; i += 1) {
      const docId = segment.branch.nodes[i];
      path.push(docId);
      pathRefs.push({ branchId: segment.branch.id, index: i });
    }
  });

  return { path, pathRefs };
};

/**
 * Wiki Racing 게임 상태 관리를 위한 Zustand 스토어
 */
export const useGameStore = create<GameState & GameSettings & GameActions>((set, get) => ({
  ...initialState,

  startNewGame: () => {
    const scenario = getRandomScenario();
    console.log('Starting new game with scenario:', scenario);
    console.log('Start doc:', mockWikiDocuments[scenario.start]);
    console.log('Goal doc:', mockWikiDocuments[scenario.goal]);

    const mainBranchId = createBranchId('main');
    const mainBranch = {
      id: mainBranchId,
      parentIndex: 0,
      nodes: [scenario.start],
      nodeOrders: [0], // 시작 노드는 order 0
      color: branchPalette[0],
    };

    set({
      startDocId: scenario.start,
      goalDocId: scenario.goal,
      currentDocId: scenario.start,
      path: [scenario.start],
      pathRefs: [{ branchId: mainBranchId, index: 0 }],
      branches: [mainBranch],
      activeBranchId: mainBranchId,
      moves: 0,
      startTime: Date.now(),
      status: 'playing',
      endTime: undefined,
      score: undefined,
    });
  },

  navigateTo: (nodeId) => {
    const state = get();
    if (state.status !== 'playing') return;
    const { activeBranchId } = state;
    if (!activeBranchId) return;

    const currentDoc = mockWikiDocuments[state.currentDocId!];
    // 현재 문서에 연결된 노드만 클릭 가능
    if (!currentDoc.links.includes(nodeId)) {
      console.warn(`Cannot navigate to ${nodeId} - not linked from current document`);
      return;
    }

    const newMoves = state.moves + 1;
    const branches = state.branches.map(branch =>
      branch.id === activeBranchId
        ? {
            ...branch,
            nodes: [...branch.nodes, nodeId],
            nodeOrders: [...(branch.nodeOrders || []), newMoves]
          }
        : branch
    );
    const activeBranch = branches.find(branch => branch.id === activeBranchId);
    const branchIndex = activeBranch ? activeBranch.nodes.length - 1 : 0;

    // 이미 방문한 노드를 다시 방문하는 것도 허용 (위키레이싱에서는 일반적)
    const newPath = [...state.path, nodeId];
    const newPathRefs = [...state.pathRefs, { branchId: activeBranchId, index: branchIndex }];

    // 목표 도달 여부 확인
    if (nodeId === state.goalDocId) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - state.startTime!) / 1000);
      const score = Math.max(1000 - (newMoves * 50) - timeTaken, 100);
      
      set({
        currentDocId: nodeId,
        path: newPath,
        pathRefs: newPathRefs,
        branches,
        moves: newMoves,
        status: 'finished',
        endTime,
        score,
      });
    } else {
      set({
        currentDocId: nodeId,
        path: newPath,
        pathRefs: newPathRefs,
        branches,
        moves: newMoves,
      });
    }
  },

  goBack: () => {
    const state = get();
    if (state.status !== 'playing' || state.path.length <= 1) return;

    // 역링크 허용이 꺼져있으면 뒤로가기 불가
    if (!state.allowBacktracking) return;

    const newPath = state.path.slice(0, -1);
    const newPathRefs = state.pathRefs.slice(0, -1);
    const newCurrentId = newPath[newPath.length - 1];

    
    set({
      currentDocId: newCurrentId,
      path: newPath,
      pathRefs: newPathRefs,
      activeBranchId: newPathRefs[newPathRefs.length - 1]?.branchId ?? state.activeBranchId,
      moves: state.moves + 1,
    });
  },

  jumpToNode: (nodeId) => {
    const state = get();
    if (state.status !== 'playing') return;

    // 역링크 허용이 꺼져있으면 특정 지점으로 점프 불가
    if (!state.allowBacktracking) return;

    const targetIndex = state.path.lastIndexOf(nodeId);
    // 경로에 없는 노드거나 이미 현재 노드면 무시
    if (targetIndex === -1 || targetIndex === state.path.length - 1) return;

    const newPath = state.path.slice(0, targetIndex + 1);
    const newPathRefs = state.pathRefs.slice(0, targetIndex + 1);

    set({
      currentDocId: nodeId,
      path: newPath,
      pathRefs: newPathRefs,
      activeBranchId: newPathRefs[newPathRefs.length - 1]?.branchId ?? state.activeBranchId,
      moves: state.moves + 1,
    });
  },

  branchFromHistory: (branchId, nodeIndex) => {
    const state = get();
    if (state.status !== 'playing') return;
    const targetBranch = state.branches.find(branch => branch.id === branchId);
    if (!targetBranch) return;
    if (nodeIndex < 0 || nodeIndex >= targetBranch.nodes.length) return;
    if (!state.allowBacktracking) return;

    const forkDocId = targetBranch.nodes[nodeIndex];
    const { path, pathRefs } = buildPathToNode(state.branches, branchId, nodeIndex);

    const newBranchId = createBranchId();
    const color = branchPalette[state.branches.length % branchPalette.length];
    const newMoves = state.moves + 1;
    const newBranch = {
      id: newBranchId,
      parentId: branchId,
      parentIndex: nodeIndex,
      nodes: [forkDocId],
      nodeOrders: [newMoves], // 분기 시작 노드의 order
      color,
    };

    set({
      currentDocId: forkDocId,
      path,
      pathRefs,
      branches: [...state.branches, newBranch],
      activeBranchId: newBranchId,
      moves: newMoves,
    });
  },

  setAllowBacktracking: (allow) => {
    set({ allowBacktracking: allow });
  },

  setGameMode: (mode) => {
    set({ gameMode: mode });
  },

  returnToMenu: () => {
    const state = get();
    set({
      ...initialState,
      allowBacktracking: state.allowBacktracking,
      gameMode: state.gameMode,
      status: 'idle',
    });
  },
}));
