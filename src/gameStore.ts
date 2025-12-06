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
  returnToMenu: () => void;
  setAllowBacktracking: (allow: boolean) => void;
  setGameMode: (mode: 'easy' | 'challenge') => void;
}

const initialState: GameState & GameSettings = {
  startDocId: null,
  goalDocId: null,
  currentDocId: null,
  path: [],
  historyLog: [],
  moves: 0,
  startTime: null,
  status: 'idle',
  allowBacktracking: true,
  gameMode: 'challenge',
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

    set({
      startDocId: scenario.start,
      goalDocId: scenario.goal,
      currentDocId: scenario.start,
      path: [scenario.start],
      historyLog: [{ docId: scenario.start, viaBacktrack: false }],
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

    const currentDoc = mockWikiDocuments[state.currentDocId!];
    // 현재 문서에 연결된 노드만 클릭 가능
    if (!currentDoc.links.includes(nodeId)) {
      console.warn(`Cannot navigate to ${nodeId} - not linked from current document`);
      return;
    }

    // 이미 방문한 노드를 다시 방문하는 것도 허용 (위키레이싱에서는 일반적)
    const newPath = [...state.path, nodeId];
    const newHistory: NavigationStep[] = [...state.historyLog, { docId: nodeId, viaBacktrack: false }];
    const newMoves = state.moves + 1;

    // 목표 도달 여부 확인
    if (nodeId === state.goalDocId) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - state.startTime!) / 1000);
      const score = Math.max(1000 - (newMoves * 50) - timeTaken, 100);

      set({
        currentDocId: nodeId,
        path: newPath,
        historyLog: newHistory,
        moves: newMoves,
        status: 'finished',
        endTime,
        score,
      });
    } else {
      set({
        currentDocId: nodeId,
        path: newPath,
        historyLog: newHistory,
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
    const newCurrentId = newPath[newPath.length - 1];

    set({
      currentDocId: newCurrentId,
      path: newPath,
      moves: state.moves + 1, // 뒤로가기도 이동 횟수에 포함
      historyLog: [...state.historyLog, { docId: newCurrentId, viaBacktrack: true }],
    });
  },

  jumpToNode: (nodeId) => {
    const state = get();
    if (state.status !== 'playing') return;

    // 역링크 허용이 꺼져있으면 특정 지점으로 점프 불가
    if (!state.allowBacktracking) return;

    const targetIndex = state.path.indexOf(nodeId);
    // 경로에 없는 노드거나 이미 현재 노드면 무시
    if (targetIndex === -1 || targetIndex === state.path.length - 1) return;

    const newPath = state.path.slice(0, targetIndex + 1);

    set({
      currentDocId: nodeId,
      path: newPath,
      moves: state.moves + 1,
      historyLog: [...state.historyLog, { docId: nodeId, viaBacktrack: true }],
    });
  },

  jumpToNode: (nodeId) => {
    const state = get();
    if (state.status !== 'playing') return;

    // 역링크 허용이 꺼져있으면 특정 지점으로 점프 불가
    if (!state.allowBacktracking) return;

    const targetIndex = state.path.indexOf(nodeId);
    // 경로에 없는 노드거나 이미 현재 노드면 무시
    if (targetIndex === -1 || targetIndex === state.path.length - 1) return;

    const newPath = state.path.slice(0, targetIndex + 1);

    set({
      currentDocId: nodeId,
      path: newPath,
      moves: state.moves + 1,
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
