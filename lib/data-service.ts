import Papa from 'papaparse';

export interface DataStats {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
}

export interface Dataset {
  data: number[][];
  columns: string[];
  stats: Record<string, DataStats>;
}

export const processCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const columns = results.data[0] as string[];
        const data = results.data.slice(1) as number[][];
        
        // Calculate statistics for each column
        const stats: Record<string, DataStats> = {};
        columns.forEach((col, idx) => {
          const values = data.map(row => parseFloat(row[idx])).filter(val => !isNaN(val));
          stats[col] = calculateStats(values);
        });

        resolve({ data, columns, stats });
      },
      error: (error) => reject(error),
      header: true,
      dynamicTyping: true,
    });
  });
};

const calculateStats = (values: number[]): DataStats => {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const stdDev = Math.sqrt(
    values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
  );

  return {
    mean,
    median,
    stdDev,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
};