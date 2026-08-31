import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Lock, Download, AlertCircle, FileText } from "lucide-react";

import {
  getPublicLinkInfo,
  verifyPublicLinkPassword,
} from "../api";

function SharedLink() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [linkInfo, setLinkInfo] = useState(null);

  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getPublicLinkInfo(token);

        if (cancelled) return;

        setLinkInfo(data);

        if (data?.downloadUrl) {
          setDownloadUrl(data.downloadUrl);
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err.message || "This link is invalid or has expired."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleVerify(e) {
    e.preventDefault();
    setVerifyError("");

    if (!password) {
      setVerifyError("Please enter the password.");
      return;
    }

    setVerifying(true);

    try {
      const result = await verifyPublicLinkPassword(
        token,
        password
      );

      if (result?.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
      } else {
        setVerifyError("Could not generate a download link.");
      }
    } catch (err) {
      setVerifyError(err.message || "Incorrect password.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08040f] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-fuchsia-600/20 blur-[120px] rounded-full -top-32 -left-32" />
      <div className="absolute w-96 h-96 bg-lime-400/10 blur-[120px] rounded-full -bottom-32 -right-32" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#10091c]/95 shadow-2xl p-8">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-10 text-gray-400">
            <div className="w-8 h-8 border-2 border-lime-300/60 border-t-transparent rounded-full animate-spin" />
            <p>Loading shared file...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <AlertCircle className="text-red-400" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && linkInfo && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-lime-300/10">
                <FileText className="text-lime-300" size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  Shared file
                </p>
                <h1 className="text-lg font-bold truncate">
                  {linkInfo.fileName || "Untitled file"}
                </h1>
              </div>
            </div>

            {linkInfo.requiresPassword && !downloadUrl && (
              <form onSubmit={handleVerify} className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <Lock size={14} />
                  This file is password protected
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-lime-300/60"
                />

                {verifyError && (
                  <p className="text-sm text-red-400">
                    {verifyError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full h-11 rounded-xl bg-lime-300 text-black font-bold disabled:opacity-50"
                >
                  {verifying ? "Checking..." : "Unlock"}
                </button>
              </form>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                className="w-full h-11 rounded-xl bg-lime-300 text-black font-bold flex items-center justify-center gap-2 hover:bg-lime-200 transition"
              >
                <Download size={18} />
                Download file
              </a>
            )}

            {linkInfo.expiresAt && (
              <p className="text-xs text-gray-600 mt-4 text-center">
                Link expires{" "}
                {new Date(linkInfo.expiresAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedLink;