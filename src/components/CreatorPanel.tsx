import { useState } from 'react';
import { Sparkles, Heart, Plus, Trash2, Copy, Check, Eye, HelpCircle, Palette, Music, Image as ImageIcon, MessageSquare, Info } from 'lucide-react';
import { WishConfig, THEMES, DEFAULT_CONFIG, Memory } from '../types';
import { STICKER_TEMPLATES } from './Stickers';
import { SOUNDS } from './AudioPlayer';

interface CreatorPanelProps {
  config: WishConfig;
  onChangeConfig: (newConfig: WishConfig) => void;
  onPreviewShow: () => void;
}

export default function CreatorPanel({ config, onChangeConfig, onPreviewShow }: CreatorPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'letter' | 'memories' | 'theme'>('details');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Update helper
  const updateField = (key: keyof WishConfig, value: any) => {
    onChangeConfig({
      ...config,
      [key]: value,
    });
  };

  // Update a single polaroid
  const updateMemory = (id: string, index: number, field: keyof Memory, value: any) => {
    const updatedMemories = [...config.memories];
    updatedMemories[index] = {
      ...updatedMemories[index],
      [field]: value
    };
    updateField('memories', updatedMemories);
  };

  // Add a new memory polaroid card
  const addMemory = () => {
    if (config.memories.length >= 8) {
      alert('Maximum of 8 memories is allowed to keep performance fluid! 💖');
      return;
    }
    const newMemory: Memory = {
      id: `m_${Date.now()}`,
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
      caption: 'Click here to write another sweet memory caption... 🌸'
    };
    updateField('memories', [...config.memories, newMemory]);
  };

  // Delete a memory polaroid
  const removeMemory = (index: number) => {
    if (config.memories.length <= 1) {
      alert('You need at least 1 memory card to display in your slider! 🥰');
      return;
    }
    const filtered = config.memories.filter((_, i) => i !== index);
    updateField('memories', filtered);
  };

  // Generate self-contained payload URL
  const generateShareLink = () => {
    try {
      const stateString = JSON.stringify(config);
      // Compact base64 representation
      const compressedState = btoa(encodeURIComponent(stateString));
      const finalLink = `${window.location.origin}${window.location.pathname}?v=${compressedState}`;
      setShareUrl(finalLink);
      navigator.clipboard.writeText(finalLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Failed to serialize URL state', e);
      alert('Something went wrong. Please check your data! 😿');
    }
  };

  return (
    <div className="flex flex-col bg-neutral-900/90 border border-neutral-800 backdrop-blur rounded-3xl h-full w-full shadow-2xl p-6 overflow-hidden">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-yellow-400 text-neutral-900 rounded-xl">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-lg font-extrabold font-sans text-white uppercase tracking-tight">Vibe Wish Architect</h2>
            <span className="text-[10px] font-mono text-neutral-400">Design your perfect Gen-Z card in real-time</span>
          </div>
        </div>
        <button
          id="preview_show_top_button"
          onClick={onPreviewShow}
          className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 rounded-full font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
        >
          <Eye size={12} />
          Play View
        </button>
      </div>

      {/* Control Category Tabs */}
      <div className="flex gap-1 bg-neutral-950 p-1.5 rounded-2xl mb-4 overflow-x-auto text-xs font-semibold scrollbar-none">
        <button
          id="tab_details"
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all shrink-0 ${activeTab === 'details' ? 'bg-neutral-800 text-yellow-400' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          <Heart size={13} fill={activeTab === 'details' ? 'currentColor' : 'transparent'} />
          1. Recipient
        </button>
        <button
          id="tab_letter"
          onClick={() => setActiveTab('letter')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all shrink-0 ${activeTab === 'letter' ? 'bg-neutral-800 text-yellow-400' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          <MessageSquare size={13} />
          2. Letter
        </button>
        <button
          id="tab_memories"
          onClick={() => setActiveTab('memories')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all shrink-0 ${activeTab === 'memories' ? 'bg-neutral-800 text-yellow-400' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          <ImageIcon size={13} />
          3. Photos
        </button>
        <button
          id="tab_theme"
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all shrink-0 ${activeTab === 'theme' ? 'bg-neutral-800 text-yellow-400' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          <Palette size={13} />
          4. Styles
        </button>
      </div>

      {/* Central Editor fields container */}
      <div className="flex-1 overflow-y-auto pr-1 text-left scrollbar-thin text-xs space-y-4">
        
        {/* TAB 1: DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-4 animate-fade-in">
            {/* Name */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase font-sans">Recipient's Cute Name</label>
              <input
                id="recipient_name_input"
                type="text"
                value={config.recipientName}
                onChange={(e) => updateField('recipientName', e.target.value)}
                placeholder="e.g. Cutiepie, Silly Bear"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400/50 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-yellow-400/20 text-xs"
              />
            </div>

            {/* Birthday Date / Meet date */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase">Reference Date</label>
              <input
                id="ref_date_input"
                type="date"
                value={config.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400/50 rounded-xl px-4 py-2.5 text-neutral-200 outline-none focus:ring-1 focus:ring-yellow-400/20 text-xs text-left"
              />
              <span className="text-[10px] text-neutral-500 font-mono mt-1 block">Used to calculate elapsed lifetime or countdown</span>
            </div>

            {/* Counter Type */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase">Counter Calculator Metric</label>
              <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-1 rounded-xl">
                {(['age', 'together', 'countdown'] as const).map((type) => (
                  <button
                    id={`counter_type_${type}`}
                    key={type}
                    onClick={() => updateField('counterType', type)}
                    className={`py-2 px-1 text-[10px] rounded-lg font-bold capitalize cursor-pointer transition-all ${config.counterType === type ? 'bg-neutral-800 text-yellow-400 shadow' : 'text-neutral-400'}`}
                  >
                    {type === 'age' ? 'Life Age' : type === 'together' ? 'Together' : 'Countdown'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom counter helper text */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase">Counter Subtitle / Legend</label>
              <input
                id="counter_label_input"
                type="text"
                value={config.counterLabel}
                onChange={(e) => updateField('counterLabel', e.target.value)}
                placeholder="e.g. Years of being insanely beautiful"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400/50 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-yellow-400/20 text-xs"
              />
            </div>

            {/* Stickers selection */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase">Main Animated Mascot</label>
              <div className="grid grid-cols-2 gap-2">
                {STICKER_TEMPLATES.map((stk) => (
                  <button
                    id={`sticker_select_${stk.id}`}
                    key={stk.id}
                    onClick={() => updateField('stickerId', stk.id)}
                    className={`py-2 px-3 bg-neutral-950 border rounded-xl text-left font-sans text-[11px] cursor-pointer transition-all ${config.stickerId === stk.id ? 'border-yellow-400 text-yellow-400 shadow-lg' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                  >
                    {stk.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LETTER CONTENT */}
        {activeTab === 'letter' && (
          <div className="space-y-4 animate-fade-in">
            {/* Letter Title */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase">Envelope Card Title</label>
              <input
                id="letter_title_input"
                type="text"
                value={config.letterTitle}
                onChange={(e) => updateField('letterTitle', e.target.value)}
                placeholder="e.g. Happy Birthday!"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400/50 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-yellow-400/20 text-xs font-sans font-bold"
              />
            </div>

            {/* Letter Subtitle */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase">Letter Subtitle / Note</label>
              <input
                id="letter_subtitle_input"
                type="text"
                value={config.letterSubtitle}
                onChange={(e) => updateField('letterSubtitle', e.target.value)}
                placeholder="e.g. Just for you sweet pie"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400/50 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-yellow-400/20 text-xs"
              />
            </div>

            {/* Letter Paragraph Message */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase">Written Birthday Letter Message (supports linebreaks)</label>
              <textarea
                id="letter_message_input"
                value={config.letterMessage}
                onChange={(e) => updateField('letterMessage', e.target.value)}
                rows={9}
                placeholder="Write your beautiful text, heartfelt wishes, inside joke quotes, or slang letters here..."
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:ring-1 focus:ring-yellow-400/20 text-xs font-sans leading-relaxed resize-none"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Polaroid PHOTO CARDS */}
        {activeTab === 'memories' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">Photos Stack List</span>
              <button
                id="add_photo_button"
                onClick={addMemory}
                className="px-2.5 py-1 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-500 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus size={11} />
                Add Polaroid
              </button>
            </div>

            {/* Loop through list of memory cards */}
            <div className="space-y-3">
              {config.memories.map((mem, idx) => (
                <div key={mem.id} className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-2xl relative flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                    <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Memory #{idx + 1}</span>
                    <button
                      id={`delete_memory_${idx}`}
                      onClick={() => removeMemory(idx)}
                      className="p-1 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded cursor-pointer transition-colors"
                      title="Remove Polaroid Card"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Image URL input */}
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Image JPG/PNG Address</label>
                    <input
                      id={`memory_url_${idx}`}
                      type="text"
                      value={mem.imageUrl}
                      onChange={(e) => updateMemory(mem.id, idx, 'imageUrl', e.target.value)}
                      placeholder="e.g. paste image URL"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-yellow-400/30 rounded-lg px-2.5 py-1.5 text-neutral-300 outline-none text-[10px] text-left"
                    />
                  </div>

                  {/* Caption input */}
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Handwritten Caption</label>
                    <input
                      id={`memory_caption_${idx}`}
                      type="text"
                      value={mem.caption}
                      onChange={(e) => updateMemory(mem.id, idx, 'caption', e.target.value)}
                      placeholder="Caption detail..."
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-yellow-400/30 rounded-lg px-2.5 py-1.5 text-white outline-none text-[10px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VISUAL STYLE THEMES & MUSIC */}
        {activeTab === 'theme' && (
          <div className="space-y-4 animate-fade-in">
            {/* Dynamic visual themes */}
            <div>
              <label className="block text-neutral-300 font-bold mb-2 uppercase">Vibe Color Template</label>
              <div className="grid grid-cols-2 gap-2.5">
                {THEMES.map((th) => (
                  <button
                    id={`theme_select_${th.id}`}
                    key={th.id}
                    onClick={() => updateField('themeId', th.id)}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 cursor-pointer text-center border-2 transition-all ${config.themeId === th.id ? 'border-yellow-400 bg-neutral-800 shadow-lg' : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'}`}
                  >
                    {/* Circle Color Swatch representation */}
                    <div className="flex gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${th.id === 'gold-charcoal' ? 'bg-yellow-400' : th.id === 'cyber-neon' ? 'bg-cyan-400' : th.id === 'sweet-strawberry' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                      <span className="w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-700" />
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-300">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive synthesized background lofi soundtracks */}
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase">Interactive Background soundscapes</label>
              <div className="grid grid-cols-2 gap-2">
                {SOUNDS.map((snd) => (
                  <button
                    id={`sound_select_${snd.id}`}
                    key={snd.id}
                    onClick={() => updateField('musicTrackId', snd.id)}
                    className={`py-2 px-3 border rounded-xl text-left cursor-pointer transition-all ${config.musicTrackId === snd.id ? 'border-yellow-400 text-yellow-400 bg-neutral-800/10' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                  >
                    <span className="text-[11px] font-bold block">{snd.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-neutral-500 font-mono mt-1 leading-relaxed">Runs beautiful music loops synthesized directly in your browser's audio chips.</p>
            </div>
          </div>
        )}

      </div>

      {/* Share / Deploy Link block */}
      <div className="border-t border-neutral-800 pt-4 mt-4 space-y-3">
        <button
          id="generate_share_link_button"
          onClick={generateShareLink}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:brightness-110 text-neutral-950 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied to Clipboard! 💖' : 'Copy Shareable Link 🔗'}
        </button>

        {shareUrl && (
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl relative select-text">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[9px] font-mono text-neutral-500 uppercase font-semibold">Self-Contained Payload URL</span>
              <button
                id="copy_share_url_anchor_button"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 3000);
                }}
                className="text-[9px] font-mono text-yellow-500 hover:underline cursor-pointer"
              >
                Copy Link
              </button>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono truncate cursor-pointer mt-1 select-all break-all text-left">
              {shareUrl}
            </div>
          </div>
        )}

        <div className="flex gap-2 p-3 bg-neutral-950/60 border border-neutral-800/50 rounded-xl text-[10px] text-neutral-400 text-left items-start">
          <Info size={12} className="text-yellow-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">
            Paste this shareable link into any chat box. Your custom name, stickers, sweet birthday message, and slides are encoded entirely inside the URL, so your partner will read it perfectly without any database lag! ♾️
          </p>
        </div>
      </div>

    </div>
  );
}
