export interface Memory {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface WishConfig {
  recipientName: string;
  senderName: string;
  dateOfBirth: string; // e.g. "2004-06-21" or "2020-05-18"
  counterType: 'age' | 'together' | 'countdown';
  counterLabel: string; // Custom string overlay, e.g. "Years of Knowing You" or "Your sweet life on Earth"
  letterTitle: string;
  letterSubtitle: string;
  letterMessage: string;
  musicTrackId: string;
  themeId: string;
  stickerId: string;
  memories: Memory[];
}

export interface SoundTrack {
  id: string;
  name: string;
  description: string;
  notes: number[]; // frequencies or patterns for oscillator synth if loaded dynamically
  type: 'synth' | 'lofi' | 'acoustic' | 'pop';
}

export interface ThemePreset {
  id: string;
  name: string;
  background: string; // Tailwind class
  accentText: string; // e.g. "text-yellow-400"
  accentGlow: string; // e.g. "shadow-[0_0_20px_rgba(250,204,21,0.4)]"
  buttonBg: string;
  cardBg: string;
  outlineColor: string; // e.g. "border-yellow-400"
  fireflyColor: string; // e.g. "rgba(250, 204, 21, 0.5)"
}

export const THEMES: ThemePreset[] = [
  {
    id: 'gold-charcoal',
    name: 'Romantic Velvet Rose',
    background: 'bg-gradient-to-br from-rose-950 via-neutral-950 to-neutral-950 text-neutral-100',
    accentText: 'text-rose-400',
    accentGlow: 'shadow-[0_0_25px_rgba(244,63,94,0.3)]',
    buttonBg: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-lg shadow-rose-500/20 border border-rose-400/20 font-extrabold',
    cardBg: 'bg-neutral-900/90 border border-rose-500/30 backdrop-blur-md',
    outlineColor: 'border-rose-400/80',
    fireflyColor: 'rgba(244, 63, 94, 0.45)'
  },
  {
    id: 'cyber-neon',
    name: 'Romantic Lavender Space',
    background: 'bg-gradient-to-br from-purple-950 via-neutral-950 to-neutral-950 text-slate-100',
    accentText: 'text-purple-400',
    accentGlow: 'shadow-[0_0_25px_rgba(168,85,247,0.35)]',
    buttonBg: 'bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/20 border border-purple-400/20 font-extrabold',
    cardBg: 'bg-neutral-900/90 border border-purple-500/30 backdrop-blur-md',
    outlineColor: 'border-purple-400/80',
    fireflyColor: 'rgba(168, 85, 247, 0.45)'
  },
  {
    id: 'sweet-strawberry',
    name: 'Sweet Love Garden',
    background: 'bg-gradient-to-br from-red-950 via-neutral-950 to-neutral-950 text-rose-100',
    accentText: 'text-rose-300',
    accentGlow: 'shadow-[0_0_25px_rgba(239,68,68,0.35)]',
    buttonBg: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 border border-red-400/20 font-extrabold',
    cardBg: 'bg-neutral-900/90 border border-red-500/30 backdrop-blur-md',
    outlineColor: 'border-red-400/80',
    fireflyColor: 'rgba(239, 68, 68, 0.45)'
  },
  {
    id: 'sage-matcha',
    name: 'Cozy Caramel Cocoa',
    background: 'bg-gradient-to-br from-amber-950 via-neutral-950 to-neutral-950 text-amber-100',
    accentText: 'text-amber-300',
    accentGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-neutral-950 shadow-lg shadow-amber-500/20 border border-amber-400/20 font-extrabold',
    cardBg: 'bg-neutral-900/90 border border-amber-500/30 backdrop-blur-md',
    outlineColor: 'border-amber-400/70',
    fireflyColor: 'rgba(245, 158, 11, 0.45)'
  }
];

export const DEFAULT_CONFIG: WishConfig = {
  recipientName: 'Cutiepie',
  senderName: 'Your Partner',
  dateOfBirth: '2008-07-16',
  counterType: 'age',
  counterLabel: 'Years of Joy and Smiles',
  letterTitle: 'Happy Birthday ✨',
  letterSubtitle: 'Just for you ♥',
  letterMessage: `Happiest birthday my silly cutuu 🐼 I pray you achieve all your dreams, stay happy, and keep smiling the way you do... because that smile is my absolutely favorite thing!

Everyday is your day because you are the major main character... and YOU KNOW IT 😎 Let's share unlimited laughs, love, silly fights, and deep late-night conversations.

I love you forever and ever and ever ♾️ Thank you for being my partner in crime, my support system, and my absolute favorite person in every sense! Happy Birthday! 🎂💖✨`,
  musicTrackId: 'lofi-romance',
  themeId: 'gold-charcoal',
  stickerId: 'happy-panda',
  memories: [
    {
      id: 'm1',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
      caption: 'The way you blush when I look at you closely... cuteness overload! 🥰'
    },
    {
      id: 'm2',
      imageUrl: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?q=80&w=600&auto=format&fit=crop',
      caption: 'Our late night deep talks under the stars 🌙 talking about everything and nothing.'
    },
    {
      id: 'm3',
      imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600&auto=format&fit=crop',
      caption: 'Endless boba sessions 🧋 We literally have a boba-drinking addiction, no cap!'
    },
    {
      id: 'm4',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
      caption: 'Silly grocery store shopping dates 🛒 Making chores feel like holding a carnival.'
    }
  ]
};
