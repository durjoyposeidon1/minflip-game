import React, { useState } from 'react';
import { UserGameProgress } from '../../types/game';
import { sound } from '../../services/sound';
import {
  Volume2,
  VolumeX,
  Music,
  Vibrate,
  RotateCcw,
  Smartphone,
  Info,
  User,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface SettingsScreenProps {
  progress: UserGameProgress;
  onUpdateSettings: (settings: Partial<UserGameProgress['settings']>) => void;
  onUpdateProfile: (profile: Partial<UserGameProgress['profile']>) => void;
  onResetProgress: () => void;
  onOpenCapacitorGuide: () => void;
}

const AVATARS = ['🦊', '🦉', '🤖', '🧙', '🧠', '🥷', '🕵️', '🐱', '🦁', '🐼'];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  progress,
  onUpdateSettings,
  onUpdateProfile,
  onResetProgress,
  onOpenCapacitorGuide,
}) => {
  const [nameInput, setNameInput] = useState(progress.profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(progress.profile.avatar);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = () => {
    sound.playTap();
    onUpdateProfile({
      name: nameInput.trim() || 'Brain Explorer',
      avatar: selectedAvatar,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  const handleToggleSound = () => {
    const nextVal = !progress.settings.soundEnabled;
    sound.setSoundEnabled(nextVal);
    sound.playTap();
    onUpdateSettings({ soundEnabled: nextVal });
  };

  const handleToggleMusic = () => {
    const nextVal = !progress.settings.musicEnabled;
    sound.setMusicEnabled(nextVal);
    sound.playTap();
    onUpdateSettings({ musicEnabled: nextVal });
  };

  const handleToggleHaptics = () => {
    const nextVal = !progress.settings.hapticsEnabled;
    sound.setHapticsEnabled(nextVal);
    sound.playTap();
    onUpdateSettings({ hapticsEnabled: nextVal });
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 pb-8 space-y-5">
      <div className="text-center my-1">
        <h2 className="font-display font-black text-2xl text-white">Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Customize your MindFlip experience</p>
      </div>

      {/* 1. Player Profile Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3.5 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <User className="w-3.5 h-3.5" />
          <span>Player Profile</span>
        </div>

        {/* Avatar Picker */}
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Choose Avatar</label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
            {AVATARS.map((av) => (
              <button
                key={av}
                onClick={() => {
                  sound.playTap();
                  setSelectedAvatar(av);
                }}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl transition-all shrink-0 ${
                  selectedAvatar === av
                    ? 'bg-indigo-600/30 border-2 border-indigo-400 scale-105 shadow-md'
                    : 'bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Nickname Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={nameInput}
            maxLength={18}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your Nickname"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={handleSaveProfile}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow active:scale-95 transition-all"
          >
            {isSaved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* 2. Audio & Haptics Toggles */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-md">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Game Controls & Audio
        </span>

        {/* Sound Effects */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              {progress.settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Sound Effects</div>
              <div className="text-[11px] text-slate-400">Pops, chimes, and fanfare</div>
            </div>
          </div>
          <button
            onClick={handleToggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              progress.settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                progress.settings.soundEnabled ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Ambient Music */}
        <div className="flex items-center justify-between py-1 border-t border-slate-800/80 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Ambient Music</div>
              <div className="text-[11px] text-slate-400">Cozy synthesized lofi chords</div>
            </div>
          </div>
          <button
            onClick={handleToggleMusic}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              progress.settings.musicEnabled ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                progress.settings.musicEnabled ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Haptics Vibration */}
        <div className="flex items-center justify-between py-1 border-t border-slate-800/80 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Vibrate className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Haptic Vibration</div>
              <div className="text-[11px] text-slate-400">Tactile taps & feedback</div>
            </div>
          </div>
          <button
            onClick={handleToggleHaptics}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              progress.settings.hapticsEnabled ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                progress.settings.hapticsEnabled ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Android APK & Capacitor Integration Guide */}
      <div
        onClick={() => {
          sound.playTap();
          onOpenCapacitorGuide();
        }}
        className="w-full bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl">
            <Smartphone className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Build Android APK / AAB</div>
            <div className="text-[11px] text-slate-400">
              Capacitor setup & Google Play preparation
            </div>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-500/30">
          Guide
        </span>
      </div>

      {/* 4. Danger Zone: Reset Progress */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Progress Management
        </span>

        {showResetConfirm ? (
          <div className="p-3 bg-rose-500/10 border border-rose-500/40 rounded-2xl text-center space-y-2 animate-pop">
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-300 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Are you sure? This erases all stars & levels!</span>
            </div>
            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playWrong();
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              sound.playTap();
              setShowResetConfirm(true);
            }}
            className="w-full py-2.5 px-3 rounded-2xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Game Progress</span>
          </button>
        )}
      </div>

      {/* About MindFlip */}
      <div className="text-center text-xs text-slate-500 pt-2 space-y-1">
        <div className="font-semibold text-slate-400">MindFlip v1.0.0</div>
        <div>“Think Different. Solve Everything.”</div>
        <div className="text-[10px]">100 Original Playable Levels · Offline First</div>
      </div>
    </div>
  );
};
