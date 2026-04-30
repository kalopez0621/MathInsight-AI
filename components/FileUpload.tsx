
import React, { useState } from 'react';
import { Upload, FileType, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large (max 5MB)");
        return;
      }
      onFileSelect(file);
      setError(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="bg-indigo-50 p-4 rounded-full mb-4">
            <Upload className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Assessment Data</h2>
          <p className="text-slate-500 mb-6 max-w-sm">
            Upload your student FAST PM1/PM2 scores (CSV or XLSX) to begin deep analysis.
          </p>
          
          <label className={`
            inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all cursor-pointer
            ${isLoading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200'}
          `}>
            {isLoading ? 'Processing...' : 'Browse Files'}
            <input 
              type="file" 
              className="hidden" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileChange} 
              disabled={isLoading}
            />
          </label>

          <div className="mt-6 flex gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1"><FileType className="w-3 h-3" /> CSV</span>
            <span className="flex items-center gap-1"><FileType className="w-3 h-3" /> Excel (.xlsx)</span>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureItem 
          title="Subgroup Focus" 
          desc="Analyze ELL, ESE, and L25/35 groups with precision." 
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} 
        />
        <FeatureItem 
          title="Growth Analysis" 
          desc="Identify students who are excelling or regressing." 
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} 
        />
        <FeatureItem 
          title="Data Security" 
          desc="Analysis happens securely with standardized fields." 
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} 
        />
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="bg-white/50 backdrop-blur p-4 rounded-xl border border-slate-100">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="font-bold text-slate-700">{title}</h3>
    </div>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default FileUpload;
