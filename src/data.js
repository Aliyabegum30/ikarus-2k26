// All 30 challenge definitions. Edit text here only.
// Wheel segment i shows challenges[i]; the server stores only the index.
export const EVENTS = {
  "prompt2web": {
    "key": "prompt2web",
    "name": "Prompt2Web",
    "title": "PROMPT2WEB",
    "heading": "AI Website Challenge",
    "subtitle": "Spin the wheel. Discover your mission. Turn your prompt into a website.",
    "timeLimit": "30 minutes",
    "challenges": [
      {
        "id": 1,
        "theme": "Haunted Restaurant",
        "mission": "Build a restaurant website that only comes alive at midnight.",
        "conditions": [
          "Display at least 3 spooky food items with fictional prices.",
          "Add a working order button.",
          "Include a hidden message or secret page.",
          "Make one element react to a click or hover."
        ],
        "bonus": "Make the menu transform when users activate midnight mode."
      },
      {
        "id": 2,
        "theme": "Mystery Files",
        "mission": "A priceless trophy has disappeared from your college. Build a detective website that helps users identify the thief.",
        "conditions": [
          "Display 3 suspects with different alibis.",
          "Provide at least 3 clues.",
          "Let users select a suspect and submit their answer.",
          "Display a case-solved or try-again screen."
        ],
        "bonus": "Add a clue that appears only after solving a mini-puzzle."
      },
      {
        "id": 3,
        "theme": "Mars Colony 2090",
        "mission": "Humanity has 60 seconds to prepare a Mars colony. Build a website where players manage limited resources.",
        "conditions": [
          "Show oxygen, food, and energy levels.",
          "Provide resource allocation controls.",
          "Update the resource values when users make choices.",
          "Display a survival or failure result."
        ],
        "bonus": "Introduce a random meteor strike that reduces resources."
      },
      {
        "id": 4,
        "theme": "Escape the Loop",
        "mission": "A user is trapped in a time loop. Create a website where they must complete tasks to break free.",
        "conditions": [
          "Display 3 tasks or puzzles.",
          "Include a progress indicator.",
          "Make one completed task change the page.",
          "Unlock an ending after all tasks are complete."
        ],
        "bonus": "Reset the page after a failed attempt but retain one clue."
      },
      {
        "id": 5,
        "theme": "Villain Academy",
        "mission": "Build a fictional academy where users train to become supervillains by choosing skills and completing challenges.",
        "conditions": [
          "Create 3 villain character profiles.",
          "Let users select a character.",
          "Display skill points and a progress bar.",
          "Unlock a final rank after completing a task."
        ],
        "bonus": "Create a secret character unlocked by a special action."
      },
      {
        "id": 6,
        "theme": "The Last Store on Earth",
        "mission": "In a post-apocalyptic world, users have limited credits to buy supplies and survive.",
        "conditions": [
          "Display at least 5 supplies and their prices.",
          "Give users a fixed starting budget.",
          "Update the cart total when items are added or removed.",
          "Prevent purchases that exceed the budget."
        ],
        "bonus": "Make one randomly selected supply become twice as expensive."
      },
      {
        "id": 7,
        "theme": "The Secret Society",
        "mission": "Create a mysterious members-only website where visitors must prove they deserve access.",
        "conditions": [
          "Display a welcome page and a locked section.",
          "Include a password or code input.",
          "Show an error for an incorrect code.",
          "Reveal secret content after the correct answer."
        ],
        "bonus": "Hide the correct code inside a visual clue."
      },
      {
        "id": 8,
        "theme": "Zombie Survival",
        "mission": "Build a survival dashboard where users make decisions to protect a group of survivors.",
        "conditions": [
          "Display health, food, and survivor counts.",
          "Offer 3 survival decisions.",
          "Update the stats based on each decision.",
          "Show a survival or game-over screen."
        ],
        "bonus": "Trigger a zombie attack after a random decision."
      },
      {
        "id": 9,
        "theme": "Emotion Switch",
        "mission": "Create a website that transforms its appearance and content based on the mood selected by the visitor.",
        "conditions": [
          "Offer at least 4 mood choices.",
          "Change theme colors based on selection.",
          "Display a matching activity or message.",
          "Include a working mood-reset option."
        ],
        "bonus": "Add a surprise mood that unlocks only after three selections."
      },
      {
        "id": 10,
        "theme": "Save Tomorrow",
        "mission": "Create an interactive climate-action game where every decision changes the health of a virtual planet.",
        "conditions": [
          "Display a planet health score.",
          "Provide 3 environmental actions.",
          "Update the score when actions are taken.",
          "Show different outcomes based on the final score."
        ],
        "bonus": "Add a pollution emergency that forces users to act quickly."
      },
      {
        "id": 11,
        "theme": "Glitch Arcade",
        "mission": "Build a mini arcade website with a game that changes its rules unexpectedly.",
        "conditions": [
          "Include a playable click or reaction game.",
          "Display a timer and score.",
          "Change one game rule during play.",
          "Provide a restart button."
        ],
        "bonus": "Randomly reverse the controls for five seconds."
      },
      {
        "id": 12,
        "theme": "Time Traveller's Shop",
        "mission": "Create a store selling objects from different eras, from ancient history to the distant future.",
        "conditions": [
          "Display items from 3 different eras.",
          "Let users filter items by era.",
          "Add items to a shopping basket.",
          "Show the total price."
        ],
        "bonus": "Add a future-only item unlocked through a riddle."
      },
      {
        "id": 13,
        "theme": "Brain Heist",
        "mission": "Break into a fictional digital vault by solving a sequence of logic challenges.",
        "conditions": [
          "Present 3 different puzzles.",
          "Give feedback on each answer.",
          "Track player progress.",
          "Unlock the vault after all puzzles are solved."
        ],
        "bonus": "Include a decoy clue that players must recognize as misleading."
      },
      {
        "id": 14,
        "theme": "Alien Translator",
        "mission": "Create an interactive website that helps humans decode messages from an alien civilization.",
        "conditions": [
          "Show a fictional alien symbol alphabet.",
          "Let users enter or select symbols.",
          "Translate at least 5 predefined messages.",
          "Display whether the decoded message is correct."
        ],
        "bonus": "Reveal a final message when users decode three transmissions."
      },
      {
        "id": 15,
        "theme": "Impossible Fair",
        "mission": "Design a virtual carnival where visitors play mini-games to win tickets and unlock prizes.",
        "conditions": [
          "Display 3 fictional carnival games.",
          "Make at least one game playable.",
          "Award tickets based on the result.",
          "Allow users to exchange tickets for a prize."
        ],
        "bonus": "Add a rare prize that costs more tickets than the player starts with."
      }
    ]
  },
  "gamifiedWeb": {
    "key": "gamifiedWeb",
    "name": "Gamified Web",
    "title": "GAMIFIED WEB",
    "heading": "Game Development Challenge",
    "subtitle": "Spin your fate. Build your game. Beat the challenge.",
    "timeLimit": "30 minutes",
    "challenges": [
      {
        "id": 1,
        "theme": "Treasure Rush",
        "mission": "Build a game where players collect treasures while avoiding traps.",
        "conditions": [
          "Create a playable game area.",
          "Include at least 5 collectible treasures.",
          "Add traps that reduce lives.",
          "Display score and remaining lives."
        ],
        "bonus": "Add a rare golden treasure worth 10 points."
      },
      {
        "id": 2,
        "theme": "Reflex Royale",
        "mission": "Create a reaction game where players must hit targets before they disappear.",
        "conditions": [
          "Display targets at changing positions.",
          "Give players 30 seconds.",
          "Calculate the final score.",
          "Show a game-over screen."
        ],
        "bonus": "Add a decoy target that deducts points."
      },
      {
        "id": 3,
        "theme": "Puzzle Dungeon",
        "mission": "Build an adventure game where players unlock doors by solving puzzles.",
        "conditions": [
          "Create 3 puzzle levels.",
          "Provide clues for each puzzle.",
          "Track completed levels.",
          "Unlock the exit after all puzzles are solved."
        ],
        "bonus": "Add a hidden room with a bonus puzzle."
      },
      {
        "id": 4,
        "theme": "Pixel Invaders",
        "mission": "Create a retro arcade game where players defend their base from incoming enemies.",
        "conditions": [
          "Add player movement.",
          "Display moving enemies.",
          "Include a shooting or attack action.",
          "Track score and game-over conditions."
        ],
        "bonus": "Introduce a boss enemy after 10 points."
      },
      {
        "id": 5,
        "theme": "Gravity Flip",
        "mission": "Build a platform game where players switch gravity to avoid obstacles.",
        "conditions": [
          "Create a controllable character.",
          "Include platforms and obstacles.",
          "Add a working gravity-switch action.",
          "Provide a finish line and restart button."
        ],
        "bonus": "Add a section where gravity changes automatically."
      },
      {
        "id": 6,
        "theme": "Zombie Escape",
        "mission": "Help a character escape a zombie-filled maze before time runs out.",
        "conditions": [
          "Create a maze with an exit.",
          "Allow the character to move.",
          "Include at least one moving zombie.",
          "Add a timer and win/lose screens."
        ],
        "bonus": "Add a limited-use speed boost."
      },
      {
        "id": 7,
        "theme": "Target Master",
        "mission": "Build an accuracy game where players hit moving targets to earn points.",
        "conditions": [
          "Show moving or appearing targets.",
          "Track successful hits.",
          "Deduct points for missed or incorrect clicks.",
          "Display accuracy and final score."
        ],
        "bonus": "Add a tiny target worth extra points."
      },
      {
        "id": 8,
        "theme": "Coin Dash",
        "mission": "Create a fast-paced game where players collect coins while avoiding moving obstacles.",
        "conditions": [
          "Make the player controllable.",
          "Include coins and moving obstacles.",
          "Update the score when coins are collected.",
          "End the game when the player collides with an obstacle."
        ],
        "bonus": "Add a magnet power-up that attracts coins."
      },
      {
        "id": 9,
        "theme": "Memory Mayhem",
        "mission": "Build a memory game where players repeat a sequence of lights or symbols.",
        "conditions": [
          "Display a sequence to memorize.",
          "Let players repeat it.",
          "Increase the sequence length after success.",
          "End the game after an incorrect answer."
        ],
        "bonus": "Add a reverse-sequence challenge."
      },
      {
        "id": 10,
        "theme": "Lava Escape",
        "mission": "Guide a character across platforms while the lava rises beneath them.",
        "conditions": [
          "Create platforms that the character can jump between.",
          "Include a rising lava hazard.",
          "Track the player's progress.",
          "Show victory or defeat."
        ],
        "bonus": "Add a temporary safe platform."
      },
      {
        "id": 11,
        "theme": "Lucky Quest",
        "mission": "Create an adventure game where players roll dice to move across a board and collect rewards.",
        "conditions": [
          "Create a board with at least 10 spaces.",
          "Add a working dice roll.",
          "Move the player based on the dice result.",
          "Display the player's position and rewards."
        ],
        "bonus": "Add a trap that sends the player backward."
      },
      {
        "id": 12,
        "theme": "Element Clash",
        "mission": "Build a battle game where players choose fire, water, or earth to defeat an opponent.",
        "conditions": [
          "Include 3 elemental powers.",
          "Define which element beats which.",
          "Let players battle a computer opponent.",
          "Track wins, losses, and draws."
        ],
        "bonus": "Add a rare fourth element with a special rule."
      },
      {
        "id": 13,
        "theme": "Invisible Path",
        "mission": "Create a puzzle game where players must remember a path and navigate it after it disappears.",
        "conditions": [
          "Show a grid with a hidden safe path.",
          "Give players time to memorize it.",
          "Hide the path before navigation.",
          "Track progress and detect incorrect moves."
        ],
        "bonus": "Make the path more complex after each win."
      },
      {
        "id": 14,
        "theme": "Time Freeze",
        "mission": "Build a game where players collect objects while time moves, but can freeze time briefly to avoid danger.",
        "conditions": [
          "Include moving hazards and collectibles.",
          "Add a time-freeze control.",
          "Limit how long time can remain frozen.",
          "Track score and game-over conditions."
        ],
        "bonus": "Add a cooldown before time freeze can be used again."
      },
      {
        "id": 15,
        "theme": "Boss Battle",
        "mission": "Create a mini-game where players fight a boss using timed attacks and defensive moves.",
        "conditions": [
          "Display player and boss health bars.",
          "Include attack and defend actions.",
          "Make the boss respond to player actions.",
          "Show victory when the boss's health reaches zero and defeat when the player's health reaches zero."
        ],
        "bonus": "Give the boss a special attack when its health drops below 50%."
      }
    ]
  }
};

export const SEGMENT_COLORS = ['#8b5cf6','#ec4899','#f97316','#eab308','#14b8a6','#3b82f6','#a855f7','#f43f5e','#22c55e','#0ea5e9','#d946ef','#f59e0b','#6366f1','#10b981','#ef4444'];
