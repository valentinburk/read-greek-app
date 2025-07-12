import React from 'react';

// Utility function to get the full Greek word from syllables
export function getGreekWord(greekSyllables: string): string {
  return greekSyllables.replace(/-/g, '');
}

// Format pronunciation with syllable highlighting
export function formatPronunciation(pronunciation: string): React.ReactElement[] {
  if (!pronunciation) return [];
  return pronunciation.split('-').map((syllable: string, index: number) => {
    const isStressed: boolean = syllable === syllable.toUpperCase();
    return React.createElement(
      'span',
      {
        key: index,
        className: `${isStressed ? 'font-bold text-blue-600' : 'text-gray-600'} ${index > 0 ? 'ml-1' : ''}`
      },
      syllable,
      index < pronunciation.split('-').length - 1 && React.createElement('span', { className: 'text-gray-400' }, '·')
    );
  });
}

// Format Greek syllables with stress highlighting
export function formatGreekSyllables(greekSyllables: string, pronunciation: string): React.ReactElement[] {
  if (!greekSyllables || !pronunciation) return [];
  const greekSylls = greekSyllables.split('-');
  const latinSylls = pronunciation.split('-');
  return greekSylls.map((syllable: string, index: number) => {
    const correspondingLatin = latinSylls[index] || '';
    const isStressed: boolean = correspondingLatin === correspondingLatin.toUpperCase();
    return React.createElement(
      'span',
      {
        key: index,
        className: `${isStressed ? 'font-bold text-blue-600' : 'text-gray-600'} ${index > 0 ? 'ml-1' : ''}`
      },
      syllable,
      index < greekSylls.length - 1 && React.createElement('span', { className: 'text-gray-400' }, '·')
    );
  });
}

// Dynamic color palette for difficulty levels
const DIFFICULTY_COLORS: string[] = [
  'bg-green-100 text-green-800',   // 1
  'bg-yellow-100 text-yellow-800', // 2
  'bg-red-100 text-red-800',       // 3
  'bg-blue-100 text-blue-800',     // 4
  'bg-purple-100 text-purple-800', // 5
  'bg-pink-100 text-pink-800',     // 6
  'bg-orange-100 text-orange-800', // 7
  'bg-teal-100 text-teal-800',     // 8
  'bg-gray-100 text-gray-800'      // fallback/default
];

export function getDifficultyColor(diff: number): string {
  // Use color if defined, else fallback to last (gray)
  return DIFFICULTY_COLORS[diff - 1] || DIFFICULTY_COLORS[DIFFICULTY_COLORS.length - 1];
}

// Dynamic label palette for difficulty levels
const DIFFICULTY_LABELS: string[] = [
  'Short words',   // 1
  'Medium words',  // 2
  'Long words',    // 3
  'Very long words', // 4
  'Expert words',    // 5
  // Add more as needed
];

export function getDifficultyLabel(diff: number): string {
  // Use label if defined, else fallback to generic
  return DIFFICULTY_LABELS[diff - 1] || `Difficulty ${diff}`;
} 