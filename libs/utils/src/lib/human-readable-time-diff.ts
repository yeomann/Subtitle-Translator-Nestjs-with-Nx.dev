export const humanDiffTimestamp = (t1: number, t2: number): string => {
  const diff = Math.max(t1, t2) - Math.min(t1, t2);
  const SEC = 1000,
    MIN = 60 * SEC,
    HRS = 60 * MIN;

  const hrs = Math.floor(diff / HRS);
  const min = Math.floor((diff % HRS) / MIN).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const sec = Math.floor((diff % MIN) / SEC).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const ms = Math.floor(diff % SEC).toLocaleString('en-US', {
    minimumIntegerDigits: 4,
    useGrouping: false,
  });

  return `Hours:${hrs} Minutes:${min} Second.MilliSeconds:${sec}.${ms}`;
};
