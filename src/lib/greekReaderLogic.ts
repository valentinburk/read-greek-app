import { GreekWord } from './types';

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
    !recentCards.some(recent => recent.greek.replace(/-/g, '') === word.greek.replace(/-/g, ''))
  );
  if (availableCards.length === 0) {
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  }
  return availableCards[Math.floor(Math.random() * availableCards.length)];
} 