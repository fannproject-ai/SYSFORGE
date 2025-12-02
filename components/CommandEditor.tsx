import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Terminal, Play, Save } from 'lucide-react';
import { SessionConfig } from '../types';

interface Props {
  config: SessionConfig;
}

const CommandEditor: React.FC<Props> = ({ config }) => {
  const [code, setCode] = useState<string>('# Tulis skrip kustom Anda di sini\n# Klik variabel di bawah untuk menyisipkannya\n\nsudo apt update\nsudo apt install -y nginx\n\necho "Menyiapkan {{DOMAIN}} di {{IP}}..."');
  const [copied, setCopied] = useState(false);

  const insertVariable = (variable: string) => {
    setCode(prev => prev + variable);
  };

  const processedCode = code
    .replace(/{{IP}}/g, config.ipAddress)
    .replace(/{{HOSTNAME}}/g, config.hostname)
    .replace(/{{USERNAME}}/g, config.username)
    .replace(/{{DOMAIN}}/g, config.domain)
    .replace(/{{PORT}}/g, config.port.toString());

  const handleCopy = () => {
    navigator.clipboard.writeText(processedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Terminal className="w-8 h-8 text-cyan-400" />
          Editor Perintah
        </h2>
        <p className="text-slate-400 mt-2">Tulis skrip kustom dengan penyorotan sintaks. Gunakan placeholder di bawah ini agar skrip Anda dapat digunakan kembali.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 border border-slate-700 border-b-0 rounded-t-xl p-3 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-slate-500 uppercase mr-2">Sisipkan Variabel:</span>
        <button onClick={() => insertVariable(' {{IP}} ')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-xs font-mono transition-colors">{'{{IP}}'}</button>
        <button onClick={() => insertVariable(' {{DOMAIN}} ')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-xs font-mono transition-colors">{'{{DOMAIN}}'}</button>
        <button onClick={() => insertVariable(' {{USERNAME}} ')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-xs font-mono transition-colors">{'{{USERNAME}}'}</button>
        <button onClick={() => insertVariable(' {{HOSTNAME}} ')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-xs font-mono transition-colors">{'{{HOSTNAME}}'}</button>
        <button onClick={() => insertVariable(' {{PORT}} ')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-xs font-mono transition-colors">{'{{PORT}}'}</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 border border-slate-700 rounded-b-xl overflow-hidden bg-slate-950">
        {/* Input Area */}
        <div className="flex-1 border-r border-slate-700 flex flex-col relative group">
           <div className="absolute top-0 right-0 p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
             <span className="text-xs text-slate-500 font-mono">Editor</span>
           </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-slate-950 p-4 text-sm font-mono text-slate-300 resize-none focus:outline-none focus:bg-slate-900/50 transition-colors"
            spellCheck={false}
            placeholder="Ketik perintah Anda di sini..."
          />
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-slate-900 flex flex-col relative group">
           <div className="absolute top-2 right-2 z-10 flex gap-2">
             <button
                onClick={handleCopy}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all shadow-lg"
                title="Salin Skrip Terkompilasi"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
           </div>
           
           <div className="absolute top-0 left-0 p-2 z-10 pointer-events-none">
             <span className="text-xs text-slate-500 font-mono">Pratinjau Langsung (Terkompilasi)</span>
           </div>

          <div className="flex-1 p-4 overflow-auto custom-scrollbar">
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown 
                components={{
                    pre: ({node, ...props}: any) => <pre className="not-prose" {...props} />,
                    code: ({node, ...props}: any) => <code className="block font-mono text-sm leading-relaxed text-cyan-50" {...props} />
                }}
              >
                {`\`\`\`bash\n${processedCode}\n\`\`\``}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandEditor;