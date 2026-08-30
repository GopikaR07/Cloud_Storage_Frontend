import { Upload } from "lucide-react";

function UploadBox() {
  return (
    <button className="rounded-2xl border border-lime-400/30 bg-lime-400/5 p-6 flex flex-col items-center justify-center hover:bg-lime-400/10 transition group">

      <div className="w-14 h-14 rounded-2xl bg-lime-300/10 border border-lime-400/30 flex items-center justify-center mb-4 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.2)] transition">

        <Upload
          className="text-lime-300"
          size={25}
        />

      </div>

      <h3 className="font-bold">
        Upload Files
      </h3>

      <p className="text-xs text-gray-500 mt-2">
        Add files to your cloud
      </p>

    </button>
  );
}

export default UploadBox;