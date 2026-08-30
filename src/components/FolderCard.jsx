import { Folder } from "lucide-react";

function FolderCard({
  folder,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onOpen(folder)
      }
      className="text-left rounded-2xl border border-white/10 bg-[#10091b] p-4 hover:border-lime-300/35 hover:bg-lime-300/[0.025] transition"
    >

      <div className="w-11 h-11 rounded-xl border border-lime-300/20 bg-lime-300/[0.07] flex items-center justify-center mb-4">

        <Folder
          size={21}
          className="text-lime-300"
        />

      </div>

      <p
        title={folder.name}
        className="font-semibold text-sm text-white truncate"
      >
        {folder.name || "Unnamed folder"}
      </p>

      <p className="text-xs text-gray-600 mt-1">
        Folder
      </p>

    </button>
  );
}

export default FolderCard;