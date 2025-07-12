import React from 'react';
import { GreekWord } from '../lib/types';
import { getGreekWord, formatPronunciation, formatGreekSyllables, getDifficultyColor } from '../lib/utils';

interface GreekCardProps {
  card: GreekWord;
  showGreekSyllables: boolean;
  showPhoneticPronunciation: boolean;
  isTransitioning: boolean;
}

export const GreekCard: React.FC<GreekCardProps> = ({
  card,
  showGreekSyllables,
  showPhoneticPronunciation,
  isTransitioning
}) => {
  return (
    <div className={`text-center space-y-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* Greek Word */}
      <div className="space-y-4">
        <h2 className="font-bold text-gray-900 tracking-wide text-3xl sm:text-3xl md:text-5xl lg:text-6xl pb-2">
          {getGreekWord(card.greek)}
        </h2>

        {/* Pronunciation */}
        {(showGreekSyllables || showPhoneticPronunciation) && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {/* Greek Syllables */}
            {showGreekSyllables && (
              <div>
                <div className="text-xs/7 sm:text-sm md:text-lg lg:text-xl font-mono">
                  {formatGreekSyllables(card.greek, card.pronunciation)}
                </div>
              </div>
            )}

            {/* Latin Pronunciation */}
            {showPhoneticPronunciation && (
              <div>
                <div className="text-xs/7 sm:text-sm md:text-lg lg:text-xl font-mono">
                  {formatPronunciation(card.pronunciation)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meaning */}
        <div className="text-xl sm:text-2xl md:text-2xl text-gray-600">
          <span className="font-medium">Meaning:</span> {card.meaning}
        </div>

        {/* Difficulty Badge */}
        <div className="flex justify-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(card.difficulty)}`}>
            Difficulty {card.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}; 