/**
 * Convert milliseconds to hours with optional decimal places
 */
export const msToHours = (ms: number, showDecimals = true): number => {
  const hours = ms / 1000 / 60 / 60;
  return showDecimals ? hours : Math.floor(hours);
};

/**
 * Format milliseconds into hours display string
 */
export const getMsPlayedInHours = (ms: number | string, showDecimals = true): string => {
  const msNum = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  return msToHours(msNum, showDecimals).toFixed(showDecimals ? 2 : 0);
};
