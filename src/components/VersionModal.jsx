import { useEffect, useRef, useState } from "react";
import {
  X,
  Upload,
  History,
  Download,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  getFileVersions,
  uploadFileVersion,
  downloadFileVersion,
  restoreFileVersion,
} from "../api";

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function VersionModal({ file, onClose, onChanged }) {
  const inputRef = useRef(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function loadVersions() {
    setLoading(true);
    setError("");
    try {
      const response = await getFileVersions(file.id);
      setVersions(response?.versions || []);
    } catch (err) {
      console.error("Load versions error:", err);
      setError(err.message || "Could not load versions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVersions();
  }, [file.id]);

  async function handleUpload(event) {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError("");
      await uploadFileVersion(file.id, selectedFile);
      await loadVersions();
      if (onChanged) await onChanged();
    } catch (err) {
      console.error("Upload version error:", err);
      setError(err.message || "Could not upload new version.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(version) {
    try {
      const response = await downloadFileVersion(file.id, version.id);
      if (!response?.downloadUrl) throw new Error("Download URL was not returned.");
      window.open(response.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert(err.message || "Could not download version.");
    }
  }

  async function handleRestore(version) {
    if (!window.confirm(`Restore version ${version.version_number}?`)) return;

    try {
      await restoreFileVersion(file.id, version.id);
      await loadVersions();
      if (onChanged) await onChanged();
    } catch (err) {
      alert(err.message || "Could not restore version.");
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => !uploading && onClose()}
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 bg-[#0d0717] shadow-2xl">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <History size={19} className="text-fuchsia-300" />
              <h2 className="text-xl font-bold">File Versions</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1 truncate">{file.name}</p>
          </div>
          <button type="button" onClick={onClose} disabled={uploading} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.05] disabled:opacity-40">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[65vh]">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-lime-300/20 text-lime-300 hover:bg-lime-300/[0.06] disabled:opacity-40 transition"
          >
            {uploading ? <><Loader2 size={17} className="animate-spin" /> Uploading...</> : <><Upload size={17} /> Upload New Version</>}
          </button>

          <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} />

          {error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-3 text-sm text-red-300">{error}</div>}

          {loading && <div className="py-12 text-center text-gray-600"><Loader2 size={22} className="mx-auto animate-spin mb-3" />Loading versions...</div>}

          {!loading && versions.length > 0 && (
            <div className="mt-5 space-y-3">
              {versions.map((version) => (
                <div key={version.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-200">Version {version.version_number}</p>
                      <p className="text-xs text-gray-600 mt-1 truncate">{version.name} · {formatFileSize(version.size_bytes)}</p>
                      <p className="text-[11px] text-gray-700 mt-1">{new Date(version.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" onClick={() => handleDownload(version)} className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-white" title="Download"><Download size={15} /></button>
                      <button type="button" onClick={() => handleRestore(version)} className="p-2 rounded-lg border border-lime-300/20 text-lime-300 hover:bg-lime-300/[0.05]" title="Restore version"><RotateCcw size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && versions.length === 0 && <div className="py-12 text-center text-gray-600">No previous versions yet.</div>}
        </div>
      </div>
    </div>
  );
}

export default VersionModal;
