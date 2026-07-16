export type Choice = { label: string; correct?: boolean };
export type Question = { prompt: string; choices?: Choice[]; answer?: string; kind?: "choice" | "text" | "prediction" };
export type Game = { id: string; title: string; description: string; questions: Question[] };
export type Player = { id: string; name: string; score: number };

export const games: Game[] = [
  {
    id: "animal-match", title: "Baby Animal Match", description: "Match each little one to its animal name.",
    questions: [
      { prompt: "What is a baby goat called?", choices: [{ label: "Kid", correct: true }, { label: "Calf" }, { label: "Foal" }, { label: "Cub" }] },
      { prompt: "What is a baby kangaroo called?", choices: [{ label: "Kit" }, { label: "Joey", correct: true }, { label: "Pup" }, { label: "Chick" }] },
      { prompt: "What is a baby horse called?", choices: [{ label: "Fawn" }, { label: "Calf" }, { label: "Foal", correct: true }, { label: "Cub" }] },
      { prompt: "What is a baby rabbit called?", choices: [{ label: "Kit", correct: true }, { label: "Joey" }, { label: "Kid" }, { label: "Pup" }] },
    ],
  },
  {
    id: "trivia", title: "Baby Trivia", description: "Sweet facts and surprising answers.",
    questions: [
      { prompt: "How many bones is a baby born with?", choices: [{ label: "206" }, { label: "270" }, { label: "300", correct: true }, { label: "350" }] },
      { prompt: "Which sense develops first in the womb?", choices: [{ label: "Sight" }, { label: "Touch", correct: true }, { label: "Taste" }, { label: "Hearing" }] },
      { prompt: "About how many diapers does a newborn use each day?", choices: [{ label: "2–3" }, { label: "4–5" }, { label: "8–12", correct: true }, { label: "15–20" }] },
      { prompt: "What is a baby swan called?", choices: [{ label: "Cub" }, { label: "Cygnet", correct: true }, { label: "Kit" }, { label: "Chicklet" }] },
    ],
  },
  {
    id: "nursery-rhymes", title: "Nursery Rhyme Quiz", description: "Complete these classic nursery rhymes.",
    questions: [
      { prompt: "Twinkle, twinkle, little star, how I wonder what you…", choices: [{ label: "see" }, { label: "are", correct: true }, { label: "do" }, { label: "say" }] },
      { prompt: "Humpty Dumpty sat on a…", choices: [{ label: "chair" }, { label: "wall", correct: true }, { label: "hill" }, { label: "ball" }] },
      { prompt: "The itsy bitsy spider climbed up the water…", choices: [{ label: "spout", correct: true }, { label: "pipe" }, { label: "wall" }, { label: "fall" }] },
      { prompt: "Row, row, row your boat, gently down the…", choices: [{ label: "sea" }, { label: "river" }, { label: "stream", correct: true }, { label: "lake" }] },
    ],
  },
  {
    id: "scramble", title: "Baby Word Scramble", description: "Fast fingers win this one.",
    questions: [
      { prompt: "Unscramble: LTTBOE", kind: "text", answer: "BOTTLE" },
      { prompt: "Unscramble: AIPDRE", kind: "text", answer: "DIAPER" },
      { prompt: "Unscramble: RLSETROL", kind: "text", answer: "STROLLER" },
    ],
  },
  {
    id: "emoji", title: "Emoji Baby Phrases", description: "Decode each little picture puzzle.",
    questions: [
      { prompt: "🌧️ + 👶", choices: [{ label: "Baby shower", correct: true }, { label: "Rainy day" }, { label: "Bath time" }] },
      { prompt: "🍼 + 🕛", choices: [{ label: "Bedtime" }, { label: "Midnight feeding", correct: true }, { label: "Bottle warmer" }] },
      { prompt: "👶 + 🦈", choices: [{ label: "Baby Shark", correct: true }, { label: "Ocean baby" }, { label: "Little swimmer" }] },
    ],
  },
  {
    id: "predictions", title: "Baby Predictions", description: "Make a wish for the little one.",
    questions: [
      { prompt: "What date do you think baby will arrive?", kind: "prediction", answer: "" },
      { prompt: "What will baby's first word be?", kind: "prediction", answer: "" },
      { prompt: "Leave one sweet wish for the baby.", kind: "prediction", answer: "" },
    ],
  },
];
