export interface GreekWord {
  pronunciation: string;
  meaning: string;
  difficulty: 1 | 2 | 3;
  greek: string;
}

export interface SessionStats {
  cardsShown: number;
  sessionTime: number;
  currentStreak: number;
} 