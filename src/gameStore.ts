import { create } from 'zustand';
import type { GameState } from '../types/wikirace';
import { getRandomScenario, mockWikiDocuments } from '../data/mockWikiData';

/**
 * 상태를 변경하는 액션을 정의합니다.
 */
interface GameActions {
  startNewGame: () => void;
  navigateTo: (nodeId: string) => void;
  goBack: () => void;
}

const initialState: GameState = {
  startDocId: null,
  goalDocId: null,
  currentDocId: null,
  path: [],
  moves: 0,
  startTime: null,
  status: 'idle',
};

/**
 * Wiki Racing 게임 상태 관리를 위한 Zustand 스토어
 */
export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  startNewGame: () => {
    const scenario = getRandomScenario();
    set({
      startDocId: scenario.start,
      goalDocId: scenario.goal,
      currentDocId: scenario.start,
      path: [scenario.start],
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
    // 현재 문서에 연결된 노드이거나, 이미 방문한 경로의 노드가 아니어야 함
    if (!currentDoc.links.includes(nodeId) || state.path.includes(nodeId)) {
      return;
    }

    const newPath = [...state.path, nodeId];
    const newMoves = state.moves + 1;

    // 목표 도달 여부 확인
    if (nodeId === state.goalDocId) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - state.startTime!) / 1000);
      const score = Math.max(1000 - (newMoves * 50) - timeTaken, 100);
      
      set({
        currentDocId: nodeId,
        path: newPath,
        moves: newMoves,
        status: 'finished',
        endTime,
        score,
      });
    } else {
      set({
        currentDocId: nodeId,
        path: newPath,
        moves: newMoves,
      });
    }
  },

  goBack: () => {
    const state = get();
    if (state.status !== 'playing' || state.path.length <= 1) return;

    const newPath = state.path.slice(0, -1);
    const newCurrentId = newPath[newPath.length - 1];
    
    set({
      currentDocId: newCurrentId,
      path: newPath,
      moves: state.moves + 1, // 뒤로가기도 이동 횟수에 포함
    });
  },
}));