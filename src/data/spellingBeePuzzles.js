// Generate random Spelling Bee puzzle
export const generateSpellingBeePuzzle = () => {
  const puzzles = [
    { letters: ['C', 'A', 'T', 'R', 'E', 'O', 'N'], center: 'A' },
    { letters: ['P', 'L', 'A', 'Y', 'E', 'R', 'S'], center: 'L' },
    { letters: ['S', 'T', 'A', 'R', 'E', 'M', 'K'], center: 'T' },
    { letters: ['B', 'E', 'A', 'R', 'D', 'K', 'S'], center: 'E' },
    { letters: ['M', 'O', 'U', 'S', 'E', 'R', 'T'], center: 'O' },
    { letters: ['H', 'O', 'U', 'S', 'E', 'R', 'T'], center: 'O' },
    { letters: ['F', 'I', 'R', 'E', 'D', 'S', 'T'], center: 'I' },
    { letters: ['G', 'A', 'M', 'E', 'S', 'T', 'R'], center: 'A' },
    { letters: ['W', 'I', 'N', 'D', 'E', 'R', 'S'], center: 'I' },
    { letters: ['B', 'O', 'A', 'T', 'S', 'R', 'E'], center: 'O' },
    { letters: ['C', 'O', 'L', 'D', 'E', 'R', 'S'], center: 'O' },
    { letters: ['P', 'A', 'R', 'T', 'Y', 'S', 'E'], center: 'A' },
    { letters: ['L', 'I', 'G', 'H', 'T', 'S', 'E'], center: 'I' },
    { letters: ['S', 'A', 'N', 'D', 'Y', 'E', 'R'], center: 'A' },
    { letters: ['R', 'O', 'C', 'K', 'S', 'E', 'T'], center: 'O' },
    { letters: ['F', 'A', 'R', 'M', 'E', 'S', 'T'], center: 'A' },
    { letters: ['D', 'A', 'N', 'C', 'E', 'R', 'S'], center: 'A' },
    { letters: ['S', 'I', 'N', 'G', 'E', 'R', 'T'], center: 'I' },
    { letters: ['B', 'R', 'I', 'G', 'H', 'T', 'S'], center: 'I' },
    { letters: ['S', 'P', 'O', 'R', 'T', 'Y', 'E'], center: 'O' },
    { letters: ['C', 'H', 'E', 'E', 'R', 'S', 'T'], center: 'E' },
    { letters: ['M', 'A', 'G', 'I', 'C', 'S', 'T'], center: 'A' },
    { letters: ['W', 'O', 'R', 'L', 'D', 'S', 'E'], center: 'O' },
    { letters: ['F', 'L', 'O', 'W', 'E', 'R', 'S'], center: 'O' },
    { letters: ['S', 'M', 'I', 'L', 'E', 'T', 'R'], center: 'I' },
    { letters: ['H', 'A', 'P', 'P', 'Y', 'E', 'S'], center: 'A' },
    { letters: ['D', 'R', 'E', 'A', 'M', 'S', 'T'], center: 'E' },
    { letters: ['F', 'R', 'I', 'E', 'N', 'D', 'S'], center: 'I' },
  ];
  return puzzles[Math.floor(Math.random() * puzzles.length)];
};
