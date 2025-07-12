'use client';

import React, { useState, useEffect, useCallback } from 'react';
import greekWordsData from '../data/greekWords.json';
import { GreekWord } from '../lib/types';
import { filterWordsByDifficulty, getAvailableDifficulties } from '../lib/greekReaderLogic';
import { Header } from '../components/Header';
import { GreekCard } from '../components/GreekCard';
import { NavigationButtons } from '../components/NavigationButtons';
import { Settings } from '../components/Settings';

const GreekSpeedReader: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<GreekWord | null>(null);
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([1]);
  const [showGreekSyllables, setShowGreekSyllables] = useState<boolean>(true);
  const [showPhoneticPronunciation, setShowPhoneticPronunciation] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [availableWords, setAvailableWords] = useState<GreekWord[]>([]);
  const [isCardTransitioning, setIsCardTransitioning] = useState<boolean>(false);

  // Get available difficulties from the data
  const availableDifficulties = getAvailableDifficulties(greekWordsData as GreekWord[]);

  // Filter words by selected difficulties
  useEffect(() => {
    const filteredWords: GreekWord[] = filterWordsByDifficulty(greekWordsData as GreekWord[], selectedDifficulties);
    setAvailableWords(filteredWords);
    // Set initial random card
    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      setCurrentCard(filteredWords[randomIndex]);
    }
  }, [selectedDifficulties]);

  const showNextCard = useCallback((): void => {
    if (availableWords.length > 0) {
      setIsCardTransitioning(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        setCurrentCard(availableWords[randomIndex]);
        setTimeout(() => {
          setIsCardTransitioning(false);
        }, 50);
      }, 300);
    }
  }, [availableWords]);

  const handleGreekSyllablesToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowGreekSyllables(e.target.checked);
  };

  const handlePhoneticPronunciationToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowPhoneticPronunciation(e.target.checked);
  };

  const handleDifficultyToggle = (difficulty: number): void => {
    setSelectedDifficulties(prev => {
      if (prev.includes(difficulty)) {
        // Don't allow deselecting the last difficulty
        if (prev.length === 1) return prev;
        return prev.filter(d => d !== difficulty);
      } else {
        return [...prev, difficulty].sort((a, b) => a - b);
      }
    });
  };

  const toggleSettings = (): void => {
    if (showSettings) {
      setIsClosing(true);
      setTimeout(() => {
        setShowSettings(false);
        setIsClosing(false);
      }, 300);
    } else {
      setShowSettings(true);
      setIsOpening(true);
      setTimeout(() => {
        setIsOpening(false);
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto pt-6">
        <Header />

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          {currentCard && (
            <GreekCard
              card={currentCard}
              showGreekSyllables={showGreekSyllables}
              showPhoneticPronunciation={showPhoneticPronunciation}
              isTransitioning={isCardTransitioning}
            />
          )}
        </div>

        <NavigationButtons
          onNextCard={showNextCard}
          onToggleSettings={toggleSettings}
        />

        <Settings
          showSettings={showSettings}
          isClosing={isClosing}
          isOpening={isOpening}
          showGreekSyllables={showGreekSyllables}
          showPhoneticPronunciation={showPhoneticPronunciation}
          selectedDifficulties={selectedDifficulties}
          availableDifficulties={availableDifficulties}
          onToggleSettings={toggleSettings}
          onGreekSyllablesToggle={handleGreekSyllablesToggle}
          onPhoneticPronunciationToggle={handlePhoneticPronunciationToggle}
          onDifficultyToggle={handleDifficultyToggle}
        />
      </div>
    </div>
  );
};

export default GreekSpeedReader;