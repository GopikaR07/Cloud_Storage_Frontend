import { Search } from "lucide-react";

function Header({
  userName,
  search,
  setSearch,
}) {
  return (
    <header className="min-h-[104px] px-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-white/10 bg-[#0b0612]/70">

      <div>

        <p className="text-lime-300 text-[11px] tracking-[0.3em] font-semibold mb-2">
          DASHBOARD
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome back, {userName || "there"} 👋
        </h2>

      </div>


      <div className="relative w-full sm:w-[280px]">

        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search files..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-fuchsia-400/50"
        />

      </div>

    </header>
  );
}

export default Header;