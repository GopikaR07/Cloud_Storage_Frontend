import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Cloud,
  HardDrive,
  Upload,
  FolderPlus,
  RefreshCw,
  AlertCircle,
  LayoutDashboard,
  Files,
  Folder,
  Share2,
  Search,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Download,
  
  Copy
} from "lucide-react";

import FileCard from "../components/FileCard";
import FolderCard from "../components/FolderCard";
import Breadcrumbs from "../components/Breadcrumbs";
import UploadDropzone from "../components/UploadDropzone";

import {
  getCurrentUser,
  getFolder,
  getFile,
  getRootContents,
  createPublicLink,
  getResourceShares,
updateShare,
deleteShare,
getPublicLinks,
deletePublicLink,
   getUserByEmail,
  shareResource,
  getSharedFiles,
  searchFiles,

} from "../api";


function Dashboard() {

  const [user, setUser] = useState(null);

  const [folders, setFolders] = useState([]);

  const [files, setFiles] = useState([]);

  const [path, setPath] = useState([]);
  const [storageUsed, setStorageUsed] = useState(0);

  const [
    currentFolderId,
    setCurrentFolderId,
  ] = useState(null);

  const [shareFile, setShareFile] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
const [shareRole, setShareRole] = useState("viewer");
const [sharing, setSharing] = useState(false);
const [shareMessage, setShareMessage] = useState("");

const [sharedFiles, setSharedFiles] = useState([]);
const [sharedLoading, setSharedLoading] = useState(false);
const [sharedError, setSharedError] = useState("");

const [resourceShares, setResourceShares] = useState([]);
const [loadingShares, setLoadingShares] = useState(false);

const [publicLink, setPublicLink] = useState("");
const [creatingPublicLink, setCreatingPublicLink] = useState(false);

const [publicLinkId, setPublicLinkId] = useState(null);

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [searchType, setSearchType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const searchCache = useRef(new Map());

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [active, setActive] =
    useState("dashboard");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const fileInputRef = useRef(null);

  const [showUpload, setShowUpload] =
  useState(false);

  const [previewFile, setPreviewFile] =
  useState(null);

    function openPreview(file) {
  setPreviewFile(file);
}

function openPreview(file) {
  setPreviewFile(file);
}

async function openSharedFile(file) {
  try {
    const response = await getFile(file.id);

    const url = response?.downloadUrl;

    if (!url) {
      throw new Error("File download URL was not returned.");
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  } catch (error) {

    console.error(
      "Open shared file error:",
      error
    );

    setShareMessage(
      error.message ||
      "Unable to open shared file."
    );
  }
}

async function openShare(file) {
  setShareFile(file);

  setShareMessage("");

  setPublicLink("");
  setPublicLinkId(null);

  setResourceShares([]);

  await loadResourceShares(file.id);

  try {
    const response = await getPublicLinks(
      "file",
      file.id
    );

    const links =
  response?.links || [];

if (links.length > 0) {
  const latestLink = links[0];

  setPublicLink(
    latestLink.link ||
    ""
  );

  setPublicLinkId(
    latestLink.id ||
    null
  );
}

  } catch (error) {

    console.error(
      "Load public links error:",
      error
    );
  }
}

  // ==========================================
  // LOAD ROOT
  // ==========================================

  async function loadRoot() {

    setLoading(true);
    setError("");

    try {

      const [
        currentUser,
        contents,
      ] = await Promise.all([

        getCurrentUser()
          .catch(() => null),

        getRootContents(),

      ]);


      setUser(
        currentUser?.user ||
        currentUser ||
        null
      );


      setFolders(
        contents?.children?.folders || []
      );


      

      const loadedFiles =
  contents?.children?.files || [];
  setFiles(loadedFiles);

const totalBytes = loadedFiles.reduce(
  (total, file) =>
    total +
    Number(
      file.size_bytes ||
      file.size ||
      file.file_size ||
      0
    ),
  0
);

setStorageUsed(totalBytes);


      setPath(
        contents?.path || []
      );


      setCurrentFolderId(
        contents?.folder?.id || null
      );

    } catch (err) {

      setError(
        err.message ||
        "Could not load your files."
      );

    } finally {

      setLoading(false);

    }
  }

  const loadResourceShares = async (fileId) => {
  try {
    setLoadingShares(true);

    const response = await getResourceShares(
      "file",
      fileId
    );

    setResourceShares(
      response?.shares ||
      response ||
      []
    );

  } catch (error) {
    console.error(
      "Failed to load shares:",
      error
    );

    setResourceShares([]);
  } finally {
    setLoadingShares(false);
  }
};

  async function loadSharedFiles() {
  setSharedLoading(true);
  setSharedError("");

  try {
    const response = await getSharedFiles();

    setSharedFiles(
      response?.files || []
    );

  } catch (error) {

    console.error(
      "Load shared files error:",
      error
    );

    setSharedError(
      error.message ||
      "Could not load shared files."
    );

  } finally {

    setSharedLoading(false);

  }
}

  // ==========================================
  // OPEN FOLDER
  // ==========================================

  async function openFolder(
    folder,
    nextPath = null
  ) {

    setLoading(true);
    setError("");

    try {

      const contents =
        await getFolder(folder.id);


      setFolders(
        contents?.children?.folders || []
      );


      setFiles(
        contents?.children?.files || []
      );


      setPath(
        nextPath || [
          ...path,
          {
            id: folder.id,
            name: folder.name,
          },
        ]
      );


      setCurrentFolderId(
        folder.id
      );

    } catch (err) {

      setError(
        err.message ||
        "Could not open this folder."
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadRoot();

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const isSearching = search.trim().length > 0;

  async function performSearch(query, page = 1, append = false) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      setSearchHasMore(false);
      setSearchError("");
      return;
    }

    const cacheKey = JSON.stringify({
      query: trimmedQuery.toLowerCase(),
      page,
      type: searchType,
      sort: sortBy,
      order: sortOrder,
    });

    if (searchCache.current.has(cacheKey)) {
      const cached = searchCache.current.get(cacheKey);

      setSearchResults((previous) =>
        append ? [...previous, ...cached.results] : cached.results
      );
      setSearchHasMore(cached.hasMore);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");

      const response = await searchFiles(trimmedQuery, {
        page,
        limit: 10,
        type: searchType,
        sort: sortBy,
        order: sortOrder,
      });

      searchCache.current.set(cacheKey, response);

      setSearchResults((previous) =>
        append
          ? [...previous, ...(response.results || [])]
          : response.results || []
      );
      setSearchHasMore(response.hasMore || false);

    } catch (error) {
      console.error("Search error:", error);
      setSearchError(error.message || "Search failed.");

      if (!append) {
        setSearchResults([]);
      }

    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setSearchResults([]);
      setSearchPage(1);
      setSearchHasMore(false);
      setSearchError("");
      return;
    }

    const timer = setTimeout(() => {
      setSearchPage(1);
      performSearch(query, 1, false);
    }, 300);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchType, sortBy, sortOrder]);

  async function loadMoreSearchResults() {
    if (searchLoading || !searchHasMore) {
      return;
    }

    const nextPage = searchPage + 1;

    await performSearch(search, nextPage, true);

    setSearchPage(nextPage);
  }

  const displayedSearchFolders = searchResults.filter(
    (item) => item.resource_type === "folder"
  );

  const displayedSearchFiles = searchResults.filter(
    (item) => item.resource_type === "file"
  );


  // ==========================================
  // USER
  // ==========================================

  const userName =
    user?.name ||
    user?.fullName ||
    user?.full_name ||
    user?.email?.split("@")[0] ||
    "there";


  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("jwt");

    window.location.href = "/login";
  }


  // ==========================================
  // SIDEBAR NAVIGATION
  // ==========================================

  function handleNavigation(id) {

    setActive(id);
    setMobileMenu(false);

    /*
      Dashboard:
      Show the main dashboard.
    */

    if (id === "dashboard") {

      setSearch("");

      loadRoot();

      return;
    }


    /*
      My Files:
      Show the file explorer.
    */

    if (id === "files") {

      setSearch("");

      loadRoot();

      return;
    }


    /*
      Folders:
      Show folders only.
    */

    if (id === "folders") {

      setSearch("");

      loadRoot();

      return;
    }


    /*
      Search:
      Focus the search bar.
    */

    if (id === "search") {

      setTimeout(() => {

        document
          .getElementById("cloudnova-search")
          ?.focus();

      }, 100);

      return;
    }


    /*
      Shared:
      Placeholder for Day 11.
    */

    if (id === "shared") {

  setSearch("");

  loadSharedFiles();

  return;
}
  }


  // ==========================================
  // UPLOAD
  // ==========================================

 function chooseUpload() {
  setShowUpload(true);
}



  // ==========================================
  // SIDEBAR ITEM
  // ==========================================

  function NavItem({
    id,
    label,
    icon: Icon,
  }) {

    const isActive =
      active === id;

    return (

      <button
        type="button"
        onClick={() =>
          handleNavigation(id)
        }
        className={`
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          text-left
          transition-all
          duration-200
          ${
            isActive
              ? "bg-lime-300/[0.09] text-lime-300 border border-lime-300/20"
              : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
          }
        `}
      >

        <Icon
          size={19}
          strokeWidth={1.8}
        />

        <span className="text-sm font-medium">
          {label}
        </span>

      </button>
    );
  }


  // ==========================================
  // SIDEBAR
  // ==========================================

  function SidebarContent() {

    return (

      <div className="h-full flex flex-col">

        {/* BRAND */}

        <div className="px-5 py-6 border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl border border-lime-300/30 bg-lime-300/[0.07] flex items-center justify-center">

              <Cloud
                size={22}
                className="text-lime-300"
              />

            </div>

            <div>

              <h1 className="text-xl font-black tracking-tight text-white">
                CloudNova
              </h1>

              <p className="text-[10px] text-fuchsia-400 tracking-[0.28em] font-semibold mt-1">
                CLOUD STORAGE
              </p>

            </div>

          </div>

        </div>


        {/* NAVIGATION */}

        <div className="flex-1 px-4 py-6 space-y-2">

          <NavItem
            id="dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
          />

          <NavItem
            id="files"
            label="My Files"
            icon={Files}
          />

          <NavItem
            id="folders"
            label="Folders"
            icon={Folder}
          />

          <NavItem
            id="shared"
            label="Shared"
            icon={Share2}
          />

          <NavItem
            id="search"
            label="Search"
            icon={Search}
          />

        </div>


        {/* USER / LOGOUT */}

        <div className="px-4 py-4 border-t border-white/10">

          <div className="px-3 py-3 mb-2">

            <p className="text-xs text-gray-600">
              Signed in as
            </p>

            <p className="text-sm text-gray-300 font-medium truncate mt-1">
              {userName}
            </p>

          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-300 hover:bg-red-400/[0.05] transition"
          >

            <LogOut size={18} />

            <span className="text-sm">
              Logout
            </span>

          </button>

        </div>

      </div>
    );
  }

   const STORAGE_LIMIT = 1024 * 1024 * 1024; // 1 GB

  const storagePercentage = Math.min(
    (storageUsed / STORAGE_LIMIT) * 100,
    100
  );

  function formatStorage(bytes) {
    if (bytes === 0) {
      return "0 GB";
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="min-h-screen bg-[#07040d] text-white">

      {/* =====================================
          DESKTOP SIDEBAR
      ====================================== */}

      <aside
        className="
          fixed
          left-0
          top-0
          bottom-0
          z-40
          hidden
          lg:block
          w-[260px]
          bg-[#090610]
          border-r
          border-white/10
        "
      >

        <SidebarContent />

      </aside>


      {/* =====================================
          MOBILE SIDEBAR
      ====================================== */}

      {mobileMenu && (

        <>

          <div
            className="
              fixed
              inset-0
              z-40
              bg-black/70
              lg:hidden
            "
            onClick={() =>
              setMobileMenu(false)
            }
          />

          <aside
            className="
              fixed
              left-0
              top-0
              bottom-0
              z-50
              w-[280px]
              bg-[#090610]
              border-r
              border-white/10
              lg:hidden
            "
          >

            <div className="absolute right-3 top-4">

              <button
                type="button"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="p-2 rounded-lg text-gray-500 hover:text-white"
              >

                <X size={20} />

              </button>

            </div>

            <SidebarContent />

          </aside>

        </>
      )}


      {/* =====================================
          MAIN AREA
      ====================================== */}

      <div className="lg:ml-[260px] min-h-screen">


        {/* ===================================
            HEADER
        ==================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            h-[86px]
            bg-[#07040d]/95
            backdrop-blur-xl
            border-b
            border-white/10
          "
        >

          <div
            className="
              h-full
              px-5
              sm:px-8
              flex
              items-center
              justify-between
              gap-5
            "
          >

            {/* LEFT */}

            <div className="flex items-center gap-4 min-w-0">

              <button
                type="button"
                onClick={() =>
                  setMobileMenu(true)
                }
                className="
                  lg:hidden
                  p-2.5
                  rounded-xl
                  border
                  border-white/10
                  text-gray-400
                "
              >

                <Menu size={20} />

              </button>


              <div className="min-w-0">

                <p className="text-[11px] text-lime-300 tracking-[0.3em] font-semibold">
                  DASHBOARD
                </p>

                <h2 className="text-lg sm:text-xl font-bold truncate mt-1">
                  Welcome back, {userName} 👋
                </h2>

              </div>

            </div>


            {/* SEARCH */}

            <div className="relative w-full max-w-[380px]">

              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-600
                "
              />

              <input
                id="cloudnova-search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search files and folders..."
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-fuchsia-400/25
                  bg-[#100b17]
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-fuchsia-400/60
                  transition
                "
              />

            </div>

          </div>

        </header>


        {/* ===================================
            PAGE CONTENT
        ==================================== */}

        <main className="px-5 sm:px-8 lg:px-10 py-8">

          <div className="max-w-[1400px] mx-auto">


            {/* =================================
                DASHBOARD INTRO
            ================================== */}

            {active === "dashboard" && (

              <div className="mb-8">

                <p className="text-lime-300 text-xs tracking-[0.28em] font-semibold mb-3">
                  YOUR DIGITAL SPACE
                </p>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">

                  Your files,{" "}

                  <span className="text-fuchsia-400">
                    your space.
                  </span>

                </h1>

                <p className="text-gray-500 mt-3">
                  Manage your files securely from one place.
                </p>

              </div>

            )}


            {/* =================================
                MY FILES / FOLDERS / SEARCH TITLE
            ================================== */}

            {active !== "dashboard" &&
              active !== "shared" && (

              <div className="mb-7">

                <p className="text-lime-300 text-xs tracking-[0.28em] font-semibold mb-2">
                  CLOUDNOVA
                </p>

                <h1 className="text-3xl sm:text-4xl font-black">

                  {active === "files" &&
                    "My Files"}

                  {active === "folders" &&
                    "Folders"}

                  {active === "search" &&
                    "Search"}

                </h1>

                <p className="text-gray-500 mt-2">

                  {active === "files" &&
                    "Browse all your stored files."}

                  {active === "folders" &&
                    "Browse and manage your folders."}

                  {active === "search" &&
                    "Find files and folders quickly."}

                </p>

              </div>

            )}


            {/* =================================
                SHARED PLACEHOLDER
            ================================== */}

            {active === "shared" && (

  <div className="mb-8">

    <div className="mb-7">

      <p className="text-lime-300 text-xs tracking-[0.28em] font-semibold mb-2">
        CLOUDNOVA
      </p>

      <h1 className="text-3xl sm:text-4xl font-black">
        Shared Files
      </h1>

      <p className="text-gray-500 mt-2">
        Files that have been shared with you.
      </p>

    </div>


    <div className="
      rounded-2xl
      border
      border-white/10
      bg-[#0d0717]
      overflow-hidden
    ">

      <div className="px-5 sm:px-7 py-5 border-b border-white/10">

        <h2 className="text-xl font-bold">
          Shared with me
        </h2>

        <p className="text-sm text-gray-600 mt-1">
          View and download files shared with your account.
        </p>

      </div>


      <div className="p-5 sm:p-7">

        {sharedLoading && (

          <div className="py-16 text-center text-gray-600">

            <RefreshCw
              size={22}
              className="mx-auto animate-spin mb-3"
            />

            Loading shared files...

          </div>

        )}


        {!sharedLoading && sharedError && (

          <div className="py-12 text-center">

            <AlertCircle
              size={26}
              className="mx-auto text-fuchsia-400 mb-3"
            />

            <p className="text-gray-300 font-medium">
              Could not load shared files
            </p>

            <p className="text-sm text-gray-600 mt-2">
              {sharedError}
            </p>

            <button
              type="button"
              onClick={loadSharedFiles}
              className="
                mt-5
                px-4
                py-2.5
                rounded-xl
                bg-lime-300
                text-black
                font-semibold
                text-sm
              "
            >
              Try again
            </button>

          </div>

        )}


        {!sharedLoading &&
          !sharedError &&
          sharedFiles.length === 0 && (

          <div className="py-16 text-center">

            <Share2
              size={38}
              className="mx-auto text-gray-700 mb-4"
            />

            <p className="text-gray-300 font-medium">
              No shared files yet
            </p>

            <p className="text-sm text-gray-600 mt-2">
              Files shared with you will appear here.
            </p>

          </div>

        )}


        {!sharedLoading &&
          !sharedError &&
          sharedFiles.length > 0 && (

          <div className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-3
          ">

            {sharedFiles.map((file) => (

              <div
                key={file.id}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  p-4
                  hover:border-lime-300/20
                  transition
                "
              >

                <div className="
                  w-12
                  h-12
                  rounded-xl
                  bg-fuchsia-400/[0.07]
                  border
                  border-fuchsia-400/15
                  flex
                  items-center
                  justify-center
                  mb-4
                ">

                  <Files
                    size={22}
                    className="text-fuchsia-300"
                  />

                </div>


                <p className="
                  text-sm
                  font-semibold
                  text-white
                  truncate
                ">
                  {file.name}
                </p>


                <p className="
                  text-xs
                  text-gray-600
                  mt-2
                ">
                  {file.role === "editor"
                    ? "Editor"
                    : "Viewer"}
                </p>


                {file.shared_by_email && (

                  <p className="
                    text-[11px]
                    text-gray-700
                    mt-1
                    truncate
                  ">
                    Shared by {file.shared_by_email}
                  </p>

                )}


                <button
                  type="button"
                  onClick={() => openSharedFile(file)}
                  className="
                    w-full
                    mt-4
                    py-2
                    rounded-lg
                    border
                    border-white/10
                    text-xs
                    text-gray-400
                    hover:text-lime-300
                    hover:border-lime-300/20
                    transition
                  "
                >
                  View File
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  </div>

)}


            {/* =================================
                DASHBOARD STORAGE
            ================================== */}

            {active === "dashboard" && (

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_290px] gap-5 mb-8">


                {/* STORAGE */}

                <div className="rounded-2xl border border-fuchsia-400/20 bg-[#10091b] p-6">

                  <div className="flex items-start justify-between gap-5">

                    <div>

                      <p className="text-sm text-gray-500">
                        Storage
                      </p>

                      <div className="mt-2 flex items-end gap-2">

                        <span className="text-4xl font-black">
                          {formatStorage(storageUsed)}
                        </span>

                        <span className="text-sm text-gray-600 mb-1">
                          / 1 GB
                        </span>

                      </div>

                    </div>


                    <div className="w-14 h-14 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/[0.07] flex items-center justify-center">

                      <HardDrive
                        size={24}
                        className="text-fuchsia-300"
                      />

                    </div>

                  </div>


                  <div className="mt-6 h-2 rounded-full bg-white/[0.05] overflow-hidden">

                    <div
    className="h-full bg-gradient-to-r from-lime-300 to-fuchsia-400 transition-all duration-500"
    style={{
      width: `${storagePercentage}%`,
    }}
  />
                  </div>


                  <p className="text-xs text-gray-600 mt-3">
  {storageUsed === 0
    ? "No storage used yet."
    : `${storagePercentage.toFixed(1)}% of your 1 GB storage used.`}
</p>

                </div>


                {/* UPLOAD */}

                <button
                  type="button"
                  onClick={chooseUpload}
                  className="
                    min-h-[180px]
                    rounded-2xl
                    border
                    border-lime-300/25
                    bg-lime-300/[0.025]
                    hover:bg-lime-300/[0.05]
                    hover:border-lime-300/45
                    transition
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >

                  <div className="w-14 h-14 rounded-2xl border border-lime-300/30 bg-lime-300/[0.08] flex items-center justify-center mb-4">

                    <Upload
                      size={25}
                      className="text-lime-300"
                    />

                  </div>

                  <p className="font-bold">
                    Upload Files
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Add files to your cloud
                  </p>

                </button>


                

              </div>

            )}


            {/* =================================
                FILE EXPLORER
            ================================== */}

            {active !== "shared" && (

              <div className="rounded-2xl border border-white/10 bg-[#0d0717] overflow-hidden">


                {/* EXPLORER HEADER */}

                <div className="px-5 sm:px-7 py-5 border-b border-white/10">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div>

                      <h2 className="text-xl font-bold">
                        {isSearching
                          ? "Search Results"
                          : active === "folders"
                          ? "Folders"
                          : "My Files"}
                      </h2>

                      <p className="text-sm text-gray-600 mt-1">
                        Browse your folders and files
                      </p>

                    </div>


                    <div className="flex items-center gap-2 flex-wrap">

                      {isSearching && (
                        <>
                          <select
                            value={searchType}
                            onChange={(e) => {
                              setSearchType(e.target.value);
                              setSearchPage(1);
                            }}
                            className="
                              h-10
                              rounded-xl
                              border
                              border-white/10
                              bg-[#100b17]
                              px-3
                              text-sm
                              text-gray-300
                              outline-none
                            "
                          >
                            <option value="all">All</option>
                            <option value="file">Files</option>
                            <option value="folder">Folders</option>
                          </select>

                          <select
                            value={sortBy}
                            onChange={(e) => {
                              setSortBy(e.target.value);
                              setSearchPage(1);
                            }}
                            className="
                              h-10
                              rounded-xl
                              border
                              border-white/10
                              bg-[#100b17]
                              px-3
                              text-sm
                              text-gray-300
                              outline-none
                              focus:border-fuchsia-400/40
                            "
                          >
                            <option value="name">Name</option>
                            <option value="size">Size</option>
                            <option value="date">Date</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setSortOrder(
                                sortOrder === "asc" ? "desc" : "asc"
                              );
                              setSearchPage(1);
                            }}
                            className="
                              h-10
                              px-3
                              rounded-xl
                              border
                              border-white/10
                              text-sm
                              text-gray-400
                              hover:text-lime-300
                              hover:border-lime-300/25
                              transition
                            "
                          >
                            {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={loadRoot}
                        className="
                          p-2.5
                          rounded-xl
                          border
                          border-white/10
                          text-gray-500
                          hover:text-lime-300
                          hover:border-lime-300/25
                          transition
                        "
                        title="Refresh"
                      >

                        <RefreshCw
                          size={17}
                        />

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "Create folder will be implemented in the file-management step."
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          px-3.5
                          py-2.5
                          rounded-xl
                          border
                          border-fuchsia-400/20
                          text-fuchsia-300
                          hover:bg-fuchsia-400/[0.06]
                          transition
                        "
                      >

                        <FolderPlus
                          size={17}
                        />

                        <span className="text-sm">
                          New Folder
                        </span>

                      </button>

                    </div>

                  </div>


                  {/* BREADCRUMBS */}

                  <div className="mt-5">

                    <Breadcrumbs
                      path={path}
                      onHome={loadRoot}
                      onFolder={(
                        item,
                        index
                      ) => {

                        const nextPath =
                          path.slice(
                            0,
                            index + 1
                          );

                        openFolder(
                          item,
                          nextPath
                        );

                      }}
                    />

                  </div>

                </div>


                {/* CONTENT */}

                <div className="p-5 sm:p-7">


                  {/* LOADING */}

                  {loading && (

                    <div className="py-16 text-center text-gray-600">

                      <RefreshCw
                        size={22}
                        className="mx-auto animate-spin mb-3"
                      />

                      Loading your files...

                    </div>

                  )}


                  {/* ERROR */}

                  {!loading &&
                    error && (

                    <div className="py-12 text-center">

                      <AlertCircle
                        size={26}
                        className="mx-auto text-fuchsia-400 mb-3"
                      />

                      <p className="text-gray-300 font-medium">
                        Could not load files
                      </p>

                      <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={loadRoot}
                        className="mt-5 px-4 py-2.5 rounded-xl bg-lime-300 text-black font-semibold text-sm"
                      >
                        Try again
                      </button>

                    </div>

                  )}


                  {/* SEARCHING */}

                  {isSearching &&
                    searchLoading &&
                    searchResults.length === 0 && (

                    <div className="py-16 text-center text-gray-600">

                      <RefreshCw
                        size={22}
                        className="mx-auto animate-spin mb-3"
                      />

                      Searching your files...

                    </div>

                  )}


                  {/* SEARCH ERROR */}

                  {isSearching &&
                    !searchLoading &&
                    searchError && (

                    <div className="py-12 text-center">

                      <AlertCircle
                        size={26}
                        className="mx-auto text-fuchsia-400 mb-3"
                      />

                      <p className="text-gray-300 font-medium">
                        Search failed
                      </p>

                      <p className="text-sm text-gray-600 mt-2">
                        {searchError}
                      </p>

                    </div>

                  )}


                  {/* EMPTY */}

                  {!loading &&
                    !error &&
                    !searchError &&

                    (
                      isSearching
                        ? (
                            !searchLoading &&
                            searchResults.length === 0
                          )
                        : (
                            active === "folders"
                              ? folders.length === 0
                              : folders.length === 0 &&
                                files.length === 0
                          )
                    ) && (

                    <div className="py-16 text-center">

                      <Cloud
                        size={38}
                        className="mx-auto text-gray-700 mb-4"
                      />

                      <p className="text-gray-300 font-medium">

                        {isSearching
                          ? "No matching files or folders"
                          : active === "folders"
                          ? "No folders yet"
                          : "This folder is empty"}

                      </p>

                      <p className="text-sm text-gray-600 mt-2">

                        {isSearching
                          ? "Try a different search term."
                          : "Your uploaded files and folders will appear here."}

                      </p>

                    </div>

                  )}


                  {/* DATA */}

                  {!loading &&
                    !error &&
                    !searchError &&
                    !(isSearching && searchLoading && searchResults.length === 0) && (

                    <div className="space-y-8">

                      {isSearching ? (

                        <>

                          {/* SEARCH FOLDERS */}

                          {displayedSearchFolders.length > 0 && (

                            <section>

                              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                                Folders
                              </h3>

                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

                                {displayedSearchFolders.map(
                                  (folder) => (

                                    <FolderCard
                                      key={folder.id}
                                      folder={folder}
                                      onOpen={openFolder}
                                    />

                                  )
                                )}

                              </div>

                            </section>

                          )}


                          {/* SEARCH FILES */}

                          {displayedSearchFiles.length > 0 && (

                            <section>

                              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                                Files
                              </h3>

                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

                                {displayedSearchFiles.map(
                                  (file) => (

                                    <FileCard
                                      key={file.id}
                                      file={file}
                                      onPreview={openPreview}
                                      onShare={openShare}
                                    />

                                  )
                                )}

                              </div>

                            </section>

                          )}


                          {/* LOAD MORE */}

                          {searchResults.length > 0 &&
                            searchHasMore && (

                            <div className="flex justify-center pt-4">

                              <button
                                type="button"
                                onClick={loadMoreSearchResults}
                                disabled={searchLoading}
                                className="
                                  px-5
                                  py-2.5
                                  rounded-xl
                                  border
                                  border-white/10
                                  text-sm
                                  text-gray-300
                                  hover:text-lime-300
                                  hover:border-lime-300/25
                                  disabled:opacity-50
                                  transition
                                "
                              >
                                {searchLoading ? "Loading..." : "Load more"}
                              </button>

                            </div>

                          )}

                        </>

                      ) : (

                        <>

                          {/* FOLDERS */}

                          {folders.length > 0 && (

                            <section>

                              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                                Folders
                              </h3>

                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

                                {folders.map(
                                  (folder) => (

                                    <FolderCard
                                      key={
                                        folder.id
                                      }
                                      folder={
                                        folder
                                      }
                                      onOpen={
                                        openFolder
                                      }
                                    />

                                  )
                                )}

                              </div>

                            </section>

                          )}


                          {/* FILES */}

                          {active !== "folders" &&
                            files.length > 0 && (

                            <section>

                              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                                Files
                              </h3>

                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

                                {files.map(
                                  (file) => (

                                    <FileCard
                                      key={
                                        file.id
                                      }
                                      file={
                                        file
                                      }
                                        onPreview={openPreview}
                                        onShare={openShare}
                                    />

                                  )
                                )}

                              </div>

                            </section>

                          )}

                        </>

                      )}

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

        </main>

      </div>
     

    {showUpload && (
      <UploadDropzone
        folderId={currentFolderId}
        onClose={() => setShowUpload(false)}
        onUploadComplete={async () => {
          await loadRoot();
        }}
      />
    )}

    {previewFile && (

  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">

    {/* BACKDROP */}

    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onClick={() =>
        setPreviewFile(null)
      }
    />


    {/* MODAL */}

    <div className="
      relative
      w-full
      max-w-5xl
      max-h-[90vh]
      rounded-3xl
      border
      border-white/10
      bg-[#0d0717]
      shadow-2xl
      overflow-hidden
      flex
      flex-col
    ">


      {/* HEADER */}

      <div className="
        px-5
        py-4
        border-b
        border-white/10
        flex
        items-center
        justify-between
        gap-4
      ">

        <div className="min-w-0">

          <h2 className="font-semibold text-white truncate">
            {previewFile.name}
          </h2>

          <p className="text-xs text-gray-600 mt-1">
            File preview
          </p>

        </div>


        <div className="flex items-center gap-2">

          {previewFile.url && (

            <a
              href={previewFile.url}
              target="_blank"
              rel="noreferrer"
              download
              className="
                p-2.5
                rounded-xl
                border
                border-white/10
                text-gray-500
                hover:text-lime-300
                transition
              "
              title="Download"
            >

              <Download
                size={18}
              />

            </a>

          )}


          <button
            type="button"
            onClick={() =>
              setPreviewFile(null)
            }
            className="
              p-2.5
              rounded-xl
              border
              border-white/10
              text-gray-500
              hover:text-white
              transition
            "
          >

            <X size={19} />

          </button>

        </div>

      </div>


      {/* PREVIEW */}

      <div className="
        flex-1
        min-h-[400px]
        max-h-[75vh]
        overflow-auto
        flex
        items-center
        justify-center
        bg-black/20
        p-5
      ">


        {/* IMAGE */}

        {(
          previewFile.mime_type ||
          previewFile.mimeType ||
          ""
        ).startsWith("image/") &&
        previewFile.url && (

          <img
            src={previewFile.url}
            alt={previewFile.name}
            className="
              max-w-full
              max-h-[68vh]
              object-contain
              rounded-xl
            "
          />

        )}


        {/* PDF */}

        {(
          previewFile.mime_type ===
            "application/pdf" ||
          previewFile.mimeType ===
            "application/pdf" ||
          previewFile.name
            ?.toLowerCase()
            .endsWith(".pdf")
        ) &&
        previewFile.url && (

          <iframe
            src={previewFile.url}
            title={previewFile.name}
            className="
              w-full
              h-[68vh]
              rounded-xl
              border
              border-white/10
              bg-white
            "
          />

        )}


        {/* TEXT */}

        {(
          previewFile.mime_type ||
          previewFile.mimeType ||
          ""
        ).startsWith("text/") &&
        previewFile.url && (

          <iframe
            src={previewFile.url}
            title={previewFile.name}
            className="
              w-full
              h-[68vh]
              rounded-xl
              border
              border-white/10
              bg-[#10091a]
            "
          />

        )}


        {/* OTHER */}

        {!previewFile.url && (

          <div className="text-center">

            <div className="
              w-20
              h-20
              mx-auto
              rounded-3xl
              bg-fuchsia-400/[0.07]
              border
              border-fuchsia-400/15
              flex
              items-center
              justify-center
              mb-5
            ">

              <Files
                size={32}
                className="text-fuchsia-300"
              />

            </div>

            <p className="text-gray-300 font-semibold">
              Preview unavailable
            </p>

            <p className="text-sm text-gray-600 mt-2">
              This file does not have a preview URL yet.
            </p>

          </div>

        )}

      </div>

    </div>

  </div>

)}
    {shareFile && (

  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">

    {/* BACKDROP */}

    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onClick={() =>
        setShareFile(null)
      }
    />

    {/* MODAL */}

    <div
      className="
        relative
        w-full
        max-w-lg
        rounded-3xl
        border
        border-white/10
        bg-[#0d0717]
        shadow-2xl
        overflow-hidden
      "
    >

      {/* HEADER */}

      <div className="
        px-6
        py-5
        border-b
        border-white/10
        flex
        items-center
        justify-between
      ">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <Share2
              size={19}
              className="text-lime-300"
            />

            <h2 className="text-xl font-bold text-white">
              Share File
            </h2>

          </div>

          <p className="text-sm text-gray-500 mt-1 truncate">
            {shareFile.name}
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            setShareFile(null)
          }
          className="
            p-2
            rounded-xl
            text-gray-500
            hover:text-white
            hover:bg-white/[0.05]
          "
        >
          <X size={19} />
        </button>

      </div>


      {/* BODY */}

      <div className="p-6">

        {/* EMAIL */}

        <label className="
          block
          text-sm
          font-medium
          text-gray-300
          mb-2
        ">
          Share with
        </label>

        <input
  type="email"
  value={shareEmail}
  onChange={(e) =>
    setShareEmail(e.target.value)
  }
  placeholder="Enter user's email"
  className="
    w-full
    h-12
    rounded-xl
    border
    border-white/10
    bg-white/[0.03]
    px-4
    text-sm
    text-white
    placeholder:text-gray-700
    outline-none
    focus:border-lime-300/30
  "
/>



        {/* PERMISSION */}

        <label className="
          block
          text-sm
          font-medium
          text-gray-300
          mt-5
          mb-2
        ">
          Permission
        </label>

        <select
          value={shareRole}
  onChange={(e) =>
    setShareRole(e.target.value)
  }
          className="
            w-full
            h-12
            rounded-xl
            border
            border-white/10
            bg-[#120b1c]
            px-4
            text-sm
            text-gray-300
            outline-none
            focus:border-lime-300/30
          "
        >

          <option value="viewer">
            Viewer — can view and download
          </option>

          <option value="editor">
            Editor — can modify
          </option>

        </select>


        {/* SHARE BUTTON */}

        <button
  type="button"
  disabled={sharing}
  onClick={async () => {
  try {
    const email = shareEmail.trim();

    if (!email) {
      setShareMessage("Please enter an email address.");
      return;
    }

    setSharing(true);
    setShareMessage("");

    // 1. Find the user using their email
    const userResponse =
      await getUserByEmail(email);

    const granteeUserId =
      userResponse?.user?.id;

    if (!granteeUserId) {
      throw new Error("User not found.");
    }

    // 2. Create the share
    await shareResource(
      "file",
      shareFile.id,
      granteeUserId,
      shareRole
    );

    await loadResourceShares(shareFile.id);

    setShareMessage(
      `File shared successfully with ${email}`
    );

    setShareEmail("");

  } catch (error) {

    console.error("Share error:", error);

    setShareMessage(
      error.message ||
      "Failed to share file."
    );

  } finally {

    setSharing(false);

  }
}}
  className="
    w-full
    h-12
    mt-6
    rounded-xl
    bg-lime-300
    text-black
    font-bold
    flex
    items-center
    justify-center
    gap-2
    hover:bg-lime-200
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  <Share2 size={18} />

  {sharing ? "Sharing..." : "Share File"}
</button>

{shareMessage && (
  <p className="mt-3 text-sm text-gray-400 text-center">
    {shareMessage}
  </p>
)}

<div className="mt-6">

  <p className="text-sm font-medium text-gray-300">
    People with access
  </p>

  {loadingShares ? (
    <p className="text-xs text-gray-500 mt-3">
      Loading...
    </p>
  ) : resourceShares.length === 0 ? (
    <p className="text-xs text-gray-500 mt-3">
      No one else has access yet.
    </p>
  ) : (
    <div className="mt-3 space-y-2">

      {resourceShares.map((share) => (
        <div
          key={share.id}
          className="
            flex
            items-center
            justify-between
            gap-3
            rounded-xl
            border
            border-white/10
            bg-white/[0.03]
            p-3
          "
        >

          <div className="min-w-0">
            <p className="text-sm text-gray-300 truncate">
              {share.email ||
               share.granteeEmail ||
               share.user?.email ||
               "Shared user"}
            </p>

            <p className="text-xs text-gray-600 mt-1">
              {share.role}
            </p>
          </div>

          <div className="flex items-center gap-2">

            <select
              value={share.role}
              onChange={async (e) => {
                try {
                  const newRole = e.target.value;

                  await updateShare(
                    share.id,
                    newRole
                  );

                  await loadResourceShares(
                    shareFile.id
                  );

                } catch (error) {
                  console.error(
                    "Update share error:",
                    error
                  );

                  setShareMessage(
                    error.message ||
                    "Failed to update permission."
                  );
                }
              }}
              className="
                rounded-lg
                border
                border-white/10
                bg-[#120b1c]
                px-2
                py-2
                text-xs
                text-gray-300
                outline-none
              "
            >
              <option value="viewer">
                Viewer
              </option>

              <option value="editor">
                Editor
              </option>
            </select>

            <button
              type="button"
              onClick={async () => {
                try {
                  await deleteShare(share.id);

                  await loadResourceShares(
                    shareFile.id
                  );

                  setShareMessage(
                    "Access removed."
                  );

                } catch (error) {
                  console.error(
                    "Delete share error:",
                    error
                  );

                  setShareMessage(
                    error.message ||
                    "Failed to remove access."
                  );
                }
              }}
              className="
                rounded-lg
                px-2
                py-2
                text-xs
                text-red-300
                hover:bg-red-400/10
              "
            >
              Remove
            </button>

          </div>

        </div>
      ))}

    </div>
  )}

</div>


        {/* DIVIDER */}

        <div className="
          flex
          items-center
          gap-3
          my-6
        ">

          <div className="flex-1 h-px bg-white/10" />

          <span className="text-xs text-gray-600">
            OR
          </span>

          <div className="flex-1 h-px bg-white/10" />

        </div>


        {/* PUBLIC LINK */}

        <div>

          <p className="text-sm font-medium text-gray-300">
            Public link
          </p>

          <p className="text-xs text-gray-600 mt-1">
            Create a link that can be shared with anyone.
          </p>

          <button
  type="button"
  disabled={creatingPublicLink}
  onClick={async () => {
    try {
      if (!shareFile?.id) {
        setShareMessage("No file selected.");
        return;
      }

      setCreatingPublicLink(true);
      setShareMessage("");

      const response = await createPublicLink(
        "file",
        shareFile.id
      );

      const link =
        response?.link ||
        response?.publicLink ||
        response?.url;

      if (!link) {
        throw new Error("Public link was not returned.");
      }

      setPublicLink(link);

      setPublicLinkId(
  response?.share?.id || null
);
      setShareMessage("Public link created successfully.");
    } catch (error) {
      console.error("Public link error:", error);

      setShareMessage(
        error.message || "Failed to create public link."
      );
    } finally {
      setCreatingPublicLink(false);
    }
  }}
  className="
    w-full
    h-11
    mt-3
    rounded-xl
    border
    border-fuchsia-400/20
    bg-fuchsia-400/[0.05]
    text-fuchsia-200
    text-sm
    font-semibold
    hover:bg-fuchsia-400/[0.1]
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  {creatingPublicLink
    ? "Creating link..."
    : "Create public link"}
</button>

{publicLink && (
  <div className="mt-4 space-y-3">

    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-gray-500 mb-2">
        Public link
      </p>

      <p className="text-sm text-gray-300 break-all">
        {publicLink}
      </p>
    </div>

    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(publicLink);
          setShareMessage("Link copied to clipboard.");
        } catch (error) {
          console.error("Copy error:", error);
          setShareMessage("Failed to copy link.");
        }
      }}
      className="
        w-full
        h-10
        rounded-xl
        border
        border-white/10
        bg-white/[0.03]
        text-gray-300
        text-sm
        font-semibold
        hover:bg-white/[0.08]
        transition
      "
    >
      Copy link
    </button>

    {publicLinkId && (
  <button
    type="button"
    onClick={async () => {
      try {
        await deletePublicLink(
          publicLinkId
        );

        setPublicLink("");
        setPublicLinkId(null);

        setShareMessage(
          "Public link revoked."
        );

      } catch (error) {
        console.error(
          "Revoke public link error:",
          error
        );

        setShareMessage(
          error.message ||
          "Failed to revoke public link."
        );
      }
    }}
    className="
      w-full
      h-10
      rounded-xl
      border
      border-red-400/20
      bg-red-400/[0.05]
      text-red-300
      text-sm
      font-semibold
      hover:bg-red-400/[0.1]
      transition
    "
  >
    Revoke public link
  </button>
)}

  </div>
)}


        </div>

      </div>

    </div>

  </div>

)}

    </div>
  );
}

export default Dashboard;