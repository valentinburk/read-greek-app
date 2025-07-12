import { GreekWord } from './types';

export function parseCSV(csvContent: string): GreekWord[] {
  const lines = csvContent.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      difficulty: parseInt(values[0]) as 1 | 2 | 3 | 4,
      greek: values[1],
      pronunciation: values[2],
      meaning: values[3]
    };
  });
} 