import { Folder, Trash2 } from "lucide-react";

function FolderCard({
  folder,
  onOpen,
  onDelete,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(folder)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(folder);
        }
      }}
      className="group relative text-left rounded-2xl border border-white/10 bg-[#10091b] p-4 hover:border-lime-300/35 hover:bg-lime-300/[0.025] transition cursor-pointer"
    >

      {onDelete && (
        <button
          type="button"
          title="Move to trash"
          aria-label={`Move ${folder?.name || "folder"} to trash`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(folder);
          }}
          className="
            absolute
            top-3
            right-3
            w-8
            h-8
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
          <Trash2 size={14} />
        </button>
      )}

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

    </div>
  );
}

export default FolderCard;