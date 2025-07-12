// Type definitions
export interface GreekWord {
  greek: string;
  pronunciation: string;
  meaning: string;
  difficulty: 1 | 2 | 3;
  greekSyllables: string;
}

export interface SessionStats {
  cardsShown: number;
  sessionTime: number;
  currentStreak: number;
}

// Filter words by difficulty
export function filterWordsByDifficulty(words: GreekWord[], difficulty: 1 | 2 | 3): GreekWord[] {
  return words.filter(word => word.difficulty <= difficulty);
}

// Get next card with spaced repetition logic
export function getNextCard(
  availableWords: GreekWord[],
  cardHistory: GreekWord[],
  recentCount: number = 5
): GreekWord {
  const recentCards = cardHistory.slice(-recentCount);
  const availableCards = availableWords.filter(word =>
    !recentCards.some(recent => recent.greek === word.greek)
  );
  if (availableCards.length === 0) {
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  }
  return availableCards[Math.floor(Math.random() * availableCards.length)];
}

// Update stats for next card
export function updateStatsForNextCard(prev: SessionStats): SessionStats {
  return {
    ...prev,
    cardsShown: prev.cardsShown + 1,
    currentStreak: prev.currentStreak + 1
  };
}

// Reset session stats
export function resetSessionStats(): SessionStats {
  return { cardsShown: 0, sessionTime: 0, currentStreak: 0 };
}

// Auto-advance difficulty
export function autoAdvanceDifficulty(cardsShown: number, currentDifficulty: 1 | 2 | 3): 1 | 2 | 3 {
  if (cardsShown > 0 && cardsShown % 10 === 0 && currentDifficulty < 3) {
    return (currentDifficulty + 1) as 1 | 2 | 3;
  }
  return currentDifficulty;
} 