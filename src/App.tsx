import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { WishConfig, DEFAULT_CONFIG, THEMES } from './types';
import FireflyEmbers from './components/FireflyEmbers';
import AudioPlayer from './components/AudioPlayer';
import InteractiveShow from './components/InteractiveShow';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [config] = useState<WishConfig>(DEFAULT_CONFIG);

  const currentTheme = THEMES.find((t) => t.id === config.themeId) || THEMES[0];

  return (
    <div className={`relative min-h-screen text-neutral-100 flex flex-col font-sans transition-colors duration-500 overflow-x-hidden ${currentTheme.background}`}>
      
      {/* Background drifting firefly particles */}
      <FireflyEmbers color={currentTheme.fireflyColor} count={32} />

      {/* Embedded Audio Synth Player in top corner */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <AudioPlayer
          trackId={config.musicTrackId}
          isPlaying={isPlaying}
          onTogglePlay={setIsPlaying}
        />
      </div>

      {/* Primary Full screen Interactive Presentation */}
      <div className="flex-1 w-full h-full relative z-20">
        <InteractiveShow
          config={config}
          theme={currentTheme}
          onRestart={() => setIsPlaying(false)}
          onStartMusic={() => setIsPlaying(true)}
        />
      </div>

    </div>
  );
}
