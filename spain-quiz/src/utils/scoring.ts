export function scoreMultipleChoice(selectedIndex: number, correctIndex: number, points: number): number {
  return selectedIndex === correctIndex ? points : 0;
}

export function scoreEstimate(value: number, target: number, tolerance: number, points: number): number {
  return Math.abs(value - target) <= tolerance ? points : 0;
}
