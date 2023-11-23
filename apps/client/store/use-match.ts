import { User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 } from "uuid";

interface UseMatch {
  matchInfo?: MatchType;
  setMatchInfo: (newInfo: MatchType) => void;
  matchId: string;
  setMatchId: (id: string) => void;
  enemy?: User;
  setEnemy: (user: User) => void;
  isMyTurn: boolean;
  setIsMyTurn: (turn: boolean) => void;
  myMoves: { x: number; y: number; result: "ship" | "water" }[];
  addMyMoves: (newMove: {
    x: number;
    y: number;
    result: "ship" | "water";
  }) => void;
  enemyMoves: { x: number; y: number; result: "ship" | "water" }[];
  addEnemyMoves: (newMove: {
    x: number;
    y: number;
    result: "ship" | "water";
  }) => void;
  resetMatch: () => void;
}

export const useMatch = create<UseMatch>()(
  persist(
    (set) => ({
      matchInfo: {
        timePerMove: 10,
        totalTime: 3,
        incrementOnMove: 2,
        size: 10,
        ship: 16,
      } as MatchType,
      setMatchInfo(newInfo) {
        set({ matchInfo: newInfo });
      },
      matchId: v4(),
      setMatchId(id) {
        set({ matchId: id });
      },
      setEnemy(user) {
        set({ enemy: user });
      },
      isMyTurn: false,
      setIsMyTurn(turn) {
        set({ isMyTurn: turn });
      },
      myMoves: [],
      addMyMoves(newMove) {
        set((state) => ({ myMoves: [...state.myMoves, newMove] }));
      },
      enemyMoves: [],
      addEnemyMoves(newMove) {
        set((state) => ({ enemyMoves: [...state.enemyMoves, newMove] }));
      },
      resetMatch() {
        set({ myMoves: [], enemyMoves: [] });
      },
    }),
    { name: "matchStore" }
  )
);
