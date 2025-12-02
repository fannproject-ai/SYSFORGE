import React, { useState, useEffect } from 'react';
import { SessionConfig } from '../types';
import { X, Save, Server, Plus, Trash2, Power, Edit2 } from 'lucide-react';
import { DEFAULT_CONFIG } from '../constants';

interface Props {
  currentConfig: SessionConfig;
  savedConnections: SessionConfig[];
  onSave: (connections: SessionConfig[]) => void;
  onSelect: (config: SessionConfig) => void;
  onClose: () => void;
}

const ConnectionManager: React.FC<Props> = ({ currentConfig, savedConnections, onSave, onSelect, onClose }) => {
  const [connections, setConnections] = useState<SessionConfig[]>(savedConnections);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<SessionConfig>(currentConfig);

  useEffect(() => {
    if (editingId) {
        const target = connections.find(c => c.id === editingId);
        if (target) setFormData(target);
    }
  }, [editingId, connections]);

  const handleCreateNew = () => {
    const newConfig: SessionConfig = {
        ...DEFAULT_CONFIG,
        id: crypto.randomUUID(),
        name: 'Koneksi Baru'
    };
    setConnections([...connections, newConfig]);
    setEditingId(newConfig.id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connections.length <= 1) return; // Prevent deleting last one
    const filtered = connections.filter(c => c.id !== id);
    setConnections(filtered);
    if (editingId === id) setEditingId(null);
    onSave(filtered);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = connections.map(c => c.id === formData.id ? formData : c);
    setConnections(updated);
    onSave(updated);
    
    // Auto select if we just edited the active one
    if (formData.id === currentConfig.id) {
        onSelect(formData);
    }
    setEditingId(null);
  };

  const handleSelectConnection = (config: SessionConfig) => {
    onSelect(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Sidebar: Connection List */}
        <div className="w-1/3 bg-slate-950 border-r border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-200">Daftar Koneksi</h3>
                <button onClick={handleCreateNew} className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {connections.map(conn => (
                    <div 
                        key={conn.id}
                        onClick={() => setEditingId(conn.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all group relative ${
                            editingId === conn.id 
                            ? 'bg-slate-800 border-cyan-500/50' 
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={`font-semibold text-sm ${editingId === conn.id ? 'text-cyan-400' : 'text-slate-300'}`}>{conn.name}</span>
                            {currentConfig.id === conn.id && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>}
                        </div>
                        <div className="text-xs text-slate-500 font-mono truncate">{conn.username}@{conn.ipAddress}</div>
                        
                        <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectConnection(conn);
                                }}
                                className="p-1.5 bg-green-900/50 text-green-400 rounded hover:bg-green-900 hover:text-green-300"
                                title="Sambungkan"
                            >
                                <Power className="w-3 h-3" />
                            </button>
                            <button 
                                onClick={(e) => handleDelete(conn.id, e)}
                                className="p-1.5 bg-red-900/50 text-red-400 rounded hover:bg-red-900 hover:text-red-300"
                                title="Hapus"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Content: Edit Form */}
        <div className="flex-1 flex flex-col bg-slate-900">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                        <Server className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Detail Koneksi</h2>
                        <p className="text-xs text-slate-400">Edit parameter untuk {formData.name}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {editingId ? (
                <form onSubmit={handleSaveForm} className="p-6 space-y-5 overflow-y-auto flex-1">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Nama Profil</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Sistem Operasi</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['debian', 'ubuntu', 'centos'].map(os => (
                                <button
                                    key={os}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, os: os as any })}
                                    className={`py-2 px-4 rounded-lg border text-sm font-medium capitalize transition-all ${
                                        formData.os === os 
                                        ? 'bg-cyan-600 border-cyan-500 text-white' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                                    }`}
                                >
                                    {os}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-8 space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Alamat IP</label>
                            <input 
                                type="text" 
                                value={formData.ipAddress}
                                onChange={e => setFormData({...formData, ipAddress: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none font-mono"
                            />
                        </div>
                         <div className="col-span-4 space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Port</label>
                            <input 
                                type="number" 
                                value={formData.port}
                                onChange={e => setFormData({...formData, port: parseInt(e.target.value) || 22})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Hostname</label>
                        <input 
                            type="text" 
                            value={formData.hostname}
                            onChange={e => setFormData({...formData, hostname: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none font-mono"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Username</label>
                            <input 
                                type="text" 
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Nama Domain</label>
                            <input 
                                type="text" 
                                value={formData.domain}
                                onChange={e => setFormData({...formData, domain: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                         <button type="button" onClick={() => handleSelectConnection(formData)} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                            <Power className="w-5 h-5" />
                            Gunakan
                        </button>
                        <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                            <Save className="w-5 h-5" />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Edit2 className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-lg font-medium">Pilih koneksi untuk diedit atau buat baru.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionManager;