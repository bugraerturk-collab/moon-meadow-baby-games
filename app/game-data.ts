export type Choice = { label: string; correct?: boolean };
export type Question = { prompt: string; choices?: Choice[]; answer?: string; kind?: "choice" | "text" | "prediction" };
export type Game = { id: string; title: string; description: string; questions: Question[] };
export type Player = { id: string; name: string; score: number };

const choice = (prompt: string, labels: string[], correct: number): Question => ({ prompt, choices: labels.map((label, index) => ({ label, correct: index === correct })) });
const tf = (prompt: string, correct: boolean): Question => choice(prompt, ["True", "False"], correct ? 0 : 1);
const text = (prompt: string, answer: string): Question => ({ prompt, kind: "text", answer });
const prediction = (prompt: string): Question => ({ prompt, kind: "prediction", answer: "" });

export const games: Game[] = [
  { id: "animal-match", title: "Baby Animal Match", description: "Match each little one to its animal name.", questions: [
    choice("What is a baby goat called?", ["Kid", "Calf", "Foal", "Cub"], 0), choice("What is a baby kangaroo called?", ["Kit", "Joey", "Pup", "Chick"], 1),
    choice("What is a baby horse called?", ["Fawn", "Calf", "Foal", "Cub"], 2), choice("What is a baby rabbit called?", ["Kit", "Joey", "Kid", "Pup"], 0),
    choice("What is a baby deer called?", ["Cub", "Fawn", "Foal", "Chick"], 1), choice("What is a baby sheep called?", ["Lamb", "Kid", "Calf", "Kit"], 0),
    choice("What is a baby cow called?", ["Foal", "Calf", "Pup", "Cub"], 1), choice("What is a baby pig called?", ["Piglet", "Kid", "Fawn", "Joey"], 0),
    choice("What is a baby duck called?", ["Chick", "Duckling", "Cygnet", "Gosling"], 1), choice("What is a baby goose called?", ["Duckling", "Gosling", "Chick", "Kit"], 1),
    choice("What is a baby swan called?", ["Cygnet", "Gosling", "Fledgling", "Joey"], 0), choice("What is a baby lion called?", ["Pup", "Cub", "Kit", "Calf"], 1),
    choice("What is a baby dog called?", ["Kitten", "Puppy", "Cub", "Kid"], 1), choice("What is a baby cat called?", ["Kitten", "Puppy", "Joey", "Fawn"], 0),
    choice("What is a baby elephant called?", ["Cub", "Calf", "Foal", "Kid"], 1),
  ]},
  { id: "trivia", title: "Baby Trivia", description: "Sweet facts and surprising answers.", questions: [
    choice("About how many bones is a baby born with?", ["106", "206", "About 300", "About 500"], 2), choice("Which sense develops first in the womb?", ["Sight", "Touch", "Taste", "Hearing"], 1),
    choice("About how many diapers may a newborn use each day?", ["2–3", "4–5", "8–12", "18–20"], 2), choice("Which colors can newborns see most clearly first?", ["Red and blue", "Black and white", "Green and yellow", "Purple and pink"], 1),
    choice("What is the soft spot on a baby's head called?", ["Fontanelle", "Dimple", "Crownlet", "Temple"], 0), choice("Which organ starts beating early in pregnancy?", ["Lungs", "Heart", "Eyes", "Stomach"], 1),
    choice("What is a baby's first stool called?", ["Colostrum", "Meconium", "Lanugo", "Vernix"], 1), choice("What fine hair can cover a baby before birth?", ["Lanugo", "Vernix", "Meconium", "Keratin"], 0),
    choice("Which month is statistically the most common birth month in the U.S.?", ["February", "May", "September", "December"], 2), choice("What reflex makes a baby grasp your finger?", ["Moro reflex", "Palmar grasp", "Rooting reflex", "Blink reflex"], 1),
    choice("What is a baby's first set of teeth often called?", ["Milk teeth", "Pearl teeth", "Starter teeth", "Soft teeth"], 0), choice("How many primary teeth do most children eventually have?", ["16", "20", "24", "32"], 1),
    choice("Which sense is especially strong in newborns?", ["Smell", "Long-distance sight", "Balance", "Color vision"], 0), choice("What is the creamy protective coating seen on some newborns?", ["Lanugo", "Vernix", "Colostrum", "Keratin"], 1),
    choice("Which movement do babies usually master first?", ["Walking", "Rolling over", "Jumping", "Running"], 1),
  ]},
  { id: "nursery-rhymes", title: "Nursery Rhyme Quiz", description: "Complete these classic nursery rhymes.", questions: [
    choice("Twinkle, twinkle, little star, how I wonder what you…", ["see", "are", "do", "say"], 1), choice("Humpty Dumpty sat on a…", ["chair", "wall", "hill", "ball"], 1),
    choice("The itsy bitsy spider climbed up the water…", ["spout", "pipe", "wall", "fall"], 0), choice("Row, row, row your boat, gently down the…", ["sea", "river", "stream", "lake"], 2),
    choice("Mary had a little…", ["duck", "lamb", "bear", "goat"], 1), choice("Hickory dickory dock, the mouse ran up the…", ["clock", "tree", "rock", "stairs"], 0),
    choice("Baa, baa, black sheep, have you any…", ["hay", "wool", "milk", "bells"], 1), choice("Jack and Jill went up the…", ["road", "hill", "stairs", "tree"], 1),
    choice("Rock-a-bye baby, on the tree…", ["top", "branch", "leaf", "bough"], 3), choice("Hey diddle diddle, the cat and the…", ["fiddle", "drum", "bell", "flute"], 0),
    choice("Little Miss Muffet sat on a…", ["blanket", "tuffet", "stool", "pillow"], 1), choice("One, two, buckle my…", ["shoe", "coat", "belt", "hat"], 0),
    choice("Old MacDonald had a…", ["barn", "farm", "horse", "tractor"], 1), choice("The wheels on the bus go round and…", ["away", "down", "round", "fast"], 2),
    choice("London Bridge is falling…", ["over", "apart", "down", "slowly"], 2),
  ]},
  { id: "scramble", title: "Baby Word Scramble", description: "Fast fingers win this one.", questions: [
    text("Unscramble: LTTBOE", "BOTTLE"), text("Unscramble: AIPDRE", "DIAPER"), text("Unscramble: RLSETROL", "STROLLER"), text("Unscramble: BRCI", "CRIB"), text("Unscramble: BBYBA", "BABY"),
    text("Unscramble: RLTATE", "RATTLE"), text("Unscramble: IFPEACR", "PACIFIER"), text("Unscramble: NTEKLAB", "BLANKET"), text("Unscramble: SNEOIE", "ONESIE"), text("Unscramble: RSNYERU", "NURSERY"),
    text("Unscramble: OBCUNER", "BOUNCER"), text("Unscramble: LUDDCE", "CUDDLE"), text("Unscramble: ITSMTNE", "MITTENS"), text("Unscramble: BEITOO", "BOOTIE"), text("Unscramble: YLLULBA", "LULLABY"),
  ]},
  { id: "emoji", title: "Emoji Baby Phrases", description: "Decode each little picture puzzle.", questions: [
    choice("🌧️ + 👶", ["Baby shower", "Rainy day", "Bath time", "Cloud baby"], 0), choice("🍼 + 🕛", ["Bedtime", "Midnight feeding", "Bottle warmer", "Morning milk"], 1),
    choice("👶 + 🦈", ["Baby Shark", "Ocean baby", "Little swimmer", "Shark tale"], 0), choice("🫛 + 👸 + 🛏️", ["Three little peas", "Peas in a pod", "Princess and the Pea", "Green dreams"], 2),
    choice("🌙 + 📖", ["Goodnight Moon", "Star light", "Dream big", "Night light"], 0), choice("👶 + 👣", ["Baby steps", "Tiny dancer", "First shoes", "Walking home"], 0),
    choice("🧸 + 🤗", ["Teddy bear hug", "Toy box", "Bear nap", "Cuddle time"], 0), choice("🍼 + 🧼", ["Bottle bubbles", "Milk bath", "Bottle wash", "Bubble tea"], 2),
    choice("👶 + 😴 + 🎵", ["Baby dance", "Bedtime story", "Lullaby", "Morning song"], 2), choice("🦆 + 🦆 + 🦆 + 🦆 + 🦆", ["Five Little Ducks", "Duck parade", "Old MacDonald", "Yellow family"], 0),
    choice("🚌 + 🔄", ["Round trip", "Wheels on the Bus", "School run", "Baby on board"], 1), choice("🐑 + ⚫", ["Little Bo Peep", "Baa Baa Black Sheep", "Counting sheep", "Farm night"], 1),
    choice("🐄 + 🌙", ["Midnight snack", "Hey Diddle Diddle", "Moon meal", "Silver spoon"], 1), choice("🕷️ + 💧", ["Itsy Bitsy Spider", "Rainy web", "Water bug", "Spider bath"], 0),
    choice("🚣 + 🌊 + 🎵", ["Sailing song", "Row Row Row Your Boat", "Ocean lullaby", "Little captain"], 1),
  ]},
  { id: "baby-facts-tf", title: "Baby Facts: True or False", description: "Quick-fire facts with a tiny twist.", questions: [
    tf("Newborn babies have more bones than adults.", true), tf("Babies are born with fully developed kneecaps.", false), tf("A newborn's stomach is very small.", true),
    tf("Most newborns can see clearly across a whole room.", false), tf("Babies can recognize familiar voices from before birth.", true), tf("All babies are born with blue eyes.", false),
    tf("The grasp reflex can make a newborn hold a finger.", true), tf("Babies usually walk before they can sit.", false), tf("Newborns spend much of the day sleeping.", true),
    tf("A baby's first teeth are permanent teeth.", false), tf("Babies communicate before they can speak words.", true), tf("Every baby crawls before walking.", false),
    tf("Tummy time helps babies build neck and shoulder strength.", true), tf("Newborns can only hear very loud sounds.", false), tf("Babies often prefer looking at faces.", true),
  ]},
  { id: "rhyme-tf", title: "Rhyme Time: True or False", description: "How well do you know the classics?", questions: [
    tf("Humpty Dumpty sat on a wall.", true), tf("Mary's little companion was a puppy.", false), tf("The cow jumped over the moon in Hey Diddle Diddle.", true),
    tf("Jack and Jill went downhill to fetch water.", false), tf("The Itsy Bitsy Spider climbed a water spout.", true), tf("Old MacDonald lived in a castle.", false),
    tf("Baa Baa Black Sheep has three bags full.", true), tf("Little Miss Muffet was frightened by a mouse.", false), tf("The Wheels on the Bus go round and round.", true),
    tf("Twinkle Twinkle is about a little moon.", false), tf("Hickory Dickory Dock features a mouse and a clock.", true), tf("Five Little Ducks all stayed home from the start.", false),
    tf("Rock-a-bye Baby mentions a tree bough.", true), tf("Row Row Row Your Boat says life is a race.", false), tf("London Bridge is falling down.", true),
  ]},
  { id: "predictions", title: "Baby Predictions", description: "Make a wish for the little one.", questions: [
    prediction("What date do you think baby will arrive?"), prediction("What time of day will baby arrive?"), prediction("What will baby's birth weight be?"),
    prediction("What will baby's first word be?"), prediction("Who will baby look like most?"), prediction("What color eyes do you predict?"), prediction("What color hair do you predict?"),
    prediction("What will make baby laugh the most?"), prediction("What food will baby love first?"), prediction("What toy will become baby's favorite?"),
    prediction("What future hobby will baby enjoy?"), prediction("What will baby's first adventure be?"), prediction("Choose three words to describe baby's future personality."),
    prediction("Share one piece of advice for the parents-to-be."), prediction("Leave one sweet wish for the baby."),
  ]},
];
