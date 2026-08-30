import { useRef, useState } from "react";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://cloud-storage-backend-six.vercel.app";


function formatFileSize(bytes) {
  if (!bytes) return "0 B";

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}


function UploadDropzone({
  folderId = null,
  onUploadComplete,
  onClose,
}) {

  const inputRef = useRef(null);

  const [dragging, setDragging] =
    useState(false);

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [status, setStatus] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================
  // SELECT FILES
  // ==========================================

  function addFiles(files) {

    const incoming =
      Array.from(files || []);

    if (!incoming.length) {
      return;
    }

    setSelectedFiles(
      (previous) => [
        ...previous,
        ...incoming,
      ]
    );

    setError("");
    setStatus("");
  }


  // ==========================================
  // FILE PICKER
  // ==========================================

  function handleFileChange(event) {

    addFiles(
      event.target.files
    );

    event.target.value = "";
  }


  // ==========================================
  // DRAG ENTER
  // ==========================================

  function handleDragEnter(event) {

    event.preventDefault();
    event.stopPropagation();

    setDragging(true);
  }


  // ==========================================
  // DRAG LEAVE
  // ==========================================

  function handleDragLeave(event) {

    event.preventDefault();
    event.stopPropagation();

    setDragging(false);
  }


  // ==========================================
  // DRAG OVER
  // ==========================================

  function handleDragOver(event) {

    event.preventDefault();
    event.stopPropagation();

    setDragging(true);
  }


  // ==========================================
  // DROP
  // ==========================================

  function handleDrop(event) {

    event.preventDefault();
    event.stopPropagation();

    setDragging(false);

    addFiles(
      event.dataTransfer.files
    );
  }


  // ==========================================
  // REMOVE FILE
  // ==========================================

  function removeFile(index) {

    if (uploading) {
      return;
    }

    setSelectedFiles(
      (previous) =>
        previous.filter(
          (_, i) => i !== index
        )
    );
  }


  // ==========================================
  // UPLOAD SINGLE FILE
  // ==========================================

  function uploadSingleFile(file) {

    return new Promise(
      (resolve, reject) => {

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {

          reject(
            new Error(
              "You are not logged in."
            )
          );

          return;
        }


        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );


        if (folderId) {

          formData.append(
            "folderId",
            folderId
          );

        }


        const xhr =
          new XMLHttpRequest();


        xhr.open(
          "POST",
          `${API_BASE_URL}/api/files/upload`
        );


        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${token}`
        );


        xhr.upload.onprogress =
          (event) => {

            if (!event.lengthComputable) {
              return;
            }

            const percent =
              Math.round(
                (event.loaded /
                  event.total) *
                  100
              );

            setProgress(percent);
          };


        xhr.onload = () => {

          let response = {};

          try {

            response =
              JSON.parse(
                xhr.responseText
              );

          } catch {

            response = {};
          }


          if (
            xhr.status >= 200 &&
            xhr.status < 300
          ) {

            resolve(response);

            return;
          }


          reject(
            new Error(
              response?.message ||
              response?.error?.message ||
              `Upload failed (${xhr.status})`
            )
          );
        };


        xhr.onerror = () => {

          reject(
            new Error(
              "Network error while uploading the file."
            )
          );
        };


        xhr.onabort = () => {

          reject(
            new Error(
              "Upload was cancelled."
            )
          );
        };


        xhr.send(
          formData
        );
      }
    );
  }


  // ==========================================
  // UPLOAD ALL
  // ==========================================

  async function handleUpload() {

    if (
      uploading ||
      selectedFiles.length === 0
    ) {
      return;
    }


    setUploading(true);
    setError("");
    setStatus("Uploading...");
    setProgress(0);


    try {

      for (
        let i = 0;
        i < selectedFiles.length;
        i++
      ) {

        const file =
          selectedFiles[i];


        setStatus(
          `Uploading ${file.name}...`
        );


        setProgress(0);


        await uploadSingleFile(
          file
        );
      }


      setProgress(100);

      setStatus(
        selectedFiles.length === 1
          ? "File uploaded successfully!"
          : "Files uploaded successfully!"
      );


      setSelectedFiles([]);


      if (onUploadComplete) {

        await onUploadComplete();

      }


      setTimeout(() => {

        if (onClose) {
          onClose();
        }

      }, 900);


    } catch (err) {

      console.error(
        "Upload error:",
        err
      );


      setError(
        err.message ||
        "Upload failed."
      );

      setStatus("");

    } finally {

      setUploading(false);

    }
  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => {

          if (!uploading && onClose) {
            onClose();
          }

        }}
      />


      {/* MODAL */}

      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d0717] shadow-2xl overflow-hidden">


        {/* HEADER */}

        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-white">
              Upload Files
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add files to your CloudNova storage
            </p>

          </div>


          {!uploading && (

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.05] transition"
            >

              <X size={20} />

            </button>

          )}

        </div>


        {/* BODY */}

        <div className="p-6">


          {/* DROP AREA */}

          <div
            onDragEnter={
              handleDragEnter
            }
            onDragOver={
              handleDragOver
            }
            onDragLeave={
              handleDragLeave
            }
            onDrop={
              handleDrop
            }
            onClick={() => {

              if (!uploading) {
                inputRef.current?.click();
              }

            }}
            className={`
              min-h-[210px]
              rounded-2xl
              border-2
              border-dashed
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-6
              cursor-pointer
              transition-all
              ${
                dragging
                  ? "border-lime-300 bg-lime-300/[0.08]"
                  : "border-white/10 bg-white/[0.015] hover:border-fuchsia-400/30 hover:bg-fuchsia-400/[0.03]"
              }
              ${
                uploading
                  ? "cursor-default opacity-70"
                  : ""
              }
            `}
          >

            <div className="w-14 h-14 rounded-2xl border border-lime-300/25 bg-lime-300/[0.06] flex items-center justify-center mb-4">

              <Upload
                size={25}
                className="text-lime-300"
              />

            </div>


            <p className="text-white font-semibold">

              {dragging
                ? "Drop your files here"
                : "Drag & drop your files here"}

            </p>


            <p className="text-sm text-gray-600 mt-2">
              or click to choose files
            </p>


            <p className="text-xs text-gray-700 mt-3">
              Images, PDFs, text files and documents
            </p>


            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={
                handleFileChange
              }
              disabled={uploading}
            />

          </div>


          {/* SELECTED FILES */}

          {selectedFiles.length > 0 && (

            <div className="mt-5 space-y-2 max-h-[210px] overflow-y-auto">

              {selectedFiles.map(
                (file, index) => (

                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02]"
                  >

                    <div className="w-10 h-10 shrink-0 rounded-lg bg-fuchsia-400/[0.08] border border-fuchsia-400/15 flex items-center justify-center">

                      <File
                        size={18}
                        className="text-fuchsia-300"
                      />

                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="text-sm text-gray-200 truncate">
                        {file.name}
                      </p>

                      <p className="text-xs text-gray-600 mt-0.5">
                        {formatFileSize(
                          file.size
                        )}
                      </p>

                    </div>


                    {!uploading && (

                      <button
                        type="button"
                        onClick={(event) => {

                          event.stopPropagation();

                          removeFile(index);

                        }}
                        className="p-2 text-gray-600 hover:text-red-300 transition"
                      >

                        <X size={16} />

                      </button>

                    )}

                  </div>

                )
              )}

            </div>

          )}


          {/* PROGRESS */}

          {uploading && (

            <div className="mt-5">

              <div className="flex items-center justify-between mb-2">

                <span className="text-sm text-gray-400">
                  {status}
                </span>

                <span className="text-sm font-semibold text-lime-300">
                  {progress}%
                </span>

              </div>


              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-lime-300 to-fuchsia-400 transition-all duration-200"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

          )}


          {/* SUCCESS */}

          {!uploading &&
            status &&
            !error && (

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-lime-300/20 bg-lime-300/[0.05] px-4 py-3">

              <CheckCircle
                size={19}
                className="text-lime-300 shrink-0"
              />

              <p className="text-sm text-lime-200">
                {status}
              </p>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3">

              <AlertCircle
                size={19}
                className="text-red-300 shrink-0 mt-0.5"
              />

              <div>

                <p className="text-sm text-red-200 font-medium">
                  Upload failed
                </p>

                <p className="text-xs text-red-300/70 mt-1">
                  {error}
                </p>

              </div>

            </div>

          )}


          {/* BUTTON */}

          <button
            type="button"
            disabled={
              uploading ||
              selectedFiles.length === 0
            }
            onClick={
              handleUpload
            }
            className="
              w-full
              mt-6
              h-12
              rounded-xl
              bg-lime-300
              text-black
              font-bold
              flex
              items-center
              justify-center
              gap-2
              transition
              disabled:opacity-30
              disabled:cursor-not-allowed
              hover:bg-lime-200
            "
          >

            {uploading ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Uploading...

              </>

            ) : (

              <>
                <Upload size={18} />

                Upload{" "}
                {selectedFiles.length > 0
                  ? `(${selectedFiles.length})`
                  : ""}
              </>

            )}

          </button>

        </div>

      </div>

    </div>
  );
}

export default UploadDropzone;