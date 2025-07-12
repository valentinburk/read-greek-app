// Type definitions
export interface GreekWord {
  pronunciation: string;
  meaning: string;
  difficulty: 1 | 2 | 3;
  greek: string;
}

// Utility function to get the full Greek word from syllables
export function getGreekWord(greekSyllables: string): string {
  return greekSyllables.replace(/-/g, '');
}

export interface SessionStats {
  cardsShown: number;
  sessionTime: number;
  currentStreak: number;
}

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Filter words by selected difficulties
export function filterWordsByDifficulty(words: GreekWord[], selectedDifficulties: number[]): GreekWord[] {
  return words.filter(word => selectedDifficulties.includes(word.difficulty));
}

// Get all available difficulties from the word list
export function getAvailableDifficulties(words: GreekWord[]): number[] {
  const difficulties = new Set(words.map(word => word.difficulty));
  return Array.from(difficulties).sort((a, b) => a - b);
}

// Get next card with spaced repetition logic
export function getNextCard(
  availableWords: GreekWord[],
  cardHistory: GreekWord[],
  recentCount: number = 5
): GreekWord {
  const recentCards = cardHistory.slice(-recentCount);
  const availableCards = availableWords.filter(word =>
    !recentCards.some(recent => getGreekWord(recent.greekSyllables) === getGreekWord(word.greekSyllables))
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