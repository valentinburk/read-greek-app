'use client';

import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import { ChevronRight, Settings } from 'lucide-react';
import greekWordsData from '../data/greekWords.json';
import {
  GreekWord,
  filterWordsByDifficulty,
  getGreekWord,
  getAvailableDifficulties
} from '../lib/greekReaderLogic';

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

  // Format pronunciation with syllable highlighting
  const formatPronunciation = (pronunciation: string): ReactElement[] => {
    if (!pronunciation) return [];
    return pronunciation.split('-').map((syllable: string, index: number) => {
      const isStressed: boolean = syllable === syllable.toUpperCase();
      return (
        <span
          key={index}
          className={`${isStressed ? 'font-bold text-blue-600' : 'text-gray-600'} 
                     ${index > 0 ? 'ml-1' : ''}`}
        >
          {syllable}
          {index < pronunciation.split('-').length - 1 && (
            <span className="text-gray-400">·</span>
          )}
        </span>
      );
    });
  };

  // Format Greek syllables with stress highlighting
  const formatGreekSyllables = (greekSyllables: string, pronunciation: string): ReactElement[] => {
    if (!greekSyllables || !pronunciation) return [];
    const greekSylls = greekSyllables.split('-');
    const latinSylls = pronunciation.split('-');
    return greekSylls.map((syllable: string, index: number) => {
      const correspondingLatin = latinSylls[index] || '';
      const isStressed: boolean = correspondingLatin === correspondingLatin.toUpperCase();
      return (
        <span
          key={index}
          className={`${isStressed ? 'font-bold text-blue-600' : 'text-gray-600'} 
                     ${index > 0 ? 'ml-1' : ''}`}
        >
          {syllable}
          {index < greekSylls.length - 1 && (
            <span className="text-gray-400">·</span>
          )}
        </span>
      );
    });
  };

  const getDifficultyColor = (diff: 1 | 2 | 3): string => {
    switch (diff) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (diff: number): string => {
    switch (diff) {
      case 1: return 'Short words';
      case 2: return 'Medium words';
      case 3: return 'Long words';
      default: return `Difficulty ${diff}`;
    }
  };

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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Ελληνικά
          </h1>
          <p className="text-gray-400 pt-2">
            Practice your Greek reading skills
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          {currentCard && (
            <div className={`text-center space-y-6 transition-opacity duration-300 ${isCardTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {/* Greek Word */}
              <div className="space-y-4">
                <h2 className="font-bold text-gray-900 tracking-wide text-3xl sm:text-3xl md:text-5xl lg:text-6xl pb-2">
                  {getGreekWord(currentCard.greek)}
                </h2>

                {/* Pronunciation */}
                {(showGreekSyllables || showPhoneticPronunciation) && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    

                    {/* Greek Syllables */}
                    {showGreekSyllables && (
                      <div>
                        <div className="text-xs/7 sm:text-sm md:text-lg lg:text-xl font-mono">
                          {formatGreekSyllables(currentCard.greek, currentCard.pronunciation)}
                        </div>
                      </div>
                    )}

                    {/* Latin Pronunciation */}
                    {showPhoneticPronunciation && (
                      <div>
                        <div className="text-xs/7 sm:text-sm md:text-lg lg:text-xl font-mono">
                          {formatPronunciation(currentCard.pronunciation)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Meaning */}
                <div className="text-xl sm:text-2xl md:text-2xl text-gray-600">
                  <span className="font-medium">Meaning:</span> {currentCard.meaning}
                </div>

                {/* Difficulty Badge */}
                <div className="flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                    Difficulty {currentCard.difficulty}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Card Button - Fixed at bottom center */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={showNextCard}
            className="bg-green-500 hover:bg-green-600 rounded-full pt-3 pb-3 pl-8 pr-4 shadow-lg border border-green-200 hover:shadow-xl transition-all flex items-center text-white font-medium"
          >
            <span className="mr-2">Next</span>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Settings Gear Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={toggleSettings}
            className="bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <Settings className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Settings Popup */}
        {showSettings && (
          <div
            className={`fixed inset-0 bg-black/50 flex items-end justify-center z-50 transition-opacity duration-300 ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={toggleSettings}
          >
            <div
              className={`bg-white rounded-t-xl shadow-lg border border-gray-200 p-6 max-w-sm w-full mx-4 mb-0 transition-transform duration-300 ease-out ${
                isClosing ? 'translate-y-full' : isOpening ? 'translate-y-full' : 'translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <button
                  onClick={toggleSettings}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Show Greek syllables</span>
                  <span className="relative inline-block w-11 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      checked={showGreekSyllables}
                      onChange={handleGreekSyllablesToggle}
                      className="sr-only peer"
                    />
                    <span
                      className={`
                        block h-6 rounded-full transition-colors duration-200
                        ${showGreekSyllables ? 'bg-blue-600' : 'bg-gray-200'}
                      `}
                    ></span>
                    <span
                      className={`
                        absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                        ${showGreekSyllables ? 'translate-x-5' : ''}
                      `}
                    ></span>
                  </span>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Show phonetic pronunciation</span>
                  <span className="relative inline-block w-11 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      checked={showPhoneticPronunciation}
                      onChange={handlePhoneticPronunciationToggle}
                      className="sr-only peer"
                    />
                    <span
                      className={`
                        block h-6 rounded-full transition-colors duration-200
                        ${showPhoneticPronunciation ? 'bg-blue-600' : 'bg-gray-200'}
                      `}
                    ></span>
                    <span
                      className={`
                        absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                        ${showPhoneticPronunciation ? 'translate-x-5' : ''}
                      `}
                    ></span>
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty levels:</label>
                  <div className="space-y-2">
                    {availableDifficulties.map((difficulty) => (
                      <label key={difficulty} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {difficulty} ({getDifficultyLabel(difficulty)})
                        </span>
                        <span className="relative inline-block w-11 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            checked={selectedDifficulties.includes(difficulty)}
                            onChange={() => handleDifficultyToggle(difficulty)}
                            className="sr-only peer"
                          />
                          <span
                            className={`
                              block h-6 rounded-full transition-colors duration-200
                              ${selectedDifficulties.includes(difficulty) ? 'bg-blue-600' : 'bg-gray-200'}
                            `}
                          ></span>
                          <span
                            className={`
                              absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                              ${selectedDifficulties.includes(difficulty) ? 'translate-x-5' : ''}
                            `}
                          ></span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreekSpeedReader;