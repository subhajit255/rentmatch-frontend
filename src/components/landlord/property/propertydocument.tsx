import React, { useEffect, useRef } from "react";
import { Label } from "../../ui/label";
import { Required } from "../../ui/miscellenious";
import { Checkbox } from "../../ui/checkbox";
import Icon from "../../icons/icon";
import { DocumentsPayload } from "@/src/types/property";

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
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const floorInput = useRef<HTMLInputElement>(null);

  /* ----------------------- ADD FILE ----------------------- */

  const handleAddFile = (

    e: React.ChangeEvent<HTMLInputElement>,

    type: keyof DocumentsPayload

  ) => {

    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files)

      .filter((file) => file instanceof File && file.size > 0)

      .map((file) => ({

        data: file,

      }));

    if (!newFiles.length) return;

    setDocuments((prev) => ({

      ...prev,

      [type]: [...prev[type], ...newFiles],

    }));

    e.target.value = "";

  };

  useEffect(() => {
    console.log("documents in PropertyDocument ::: ", documents);
  }, [documents])

  /* ----------------------- FEATURE IMAGE ----------------------- */

  const setFeaturedImage = (index: number) => {
    setDocuments((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        is_featured: i === index,
      })),
    }));
  };

  const removeFile = (type: keyof DocumentsPayload, index: number) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] gap-9">
      {/* ===================== IMAGES ===================== */}
      <SectionBlock title="Images" required>
        <input
          ref={imageInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleAddFile(e, "images")}
        />

        <ChooseCard
          command="Drag or upload your property images"
          onClick={() => imageInput.current?.click()}
        />

        {documents.images.map((item, index) => (
          <ImageCard
            key={`${item.data}-${index}`}
            file={item?.data ?? item?.url!}
            checked={item.is_featured || false}
            onCheck={() => setFeaturedImage(index)}
            onRemove={() => removeFile("images", index)}
          />
        ))}
      </SectionBlock>

      {/* ===================== VIDEOS ===================== */}
      <SectionBlock title="Video">
        <input
          ref={videoInput}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => handleAddFile(e, "videos")}
        />

        <ChooseCard
          command="Drag or upload your property video"
          onClick={() => videoInput.current?.click()}
        />

        {documents.videos
          .filter((item: any) => item.url || item.data instanceof File)
          .map((item: any, index) => {
            const key =
              item.url ??
              `${item.data.name}-${item.data.size}-${item.data.lastModified}`;
            return (
              <VideoCard
                key={key}
                file={item.url || item.data}
                index={index}
                onRemove={(idx) => {
                  setDocuments((prev) => ({
                    ...prev,
                    videos: prev.videos.filter((_, i) => i !== idx),
                  }));
                }}
              />
            );
          })}
      </SectionBlock>

      {/* ===================== FLOOR PLAN ===================== */}
      <SectionBlock title="Floor Plan">
        <input
          ref={floorInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleAddFile(e, "floor_plans")}
        />

        <ChooseCard
          command="Drag or upload your property floor plan"
          onClick={() => floorInput.current?.click()}
        />

        {documents.floor_plans
          .filter((item: any) => item.url || item.data instanceof File)
          .map((item: any, index) => {
            const key =
              item.url ??
              `${item.data.name}-${item.data.size}-${item.data.lastModified}`;
            return (
              <FileCard
                key={key}
                file={item.name || item.data}
                index={index}
                onRemove={(idx) => {
                  setDocuments((prev) => ({
                    ...prev,
                    floor_plans: prev.floor_plans.filter((_, i) => i !== idx),
                  }));
                }}
              />
            );
          })}

        {/* {documents.floor_plans.map((item: any, index) => {
          const key =
            item.url ??
            `${item.data.name}-${item.data.size}-${item.data.lastModified}`;
          return (
            item.data && (
              <FileCard
                key={key}
                file={item.url || item.data}
                index={index}
                onRemove={(idx: any) => {
                  setDocuments((prev) => ({
                    ...prev,
                    floor_plans: prev.floor_plans.filter((_, i) => i !== idx),
                  }));
                }}
              />
            )
          )
        }

        )} */}
      </SectionBlock>
    </div>
  );
};

export default PropertyDocument;

/* =====================================================
   REUSABLE UI COMPONENTS
   ===================================================== */

const SectionBlock = ({
  title,
  required,
  children,
}: {
  title: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3">
    <Label className="flex items-center gap-2">
      <Checkbox disabled />
      {title} {required && <Required />}
    </Label>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
      {children}
    </div>
  </div>
);

const ImageCard = ({
  file,
  checked,
  onCheck,
  onRemove,

}: {
  file: File | string;
  checked: boolean;
  onCheck: () => void;
  url?: string;
  onRemove: () => void;
}) => {
  const preview =
    typeof file === "string"
      ? file
      : URL.createObjectURL(file);

  useEffect(() => {
    // console.log("preview : ", preview, file);

    return () => {
      if (typeof file !== "string") {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file, preview]);

  return (

    <div className="relative rounded-[15px] h-[200px] w-[200px] group overflow-hidden">
      <img
        src={preview}
        alt="Property"
        className="h-full w-full rounded-[15px] object-cover"
      />

      {/* <Checkbox
        checked={checked}
        onChange={onCheck}
        className="absolute top-3 right-3 bg-white shadow-md border border-gray-300"
      /> */}

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all"
      >
        ×
      </button>
    </div>


    // <div className="relative rounded-[15px] h-[200px] w-[200px]">
    //   <img
    //     src={preview}
    //     alt="Property"
    //     className="h-full w-full rounded-[15px] object-cover"
    //   />
    //   {/* <Checkbox
    //     checked={checked}
    //     onChange={() => onCheck()}
    //     className="absolute top-2 right-2"
    //   /> */}

    //   <button
    //     type="button"
    //     onClick={onRemove}
    //     className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all"
    //   >
    //     ×
    //   </button>
    // </div>
  );
};


const FileCard = ({
  file,
  index,
  onRemove
}: {
  file: File | string
  index?: number;
  onRemove?: (index: number) => void;
}) => {
  console.log(file, "<---- documents files ???")
  if (typeof file !== "string" && !(file instanceof File)) {
    return null;
  }
  const preview =
    typeof file === "string"
      ? file
      : URL.createObjectURL(file);

  useEffect(() => {
    console.log("preview : ", preview, file);
    return () => {
      if (typeof file !== "string") {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file, preview]);

  return (
    <div
      className="relative rounded-[15px] h-[200px] w-[200px] flex items-center justify-center bg-muted text-sm text-center p-3 group overflow-hidden">
      {typeof file === "string" ? file : file.name}
      {onRemove && index !== undefined && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all"
        >
          ×
        </button>
      )}

    </div>
  );
}

const VideoCard = ({
  file,
  index,
  onRemove,
}: {
  file: File | string;
  index?: number;
  onRemove?: (index: number) => void;
}) => {

  if (typeof file !== "string" && !(file instanceof File)) {
    return null;
  }

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoPreview = React.useMemo(() => {
    if (typeof file === "string") return file;
    return URL.createObjectURL(file);
  }, [file]);


  useEffect(() => {

    if (videoRef.current) {
      videoRef.current.load(); // force browser to load blob
    }

    return () => {
      if (typeof file !== "string") {
        URL.revokeObjectURL(videoPreview);
      }
    };

  }, [videoPreview, file]);

  return (
    <div className="relative rounded-[15px] h-[200px] w-[200px] overflow-hidden bg-black group">
      <video
        key={index}
        ref={videoRef}
        src={videoPreview}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
      />
      {typeof file !== "string" && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1.5 rounded truncate">
          {file.name}
        </div>)}
      {onRemove && index !== undefined && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all"
        >
          ×
        </button>)}
    </div>

    // <div className="relative rounded-[15px] h-[200px] w-[200px] overflow-hidden bg-black group overflow-hidden">

    //   <video
    //     // key={index}
    //     ref={videoRef}
    //     src={videoPreview}
    //     controls
    //     playsInline
    //     preload="metadata"
    //     className="h-full w-full object-contain"
    //   />
    //   {typeof file !== "string" && (
    //     <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs p-1.5 rounded truncate">

    //       {file.name}
    //       {onRemove && index !== undefined && (
    //         <button
    //           type="button"
    //           onClick={() => onRemove(index)}
    //           className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all"
    //         >
    //           ×
    //         </button>)}

    //     </div>
    //   )}

    //   {/* {onRemove && index !== undefined && (
    //     <button
    //       type="button"
    //       onClick={() => onRemove(index)}
    //       className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6"
    //     >
    //       x
    //     </button>
    //   )} */}

    // </div>

  );

};

const ChooseCard = ({
  command,
  onClick,
}: {
  command: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-[15px] h-[200px] w-[200px] flex flex-col gap-3 items-center justify-center bg-ring/30 hover:bg-ring/40 transition"
  >
    <Icon name="UploadImage" />
    <span className="text-muted-foreground text-center text-md">
      {command}
    </span>
  </button>
);



// import React, { useEffect, useRef, useMemo } from "react";
// import { Label } from "../../ui/label";
// import { Required } from "../../ui/miscellenious";
// import { Checkbox } from "../../ui/checkbox";
// import Icon from "../../icons/icon";
// import { DocumentsPayload } from "@/src/types/property";

// type PropertyDocumentProps = {
//   documents: DocumentsPayload;
//   setDocuments: React.Dispatch<React.SetStateAction<DocumentsPayload>>;
// };

// const PropertyDocument: React.FC<PropertyDocumentProps> = ({
//   documents,
//   setDocuments,
// }) => {
//   const imageInput = useRef<HTMLInputElement>(null);
//   const videoInput = useRef<HTMLInputElement>(null);
//   const floorInput = useRef<HTMLInputElement>(null);

//   /* ----------------------- ADD FILES ----------------------- */
//   const handleAddFiles = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: keyof DocumentsPayload
//   ) => {
//     if (!e.target.files?.length) return;

//     const newFiles = Array.from(e.target.files)
//       .filter((file) => file instanceof File && file.size > 0)
//       .map((file) => ({
//         data: file,
//         ...(type === "images" && { is_featured: false }),
//       }));

//     if (!newFiles.length) return;

//     setDocuments((prev) => ({
//       ...prev,
//       [type]: [...(prev[type] || []), ...newFiles],
//     }));

//     e.target.value = "";
//   };

//   const setFeaturedImage = (index: number) => {
//     setDocuments((prev) => ({
//       ...prev,
//       images: prev.images.map((img, i) => ({
//         ...img,
//         is_featured: i === index,
//       })),
//     }));
//   };

//   const removeFile = (type: keyof DocumentsPayload, index: number) => {
//     setDocuments((prev) => ({
//       ...prev,
//       [type]: prev[type].filter((_, i) => i !== index),
//     }));
//   };

//   return (
//     <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] gap-9">
//       {/* ===================== IMAGES ===================== */}
//       <SectionBlock title="Images" required>
//         <input
//           ref={imageInput}
//           type="file"
//           accept="image/*"
//           multiple
//           hidden
//           onChange={(e) => handleAddFiles(e, "images")}
//         />

//         <ChooseCard
//           command="Drag or upload your property images"
//           onClick={() => imageInput.current?.click()}
//         />

//         {documents.images.map((item, index) => (
//           <ImageCard
//             key={item.url || `new-${index}`}
//             item={item as any}
//             checked={!!item.is_featured}
//             onCheck={() => setFeaturedImage(index)}
//             onRemove={() => removeFile("images", index)}
//           />
//         ))}
//       </SectionBlock>

//       {/* ===================== VIDEOS ===================== */}
//       <SectionBlock title="Video">
//         <input
//           ref={videoInput}
//           type="file"
//           accept="video/*"
//           multiple
//           hidden
//           onChange={(e) => handleAddFiles(e, "videos")}
//         />

//         <ChooseCard
//           command="Drag or upload your property video"
//           onClick={() => videoInput.current?.click()}
//         />

//         {documents.videos.map((item, index) => (
//           <VideoCard
//             key={item.url || `new-video-${index}`}
//             item={item as any}
//             onRemove={() => removeFile("videos", index)}
//           />
//         ))}
//       </SectionBlock>

//       {/* ===================== FLOOR PLAN ===================== */}
//       <SectionBlock title="Floor Plan">
//         <input
//           ref={floorInput}
//           type="file"
//           accept="image/*"
//           multiple
//           hidden
//           onChange={(e) => handleAddFiles(e, "floor_plans")}
//         />

//         <ChooseCard
//           command="Drag or upload your property floor plan"
//           onClick={() => floorInput.current?.click()}
//         />

//         {documents.floor_plans.map((item, index) => (
//           <FileCard
//             key={item.url || `new-floor-${index}`}
//             item={item as any}
//             onRemove={() => removeFile("floor_plans", index)}
//           />
//         ))}
//       </SectionBlock>
//     </div>
//   );
// };

// export default PropertyDocument;

// /* =====================================================
//    REUSABLE COMPONENTS
//    ===================================================== */

// const SectionBlock = ({
//   title,
//   required,
//   children,
// }: {
//   title: string;
//   required?: boolean;
//   children: React.ReactNode;
// }) => (
//   <div className="flex flex-col gap-3">
//     <Label className="flex items-center gap-2">
//       <Checkbox disabled />
//       {title} {required && <Required />}
//     </Label>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
//       {children}
//     </div>
//   </div>
// );

// /* ----------------------- IMAGE CARD (Works in both Add & Edit) ----------------------- */
// const ImageCard = ({
//   item,
//   checked,
//   onCheck,
//   onRemove,
// }: {
//   item: { data?: File; url?: string; is_featured?: boolean };
//   checked: boolean;
//   onCheck: () => void;
//   onRemove: () => void;
// }) => {
//   const preview = useMemo(() => {
//     if (item.url) return item.url;                    // Edit mode - existing image
//     if (item.data instanceof File) return URL.createObjectURL(item.data); // Add mode - new upload
//     return "";
//   }, [item.url, item.data]);

//   useEffect(() => {
//     return () => {
//       if (item.data instanceof File && !item.url) {
//         URL.revokeObjectURL(preview);
//       }
//     };
//   }, [preview, item.data, item.url]);

//   if (!preview) return null;

//   return (
//     <div className="relative rounded-[15px] h-[200px] w-[200px] group overflow-hidden">
//       <img
//         src={preview}
//         alt="Property"
//         className="h-full w-full rounded-[15px] object-cover"
//       />

//       <Checkbox
//         checked={checked}
//         onChange={onCheck}
//         className="absolute top-3 right-3 bg-white shadow-md border border-gray-300"
//       />

//       <button
//         type="button"
//         onClick={onRemove}
//         className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all"
//       >
//         ×
//       </button>
//     </div>
//   );
// };

// /* ----------------------- FILE CARD ----------------------- */
// const FileCard = ({
//   item,
//   onRemove,
// }: {
//   item: { data?: File; url?: string; name?: string };
//   onRemove: () => void;
// }) => {
//   const displayName = item.name || (item.data instanceof File ? item.data.name : "Floor Plan");

//   const previewUrl = useMemo(() => {
//     if (item.url) return item.url;
//     if (item.data instanceof File) return URL.createObjectURL(item.data);
//     return "";
//   }, [item.url, item.data]);

//   useEffect(() => {
//     return () => {
//       if (item.data instanceof File && !item.url) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   return (
//     <div className="relative rounded-[15px] h-[200px] w-[200px] flex flex-col items-center justify-center bg-muted text-sm text-center p-3 group">
//       <div className="text-center">
//         <p className="font-medium truncate">{displayName}</p>
//         {item.data instanceof File && (
//           <p className="text-xs text-muted-foreground mt-1">
//             {(item.data.size / 1024).toFixed(1)} KB
//           </p>
//         )}
//       </div>

//       <button
//         type="button"
//         onClick={onRemove}
//         className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all"
//       >
//         ×
//       </button>
//     </div>
//   );
// };

// /* ----------------------- VIDEO CARD ----------------------- */
// const VideoCard = ({
//   item,
//   onRemove,
// }: {
//   item: { data?: File; url?: string };
//   onRemove: () => void;
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const videoSrc = useMemo(() => {
//     if (item.url) return item.url;
//     if (item.data instanceof File) return URL.createObjectURL(item.data);
//     return "";
//   }, [item.url, item.data]);

//   useEffect(() => {
//     return () => {
//       if (item.data instanceof File && !item.url) {
//         URL.revokeObjectURL(videoSrc);
//       }
//     };
//   }, [videoSrc]);

//   if (!videoSrc) return null;

//   return (
//     <div className="relative rounded-[15px] h-[200px] w-[200px] overflow-hidden bg-black group">
//       <video
//         ref={videoRef}
//         src={videoSrc}
//         controls
//         playsInline
//         preload="metadata"
//         className="h-full w-full object-contain"
//       />

//       <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1.5 rounded truncate">
//         {item.data instanceof File ? item.data.name : "Video"}
//       </div>

//       <button
//         type="button"
//         onClick={onRemove}
//         className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all"
//       >
//         ×
//       </button>
//     </div>
//   );
// };

// const ChooseCard = ({
//   command,
//   onClick,
// }: {
//   command: string;
//   onClick: () => void;
// }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="rounded-[15px] h-[200px] w-[200px] flex flex-col gap-3 items-center justify-center bg-ring/30 hover:bg-ring/40 transition"
//   >
//     <Icon name="UploadImage" />
//     <span className="text-muted-foreground text-center text-md">
//       {command}
//     </span>
//   </button>
// );