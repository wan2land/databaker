export function filterOutliers<T>(
  data: T[],
  handler: (row: T) => number,
): T[] {
  if (data.length <= 1) {
    return data;
  }
  const tuples = data.map((row) => [row, handler(row)] as const);
  const values = tuples.map(([, value]) => value).sort((a, b) => a - b);

  const q1 = values[Math.floor(values.length / 4)];
  const q3 = values[Math.ceil(values.length * 0.75) - 1];

  const iqr = q3 - q1;
  const maxValue = q3 + iqr * 1.5;
  const minValue = q1 - iqr * 1.5;

  return tuples.filter(([, value]) => value >= minValue && value <= maxValue)
    .map(([row]) => row);
}
