"use client";

import React, { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { Upload, Link2, X, Check, Loader2, Image as ImageIcon, Video, AlertCircle } from "lucide-react";
import { uploadMediaAction, uploadPublicReviewPhotoAction } from "@/app/actions/upload";

export interface ImageUploaderProps {
  name: string;
  defaultValue?: string | null;
  label?: string;
  description?: string;
  bucket?: "package-media" | "gallery" | "avatars";
  allowVideo?: boolean;
  aspectRatio?: "video" | "square" | "portrait" | "wide" | "auto";
  placeholder?: string;
  isPublic?: boolean;
  onChange?: (url: string) => void;
  className?: string;
}

export default function ImageUploader({
  name,
  defaultValue = "",
  label,
  description,
  bucket = "package-media",
  allowVideo = false,
  aspectRatio = "video",
  placeholder = "https://images.unsplash.com/photo-...",
  isPublic = false,
  onChange,
  className = "",
}: ImageUploaderProps) {
  const [value, setValue] = useState<string>(defaultValue || "");
  const [mode, setMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState<string>(defaultValue || "");
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = allowVideo && /\.(mp4|webm|mov)(\?.*)?$/i.test(value);

  const handleUpdate = (newUrl: string) => {
    setValue(newUrl);
    setUrlInput(newUrl);
    setImgError(false);
    setUploadError(null);
    if (onChange) {
      onChange(newUrl);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    startTransition(async () => {
      const result = isPublic
        ? await uploadPublicReviewPhotoAction(formData)
        : await uploadMediaAction(formData);
      if (result.success && result.url) {
        handleUpdate(result.url);
      } else {
        setUploadError(result.error || "Failed to upload file.");
      }
    });
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      handleUpdate(urlInput.trim());
    }
  };

  const handleClear = () => {
    handleUpdate("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square max-w-[200px]",
    portrait: "aspect-[4/5] max-w-[240px]",
    wide: "aspect-[21/9]",
    auto: "min-h-[160px]",
  }[aspectRatio];

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Hidden input ensuring the selected URL is submitted with parent HTML form */}
      <input type="hidden" name={name} value={value} />

      {/* Header with Label & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          {label && (
            <label className="block text-xs font-bold text-current">
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] opacity-70 mt-0.5">{description}</p>
          )}
        </div>

        {/* Tab switch between file upload and URL paste */}
        <div className="inline-flex rounded-xl p-0.5 bg-[#F1F5F9] border border-[#E5E7EB] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "file"
                ? "bg-white text-[#111827] shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Upload size={12} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "url"
                ? "bg-white text-[#111827] shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Link2 size={12} /> Image URL
          </button>
        </div>
      </div>

      {/* Upload or URL input area */}
      {mode === "file" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-[#059669] bg-[#ECFDF5] scale-[0.99]"
              : "border-[#E5E7EB] hover:border-[#059669] hover:bg-[#F8FAFC]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowVideo ? "image/*,video/*" : "image/*"}
            onChange={onFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center py-2 text-center">
            {isPending ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 size={24} className="animate-spin text-[#059669]" />
                <span className="text-xs font-semibold text-[#047857]">Uploading to Cloud Storage...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center mb-2">
                  <Upload size={18} />
                </div>
                <p className="text-xs font-bold text-[#111827] mb-0.5">
                  Click to upload or drag and drop
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  {allowVideo
                    ? "PNG, JPG, WEBP, AVIF, MP4 or WEBM (Max 15MB)"
                    : "PNG, JPG, WEBP or AVIF (Max 15MB)"}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
            />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyUrl();
                }
              }}
              placeholder={placeholder}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#9CA3AF] text-xs font-medium focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0]"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2.5 rounded-xl bg-[#059669] text-white text-xs font-semibold hover:bg-[#047857] transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
          >
            <Check size={14} /> Apply
          </button>
        </div>
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-3 py-2 rounded-xl">
          <AlertCircle size={14} className="shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Live Preview Box */}
      {value && (
        <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F8FAFC] group">
          <div className={`relative w-full ${aspectClass} overflow-hidden`}>
            {isVideo ? (
              <video
                src={value}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : imgError ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <ImageIcon size={24} className="opacity-40 mb-1" />
                <span className="text-xs font-semibold opacity-80">Unable to load image preview</span>
                <span className="text-[10px] opacity-50 break-all max-w-xs">{value}</span>
              </div>
            ) : (
              <Image
                src={value}
                alt={label || "Uploaded media preview"}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
                onError={() => setImgError(true)}
                unoptimized
              />
            )}
          </div>

          {/* Media Info & Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              {isVideo ? <Video size={14} className="shrink-0" /> : <ImageIcon size={14} className="shrink-0" />}
              <span className="truncate text-[11px] font-mono opacity-90">{value}</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition-colors shrink-0"
              title="Remove media"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
