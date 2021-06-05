const maxColor = 255;

const trainings = [
  { input: { red: 0, green: 0, blue: 0 }, output: { black: 1 } },
  { input: { red: 0, green: 0, blue: 1 }, output: { black: 1 } },
  { input: { red: 0, green: 1, blue: 0 }, output: { white: 1 } },
  { input: { red: 0, green: 1, blue: 1 }, output: { white: 1 } },
  { input: { red: 0, green: 54 / maxColor, blue: 1 }, output: { black: 1 } },
  { input: { red: 1, green: 1, blue: 1 }, output: { white: 1 } },
  { input: { red: 1, green: 0, blue: 0 }, output: { white: 1 } },
  { input: { red: 102 / maxColor, green: 102 / maxColor, blue: 102 / maxColor }, output: { black: 1 } },
];
