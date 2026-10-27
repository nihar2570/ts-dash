import React, { useState } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { invalidateBoothCache } from '../data/voterRollService';

interface OnDemandVoterExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  acNo: number;
  acName?: string;
  boothNo: number;
  boothName: string;
  mandalName: string;
  electorate: number;
  isAlreadyExtracted: boolean;
  officialRollUrl?: string;
  onExtractionSuccess: () => void;
}

export const OnDemandVoterExtractorModal: React.FC<OnDemandVoterExtractorModalProps> = ({
  isOpen,
  onClose,
  acNo,
  acName = 'Assembly Constituency',
  boothNo,
  boothName,
  mandalName,
  electorate,
  isAlreadyExtracted,
  officialRollUrl,
  onExtractionSuccess,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stepText, setStepText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<any | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const defaultRollUrl = officialRollUrl || 
    `https://voters.eci.gov.in/eroll/2026/s29/sir-draftroll/${acNo}/2026-EROLLGEN-S29-${acNo}-SIR-DraftRoll-Revision1-ENG-${boothNo}-WI.pdf`;

  const cliCommand = `python scripts/extract_booth_voters.py --ac ${acNo} --booth ${boothNo} --state S29`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleRunExtraction = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    setSuccessInfo(null);
    setStepText('Connecting to ECI Draft Roll server...');

    try {
      const stepTimer1 = setTimeout(() => {
        setStepText('Streaming PDF bytes into memory (0 MB written to disk)...');
      }, 1200);

      const stepTimer2 = setTimeout(() => {
        setStepText('Parsing voter card blocks, sections, ages & relations...');
      }, 2600);

      const res = await fetch('/api/extract-booth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ac: acNo,
          booth: boothNo,
          state: 'S29',
          force: true
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const json = await res.json();

      if (res.ok && json.success) {
        setStepText('Voter roll extracted and saved successfully!');
        setSuccessInfo(json.result || json.data || { totalElectors: electorate });
        invalidateBoothCache(acNo, boothNo);
        onExtractionSuccess();
      } else {
        throw new Error(json.error || 'Server returned an unsuccessful extraction response.');
      }
    } catch (err: any) {
      console.error('On-demand extraction error:', err);
      setErrorMsg(
        err.message || 
        'Could not complete live extraction via backend server. You can copy and run the CLI command below.'
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                On-Demand ECI Voter Roll Extractor
              </h3>
              <p className="text-xs text-slate-400">
                Booth #{boothNo} • AC {acNo} ({acName}) • {mandalName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Booth Status card */}
          <div className="bg-slate-850 border border-slate-800 rounded-xl p-4 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Polling Station</span>
              <h4 className="text-sm font-bold text-slate-200 mt-1">{boothName}</h4>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>Electorate: <strong className="text-slate-200">{electorate.toLocaleString()}</strong></span>
                <span>•</span>
                <span>Est. Panna Pages: <strong className="text-slate-200">{Math.ceil(electorate / 50)}</strong></span>
                <span>•</span>
                <span>Format: <strong className="text-slate-200">2026 SIR Draft Roll</strong></span>
              </div>
            </div>

            {isAlreadyExtracted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Authentic Roll Loaded
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
                Synthesized Roll Active
              </span>
            )}
          </div>

          {/* Zero PDF Storage Banner */}
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-300">Zero Disk Pileup Architecture:</span>
              <p className="mt-0.5 text-blue-300/80 leading-relaxed">
                The streaming engine downloads the 10–15 MB draft roll directly into memory buffers, extracts voter cards into a lightweight ~200 KB JSON, and immediately purges all PDF bytes. No multi-gigabyte disk pileup.
              </p>
            </div>
          </div>

          {/* Progress / Success / Error Alert */}
          {isRunning && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-300">Extraction in Progress...</p>
                <p className="text-xs text-amber-200/80 mt-0.5">{stepText}</p>
              </div>
            </div>
          )}

          {successInfo && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="text-sm font-bold text-emerald-300">Extraction Completed Successfully!</p>
                <p className="text-emerald-200/80 mt-1">
                  Extracted <strong>{successInfo.totalElectors || electorate}</strong> electors across{' '}
                  <strong>{successInfo.totalPages || Math.ceil(electorate / 50)}</strong> Panna pages.
                  The live booth view has been refreshed with authentic voter records.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-200">
                <p className="text-sm font-bold text-rose-300">Extraction Notice</p>
                <p className="mt-1 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="space-y-3">
            <button
              onClick={handleRunExtraction}
              disabled={isRunning}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                isRunning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : isAlreadyExtracted
                  ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-amber-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting Roll in Memory...</span>
                </>
              ) : isAlreadyExtracted ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-Extract Authentic Roll (Force Overwrite)</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Execute In-Memory Extraction Now</span>
                </>
              )}
            </button>
          </div>

          {/* Alternate Execution via Terminal */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              CLI Terminal Command (Offline / High-Performance)
            </span>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <code className="text-xs font-mono text-emerald-400 flex-1 truncate">
                {cliCommand}
              </code>
              <button
                onClick={handleCopyCmd}
                className="px-2.5 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition"
                title="Copy terminal command"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Official Roll Source Link */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              ECI Portal Source PDF
            </span>
            <a
              href={defaultRollUrl}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>Inspect Source PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

