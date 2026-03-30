export function scoreMultipleChoice(selectedIndex: number, correctIndex: number): number {
  return selectedIndex === correctIndex ? 1 : 0;
}

export function scoreEstimate(value: number, target: number, tolerance: number): number {
  return Math.abs(value - target) <= tolerance ? 1 : 0;
}
