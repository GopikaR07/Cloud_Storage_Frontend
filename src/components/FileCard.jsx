import {
  FileText,
  Image,
  FileArchive,
  File,
} from "lucide-react";

function formatBytes(value) {

  const size = Number(value);

  if (!size || Number.isNaN(size)) {
    return "—";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 ** 2) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`;
  }

  if (size < 1024 ** 3) {
    return `${(
      size / 1024 ** 2
    ).toFixed(1)} MB`;
  }

  return `${(
    size / 1024 ** 3
  ).toFixed(1)} GB`;
}


function getIcon(mimeType = "") {

  if (
    mimeType.startsWith("image/")
  ) {
    return Image;
  }

  if (
    mimeType.includes("pdf") ||
    mimeType.includes("text")
  ) {
    return FileText;
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("compressed")
  ) {
    return FileArchive;
  }

  return File;
}


function FileCard({ file }) {

  const mimeType =
    file.mimeType ||
    file.mime_type ||
    "";

  const Icon = getIcon(mimeType);

  const fileName =
    file.name ||
    "Unnamed file";

  const fileSize =
    file.sizeBytes ??
    file.size_bytes;

  return (
    <div className="group rounded-2xl border border-white/10 bg-[#10091b] p-4 hover:border-fuchsia-400/30 hover:bg-white/[0.025] transition">

      <div className="w-11 h-11 rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/[0.07] flex items-center justify-center mb-4">

        <Icon
          size={21}
          className="text-fuchsia-300"
        />

      </div>

      <p
        title={fileName}
        className="font-semibold text-sm text-white truncate"
      >
        {fileName}
      </p>

      <p className="text-xs text-gray-600 mt-1">
        {formatBytes(fileSize)}
      </p>

    </div>
  );
}

export default FileCard;