import React from 'react';
import { X } from 'lucide-react';
import {
  type RedPillTrigger,
  type RedPillCategoryKey,
  FRESHNESS_META,
} from './redPillMicroTriggers';

export interface RedPillTriggerInfoModalProps {
  trigger: RedPillTrigger | null;
  onClose: () => void;
  isActive: boolean;
  onToggle: (id: string) => void;
  getCategoryIcon: (cat: RedPillCategoryKey) => React.ReactNode;
}

export const RedPillTriggerInfoModal: React.FC<RedPillTriggerInfoModalProps> = ({
  trigger,
  onClose,
  isActive,
  onToggle,
  getCategoryIcon,
}) => {
  if (!trigger) return null;

  const fMeta = FRESHNESS_META[trigger.freshness];

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-3.5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          aria-label="Close trigger detail modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pr-8">
          <span className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            {getCategoryIcon(trigger.category)}
          </span>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                #{trigger.id.toUpperCase()} &middot; {trigger.subCluster}
              </span>
              <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${fMeta.badgeClass}`}>
                {fMeta.label} ({fMeta.multiplierLabel})
              </span>
            </div>
            <h3 className="text-sm font-black text-white mt-0.5">{trigger.title}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 italic leading-relaxed">
          "{trigger.hook}"
        </p>

        {trigger.reframeAngle && (
          <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-3 text-xs space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              {trigger.freshness === 'reframed'
                ? 'How to Pivot Without Fatigue:'
                : 'Saturation Warning:'}
            </span>
            <p className="text-slate-300 leading-relaxed">{trigger.reframeAngle}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-850">
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">Target Audience</span>
            <strong className="text-amber-300">{trigger.targetGroup}</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">Delivery Channel</span>
            <strong className="text-emerald-300">{trigger.deliveryChannel}</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">Effective Vote Shift</span>
            <strong className="text-rose-400">
              +{trigger.impactPct.toFixed(2)}%
              {trigger.freshness !== 'fresh' && (
                <span className="text-[10px] text-slate-500 font-normal ml-1">
                  (base +{trigger.baseImpactPct.toFixed(2)}%)
                </span>
              )}
            </strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">Voters Shifted</span>
            <strong className="text-white">
              ~{trigger.votersAffectedStatewide.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => {
              onToggle(trigger.id);
              onClose();
            }}
            className={`px-4 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
              isActive
                ? 'bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700'
                : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700'
            }`}
          >
            {isActive ? 'Mute Trigger' : 'Activate Trigger'}
          </button>
        </div>
      </div>
    </div>
  );
};
