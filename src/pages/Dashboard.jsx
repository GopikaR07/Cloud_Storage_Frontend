import {
  useEffect,
  useMemo,
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
} from "lucide-react";

import FileCard from "../components/FileCard";
import FolderCard from "../components/FolderCard";
import Breadcrumbs from "../components/Breadcrumbs";

import {
  getCurrentUser,
  getFolder,
  getRootContents,
} from "../api";


function Dashboard() {

  const [user, setUser] = useState(null);

  const [folders, setFolders] = useState([]);

  const [files, setFiles] = useState([]);

  const [path, setPath] = useState([]);

  const [
    currentFolderId,
    setCurrentFolderId,
  ] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [active, setActive] =
    useState("dashboard");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const fileInputRef = useRef(null);


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


      setFiles(
        contents?.children?.files || []
      );


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

  const filteredFiles =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return files;
      }

      return files.filter(
        (file) =>
          (file.name || "")
            .toLowerCase()
            .includes(query)
      );

    }, [files, search]);


  const filteredFolders =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return folders;
      }

      return folders.filter(
        (folder) =>
          (folder.name || "")
            .toLowerCase()
            .includes(query)
      );

    }, [folders, search]);


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

      return;
    }
  }


  // ==========================================
  // UPLOAD
  // ==========================================

  function chooseUpload() {

    fileInputRef
      .current
      ?.click();
  }


  function handleUploadSelection(event) {

    const selected =
      event.target.files?.[0];

    if (!selected) {
      return;
    }


    alert(
      `"${selected.name}" selected. Upload will be connected on Day 10.`
    );


    event.target.value = "";
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

              <div className="min-h-[60vh] flex items-center justify-center">

                <div className="text-center max-w-md">

                  <div className="w-16 h-16 mx-auto rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/[0.06] flex items-center justify-center mb-5">

                    <Share2
                      size={28}
                      className="text-fuchsia-300"
                    />

                  </div>

                  <h1 className="text-2xl font-bold">
                    Shared Files
                  </h1>

                  <p className="text-gray-500 mt-3">
                    File sharing and permissions will be connected during Day 11.
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-gray-500">

                    Coming soon

                    <ChevronRight size={15} />

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
                          0 GB
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

                    <div className="h-full w-0 bg-gradient-to-r from-lime-300 to-fuchsia-400" />

                  </div>


                  <p className="text-xs text-gray-600 mt-3">
                    Storage usage will appear here.
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


                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={
                    handleUploadSelection
                  }
                />

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
                        {active === "folders"
                          ? "Folders"
                          : active === "search"
                          ? "Search Results"
                          : "My Files"}
                      </h2>

                      <p className="text-sm text-gray-600 mt-1">
                        Browse your folders and files
                      </p>

                    </div>


                    <div className="flex items-center gap-2">

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


                  {/* EMPTY */}

                  {!loading &&
                    !error &&

                    (
                      active === "folders"
                        ? filteredFolders.length === 0
                        : filteredFolders.length === 0 &&
                          filteredFiles.length === 0
                    ) && (

                    <div className="py-16 text-center">

                      <Cloud
                        size={38}
                        className="mx-auto text-gray-700 mb-4"
                      />

                      <p className="text-gray-300 font-medium">

                        {search
                          ? "No matching files or folders"
                          : active === "folders"
                          ? "No folders yet"
                          : "This folder is empty"}

                      </p>

                      <p className="text-sm text-gray-600 mt-2">

                        {search
                          ? "Try a different search term."
                          : "Your uploaded files and folders will appear here."}

                      </p>

                    </div>

                  )}


                  {/* DATA */}

                  {!loading &&
                    !error && (

                    <div className="space-y-8">


                      {/* FOLDERS */}

                      {filteredFolders.length > 0 && (

                        <section>

                          <h3 className="text-sm font-semibold text-gray-400 mb-3">
                            Folders
                          </h3>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

                            {filteredFolders.map(
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
                        filteredFiles.length > 0 && (

                        <section>

                          <h3 className="text-sm font-semibold text-gray-400 mb-3">
                            Files
                          </h3>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

                            {filteredFiles.map(
                              (file) => (

                                <FileCard
                                  key={
                                    file.id
                                  }
                                  file={
                                    file
                                  }
                                />

                              )
                            )}

                          </div>

                        </section>

                      )}

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;