import {
  File,
  FileText,
  FileImage,
  FileType,
  Download,
  Eye,
} from "lucide-react";

function getFileType(file) {
  const name = file?.name || "";
  const mime = file?.mime_type || file?.mimeType || "";

  if (mime.startsWith("image/")) {
    return "image";
  }

  if (
    mime === "application/pdf" ||
    name.toLowerCase().endsWith(".pdf")
  ) {
    return "pdf";
  }

  if (
    mime.startsWith("text/") ||
    name.toLowerCase().endsWith(".txt")
  ) {
    return "text";
  }

  return "other";
}


function formatFileSize(bytes) {
  if (!bytes) return "";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
}


function getIcon(type) {
  if (type === "image") {
    return FileImage;
  }

  if (type === "pdf") {
    return FileType;
  }

  if (type === "text") {
    return FileText;
  }

  return File;
}


function FileCard({
  file,
  onPreview,
}) {

  const type =
    getFileType(file);

  const Icon =
    getIcon(type);

  const size =
    file?.size ||
    file?.file_size ||
    file?.size_bytes;


  return (

    <button
      type="button"
      onClick={() => {

        if (onPreview) {
          onPreview(file);
        }

      }}
      className="
        group
        w-full
        text-left
        rounded-2xl
        border
        border-white/10
        bg-white/[0.02]
        hover:bg-white/[0.05]
        hover:border-fuchsia-400/25
        transition-all
        duration-200
        overflow-hidden
      "
    >

      {/* PREVIEW AREA */}

      <div className="h-36 flex items-center justify-center bg-[#10091a] relative">

        {type === "image" &&
        file?.url ? (

          <img
            src={file.url}
            alt={file.name}
            className="
              w-full
              h-full
              object-cover
              opacity-80
              group-hover:opacity-100
              transition
            "
          />

        ) : (

          <div className="
            w-16
            h-16
            rounded-2xl
            bg-fuchsia-400/[0.07]
            border
            border-fuchsia-400/15
            flex
            items-center
            justify-center
          ">

            <Icon
              size={30}
              className="text-fuchsia-300"
            />

          </div>

        )}


        {/* VIEW ICON */}

        <div className="
          absolute
          top-3
          right-3
          w-8
          h-8
          rounded-lg
          bg-black/60
          border
          border-white/10
          flex
          items-center
          justify-center
          opacity-0
          group-hover:opacity-100
          transition
        ">

          <Eye
            size={15}
            className="text-white"
          />

        </div>

      </div>


      {/* INFO */}

      <div className="px-4 py-3">

        <p className="text-sm text-gray-200 font-medium truncate">
          {file?.name || "Unnamed file"}
        </p>

        {size && (

          <p className="text-xs text-gray-600 mt-1">
            {formatFileSize(size)}
          </p>

        )}

      </div>

    </button>
  );
}


export default FileCard;