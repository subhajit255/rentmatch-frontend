import React, { useState, useRef, useEffect } from "react";
import { Required } from "../../ui/miscellenious";
import { DocumentsPayload, DocItem } from "@/src/types/property";
import {
  UploadCloud,
  X,
  FileText,
  Film,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../../lib/utils";

/* ----------------------- PROPS ----------------------- */

type PropertyDocumentProps = {
  documents: DocumentsPayload;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentsPayload>>;
};

/* ----------------------- COMPONENT ----------------------- */

const PropertyDocument: React.FC<PropertyDocumentProps> = ({
  documents,
  setDocuments,
}) => {
  /* ----------------------- ADD FILES ----------------------- */
  const handleAddFiles = (files: File[], type: keyof DocumentsPayload) => {
    if (!files.length) return;

    const newFiles: DocItem[] = files
      .filter((file) => file instanceof File && file.size > 0)
      .map((file) => ({
        data: file,
        name: file.name,
      }));

    if (!newFiles.length) return;

    setDocuments((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), ...newFiles],
    }));
  };

  /* ----------------------- REMOVE FILE ----------------------- */
  const removeFile = (type: keyof DocumentsPayload, index: number) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex flex-col gap-8 pb-4">
      {/* ===================== IMAGES SECTION ===================== */}
      <DocumentSection
        title="Images"
        count={documents.images.length}
        required
        icon={<ImageIcon className="w-5 h-5 text-blue-600" />}
        description="Upload high-quality images of your property."
      >
        <DropzoneBox
          typeLabel="images"
          accept="image/*"
          multiple={true}
          hint="Supported formats: PNG, JPG, JPEG, WEBP (up to 10MB each)"
          icon={<UploadCloud className="w-6 h-6 text-blue-600" />}
          onFilesSelected={(files) => handleAddFiles(files, "images")}
        />

        {documents.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 mt-4">
            {documents.images.map((item, index) => (
              <ImagePreviewCard
                key={
                  item._id ||
                  (item.data instanceof File
                    ? `${item.data.name}-${index}`
                    : index)
                }
                item={item}
                onRemove={() => removeFile("images", index)}
              />
            ))}
          </div>
        )}
      </DocumentSection>

      {/* ===================== VIDEO SECTION ===================== */}
      <DocumentSection
        title="Video Walkthrough"
        count={documents.videos.length}
        icon={<Film className="w-5 h-5 text-indigo-600" />}
        description="Add a virtual tour or walkthrough video of the property."
      >
        <DropzoneBox
          typeLabel="video"
          accept="video/*"
          multiple={false}
          hint="Supported formats: MP4, MOV, WEBM (up to 100MB)"
          icon={<Film className="w-6 h-6 text-indigo-600" />}
          onFilesSelected={(files) => handleAddFiles(files, "videos")}
        />

        {documents.videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {documents.videos
              .filter((item: any) => item.url || item.data instanceof File)
              .map((item: any, index) => (
                <VideoPreviewCard
                  key={item._id || index}
                  item={item}
                  onRemove={() => removeFile("videos", index)}
                />
              ))}
          </div>
        )}
      </DocumentSection>

      {/* ===================== FLOOR PLAN SECTION ===================== */}
      <DocumentSection
        title="Floor Plan"
        count={documents.floor_plans.length}
        icon={<FileText className="w-5 h-5 text-emerald-600" />}
        description="Upload architectural diagrams, layouts, or floor plan documents."
      >
        <DropzoneBox
          typeLabel="floor plan"
          accept="image/*,application/pdf"
          multiple={true}
          hint="Supported formats: PNG, JPG, PDF (up to 10MB)"
          icon={<FileText className="w-6 h-6 text-emerald-600" />}
          onFilesSelected={(files) => handleAddFiles(files, "floor_plans")}
        />

        {documents.floor_plans.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 mt-4">
            {documents.floor_plans
              .filter((item: any) => item.url || item.data)
              .map((item: any, index) => (
                <FilePreviewCard
                  key={item._id || index}
                  item={item}
                  onRemove={() => removeFile("floor_plans", index)}
                />
              ))}
          </div>
        )}
      </DocumentSection>
    </div>
  );
};

export default PropertyDocument;

/* =====================================================
   DOCUMENT SECTION WRAPPER
   ===================================================== */

const DocumentSection: React.FC<{
  title: string;
  count: number;
  required?: boolean;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}> = ({ title, count, required, icon, description, children }) => (
  <div className="flex flex-col gap-2.5 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
          {icon}
        </div>
        <div className="flex items-center gap-1.5">
          <h4 className="text-base font-semibold text-slate-800">{title}</h4>
          {required && <Required />}
        </div>
      </div>

      {count > 0 && (
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {count} {count === 1 ? "file" : "files"}
        </span>
      )}
    </div>

    {description && (
      <p className="text-xs text-slate-500 font-normal pl-9">{description}</p>
    )}

    <div className="mt-2">{children}</div>
  </div>
);

/* =====================================================
   DRAG-AND-DROP DROPZONE BOX
   ===================================================== */

interface DropzoneBoxProps {
  accept: string;
  multiple?: boolean;
  typeLabel: string;
  hint: string;
  icon: React.ReactNode;
  onFilesSelected: (files: File[]) => void;
}

const DropzoneBox: React.FC<DropzoneBoxProps> = ({
  accept,
  multiple = true,
  typeLabel,
  hint,
  icon,
  onFilesSelected,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f instanceof File && f.size > 0,
      );
      if (droppedFiles.length > 0) {
        onFilesSelected(droppedFiles);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(
        (f) => f instanceof File && f.size > 0,
      );
      if (selectedFiles.length > 0) {
        onFilesSelected(selectedFiles);
      }
      e.target.value = "";
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative w-full rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center gap-3 select-none",
        isDragging
          ? "border-blue-500 bg-blue-50/70 scale-[1.005] ring-4 ring-blue-500/10 shadow-xs"
          : "border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20",
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
        {icon}
      </div>

      <div className="flex flex-col gap-1 items-center">
        <p className="text-sm text-slate-700">
          <span className="font-semibold text-blue-600 hover:underline">
            Click to upload
          </span>{" "}
          or drag and drop your {typeLabel}
        </p>
        <p className="text-xs text-slate-400 font-normal">{hint}</p>
      </div>
    </div>
  );
};

/* =====================================================
   IMAGE PREVIEW CARD
   ===================================================== */

const ImagePreviewCard: React.FC<{
  item: DocItem;
  onRemove: () => void;
}> = ({ item, onRemove }) => {
  const [imgError, setImgError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    let objectUrl = "";
    const source = item?.url || item?.data;

    if (source instanceof File) {
      try {
        objectUrl = URL.createObjectURL(source);
        setPreviewUrl(objectUrl);
        setImgError(false);
      } catch (err) {
        console.error("Error creating image preview URL:", err);
      }
    } else if (typeof source === "string" && source.trim() !== "") {
      setPreviewUrl(source);
      setImgError(false);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [item?.data, item?.url]);

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200/90 bg-slate-100 aspect-4/3 shadow-2xs hover:shadow-md transition-all">
      {imgError || !previewUrl ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 gap-1 text-center">
          <ImageIcon className="w-6 h-6 text-slate-300" />
          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[120px]">
            {item.name || "Image"}
          </span>
        </div>
      ) : (
        <img
          src={previewUrl}
          alt={item.name || "Property image"}
          onError={() => {
            console.warn("Failed to load image preview:", previewUrl);
            setImgError(true);
          }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Remove Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer z-10"
        title="Remove image"
      >
        <X className="w-4 h-4" />
      </button>

      {/* File name footer */}
      {item.name && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2 text-white text-[11px] truncate opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {item.name}
        </div>
      )}
    </div>
  );
};

/* =====================================================
   VIDEO PREVIEW CARD
   ===================================================== */

const VideoPreviewCard: React.FC<{
  item: DocItem;
  onRemove: () => void;
}> = ({ item, onRemove }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");

  useEffect(() => {
    let objectUrl = "";
    const source = item?.url || item?.data;

    if (source instanceof File) {
      try {
        objectUrl = URL.createObjectURL(source);
        setVideoSrc(objectUrl);
      } catch (err) {
        console.error("Error creating video object URL:", err);
      }
    } else if (typeof source === "string" && source.trim() !== "") {
      setVideoSrc(source);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [item?.data, item?.url]);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  return (
    <div className="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-16/9 shadow-2xs">
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
          <Film className="w-8 h-8 text-slate-500" />
          <span className="text-xs">Loading video...</span>
        </div>
      )}

      {/* Remove button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer z-10"
        title="Remove video"
      >
        <X className="w-4 h-4" />
      </button>

      {/* File name bar */}
      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs px-2.5 py-1 truncate pointer-events-none">
        {item.name ||
          (item.data instanceof File ? item.data.name : "Property Video")}
      </div>
    </div>
  );
};

/* =====================================================
   FILE / FLOOR PLAN PREVIEW CARD
   ===================================================== */

const FilePreviewCard: React.FC<{
  item: DocItem;
  onRemove: () => void;
}> = ({ item, onRemove }) => {
  const [imgError, setImgError] = useState(false);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    let objectUrl = "";
    const source = item?.url || item?.data;

    if (source instanceof File) {
      try {
        objectUrl = URL.createObjectURL(source);
        setPreview(objectUrl);
        setImgError(false);
      } catch (err) {
        console.error("Error creating floor plan object URL:", err);
      }
    } else if (typeof source === "string" && source.trim() !== "") {
      setPreview(source);
      setImgError(false);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [item?.data, item?.url]);

  const displayName =
    item.name ||
    (item.data instanceof File ? item.data.name : "Floor Plan");

  const isPdf =
    displayName.toLowerCase().endsWith(".pdf") ||
    (typeof item.url === "string" && item.url.toLowerCase().endsWith(".pdf")) ||
    (item.data instanceof File && item.data.type === "application/pdf");

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200/90 bg-white aspect-4/3 shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center p-2 text-center">
      {isPdf || imgError || !preview ? (
        <div className="flex flex-col items-center justify-center gap-1.5 p-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <span
            className="text-[11px] font-medium text-slate-700 truncate max-w-[130px]"
            title={displayName}
          >
            {displayName}
          </span>
          {item.data instanceof File && (
            <span className="text-[10px] text-slate-400">
              {(item.data.size / 1024).toFixed(0)} KB
            </span>
          )}
        </div>
      ) : (
        <img
          src={preview}
          alt={displayName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Remove Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer z-10"
        title="Remove file"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Footer name if image */}
      {!isPdf && !imgError && preview && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {displayName}
        </div>
      )}
    </div>
  );
};
