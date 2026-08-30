import { HardDrive } from "lucide-react";

function StorageCard() {
  return (
    <div className="rounded-2xl border border-fuchsia-500/20 bg-[#10091c] p-6">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-gray-500 text-sm">
            Storage
          </p>

          <h3 className="text-3xl font-bold mt-2">
            0 GB
            <span className="text-sm text-gray-500 font-normal">
              {" "} / 1 GB
            </span>
          </h3>
        </div>

        <div className="w-12 h-12 rounded-xl bg-fuchsia-400/10 border border-fuchsia-400/20 flex items-center justify-center">
          <HardDrive
            className="text-fuchsia-400"
            size={23}
          />
        </div>

      </div>

      <div className="mt-6 h-2 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-0 bg-gradient-to-r from-lime-300 via-fuchsia-400 to-purple-500 rounded-full" />
      </div>

      <p className="text-xs text-gray-600 mt-3">
        Your storage usage will appear here.
      </p>

    </div>
  );
}

export default StorageCard;