export function readFileAsString(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function formatTime(minutesInput: number): string {
  const totalSeconds = Math.floor(minutesInput * 60);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}h`;
  } else if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}min`;
  } else {
    return `${seconds}s`;
  }
}
