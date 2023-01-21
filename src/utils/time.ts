export const formatTime = (time: number | null) => {
  if (time === null) return "0:00";

  if (time > 1000 * 60) {
    const minutes = time / 1000 / 60;
    return `${minutes.toFixed(2)}min`;
  }

  if (time > 1000) {
    const seconds = time / 1000;
    return `${seconds.toFixed(2)}s`;
  }

  return `${time.toFixed(2)}ms`;
};
