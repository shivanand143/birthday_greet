import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Heart, Mail, RotateCcw, Sparkles } from 'lucide-react';
import { Sticker } from './Stickers';
import { WishConfig, ThemePreset } from '../types';

interface InteractiveShowProps {
  config: WishConfig;
  theme: ThemePreset;
  onRestart: () => void;
  onEnterCustomize?: () => void;
  onStartMusic?: () => void;
}

export default function InteractiveShow({ config, theme, onRestart, onStartMusic }: InteractiveShowProps) {
  // Serialized Steps representation:
  // 0: Tap to open door
  // 1: Loading something special with progress
  // 2: There's something special I want to tell you...
  // 3: Happy Birthday Cutiepie with age metrics
  // 4: Cute memories with images & "Read My Message" button immediately below
  // 5: Tap to see the message envelope screen
  // 6: Happy Birthday with full message letter board
  const [step, setStep] = useState(0); 
  const [isOpening, setIsOpening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaderSub, setLoaderSub] = useState('Assembling sweet thoughts...');
  const [activePolaroidIndex, setActivePolaroidIndex] = useState(0);

  const handleTapToOpen = () => {
    setIsOpening(true);
    if (onStartMusic) {
      onStartMusic();
    }
    setTimeout(() => {
      setStep(1); // Go to step 1: Loading
    }, 1200);
  };

  // Time metrics calculations
  const [metrics, setMetrics] = useState({ years: 0, months: 0, days: 0 });
  const [cdMetrics, setCdMetrics] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const bday = new Date(config.dateOfBirth);
    const today = new Date();
    if (isNaN(bday.getTime())) return;

    if (config.counterType === 'countdown') {
      const calculateBdayCountdown = () => {
        const t = new Date();
        const nextBday = new Date(t.getFullYear(), bday.getMonth(), bday.getDate());
        if (nextBday.getTime() < t.getTime()) {
          nextBday.setFullYear(t.getFullYear() + 1);
        }
        const diff = nextBday.getTime() - t.getTime();
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCdMetrics({ days: d, hours: h, minutes: m });
      };
      calculateBdayCountdown();
      const timer = setInterval(calculateBdayCountdown, 60000);
      return () => clearInterval(timer);
    } else {
      let yrs = today.getFullYear() - bday.getFullYear();
      let mths = today.getMonth() - bday.getMonth();
      let dys = today.getDate() - bday.getDate();

      if (dys < 0) {
        mths -= 1;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        dys += prevMonth.getDate();
      }
      if (mths < 0) {
        yrs -= 1;
        mths += 12;
      }
      setMetrics({ years: yrs, months: mths, days: dys });
    }
  }, [config.dateOfBirth, config.counterType]);

  // Progressive loader logic for Step 1
  useEffect(() => {
    if (step !== 1) return;
    setProgress(0);
    const subtitles = [
      'Compiling romantic blueprints... ❤️',
      'Synthesizing sweet cuddle loops... 🧸',
      'Summoning silly panda helpers... 🐼',
      'Aligning our favorite memories... ✨',
      'Wrapping letters with absolute care... 💌',
      'Get ready for cute vibes! 🍰'
    ];

    let timer: number;
    let labelInterval: number;

    timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStep(2); // Auto proceed to Step 2: Teaser
          return 100;
        }
        return prev + 1;
      });
    }, 28);

    labelInterval = window.setInterval(() => {
      setLoaderSub((prev) => {
        const nextIdx = (subtitles.indexOf(prev) + 1) % subtitles.length;
        return subtitles[nextIdx];
      });
    }, 550);

    return () => {
      clearInterval(timer);
      clearInterval(labelInterval);
    };
  }, [step]);

  const nextPolaroid = () => {
    setActivePolaroidIndex((prev) => (prev + 1) % config.memories.length);
  };

  const prevPolaroid = () => {
    setActivePolaroidIndex((prev) => (prev - 1 + config.memories.length) % config.memories.length);
  };

  const handleRestart = () => {
    setStep(0);
    setIsOpening(false);
    setProgress(0);
    setActivePolaroidIndex(0);
    onRestart();
  };

  // Custom whimsical springy transition presets
  const cardAnimation = {
    initial: { y: 120, rotate: -10, scale: 0.82, opacity: 0 },
    animate: { 
      y: 0, 
      rotate: 0, 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 160, 
        damping: 14 
      } 
    },
    exit: { 
      y: -120, 
      rotate: 6, 
      scale: 0.85, 
      opacity: 0, 
      transition: { duration: 0.3 } 
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center font-cursive tracking-normal overflow-hidden px-4 select-none bg-transparent">
      
      {/* Background radial overlays for extreme neon depth */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-[90px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

      <AnimatePresence mode="wait">
        
        {/* SEQUENCE 1: Gate Tap to Open */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
            className="absolute inset-0 flex items-center justify-center z-45 bg-neutral-950/95 overflow-hidden"
          >
            {/* Sliding Doors */}
            <motion.div
              initial={{ x: '0%' }}
              animate={{ x: isOpening ? '-100%' : '0%' }}
              transition={{ duration: 1.25, ease: [0.77, 0, 0.175, 1] }}
              className="absolute left-0 top-0 bottom-0 w-1/2 border-r border-[#f43f5e]/30 bg-gradient-to-r from-[#19040d] via-[#110209] to-[#250816]"
            />
            <motion.div
              initial={{ x: '0%' }}
              animate={{ x: isOpening ? '100%' : '0%' }}
              transition={{ duration: 1.25, ease: [0.77, 0, 0.175, 1] }}
              className="absolute right-0 top-0 bottom-0 w-1/2 border-l border-[#f43f5e]/30 bg-gradient-to-l from-[#19040d] via-[#110209] to-[#250816]"
            />
            
            {/* Split glowing laser line */}
            <motion.div
              initial={{ opacity: 1, scaleY: 1 }}
              animate={{ opacity: isOpening ? 0 : 1, scaleY: isOpening ? 0 : 1 }}
              transition={{ duration: 0.9 }}
              className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-rose-500/10 via-rose-500 to-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.85)] z-50 animate-pulse"
            />

            {/* Glowing gold & velvet keyholder medallion */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: isOpening ? 0 : 1, opacity: isOpening ? 0 : 1 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="relative flex flex-col items-center gap-5 z-50 text-center"
            >
              <button
                id="tap_to_open_button"
                onClick={handleTapToOpen}
                disabled={isOpening}
                className="w-32 h-32 cursor-pointer focus:outline-none transition-transform hover:scale-110 active:scale-95 disabled:pointer-events-none relative"
                aria-label="Tap to open birthday wishes"
              >
                <div className="absolute -inset-2 bg-gradient-to-br from-rose-500 to-amber-500 rounded-full blur-md opacity-75 animate-ping duration-1000" />
                <Sticker id="heart-medallion" className="w-32 h-32 relative z-10 font-sans" animate={false} />
              </button>
              <div className="text-center bg-black/60 px-5 py-2.5 rounded-full border border-rose-500/20 backdrop-blur-md">
                <p className="font-cursive text-sm uppercase tracking-[0.2em] text-rose-300 font-extrabold animate-pulse">
                  {isOpening ? '💘 OPENING HUG...' : '👉 TAP TO OPEN 👈'}
                </p>
                <p className="text-[11px] text-neutral-400 font-sans mt-1">compulsory sounds on! 🎵🍰</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* SEQUENCE 2: Loading screen with progress indicator bar */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="flex flex-col items-center justify-center max-w-md w-full relative z-20 text-center p-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Sticker id="csh-bouncing" className="w-36 h-36 mb-6 animate-bounce" />
            
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-rose-400/30 flex items-center justify-center relative animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-4 border-t-rose-500 animate-spin" />
              </div>
              <Heart fill="currentColor" className="text-rose-500 animate-pulse absolute" size={32} />
            </div>

            <h3 className="text-2xl font-black text-rose-300 tracking-wide mb-3">
              Unpacking sweet cake... 🍰
            </h3>

            {/* Tactile bubbly custom progress bar frame */}
            <div className="w-full max-w-sm bg-neutral-950/40 border border-rose-500/30 rounded-full h-5 p-1 mb-3 overflow-hidden shadow-inner backdrop-blur-xs">
              <motion.div
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <p className="text-xs font-cursive text-rose-100/80 italic min-h-[1.5rem]">
              {loaderSub}
            </p>
          </motion.div>
        )}

        {/* SEQUENCE 3: "There's something" Teaser Page */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={cardAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center text-center max-w-md w-full relative z-20 p-6"
          >
            <Sticker id="love-bear" className="w-40 h-40 mb-5" />

            <h2 className="text-3xl font-black tracking-tight leading-snug mb-4 uppercase text-rose-300 drop-shadow-md">
              Psst... I have <br />
              something super <br />
              special to say! 🤫💖
            </h2>

            <p className="text-sm text-rose-100/80 leading-relaxed font-black">
              Because nobody makes my heart jump quite like you do, darling! Let's peek inside! 👇
            </p>

            {/* Custom bubble reactive 3D button */}
            <motion.button
              id="teaser_next_button"
              onClick={() => setStep(3)}
              className="mt-8 px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-cursive text-base rounded-2xl border-b-6 border-rose-800 active:translate-y-1 active:border-b-2 hover:scale-105 active:scale-95 transition-all duration-150 shadow-xl cursor-pointer flex items-center justify-center gap-2 font-black"
            >
              Come Inside Sunshine! 🧸🎈✨
            </motion.button>
          </motion.div>
        )}

        {/* SEQUENCE 4: Happy Birthday with Age counters */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={cardAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center text-center max-w-md w-full relative z-20 p-6"
          >
            {/* Sticker Mascot */}
            <div className="mb-4 relative">
              <div className="absolute -inset-4 bg-rose-500/20 rounded-full blur-2xl animate-pulse-slow" />
              <Sticker id={config.stickerId} className="w-40 h-40 relative z-10" />
            </div>

            {/* Custom Gen-Z greeting style with glowing display headings */}
            <h1 className="text-[2.2rem] leading-none font-black tracking-tight mb-2 uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] text-rose-300">
              Happy Birthday <br />
              <span className="text-white brightness-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)] tracking-normal capitalize decoration-wavy underline decoration-rose-500">
                {config.recipientName} 🎂
              </span>
            </h1>

            <p className="text-xs font-sans text-neutral-400 tracking-wider mb-6">
              {config.counterLabel || 'Your sweet lifetime counter'}
            </p>

            {/* Age Counter Metrics columns block */}
            <div className="grid grid-cols-3 gap-4 w-full bg-rose-500/5 p-5 rounded-3xl border border-rose-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(244,63,94,0.15)]">
              {config.counterType !== 'countdown' ? (
                <>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black font-sans text-rose-400">
                      {metrics.years}
                    </span>
                    <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase mt-1">Years 👑</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black font-sans text-rose-400">
                      {metrics.months}
                    </span>
                    <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase mt-1">Months 🌸</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black font-sans text-rose-400">
                      {metrics.days}
                    </span>
                    <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase mt-1">Days 🌱</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black font-sans text-rose-400">
                      {cdMetrics.days}
                    </span>
                    <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase mt-1">Days ⭐</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black font-sans text-rose-400">
                      {cdMetrics.hours}
                    </span>
                    <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase mt-1">Hours ⏳</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black font-sans text-rose-400">
                      {cdMetrics.minutes}
                    </span>
                    <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase mt-1">Min ⚡</span>
                  </div>
                </>
              )}
            </div>

            {/* To memories gallery button */}
            <motion.button
              id="countdown_continue_button"
              onClick={() => setStep(4)}
              className="mt-8 px-8 py-3.5 w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-cursive text-base rounded-2xl border-b-6 border-rose-800 active:translate-y-1 active:border-b-2 hover:scale-[1.03] active:scale-95 transition-all duration-150 shadow-xl cursor-pointer flex items-center justify-center gap-2 font-extrabold animate-pulse"
            >
              Unlock Cute Memories! 📸💝🌸
            </motion.button>
          </motion.div>
        )}

        {/* SEQUENCE 5: Cute Memories with polaroids & read message button directly below */}
        {step === 4 && (
          <motion.div
            key="step4"
            variants={cardAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center max-w-md w-full relative z-20 text-center p-6"
          >
            {/* Header section with floating sparkles */}
            <div className="text-center mb-5 relative w-full">
              <div className="flex items-center justify-center gap-2">
                <Sparkles size={18} className="text-rose-400" />
                <h3 className="text-2.5xl font-black uppercase text-rose-300">
                  Memory Scrapbook 📔
                </h3>
              </div>
              <p className="text-[11px] font-sans text-neutral-400 mt-1">
                Pin Chapter #0{activePolaroidIndex + 1} of {config.memories.length}
              </p>
            </div>

            {/* Polaroid Container Box */}
            <div className="relative w-80 h-96 mb-6 flex items-center justify-center">
              
              {/* Cute Washi Tape element to anchor polaroid */}
              <div className="absolute top-1 z-40 bg-pink-400/35 border border-dashed border-pink-300/60 -rotate-3 h-6 w-24 backdrop-blur-xs shadow-md" />

              <AnimatePresence mode="popLayout">
                {config.memories.map((mem, idx) => {
                  if (idx !== activePolaroidIndex) return null;
                  return (
                    <motion.div
                      key={mem.id}
                      initial={{ scale: 0.9, rotate: -4, opacity: 0, y: 15 }}
                      animate={{ scale: 1, rotate: idx % 2 === 0 ? 1 : -1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.92, rotate: 10, opacity: 0, x: 220 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                      className="absolute inset-0 bg-stone-50 p-4 pb-6 rounded-2xl flex flex-col shadow-2xl border-4 border-stone-100"
                    >
                      {/* Photo box */}
                      <div className="relative flex-1 bg-stone-900 rounded-lg overflow-hidden border border-stone-200">
                        {mem.imageUrl ? (
                          <img
                            src={mem.imageUrl}
                            alt={mem.caption}
                            className="w-full h-full object-cover select-none"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 font-sans text-xs">
                            Empty memory canvas 📸
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Handwritten Caption Box */}
                      <div className="pt-3.5 pb-1 flex flex-col text-left select-text">
                        <span className="text-[9px] font-sans text-stone-400 uppercase font-bold tracking-wider">
                          Memory Snapshot
                        </span>
                        <p className="font-cursive text-sm sm:text-base leading-snug text-stone-800 mt-0.5 min-h-[46px] font-bold">
                          {mem.caption}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Slider Switch Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
              <button
                id="prev_polaroid_button"
                onClick={prevPolaroid}
                className="py-3 bg-neutral-950/40 border border-rose-500/25 hover:border-rose-400 text-rose-300 rounded-2xl hover:bg-rose-500/10 hover:text-white cursor-pointer transition-all text-sm font-cursive font-black"
              >
                👈 Backward 🧸
              </button>
              <button
                id="next_polaroid_button"
                onClick={nextPolaroid}
                className="py-3 bg-neutral-950/40 border border-rose-500/25 hover:border-rose-400 text-rose-300 rounded-2xl hover:bg-rose-500/10 hover:text-white cursor-pointer transition-all text-sm font-cursive font-black"
              >
                Forward 👉 🍰
              </button>
            </div>

            {/* Read my message button */}
            <div className="w-full flex flex-col">
              <button
                id="read_message_polaroid_button"
                onClick={() => setStep(5)} // Go to step 5: Invitation wrapper
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-cursive text-base rounded-2xl border-b-6 border-rose-800 active:translate-y-1 active:border-b-2 hover:scale-[1.02] active:scale-95 transition-all duration-150 shadow-xl cursor-pointer flex items-center justify-center gap-2 font-black uppercase tracking-wide"
              >
                <Mail size={18} />
                Unfold Heart Letter! 💌✍️💖
              </button>
            </div>
          </motion.div>
        )}

        {/* SEQUENCE 6: Tap to see the message envelope screen */}
        {step === 5 && (
          <motion.div
            key="step5"
            variants={cardAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center relative max-w-sm w-full z-20 text-center p-6"
          >
            <h3 className="text-2.5xl sm:text-3xl font-black uppercase leading-tight mb-6 text-rose-300">
              Unzip the secret <br /> message box 👉👈✨
            </h3>

            {/* Pulsing Love Seal Envelope */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setStep(6)} // Go to step 6: Final handwritten board
              className="p-8 bg-gradient-to-br from-rose-500/10 to-pink-500/5 hover:from-rose-500/20 hover:to-pink-500/10 border border-rose-500/30 rounded-[2rem] cursor-pointer shadow-[0_0_40px_rgba(244,63,94,0.15)] relative w-full flex flex-col items-center gap-4 transition-all duration-300 backdrop-blur-md"
            >
              <div className="absolute top-2 right-3 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-pink-500" />
              </div>

              {/* Pulsing seal wax stamp */}
              <div className="w-20 h-20 bg-neutral-950/50 border border-rose-500/30 flex items-center justify-center rounded-2xl relative">
                <div className="absolute inset-0 bg-rose-500/20 rounded-2xl animate-ping border border-rose-500/30 pointer-events-none" />
                <Mail className="text-rose-400 animate-pulse" size={32} />
              </div>

              <div className="flex flex-col">
                <h4 className="text-base font-black text-rose-100 uppercase tracking-wide font-cursive">For My Favorite Person 💌</h4>
                <span className="text-[11px] text-neutral-400 font-sans mt-0.5 font-bold">tap envelope to break sealing voodoo 🔮🎀</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* SEQUENCE 7: Happy Birthday with full message letter board */}
        {step === 6 && (
          <motion.div
            key="step6"
            variants={cardAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center max-w-md w-full relative z-20 text-center px-4"
          >
            <div className="w-full rounded-[2.5rem] p-8 relative overflow-hidden backdrop-blur-md bg-neutral-950/45 border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.25)]">
              {/* Wooden parchment header styling */}
              <div className="flex justify-between items-center border-b border-rose-900/40 pb-4 mb-4">
                <div className="flex flex-col text-left">
                  <h4 className="text-2xl font-black text-rose-300">
                    {config.letterTitle} 🎉
                  </h4>
                  <span className="text-[11px] font-sans text-neutral-400 uppercase mt-0.5 font-bold">
                    {config.letterSubtitle || 'Cozy Message Board'}
                  </span>
                </div>
                <div className="p-1 px-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-full text-[10px] font-sans font-bold flex items-center gap-1">
                  <Heart size={10} fill="currentColor" />
                  BOARD
                </div>
              </div>

              {/* Cursive handwritten sweet love message with scroll bar */}
              <div className="text-left font-cursive text-base sm:text-lg leading-relaxed text-rose-50/95 max-h-[44vh] overflow-y-auto pr-2 my-2 whitespace-pre-wrap select-text scrollbar-thin font-bold">
                {config.letterMessage}
              </div>

              {/* Custom 3D replay action */}
              <button
                id="modal_memories_button"
                onClick={handleRestart}
                className="w-full mt-6 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-cursive text-base rounded-2xl border-b-6 border-rose-800 active:translate-y-1 active:border-b-2 hover:scale-[1.02] active:scale-95 transition-all duration-150 shadow-xl cursor-pointer flex items-center justify-center gap-2 font-black"
              >
                <RotateCcw size={14} />
                Hop On Carousel Again! 🔄🎪✨
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
