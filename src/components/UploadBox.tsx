import { useCallback, useRef, useState } from 'react';
import { UploadCloud, ImageIcon, X } from 'lucide-react';

interface UploadBoxProps {
  onFileSelected: (file: File) => void;
  previewUrl: string | null;
  fileName: string | null;
  onClear: () => void;
}

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png'];

export default function UploadBox({ onFileSelected, previewUrl, fileName, onClear }: UploadBoxProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): boolean => {
    const ok = ACCEPTED.includes(file.type) || /\.(jpg|jpeg|png)$/i.test(file.name);
    if (!ok) {
      setError('Please upload a JPG, JPEG, or PNG image.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (validate(file)) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div>
      {!previewUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-all duration-200 ${
            dragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/40'
          }`}
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200 ${
              dragging ? 'bg-blue-600 text-white scale-110' : 'bg-white text-blue-600 shadow-sm'
            }`}
          >
            <UploadCloud className="h-8 w-8" strokeWidth={2} />
          </span>
          <p className="mt-5 text-base font-semibold text-slate-800">
            Drag &amp; drop your chest X-ray here
          </p>
          <p className="mt-1.5 text-sm text-slate-500">
            or <span className="font-medium text-blue-600">browse files</span> from your computer
          </p>
          <p className="mt-4 text-xs text-slate-400">Supports JPG, JPEG &amp; PNG · max ~10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ImageIcon className="h-4 w-4 text-blue-600" />
              <span className="font-medium truncate max-w-[220px]">{fileName}</span>
            </div>
            <button
              onClick={onClear}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-center bg-slate-900 p-4">
            <img
              src={previewUrl}
              alt="Uploaded X-ray preview"
              className="max-h-[420px] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
