import {
  File,
  FileText,
  FileImage,
  FileType,
  Eye,
  Share2,
  History,
  Trash2,
} from "lucide-react";

function getFileType(file) {
  const name = file?.name || "";
  const mime = file?.mime_type || file?.mimeType || "";

  if (mime.startsWith("image/")) {
    return "image";
  }

  if (mime === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }

  if (mime.startsWith("text/") || name.toLowerCase().endsWith(".txt")) {
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

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
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

function FileCard({ file, onPreview, onShare, onVersions, onDelete }) {
  const type = getFileType(file);
  const Icon = getIcon(type);
  const size = file?.size || file?.file_size || file?.size_bytes;

  return (
    <div
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
        {type === "image" && file?.url ? (
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
          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-fuchsia-400/[0.07]
              border
              border-fuchsia-400/15
              flex
              items-center
              justify-center
            "
          >
            <Icon size={30} className="text-fuchsia-300" />
          </div>
        )}

        {/* FILE ACTIONS - ALWAYS VISIBLE */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {onVersions && (
            <button
              type="button"
              title="View versions"
              aria-label={`View versions of ${file?.name || "file"}`}
              onClick={(event) => {
                event.stopPropagation();
                onVersions(file);
              }}
              className="
                w-9
                h-9
                rounded-lg
                bg-black/70
                border
                border-white/15
                flex
                items-center
                justify-center
                text-gray-300
                hover:text-fuchsia-300
                hover:border-fuchsia-300/40
                hover:bg-black/85
                transition
                shadow-lg
              "
            >
              <History size={16} />
            </button>
          )}

          {onShare && (
            <button
              type="button"
              title="Share file"
              aria-label={`Share ${file?.name || "file"}`}
              onClick={(event) => {
                event.stopPropagation();
                onShare(file);
              }}
              className="
                w-9
                h-9
                rounded-lg
                bg-black/70
                border
                border-lime-300/30
                flex
                items-center
                justify-center
                text-lime-300
                hover:text-lime-200
                hover:border-lime-300/60
                hover:bg-black/85
                transition
                shadow-lg
              "
            >
              <Share2 size={16} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              title="Move to trash"
              aria-label={`Move ${file?.name || "file"} to trash`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(file);
              }}
              className="
                w-9
                h-9
                rounded-lg
                bg-black/70
                border
                border-red-400/30
                flex
                items-center
                justify-center
                text-red-300
                hover:text-red-200
                hover:border-red-400/60
                hover:bg-black/85
                transition
                shadow-lg
              "
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* PREVIEW */}
          <button
            type="button"
            title="Preview file"
            aria-label={`Preview ${file?.name || "file"}`}
            onClick={(event) => {
              event.stopPropagation();
              if (onPreview) {
                onPreview(file);
              }
            }}
            className="
              w-9
              h-9
              rounded-lg
              bg-black/70
              border
              border-white/15
              flex
              items-center
              justify-center
              text-white
              hover:text-fuchsia-300
              hover:border-fuchsia-300/40
              hover:bg-black/85
              transition
              shadow-lg
            "
          >
            <Eye size={16} />
          </button>
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

        <div className="flex items-center justify-between gap-2 mt-3">
          <span className="text-xs text-gray-600 truncate">
            Click to preview
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {onVersions && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onVersions(file);
                }}
                className="
                  flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1.5
                  rounded-lg
                  border
                  border-white/10
                  text-gray-500
                  hover:text-fuchsia-300
                  hover:border-fuchsia-300/30
                  transition
                "
              >
                <History size={14} />
                <span className="text-xs">Versions</span>
              </button>
            )}

            {onShare && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onShare(file);
                }}
                className="
                  flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1.5
                  rounded-lg
                  border
                  border-lime-300/25
                  text-lime-300
                  hover:text-lime-200
                  hover:border-lime-300/50
                  transition
                "
              >
                <Share2 size={14} />
                <span className="text-xs">Share</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileCard;