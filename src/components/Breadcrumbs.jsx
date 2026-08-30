import {
  ChevronRight,
  Home,
} from "lucide-react";

function Breadcrumbs({
  path,
  onHome,
  onFolder,
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto text-sm">

      {/* HOME */}
      <button
        type="button"
        onClick={onHome}
        className="shrink-0 text-gray-500 hover:text-lime-300 transition flex items-center gap-1.5"
      >

        <Home size={15} />

        My Files

      </button>


      {/* FOLDER PATH */}
      {(path || []).map(
        (item, index) => (

          <div
            key={
              item.id ||
              index
            }
            className="flex items-center gap-1.5 shrink-0"
          >

            <ChevronRight
              size={14}
              className="text-gray-700"
            />

            <button
              type="button"
              onClick={() =>
                onFolder(
                  item,
                  index
                )
              }
              className={
                index ===
                path.length - 1
                  ? "text-white font-medium"
                  : "text-gray-500 hover:text-fuchsia-300"
              }
            >
              {item.name}
            </button>

          </div>

        )
      )}

    </div>
  );
}

export default Breadcrumbs;