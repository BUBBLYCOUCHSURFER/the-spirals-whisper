export type Choice = {
  id: string;
  text: string;
  corruptionDelta: number;
};

export type GameEvent = {
  id: string;
  title: string;
  prompt: string;
  choices: Choice[];
  premium?: boolean;
};

export const freeEvents: GameEvent[] = [
  {
    id: "spiral-whisper-1",
    title: "The First Whisper",
    prompt:
      "In the group chat, someone draws a spiral around your name. No one admits to doing it.",
    choices: [
      { id: "ignore", text: "Ignore it. It's just a glitch.", corruptionDelta: 1 },
      { id: "emoji", text: "Reply with a spiral emoji.", corruptionDelta: 3 }
    ]
  },
  {
    id: "mirror-typing",
    title: "Mirror Typing",
    prompt:
      "Your messages start appearing reversed, as if typed from the other side of the screen.",
    choices: [
      { id: "stop", text: "Stop typing altogether.", corruptionDelta: 2 },
      { id: "continue", text: "Keep typing. Let it finish your sentences.", corruptionDelta: 4 }
    ]
  }
];

export const premiumEvents: GameEvent[] = [
  {
    id: "hanging-balloon-1",
    title: "The Hanging Balloon Doctrine",
    prompt:
      "A balloon with your friend's face drifts into the video call, neck taut with invisible string.",
    choices: [
      { id: "pop", text: "Pop it. Something wet spills out of the camera.", corruptionDelta: 6 },
      { id: "invite", text: "Invite it to stay. It hovers behind you.", corruptionDelta: 8 }
    ],
    premium: true
  },
  {
    id: "crawling-village",
    title: "The Crawling Village",
    prompt:
      "Your group chat location pins begin to move on their own, crawling toward a single point.",
    choices: [
      { id: "follow", text: "Follow the pins outside.", corruptionDelta: 7 },
      { id: "lock-in", text: "Lock your door and watch them converge.", corruptionDelta: 5 }
    ],
    premium: true
  }
];

export const allEvents = (unlocked: boolean): GameEvent[] =>
  unlocked ? [...freeEvents, ...premiumEvents] : freeEvents;
