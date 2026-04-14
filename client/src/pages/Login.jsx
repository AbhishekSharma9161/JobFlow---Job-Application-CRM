import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { TextMarquee } from "../components/ui/TextMarquee";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 👋");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 p-12 relative overflow-hidden">

        {/* Background grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* HERO TEXT */}
        <div className="relative">

          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-xl">JobFlow</span>
          </div>

          {/* Animated Text */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: -30 },
                show: { opacity: 1, y: 0 }
              }}
              className="text-4xl font-extrabold text-white leading-tight mb-4"
            >
              Your career journey,
              <br />
              beautifully tracked.
            </motion.h1>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                show: { opacity: 1, y: 0 }
              }}
              className="text-white/70 text-lg flex items-center gap-2"
            >
              <span>Manage applications, follow-ups,</span>
              <TextMarquee
                height={40}
                speed={2}
                className="font-semibold text-white min-w-[200px"
              >
                <span>your job search</span>
                <span>pipeline tracking</span>
                <span>career growth</span>
                <span>all in one place</span>
              </TextMarquee>
            </motion.div>
          </motion.div>
        </div>

        {/* PREMIUM CARDS */}
       
  <div className="flex gap-5 animate-scroll w-max">

    {[
      ["📋", "Applications", "Track every job you apply to"],
      ["📊", "Analytics", "Visual insights on your search"],
      ["🔔", "Reminders", "Never miss a follow-up"],
      ["🗂️", "Kanban", "Visualize your pipeline"],
    ]
      .concat([
        ["📋", "Applications", "Track every job you apply to"],
        ["📊", "Analytics", "Visual insights on your search"],
        ["🔔", "Reminders", "Never miss a follow-up"],
        ["🗂️", "Kanban", "Visualize your pipeline"],
      ]) // duplicate for infinite effect
      .map(([icon, title, desc], i) => (
        <div
          key={i}
          className="min-w-[220px] p-5 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 
          hover:border-purple-400 hover:scale-[1.05] transition-all duration-300
          hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]"
        >
          <div className="text-2xl mb-3">{icon}</div>
          <p className="text-white font-semibold text-sm">{title}</p>
          <p className="text-white/60 text-xs mt-1">{desc}</p>
        </div>
      ))}
  </div>
</div>
{/* RIGHT PANEL */}
<div className="flex-1 flex items-center justify-center p-8">

  {/* GLASS CARD */}
  <div className="w-full max-w-md 
   bg-blue-200/40 backdrop-blur-xl
    border border-white/40 
    rounded-2xl shadow-xl 
    px-8 py-10 animate-fade-in">

    <div className="mb-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Sign in</h2>
      <p className="text-gray-600 text-sm">Welcome back to JobFlow</p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="label text-gray-700">Email</label>
        <input
          type="email"
          className="input bg-white/70 border border-gray-300 focus:border-purple-500"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="label text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            className="input pr-10 bg-white/70 border border-gray-300 focus:border-purple-500"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl 
        bg-gradient-to-r from-purple-600 to-indigo-600 
        text-white font-semibold 
        shadow-md hover:scale-[1.02] transition"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

    </form>

    <p className="mt-6 text-center text-sm text-gray-600">
      Don't have an account?{" "}
      <Link to="/register" className="text-purple-600 font-semibold hover:underline">
        Sign up
      </Link>
    </p>

  </div>
</div>
    </div>
  );
}