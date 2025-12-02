import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import CommandBlock from './components/CommandBlock';
import ConnectionManager from './components/ConfigModal';
import AIChat from './components/AIChat';
import CommandEditor from './components/CommandEditor';
import { TOPICS, DEFAULT_CONFIG } from './constants';
import { SessionConfig } from './types';
import { Network, BrainCircuit, Wand2, Terminal } from 'lucide-react';
import { generateComplexConfig } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

function App() {
  const [savedConnections, setSavedConnections] = useState<SessionConfig[]>([DEFAULT_CONFIG]);
  const [config, setConfig] = useState<SessionConfig>(DEFAULT_CONFIG);
  
  // Navigation State
  const [activeView, setActiveView] = useState<'topic' | 'editor'>('topic');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // UI State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string | null>(null);

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return TOPICS;
    const q = searchQuery.toLowerCase();
    return TOPICS.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedTopic = TOPICS.find(t => t.id === selectedTopicId);

  const handleAiDeepThink = async () => {
    if (!selectedTopic) return;
    setAiGenerating(true);
    setAiGeneratedContent(null);
    
    const context = `
      Topic: ${selectedTopic.title}
      Description: ${selectedTopic.description}
      OS: ${config.os}
      IP: ${config.ipAddress}
      Domain: ${config.domain}
    `;
    
    const prompt = `Buat konfigurasi produksi yang komprehensif, siap pakai, atau skrip shell yang kompleks untuk ${selectedTopic.title}. 
    Sertakan komentar yang menjelaskan logika dalam Bahasa Indonesia. Gunakan IP dan Domain spesifik yang disediakan dalam konteks. 
    Fokus pada praktik terbaik dan keamanan.`;

    const result = await generateComplexConfig(prompt, context);
    setAiGeneratedContent(result);
    setAiGenerating(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar 
        topics={filteredTopics}
        selectedTopicId={selectedTopicId}
        activeView={activeView}
        onSelectTopic={(id) => {
            setSelectedTopicId(id);
            setActiveView('topic');
            setAiGeneratedContent(null);
        }}
        onSelectEditor={() => {
            setActiveView('editor');
            setSelectedTopicId(null);
        }}
        onOpenSettings={() => setShowConfigModal(true)}
        onSearch={setSearchQuery}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar showing context */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 z-20">
          <div className="flex items-center gap-6 text-sm">
             <div className="flex items-center gap-2 text-slate-400">
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">Koneksi Aktif:</span>
             </div>
             <div className="flex gap-4 items-center">
                <span className="font-bold text-white tracking-wide">{config.name}</span>
                <span className="h-4 w-px bg-slate-700"></span>
                <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-cyan-400 font-mono text-xs">{config.username}@{config.ipAddress}</span>
                <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-cyan-400 font-mono text-xs hidden sm:inline-block">{config.domain}</span>
                <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-amber-400 font-bold uppercase text-xs flex items-center">{config.os}</span>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth relative">
          
          {activeView === 'editor' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full">
                 <CommandEditor config={config} />
             </div>
          )}

          {activeView === 'topic' && selectedTopic && (
            <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-slate-800 rounded-lg text-cyan-400">
                        {selectedTopic.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedTopic.title}</h2>
                </div>
                <p className="text-lg text-slate-400 ml-14">{selectedTopic.description}</p>
              </div>

              {/* Standard Steps */}
              <div className="space-y-8">
                {selectedTopic.steps.map((step) => (
                  <div key={step.id}>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-cyan-500 rounded-full inline-block"></span>
                      {step.title}
                    </h3>
                    <p className="text-slate-400 mb-4 text-sm">{step.description}</p>
                    <CommandBlock 
                      commandTemplate={step.commandTemplate}
                      instruction={`Ubah bagian yang disorot jika perlu. Konteks saat ini diterapkan secara otomatis.`}
                      config={config}
                      highlightedVars={step.highlightedVars}
                    />
                  </div>
                ))}
              </div>

              {/* Deep Think Section */}
              <div className="mt-16 pt-8 border-t border-slate-800">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="w-8 h-8 text-amber-400" />
                            <div>
                                <h3 className="text-lg font-bold text-white">Mode Berpikir Gemini</h3>
                                <p className="text-sm text-slate-400">Buat konfigurasi kustom yang kompleks untuk topik ini.</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleAiDeepThink}
                            disabled={aiGenerating}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {aiGenerating ? <Wand2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            {aiGenerating ? 'Sedang Berpikir...' : 'Buat Konfigurasi Lengkap'}
                        </button>
                    </div>

                    {aiGeneratedContent && (
                        <div className="mt-6 bg-slate-950 rounded-xl p-6 border border-slate-800 animate-in fade-in duration-500">
                             <div className="prose prose-invert prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 max-w-none">
                                <ReactMarkdown>{aiGeneratedContent}</ReactMarkdown>
                             </div>
                        </div>
                    )}
                </div>
              </div>

            </div>
          )}
          
          {activeView === 'topic' && !selectedTopic && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Terminal className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-300">Selamat datang di SysAdmin AI Forge</h2>
                <p className="text-slate-500 mt-2 max-w-md">Pilih topik dari sidebar, gunakan pencarian untuk menemukan perintah, atau buka Editor Perintah untuk menulis skrip.</p>
            </div>
          )}
        </div>
      </main>

      {/* Overlays */}
      <AIChat config={config} />
      {showConfigModal && (
        <ConnectionManager 
          currentConfig={config}
          savedConnections={savedConnections}
          onSave={setSavedConnections}
          onSelect={setConfig}
          onClose={() => setShowConfigModal(false)} 
        />
      )}
    </div>
  );
}

export default App;