// Note: only one sprite set exists right now (public/sprites/*.png), so
// "gear" items are accent/cosmetic only for now — wire up sprite swaps
// once alt-art exists, same pattern as PlusPlus-Chan's outfit system.

export const WALLPAPERS = [
  {
    id: 'wallpaper-vinyl-room',
    type: 'wallpaper',
    name: 'Vinyl room',
    requiredLevel: 1,
    src: '/wallpapers/vinyl-room.jpg',
    accent: '#e8973a',
    description: 'Warm, analog, unhurried. Home base.',
    isDefault: true,
  },
  {
    id: 'wallpaper-studio-night',
    type: 'wallpaper',
    name: 'Studio night',
    requiredLevel: 2,
    src: '/wallpapers/studio-night.jpg',
    accent: '#6e8fb8',
    description: 'Late session, one lamp, headphones on.',
  },
  {
    id: 'wallpaper-city-lights',
    type: 'wallpaper',
    name: 'City lights',
    requiredLevel: 3,
    src: '/wallpapers/city-lights.jpg',
    accent: '#d4574a',
    description: 'Neon, glass, the studio above the noise.',
  },
  {
    id: 'wallpaper-festival-sunset',
    type: 'wallpaper',
    name: 'Festival sunset',
    requiredLevel: 5,
    src: '/wallpapers/festival-sunset.jpg',
    accent: '#f0b56e',
    description: 'The set you built all this for.',
  },
];

export const GEAR = [
  {
    id: 'gear-default',
    type: 'gear',
    name: 'House kit',
    requiredLevel: 1,
    accent: '#c9b8a3',
    description: 'Reliable cans, no frills.',
    isDefault: true,
  },
  {
    id: 'gear-redline',
    type: 'gear',
    name: 'Redline cans',
    requiredLevel: 2,
    accent: '#d4574a',
    description: 'Loud opinions about your low end.',
  },
  {
    id: 'gear-goldfoil',
    type: 'gear',
    name: 'Gold foil jacket',
    requiredLevel: 4,
    accent: '#e8973a',
    description: 'For when the session goes long.',
  },
];

export const SHOP_ITEMS = [...WALLPAPERS, ...GEAR];
