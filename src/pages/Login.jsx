import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08040f] text-white flex items-center justify-center p-6 relative overflow-hidden">

      {/* Neon background */}
      <div className="absolute w-96 h-96 bg-fuchsia-600/20 blur-[120px] rounded-full -top-32 -left-32" />

      <div className="absolute w-96 h-96 bg-lime-400/10 blur-[120px] rounded-full -bottom-32 -right-32" />

      {/* Main Card */}
      <div className="relative w-full max-w-6xl min-h-[650px] grid md:grid-cols-2 rounded-[28px] overflow-hidden border border-fuchsia-500/30 bg-[#10091c]/95 shadow-[0_0_60px_rgba(217,70,239,0.15)]">

        {/* Left */}
        <div className="relative p-10 md:p-14 flex flex-col justify-between bg-gradient-to-br from-[#170a27] via-[#10091c] to-[#090d0b] overflow-hidden">

          <div className="absolute -top-24 -left-24 w-72 h-72 border border-fuchsia-500/20 rounded-full" />

          <div className="absolute -top-16 -left-16 w-56 h-56 border border-lime-400/10 rounded-full" />

          <div className="relative">

            {/* Logo */}
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-lime-400/50 bg-lime-400/10 shadow-[0_0_25px_rgba(163,230,230,0.25)]">
                <span className="text-2xl">☁</span>
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-[0.18em]">
                  CloudNova
                </h1>

                <p className="text-[10px] tracking-[0.2em] text-fuchsia-400">
                  CLOUD STORAGE
                </p>
              </div>

            </div>

            <div className="mt-28">

              <p className="text-lime-300 text-sm tracking-[0.35em] font-semibold mb-5">
                YOUR DIGITAL SPACE
              </p>

              <h2 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
                YOUR FILES.
                <br />

                <span className="text-fuchsia-400">
                  YOUR SPACE.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-gray-400 leading-relaxed">
                Securely store, organize and access everything that matters
                to you from one powerful space.
              </p>

            </div>

          </div>

          {/* Features */}
          <div className="relative grid grid-cols-3 gap-3 mt-10">

            <div className="border border-white/10 rounded-xl p-4 bg-white/[0.03]">
              <p className="text-lime-300 text-xl mb-2">✦</p>
              <p className="text-xs text-gray-400">
                Secure
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-4 bg-white/[0.03]">
              <p className="text-fuchsia-400 text-xl mb-2">⚡</p>
              <p className="text-xs text-gray-400">
                Fast
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-4 bg-white/[0.03]">
              <p className="text-purple-400 text-xl mb-2">◆</p>
              <p className="text-xs text-gray-400">
                Private
              </p>
            </div>

          </div>

        </div>

        {/* Right */}
        <div className="bg-[#0d0715] p-8 md:p-14 flex items-center">

          <div className="w-full max-w-md mx-auto">

            <div className="mb-9">

              <p className="text-lime-300 text-xs tracking-[0.3em] font-semibold mb-3">
                WELCOME BACK
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Good to see you again.
              </h2>

              <p className="text-gray-500 mt-3">
                Sign in to continue to your workspace.
              </p>

            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-pink-400/30 bg-pink-400/10 px-4 py-3 text-sm text-pink-300">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="text-sm text-gray-300 mb-2 block">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 outline-none transition focus:border-fuchsia-400/70 focus:ring-2 focus:ring-fuchsia-400/10"
                />

              </div>

              {/* Password */}
              <div>

                <label className="text-sm text-gray-300 mb-2 block">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-gray-600 outline-none transition focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-lime-300 transition"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold tracking-wide text-black bg-lime-300 hover:bg-lime-200 transition shadow-[0_0_30px_rgba(163,230,53,0.25)] disabled:opacity-50"
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>

            </form>

            <div className="text-center mt-8">

              <span className="text-gray-500 text-sm">
                Don't have an account?{" "}
              </span>

              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-fuchsia-400 font-semibold text-sm hover:text-lime-300 transition"
              >
                Create one
              </button>

            </div>

            <div className="mt-10 flex items-center gap-3 text-gray-700">

              <div className="h-px bg-white/10 flex-1" />

              <span className="text-[10px] tracking-[0.25em]">
                CloudNova © 2026
              </span>

              <div className="h-px bg-white/10 flex-1" />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;