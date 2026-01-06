import React, { useState, useEffect } from 'react';
import { Ticket, Status, Priority, COMPANIES, TEKNISI } from '../types';
import { X, Upload, Save } from 'lucide-react';

interface Props {
  initialData?: Ticket | null;
  onClose: () => void;
  onSave: (ticket: Ticket) => void;
}

const TicketForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Ticket>>({
    date: new Date().toISOString().split('T')[0],
    status: Status.PENDING,
    priority: Priority.NORMAL,
    type: 'HW',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Create a fake URL for demo purposes since we don't have a backend to store the file
        // In a real app, this would be an API upload
        const fakeUrl = URL.createObjectURL(file);
        setFormData({ ...formData, photoUrl: fakeUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation Logic as per Supervisor Persona
    if (!formData.company || !formData.pic || !formData.issue || !formData.date) {
      setError("Mohon maaf rekan, data Tanggal, Perusahaan, PIC, dan Kendala wajib diisi agar laporan rapi.");
      return;
    }
    
    if (!formData.photoUrl && !initialData) {
        // Soft warning for new tickets
        if(!confirm("Anda belum menyertakan Bukti Foto. Apakah Anda yakin ingin menyimpan tanpa foto? (Disarankan pakai foto agar tidak ditegur admin)")) {
            return;
        }
    }

    const newTicket: Ticket = {
      id: initialData?.id || Date.now().toString(),
      date: formData.date!,
      company: formData.company!,
      pic: formData.pic!,
      issue: formData.issue!,
      type: formData.type as 'HW' | 'SW' || 'HW',
      status: formData.status as Status || Status.PENDING,
      priority: formData.priority as Priority || Priority.NORMAL,
      photoUrl: formData.photoUrl,
    };

    onSave(newTicket);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {initialData ? 'Update Tiket' : 'Tiket Baru'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
                <div className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-lg text-sm mb-4 border border-red-200 dark:border-red-800">
                    ⚠️ {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
                    <input 
                        type="date" 
                        required
                        className="w-full border dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioritas</label>
                    <select 
                        className="w-full border dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                        value={formData.priority}
                        onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                    >
                        <option value={Priority.NORMAL}>Normal</option>
                        <option value={Priority.HIGH}>🔥 High Priority</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Perusahaan</label>
                <select 
                    required
                    className="w-full border dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                    value={formData.company || ''}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                >
                    <option value="">-- Pilih Perusahaan --</option>
                    {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PIC (Teknisi)</label>
                <select 
                    required
                    className="w-full border dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                    value={formData.pic || ''}
                    onChange={e => setFormData({...formData, pic: e.target.value})}
                >
                    <option value="">-- Pilih Teknisi --</option>
                    {TEKNISI.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kendala (Issue)</label>
                <textarea 
                    required
                    rows={3}
                    className="w-full border dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="Deskripsi singkat kendala HW/SW..."
                    value={formData.issue || ''}
                    onChange={e => setFormData({...formData, issue: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe</label>
                    <select 
                        className="w-full border dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as 'HW'|'SW'})}
                    >
                        <option value="HW">Hardware</option>
                        <option value="SW">Software</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select 
                        className="w-full border dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as Status})}
                    >
                        <option value={Status.PENDING}>🔴 Belum Dikerjakan</option>
                        <option value={Status.PROCESS}>🟡 Sedang Proses</option>
                        <option value={Status.DONE}>🟢 Selesai</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bukti Foto</label>
                <div className="flex items-center space-x-2">
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer w-full transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.photoUrl ? 'Ganti Foto' : 'Upload Foto'}
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                    {formData.photoUrl && (
                        <div className="h-10 w-10 rounded overflow-hidden border dark:border-gray-600">
                            <img src={formData.photoUrl} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t dark:border-gray-700 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center shadow-lg">
                    <Save className="w-4 h-4 mr-2" /> Simpan Laporan
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;