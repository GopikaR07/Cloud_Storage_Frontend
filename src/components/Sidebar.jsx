import {
  LayoutDashboard,
  Files,
  Folder,
  Share2,
  Search,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "files",
    label: "My Files",
    icon: Files,
  },
  {
    id: "folders",
    label: "Folders",
    icon: Folder,
  },
  {
    id: "shared",
    label: "Shared",
    icon: Share2,
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
  },
];

function Sidebar({
  active,
  onNavigate,
  onLogout,
}) {
  return (
    <aside className="w-[260px] shrink-0 min-h-screen bg-[#0b0612] border-r border-white/10 flex flex-col">

      {/* LOGO */}
      <div className="px-6 py-7 border-b border-white/10">

        <div className="flex items-center gap-3 min-w-0">

          <div className="w-11 h-11 shrink-0 rounded-xl border border-lime-300/50 bg-lime-300/10 flex items-center justify-center">

            <Folder
              size={23}
              className="text-lime-300"
            />

          </div>

          <div className="min-w-0">

            <h1 className="text-[27px] leading-none font-black text-white">
              CloudNova
            </h1>

            <p className="text-[9px] tracking-[0.3em] text-fuchsia-400 mt-2">
              CLOUD STORAGE
            </p>

          </div>

        </div>

      </div>


      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-1">

        {menuItems.map(
          ({
            id,
            label,
            icon: Icon,
          }) => {

            const selected =
              active === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  onNavigate(id)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                  selected
                    ? "bg-lime-300/10 border border-lime-300/25 text-lime-300"
                    : "border border-transparent text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >

                <Icon size={19} />

                <span className="text-sm font-medium">
                  {label}
                </span>

              </button>
            );
          }
        )}

      </nav>


      {/* LOGOUT */}
      <div className="p-4 border-t border-white/10">

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-fuchsia-300 hover:bg-fuchsia-400/[0.05] transition"
        >

          <LogOut size={19} />

          <span className="text-sm">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;