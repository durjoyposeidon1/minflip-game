import React from 'react';
import { Smartphone, X, Terminal, Check, Copy } from 'lucide-react';
import { sound } from '../../services/sound';

interface CapacitorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CapacitorGuideModal: React.FC<CapacitorGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-md bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[88vh] overflow-y-auto text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-lg text-white">
              Android APK / AAB Guide
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-4 text-xs leading-relaxed">
          <p className="text-slate-300">
            MindFlip is built with Capacitor-ready mobile architecture: viewport safe-areas, touch interactions, offline storage, Web Audio synth, and Google AdMob preparation hooks.
          </p>

          {/* Step 1 */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">1</span>
              <span>Install Capacitor Dependencies</span>
            </div>
            <pre className="bg-slate-900 p-2.5 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto select-all">
              npm install @capacitor/core @capacitor/cli @capacitor/android
            </pre>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">2</span>
              <span>Build Production Assets</span>
            </div>
            <pre className="bg-slate-900 p-2.5 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto select-all">
              npm run build
            </pre>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
              <span>Add Android Platform & Sync</span>
            </div>
            <pre className="bg-slate-900 p-2.5 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto select-all">
              npx cap add android{'\n'}npx cap sync android
            </pre>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">4</span>
              <span>Generate APK / AAB (Google Play)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Open Android Studio with <code className="text-amber-300">npx cap open android</code> and go to:
            </p>
            <div className="text-[11px] text-indigo-300 bg-slate-900 p-2 rounded-lg font-mono">
              Build ➔ Generate Signed Bundle / APK ➔ Android App Bundle (AAB)
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow mt-2"
        >
          Got It, Back to Game!
        </button>
      </div>
    </div>
  );
};
