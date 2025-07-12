import React from 'react';
import { getDifficultyLabel } from '../lib/utils';

interface SettingsProps {
  showSettings: boolean;
  isClosing: boolean;
  isOpening: boolean;
  showGreekSyllables: boolean;
  showPhoneticPronunciation: boolean;
  selectedDifficulties: number[];
  availableDifficulties: number[];
  onToggleSettings: () => void;
  onGreekSyllablesToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneticPronunciationToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDifficultyToggle: (difficulty: number) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  showSettings,
  isClosing,
  isOpening,
  showGreekSyllables,
  showPhoneticPronunciation,
  selectedDifficulties,
  availableDifficulties,
  onToggleSettings,
  onGreekSyllablesToggle,
  onPhoneticPronunciationToggle,
  onDifficultyToggle
}) => {
  if (!showSettings) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-end justify-center z-50 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={onToggleSettings}
    >
      <div
        className={`bg-white rounded-t-xl shadow-lg border border-gray-200 p-6 max-w-sm w-full mx-4 mb-0 transition-transform duration-300 ease-out ${
          isClosing ? 'translate-y-full' : isOpening ? 'translate-y-full' : 'translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Settings</h3>
          <button
            onClick={onToggleSettings}
            className="text-gray-400 hover:text-gray-600 p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close settings"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex-1">
                <span className="text-base font-medium text-gray-700 block mb-1">Show Greek syllables</span>
                <span className="text-sm text-gray-500">Display syllable breaks in Greek text</span>
              </div>
              <div className="relative inline-block w-14 h-8 align-middle select-none transition duration-200 ease-in ml-4">
                <input
                  type="checkbox"
                  checked={showGreekSyllables}
                  onChange={onGreekSyllablesToggle}
                  className="sr-only peer"
                />
                <span
                  className={`
                    block w-14 h-8 rounded-full transition-colors duration-200
                    ${showGreekSyllables ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                ></span>
                <span
                  className={`
                    absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
                    ${showGreekSyllables ? 'translate-x-6' : ''}
                  `}
                ></span>
              </div>
            </label>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex-1">
                <span className="text-base font-medium text-gray-700 block mb-1">Show phonetic pronunciation</span>
                <span className="text-sm text-gray-500">Display phonetic pronunciation guide</span>
              </div>
              <div className="relative inline-block w-14 h-8 align-middle select-none transition duration-200 ease-in ml-4">
                <input
                  type="checkbox"
                  checked={showPhoneticPronunciation}
                  onChange={onPhoneticPronunciationToggle}
                  className="sr-only peer"
                />
                <span
                  className={`
                    block w-14 h-8 rounded-full transition-colors duration-200
                    ${showPhoneticPronunciation ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                ></span>
                <span
                  className={`
                    absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
                    ${showPhoneticPronunciation ? 'translate-x-6' : ''}
                  `}
                ></span>
              </div>
            </label>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-base font-medium text-gray-700 mb-4">Difficulty levels:</label>
            <div className="space-y-3">
              {availableDifficulties.map((difficulty) => (
                <label key={difficulty} className="flex items-center justify-between cursor-pointer">
                  <div className="flex-1">
                    <span className="text-base font-medium text-gray-700 block">
                      Level {difficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getDifficultyLabel(difficulty)}
                    </span>
                  </div>
                  <div className="relative inline-block w-14 h-8 align-middle select-none transition duration-200 ease-in ml-4">
                    <input
                      type="checkbox"
                      checked={selectedDifficulties.includes(difficulty)}
                      onChange={() => onDifficultyToggle(difficulty)}
                      className="sr-only peer"
                    />
                    <span
                      className={`
                        block w-14 h-8 rounded-full transition-colors duration-200
                        ${selectedDifficulties.includes(difficulty) ? 'bg-blue-600' : 'bg-gray-300'}
                      `}
                    ></span>
                    <span
                      className={`
                        absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
                        ${selectedDifficulties.includes(difficulty) ? 'translate-x-6' : ''}
                      `}
                    ></span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 