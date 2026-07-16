export type Choice = { label: string; correct?: boolean };
export type Question = { prompt: string; choices?: Choice[]; answer?: string; kind?: "choice" | "text" | "prediction" };
export type Game = { id: string; title: string; description: string; questions: Question[] };

export const games: Game[] = [
  {
    id: "mom-dad", title: "Mom or Dad?", description: "Who will be the first to…?",
    questions: [
      { prompt: "Who will take more baby photos?", choices: [{ label: "Mom", correct: true }, { label: "Dad" }] },
      { prompt: "Who will be the softest at bedtime?", choices: [{ label: "Mom" }, { label: "Dad", correct: true }] },
      { prompt: "Who picked the baby name first?", choices: [{ label: "Mom", correct: true }, { label: "Dad" }] },
      { prompt: "Who will change the first diaper?", choices: [{ label: "Mom" }, { label: "Dad", correct: true }] },
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
    id: "mommy", title: "Who Knows Mommy Best?", description: "The ultimate best-friend test.",
    questions: [
      { prompt: "What has been Mommy's biggest pregnancy craving?", choices: [{ label: "Pickles" }, { label: "Chocolate", correct: true }, { label: "Pizza" }, { label: "Fruit" }] },
      { prompt: "What was Mommy's first reaction to the happy news?", choices: [{ label: "Happy tears", correct: true }, { label: "Speechless" }, { label: "Laughter" }, { label: "Called Grandma" }] },
      { prompt: "Which lullaby will Mommy sing first?", choices: [{ label: "Twinkle Twinkle", correct: true }, { label: "You Are My Sunshine" }, { label: "Hush Little Baby" }, { label: "A family favorite" }] },
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

export const demoPlayers = [
  { id: "1", name: "Ava", score: 320 }, { id: "2", name: "Noah", score: 290 },
  { id: "3", name: "Lily", score: 260 }, { id: "4", name: "Ethan", score: 240 },
  { id: "5", name: "Grace", score: 210 }, { id: "6", name: "Mia", score: 190 },
  { id: "7", name: "Olivia", score: 160 }, { id: "8", name: "James", score: 140 },
  { id: "9", name: "Amelia", score: 130 }, { id: "10", name: "Henry", score: 120 },
  { id: "11", name: "Sofia", score: 110 }, { id: "12", name: "Leo", score: 100 },
  { id: "13", name: "Ella", score: 90 }, { id: "14", name: "Jack", score: 80 },
  { id: "15", name: "Chloe", score: 70 }, { id: "16", name: "Lucas", score: 60 },
  { id: "17", name: "Ivy", score: 50 }, { id: "18", name: "Finn", score: 40 },
];
