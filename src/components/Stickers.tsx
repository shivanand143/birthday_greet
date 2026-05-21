import { motion } from 'motion/react';

interface StickerProps {
  id: string;
  className?: string;
  animate?: boolean;
}

export function Sticker({ id, className = 'w-32 h-32', animate = true }: StickerProps) {
  const rotationAnimate = animate
    ? {
        y: [0, -6, 0],
        rotate: [0, 2, -2, 0],
        transition: {
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  switch (id) {
    case 'happy-panda':
      // Peach / Goma style panda with crown and birthday cupcake
      return (
        <motion.div animate={rotationAnimate} className={`${className} flex items-center justify-center relative`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_16px_rgba(250,204,21,0.2)]">
            {/* Panda Ears */}
            <circle cx="35" cy="35" r="12" fill="#2d2d2d" />
            <circle cx="85" cy="35" r="12" fill="#2d2d2d" />
            <circle cx="35" cy="35" r="6" fill="#1a1a1a" />
            <circle cx="85" cy="35" r="6" fill="#1a1a1a" />
            
            {/* Head */}
            <ellipse cx="60" cy="65" rx="35" ry="32" fill="#ffffff" stroke="#2d2d2d" strokeWidth="3" />
            
            {/* Eye Patches */}
            <ellipse cx="46" cy="64" rx="10" ry="7" transform="rotate(-15, 46, 64)" fill="#2d2d2d" />
            <ellipse cx="74" cy="64" rx="10" ry="7" transform="rotate(15, 74, 64)" fill="#2d2d2d" />
            
            {/* Eyes */}
            <circle cx="48" cy="63" r="4" fill="#ffffff" />
            <circle cx="72" cy="63" r="4" fill="#ffffff" />
            <circle cx="49" cy="62" r="1.5" fill="#1a1a1a" />
            <circle cx="73" cy="62" r="1.5" fill="#1a1a1a" />

            {/* Rosy Cheeks */}
            <ellipse cx="34" cy="74" rx="7" ry="4" fill="#ffb3ba" opacity="0.8" />
            <ellipse cx="86" cy="74" rx="7" ry="4" fill="#ffb3ba" opacity="0.8" />

            {/* Nose and Mouth */}
            <ellipse cx="60" cy="70" rx="4" ry="2.5" fill="#2d2d2d" />
            <path d="M 57,75 Q 60,78 60,75 Q 60,78 63,75" fill="none" stroke="#2d2d2d" strokeWidth="2.5" strokeLinecap="round" />

            {/* Golden Crown */}
            <motion.polygon
              points="48,34 52,44 60,32 68,44 72,34 76,48 44,48"
              fill="#fadcc0"
              stroke="#eab308"
              strokeWidth="2.5"
              strokeLinejoin="round"
              animate={{
                scale: [1, 1.05, 1],
                y: [0, -2, 0],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            {/* Crown Gem */}
            <circle cx="60" cy="32" r="2.5" fill="#f43f5e" />

            {/* Birthday Cupcake held in hands */}
            <g transform="translate(45, 84)">
              {/* Hands holding it */}
              <circle cx="-5" cy="8" r="6" fill="#ffffff" stroke="#2d2d2d" strokeWidth="2.5" />
              <circle cx="35" cy="8" r="6" fill="#ffffff" stroke="#2d2d2d" strokeWidth="2.5" />
              
              {/* Cupcake Base wrap */}
              <polygon points="5,15 9,32 21,32 25,15" fill="#f472b6" stroke="#2d2d2d" strokeWidth="2" />
              {/* Cream Top */}
              <path d="M 3,15 Q 15,-2 27,15 Z" fill="#fef08a" stroke="#2d2d2d" strokeWidth="2" />
              {/* Strawberry */}
              <circle cx="15" cy="3" r="5" fill="#ef4444" />
              <polygon points="15,0 13,4 17,4" fill="#22c55e" />
              {/* Tiny Sparkle candle */}
              <line x1="15" y1="-2" x2="15" y2="-8" stroke="#f59e0b" strokeWidth="2" />
              <motion.circle
                cx="15"
                cy="-11"
                r="3"
                fill="#f59e0b"
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </g>
          </svg>
        </motion.div>
      );

    case 'love-bear':
      // Adorable bear hugging a giant glowing ruby heart
      return (
        <motion.div
          animate={{
            rotate: [-3, 3, -3],
            y: [0, -4, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className={`${className} flex items-center justify-center relative`}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_20px_rgba(244,63,94,0.35)]">
            {/* Bear Ears */}
            <circle cx="42" cy="40" r="10" fill="#fbcfe8" stroke="#db2777" strokeWidth="2.5" />
            <circle cx="78" cy="40" r="10" fill="#fbcfe8" stroke="#db2777" strokeWidth="2.5" />
            
            {/* Bear Body/Head */}
            <ellipse cx="60" cy="70" rx="32" ry="30" fill="#fdf2f8" stroke="#db2777" strokeWidth="2.5" />
            
            {/* Giant Heart */}
            <motion.path
              d="M 60,94 C 38,72 32,56 46,44 C 55,36 60,46 60,46 C 60,46 65,36 74,44 C 88,56 82,72 60,94 Z"
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="2.5"
              animate={{
                scale: [1, 1.06, 1],
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
            
            {/* Soft Sparkle dots on heart */}
            <circle cx="52" cy="52" r="2.5" fill="#ffffff" opacity="0.8" />
            <circle cx="70" cy="62" r="1.5" fill="#ffffff" opacity="0.6" />

            {/* Bear Eyes (peeking over heart) */}
            <path d="M 44,52 Q 48,48 52,52" fill="none" stroke="#db2777" strokeWidth="3" strokeLinecap="round" />
            <path d="M 68,52 Q 72,48 76,52" fill="none" stroke="#db2777" strokeWidth="3" strokeLinecap="round" />
            
            {/* Bear Cheeks blushing */}
            <circle cx="39" cy="58" r="4.5" fill="#f472b6" opacity="0.8" />
            <circle cx="81" cy="58" r="4.5" fill="#f472b6" opacity="0.8" />

            {/* Bear Paws cuddling the heart */}
            <circle cx="45" cy="68" r="6" fill="#fdf2f8" stroke="#db2777" strokeWidth="2.5" />
            <circle cx="75" cy="68" r="6" fill="#fdf2f8" stroke="#db2777" strokeWidth="2.5" />
          </svg>
        </motion.div>
      );

    case 'crying-hearts':
      // Overwhelmed cuddly cat happy-crying neon floating hearts
      return (
        <motion.div animate={rotationAnimate} className={`${className} flex items-center justify-center relative`}>
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Cat Ears */}
            <polygon points="30,50 15,22 48,39" fill="#e5e5e5" stroke="#404040" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points="90,50 105,22 72,39" fill="#e5e5e5" stroke="#404040" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points="26,45 18,27 38,38" fill="#fda4af" />
            <polygon points="94,45 102,27 82,38" fill="#fda4af" />

            {/* Cat Face */}
            <ellipse cx="60" cy="68" rx="36" ry="30" fill="#ffffff" stroke="#404040" strokeWidth="2.5" />

            {/* Cute eyes: squinting happy ^_^ */}
            <path d="M 40,64 Q 45,58 50,64" fill="none" stroke="#404040" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 70,64 Q 75,58 80,64" fill="none" stroke="#404040" strokeWidth="3.5" strokeLinecap="round" />

            {/* Cute kitty mouth */}
            <path d="M 54,73 Q 60,76 60,73 Q 60,76 66,73" fill="none" stroke="#404040" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="60" cy="70" r="1.5" fill="#404040" />

            {/* Blushing blush */}
            <ellipse cx="34" cy="74" rx="6" ry="3" fill="#fda4af" />
            <ellipse cx="86" cy="74" rx="6" ry="3" fill="#fda4af" />

            {/* Left and Right Whiskers */}
            <line x1="20" y1="72" x2="8" y2="73" stroke="#404040" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="78" x2="10" y2="81" stroke="#404040" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="72" x2="112" y2="73" stroke="#404040" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="78" x2="110" y2="81" stroke="#404040" strokeWidth="2" strokeLinecap="round" />

            {/* Heart Tears floating up */}
            <g>
              <motion.path
                d="M 45,56 C 35,46 32,38 45,26 C 50,33 45,56 45,56 Z"
                fill="#ff4d6d"
                animate={{ y: [0, -25, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.path
                d="M 75,56 C 85,46 88,38 75,26 C 70,33 75,56 75,56 Z"
                fill="#ff4d6d"
                animate={{ y: [-5, -30, -5], opacity: [1, 0, 1] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
              />
            </g>
          </svg>
        </motion.div>
      );

    case 'cuddle-cats':
      // Two cute kittens hugging together - true GenZ cute coupling
      return (
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            y: [0, -3, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className={`${className} flex items-center justify-center relative`}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Gray Cat (Behind, hugging) */}
            <g transform="translate(10, 5)">
              <polygon points="15,40 10,15 35,30" fill="#a3a3a3" stroke="#525252" strokeWidth="2" />
              <polygon points="65,40 70,15 45,30" fill="#a3a3a3" stroke="#525252" strokeWidth="2" />
              <ellipse cx="40" cy="55" rx="28" ry="24" fill="#d4d4d4" stroke="#525252" strokeWidth="2" />
              {/* Happy shut eyes */}
              <path d="M 28,52 Q 33,48 38,52" fill="none" stroke="#525252" strokeWidth="2" strokeLinecap="round" />
              <path d="M 42,52 Q 47,48 52,52" fill="none" stroke="#525252" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* White Cat (In front, blushing sweet Goma) */}
            <g transform="translate(25, 23)">
              <polygon points="12,30 5,8 28,21" fill="#ffffff" stroke="#404040" strokeWidth="2.5" />
              <polygon points="58,30 65,8 42,21" fill="#ffffff" stroke="#404040" strokeWidth="2.5" />
              <ellipse cx="35" cy="45" rx="26" ry="22" fill="#ffffff" stroke="#404040" strokeWidth="2.5" />
              {/* Blinking eyes */}
              <circle cx="24" cy="42" r="3.5" fill="#404040" />
              <path d="M 42,42 Q 46,39 50,42" fill="none" stroke="#404040" strokeWidth="3" strokeLinecap="round" />
              {/* Kitty mouth */}
              <path d="M 31,48 Q 35,51 35,48 Q 35,51 39,48" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <circle cx="18" cy="47" r="4.5" fill="#fca5a5" opacity="0.8" />
              <circle cx="52" cy="47" r="4.5" fill="#fca5a5" opacity="0.8" />
            </g>

            {/* Cute floating bubble heart */}
            <motion.path
              d="M 60,25 C 50,15 46,6 60,-4 C 64,1 60,25 60,25 Z"
              fill="#ef4444"
              animate={{
                scale: [0.8, 1.2, 0.8],
                y: [0, -10, 0],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              transform="translate(0, 0)"
            />
          </svg>
        </motion.div>
      );

    case 'heart-medallion':
      // Vertical reveal line's gold heart medallion
      return (
        <div className={`${className} flex items-center justify-center relative active:scale-95 transition-all`}>
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping duration-1000 blur-sm pointer-events-none" />
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
            </defs>
            {/* Medallion outer rings */}
            <circle cx="50" cy="50" r="46" fill="transparent" stroke="url(#goldGrad)" strokeWidth="3" />
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="3 3 shrink" />
            <circle cx="50" cy="50" r="35" fill="rgba(24, 24, 27, 0.95)" stroke="url(#goldGrad)" strokeWidth="1.5" />
            
            {/* Cute Angel Wing elements left & right */}
            <path d="M 28,45 C 16,35 22,55 35,50" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 72,45 C 84,35 78,55 65,50" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />

            {/* Glowing inner red heart */}
            <path
              d="M 50,68 C 34,51 30,40 40,32 C 46,27 50,34 50,34 C 50,34 54,27 60,32 C 70,40 66,51 50,68 Z"
              fill="#f43f5e"
              stroke="#be123c"
              strokeWidth="1.5"
            />
            {/* Reflection spark */}
            <circle cx="45" cy="38" r="2" fill="#ffffff" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}
export const STICKER_TEMPLATES = [
  { id: 'happy-panda', name: 'Birthday Panda 🐼' },
  { id: 'love-bear', name: 'Love Bear Hug 💖' },
  { id: 'crying-hearts', name: 'Slang Overwhelmed Cat 🥺' },
  { id: 'cuddle-cats', name: 'Cuddle Kittens 🐱' }
];
