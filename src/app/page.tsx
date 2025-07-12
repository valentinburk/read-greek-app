'use client';

import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import { Play, Pause, RotateCcw, Target, Clock, BookOpen, Volume2 } from 'lucide-react';
import greekWordsData from '../data/greekWords.json';
import {
  GreekWord,
  SessionStats,
  filterWordsByDifficulty,
  getNextCard,
  updateStatsForNextCard,
  resetSessionStats,
  autoAdvanceDifficulty
} from '../lib/greekReaderLogic';

const GreekSpeedReader: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<GreekWord | null>(null);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [showPronunciation, setShowPronunciation] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [cardHistory, setCardHistory] = useState<GreekWord[]>([]);
  const [stats, setStats] = useState<SessionStats>(resetSessionStats());
  const [intervalTime, setIntervalTime] = useState<number>(3000);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  // Filter words by current difficulty
  const availableWords: GreekWord[] = filterWordsByDifficulty(greekWordsData as GreekWord[], difficulty);

  // Show next card
  const showNextCard = useCallback((): void => {
    const nextCard = getNextCard(availableWords, cardHistory);
    setCurrentCard(nextCard);
    setCardHistory(prev => [...prev, nextCard].slice(-10));
    setStats(prev => updateStatsForNextCard(prev));
  }, [availableWords, cardHistory]);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && isPlaying) {
      interval = setInterval(() => {
        showNextCard();
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [autoPlay, isPlaying, intervalTime, showNextCard]);

  // Session timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStats(prev => ({
          ...prev,
          sessionTime: prev.sessionTime + 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Initialize first card
  useEffect(() => {
    if (!currentCard) {
      showNextCard();
    }
  }, [currentCard, showNextCard]);

  // Auto-advance difficulty
  useEffect(() => {
    setDifficulty(prev => autoAdvanceDifficulty(stats.cardsShown, prev));
  }, [stats.cardsShown]);

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
            <span className="text-gray-400 mx-1">·</span>
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
            <span className="text-gray-400 mx-1">·</span>
          )}
        </span>
      );
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: 1 | 2 | 3): string => {
    switch(diff) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetSession = (): void => {
    setStats(resetSessionStats());
    setCardHistory([]);
    setDifficulty(1);
    setIsPlaying(false);
    setAutoPlay(false);
    showNextCard();
  };

  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleAutoPlayToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAutoPlay(e.target.checked);
  };

  const handlePronunciationToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowPronunciation(e.target.checked);
  };

  const handleIntervalTimeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setIntervalTime(parseInt(e.target.value));
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setDifficulty(parseInt(e.target.value) as 1 | 2 | 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ελληνικά
          </h1>
          <p className="text-gray-400">
            Improve your Greek reading speed with progressive difficulty
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cards Shown</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cardsShown}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Session Time</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(stats.sessionTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Difficulty</p>
                <p className="text-2xl font-bold text-gray-900">{difficulty}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
              </div>
              <div className="text-orange-500">🔥</div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          {currentCard && (
            <div className="text-center space-y-6">
              {/* Difficulty Badge */}
              <div className="flex justify-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                  Difficulty {currentCard.difficulty}
                </span>
              </div>

              {/* Greek Word */}
              <div className="space-y-4">
                <h2 className="text-6xl font-bold text-gray-900 tracking-wide">
                  {currentCard.greek}
                </h2>
                
                {/* Pronunciation */}
                {showPronunciation && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-center mb-3">
                      <Volume2 className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Pronunciation</span>
                    </div>
                    
                    {/* Greek Syllables */}
                    <div className="mb-3">
                      <div className="text-2xl font-mono">
                        {formatGreekSyllables(currentCard.greekSyllables, currentCard.pronunciation)}
                      </div>
                    </div>
                    
                    {/* Latin Pronunciation */}
                    <div>
                      <div className="text-2xl font-mono">
                        {formatPronunciation(currentCard.pronunciation)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Meaning */}
                <div className="text-xl text-gray-600">
                  <span className="font-medium">Meaning:</span> {currentCard.meaning}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Playback Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Playback Controls</h3>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
                    isPlaying 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  <span className="ml-2">{isPlaying ? 'Pause' : 'Start'}</span>
                </button>
                
                <button
                  onClick={showNextCard}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                >
                  Next Card
                </button>
                
                <button
                  onClick={resetSession}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all flex items-center"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={handleAutoPlayToggle}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-play</span>
                </label>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Speed:</label>
                  <select
                    value={intervalTime}
                    onChange={handleIntervalTimeChange}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1000}>1s</option>
                    <option value={2000}>2s</option>
                    <option value={3000}>3s</option>
                    <option value={5000}>5s</option>
                    <option value={10000}>10s</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Display Settings</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={showPronunciation}
                    onChange={handlePronunciationToggle}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show pronunciation</span>
                </label>
                
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">Max difficulty:</label>
                  <select
                    value={difficulty}
                    onChange={handleDifficultyChange}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 (Short words)</option>
                    <option value={2}>2 (Medium words)</option>
                    <option value={3}>3 (Long words)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreekSpeedReader;