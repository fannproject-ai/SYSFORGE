import React, { useState } from 'react';
import { Topic } from '../types';
import { Terminal, Settings, ChevronRight, Search, FileCode } from 'lucide-react';

interface Props {
  topics: Topic[];
  selectedTopicId: string | null;
  activeView: 'topic' | 'editor';
  onSelectTopic: (id: string) => void;
  onSelectEditor: () => void;
  onOpenSettings: () => void;
  onSearch: (query: string) => void;
}

const Sidebar: React.FC<Props> = ({ 
  topics, 
  selectedTopicId, 
  activeView,
  onSelectTopic, 
  onSelectEditor,
  onOpenSettings,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    onSearch(q);
  };

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full flex-shrink-0 transition-all">
      <div className="p-6 border-b border-slate-800">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
            <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="font-bold text-lg text-slate-100 tracking-tight">Admin<span className="text-cyan-400">Forge</span></h1>
         </div>
         
         {/* Search Input */}
         <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
                type="text" 
                placeholder="Cari materi..." 
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        
        {/* Tools Section */}
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">
            Alat
        </div>
        <button
            onClick={onSelectEditor}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
              activeView === 'editor'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className={activeView === 'editor' ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}>
              <FileCode className="w-5 h-5" />
            </span>
            <span className="flex-1 text-left font-medium">Editor Perintah</span>
             {activeView === 'editor' && <ChevronRight className="w-4 h-4 opacity-50" />}
        </button>

        {/* Library Section */}
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4">
          Pustaka Materi
        </div>
        
        {topics.length === 0 ? (
            <div className="px-3 text-sm text-slate-600 italic">Materi tidak ditemukan.</div>
        ) : (
            topics.map((topic) => (
            <button
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                activeView === 'topic' && selectedTopicId === topic.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
            >
                <span className={activeView === 'topic' && selectedTopicId === topic.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}>
                {topic.icon}
                </span>
                <span className="flex-1 text-left truncate">{topic.title}</span>
                {activeView === 'topic' && selectedTopicId === topic.id && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
            ))
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950 z-10">
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors border border-transparent hover:border-slate-800"
        >
          <Settings className="w-5 h-5" />
          <span>Kelola Koneksi</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;