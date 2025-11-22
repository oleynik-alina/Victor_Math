import React from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { UploadedImage } from '../types';

interface UploadSectionProps {
  label: string;
  image: UploadedImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ label, image, onUpload, onRemove }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700 ml-1">{label}</span>
      
      {image ? (
        <div className="relative group aspect-[4/3] w-full rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
          <img
            src={image.previewUrl}
            alt={label}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onRemove}
              className="p-2 bg-white/20 hover:bg-red-500/80 backdrop-blur-md text-white rounded-full transition-all transform hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white truncate max-w-[90%]">
            {image.file.name}
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors text-slate-400">
               <FileImage size={24} />
            </div>
            <p className="mb-1 text-sm text-slate-500 font-medium">Нажмите для загрузки</p>
            <p className="text-xs text-slate-400">JPG, PNG (макс. 5MB)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

export default UploadSection;