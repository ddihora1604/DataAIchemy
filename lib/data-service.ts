import Papa from 'papaparse';

export interface DataStats {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  ksTest: number;
  adTest: number;
  chiSquare: number;
  statSimilarity: number;
  privacyScore: number;
  correlationScore: number;
  mlUtility: number;
  dataDiversity: number;
  outlierScore: number;
}

export interface Dataset {
  data: any[][];
  columns: string[];
  stats: Record<string, DataStats>;
}

export const processCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: function(results) {
        try {
          console.log("Parsing CSV results:", results);
          
          if (!results.data || !Array.isArray(results.data)) {
            throw new Error("Invalid CSV data structure");
          }

          // Extract column names from the first row
          const columns = Object.keys(results.data[0] || {});
          console.log("Extracted columns:", columns);

          if (!columns.length) {
            throw new Error("No columns found in CSV");
          }

          // Convert data to array format and remove header row
          const data = results.data.slice(1).map(row => {
            if (typeof row === 'object') {
              return columns.map(col => row[col]);
            }
            return [];
          });

          // Calculate statistics for each column
          const stats: Record<string, DataStats> = {};
          columns.forEach((col, idx) => {
            const values = data.map(row => parseFloat(row[idx])).filter(val => !isNaN(val));
            stats[col] = calculateStats(values);
          });

          resolve({ data, columns, stats });
        } catch (error) {
          console.error("Error processing CSV:", error);
          reject(error);
        }
      },
      header: true,
      dynamicTyping: true,
      error: (error) => {
        console.error("CSV parsing error:", error);
        reject(error);
      }
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

  // Simulate advanced statistical tests
  // In a production environment, these would be actual calculations
  const simulateScore = () => 0.85 + Math.random() * 0.1;

  return {
    mean,
    median,
    stdDev,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    ksTest: simulateScore(),
    adTest: simulateScore(),
    chiSquare: simulateScore(),
    statSimilarity: simulateScore(),
    privacyScore: simulateScore(),
    correlationScore: simulateScore(),
    mlUtility: simulateScore(),
    dataDiversity: simulateScore(),
    outlierScore: simulateScore()
  };
};