import React, { useState } from 'react';
import { Copy, Check, Terminal, HelpCircle } from 'lucide-react';
import { SessionConfig } from '../types';
import { explainCommand } from '../services/geminiService';

interface Props {
  commandTemplate: string;
  instruction?: string;
  config: SessionConfig;
  highlightedVars: string[];
  onExplain?: (explanation: string) => void;
}

const CommandBlock: React.FC<Props> = ({ commandTemplate, instruction, config, highlightedVars }) => {
  const [copied, setCopied] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  // Perform substitution
  const processedCommand = commandTemplate
    .replace(/{{IP}}/g, config.ipAddress)
    .replace(/{{HOSTNAME}}/g, config.hostname)
    .replace(/{{USERNAME}}/g, config.username)
    .replace(/{{DOMAIN}}/g, config.domain);

  const handleCopy = () => {
    navigator.clipboard.writeText(processedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplain = async () => {
    if (explanation) {
        setExplanation(null); // Toggle off
        return;
    }
    setExplaining(true);
    const result = await explainCommand(processedCommand);
    setExplanation(result);
    setExplaining(false);
  };

  // Render parts to highlight dynamic variables visually (optional polish)
  const renderCode = () => {
    return (
        <code className="block font-mono text-sm leading-relaxed text-slate-300 break-words whitespace-pre-wrap">
            {processedCommand}
        </code>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden my-4 shadow-sm group">
      {instruction && (
        <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 text-xs text-slate-400 font-medium flex items-center gap-2">
            <Terminal className="w-3 h-3 text-cyan-500" />
            {instruction}
        </div>
      )}
      <div className="p-4 relative">
        <div className="pr-12">
            {renderCode()}
        </div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-all"
            title="Salin perintah"
            >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>

             <button
            onClick={handleExplain}
            className={`p-2 rounded-md transition-all ${explanation ? 'text-amber-400 bg-slate-800' : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'}`}
            title="Tanya AI untuk menjelaskan perintah ini"
            disabled={explaining}
            >
             <HelpCircle className={`w-4 h-4 ${explaining ? 'animate-pulse' : ''}`} />
            </button>
        </div>
      </div>
      
      {explanation && (
          <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-800 text-sm text-slate-400 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="font-semibold text-amber-500 mb-1 flex items-center gap-2">
                  Penjelasan Gemini
              </p>
              <div className="prose prose-invert prose-sm max-w-none">
                  {explanation}
              </div>
          </div>
      )}
    </div>
  );
};

export default CommandBlock;