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

export function getDifficultyColor(diff: 1 | 2 | 3): string {
  switch (diff) {
    case 1: return 'bg-green-100 text-green-800';
    case 2: return 'bg-yellow-100 text-yellow-800';
    case 3: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getDifficultyLabel(diff: number): string {
  switch (diff) {
    case 1: return 'Short words';
    case 2: return 'Medium words';
    case 3: return 'Long words';
    default: return `Difficulty ${diff}`;
  }
} 