import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, BookHeart, Feather, Heart, Search, Sparkles, Trash2, WandSparkles } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const starterIdeas = [
  { icon: "✦", title: "Start somewhere small", text: "Every big dream begins with one tiny step." },
  { icon: "☼", title: "Make room for joy", text: "Your hobbies deserve a place in your everyday life." },
  { icon: "↗", title: "Share the journey", text: "Your story might inspire someone else's next step." }
];

function App() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", author: "", category: "dream" });
  const [notice, setNotice] = useState("");

  async function loadPosts() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (search.trim()) params.set("search", search.trim());
      const response = await fetch(`${API}/posts?${params.toString()}`);
      if (!response.ok) throw new Error("The posts could not be loaded.");
      setPosts(await response.json());
    } catch {
      setError("Couldn't connect to the server. Check that the backend and MongoDB are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPosts(); }, [category, search]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Your post could not be saved.");
      setForm({ title: "", description: "", author: "", category: "dream" });
      setCategory("all");
      setSearch("");
      setNotice("Your words are out in the world. Keep dreaming ✨");
      await loadPosts();
      document.getElementById("community")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Couldn't save your post. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(id) {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      const response = await fetch(`${API}/posts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setPosts(current => current.filter(post => post._id !== id));
    } catch {
      setError("Could not delete this post. Please try again.");
    }
  }

  const counts = useMemo(() => ({
    all: posts.length,
    dream: posts.filter(p => p.category === "dream").length,
    hobby: posts.filter(p => p.category === "hobby").length
  }), [posts]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="bg-orb left-[-100px] top-[100px] h-80 w-80 bg-violet-500" />
      <div className="bg-orb right-[-100px] top-[520px] h-96 w-96 bg-cyan-500" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="#" className="flex items-center gap-3" aria-label="DreamSpace home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-400 text-slate-950 shadow-glow"><Sparkles size={21} /></span>
          <span className="font-['Manrope'] text-xl font-extrabold tracking-tight">dreamspace<span className="text-violet-300">.</span></span>
        </a>
        <a href="#write" className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:border-violet-300/60 hover:bg-white/5">Share your dream <ArrowRight className="ml-1 inline" size={15} /></a>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:pb-28 md:pt-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[.18em] text-violet-200"><Sparkles size={14} /> A little space for big things</div>
            <h1 className="max-w-2xl font-['Manrope'] text-5xl font-extrabold leading-[1.08] tracking-[-.055em] sm:text-6xl lg:text-7xl">Your dreams deserve <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">to be written.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">A place to collect the things you want to become, the hobbies that make you feel alive, and the little ideas you don't want to forget.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#write" className="rounded-full bg-violet-300 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-violet-200">Write your story <ArrowRight className="ml-2 inline" size={17} /></a>
              <a href="#community" className="rounded-full border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:bg-white/5">Explore the wall <ArrowDown className="ml-2 inline" size={16} /></a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-sm text-slate-400"><span className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0c1020] bg-rose-300 text-xs">♡</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0c1020] bg-cyan-200 text-xs">✦</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0c1020] bg-amber-200 text-xs">☼</span></span><span>For every dreamer, maker, and curious mind.</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-violet-500/20 to-cyan-400/10 blur-2xl" />
            <div className="glass relative rounded-[2rem] p-5 shadow-glow sm:p-7">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-200">A note to your future self</p><p className="mt-2 font-['Manrope'] text-xl font-bold">One day, I want to…</p></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-300/15 text-violet-200"><Feather size={21} /></span></div>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><span className="text-xs font-semibold text-cyan-200">01 / DREAM</span><p className="mt-2 text-lg font-semibold">Build something that helps people</p><p className="mt-1 text-sm text-slate-400">A small idea can grow into something meaningful.</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><span className="text-xs font-semibold text-rose-200">02 / HOBBY</span><p className="mt-2 text-lg font-semibold">Learn to play the guitar</p><p className="mt-1 text-sm text-slate-400">Make time for what makes you feel like you.</p></div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400"><span>your story starts here</span><Heart size={16} className="text-rose-300" /></div>
            </div>
            <div className="absolute -right-3 -top-5 rotate-6 rounded-2xl border border-white/10 bg-[#1c2140] px-4 py-3 shadow-xl sm:-right-6"><span className="text-xl">✧</span><span className="ml-2 text-sm font-semibold">Keep going.</span></div>
          </div>
        </section>

        <section className="border-y border-white/[.07] bg-white/[.02]">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-9 sm:grid-cols-3 sm:px-8">
            {starterIdeas.map(item => <div key={item.title} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[.06] text-xl text-violet-200">{item.icon}</span><div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{item.text}</p></div></div>)}
          </div>
        </section>

        <section id="write" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-28">
          <div className="pt-2"><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-200">Make it real</p><h2 className="mt-4 font-['Manrope'] text-4xl font-extrabold tracking-tight sm:text-5xl">Put it into <span className="text-violet-300">words.</span></h2><p className="mt-5 max-w-md leading-7 text-slate-400">It doesn't have to be a perfect plan. Write about the dream you're chasing or the hobby you love. Start with what matters to you.</p><div className="mt-8 flex items-center gap-3 text-sm text-slate-400"><BookHeart size={20} className="text-violet-200" /> Your entry will appear on the community wall.</div></div>
          <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between"><h3 className="text-xl font-bold">Your little corner</h3><WandSparkles className="text-violet-200" size={22} /></div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">I'm sharing a…</label>
            <div className="mb-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setForm({...form, category:"dream"})} className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${form.category === "dream" ? "border-violet-300/70 bg-violet-300/15 text-violet-100" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>✧ A dream</button>
              <button type="button" onClick={() => setForm({...form, category:"hobby"})} className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${form.category === "hobby" ? "border-cyan-200/70 bg-cyan-200/10 text-cyan-100" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>♡ A hobby</button>
            </div>
            <label htmlFor="title" className="mb-2 block text-sm font-semibold">Give it a title</label>
            <input id="title" required maxLength={90} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder={form.category === "dream" ? "e.g. Become a game designer" : "e.g. Weekend photography"} className="mb-5 w-full rounded-xl border border-white/10 bg-[#0c1020]/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/70" />
            <label htmlFor="description" className="mb-2 block text-sm font-semibold">Tell us a little more</label>
            <textarea id="description" required maxLength={1200} rows={5} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Why does this matter to you? What would you love to do next?" className="mb-2 w-full resize-y rounded-xl border border-white/10 bg-[#0c1020]/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/70" />
            <div className="mb-5 text-right text-xs text-slate-500">{form.description.length}/1200</div>
            <label htmlFor="author" className="mb-2 block text-sm font-semibold">Your name <span className="font-normal text-slate-500">(optional)</span></label>
            <input id="author" maxLength={40} value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="What should we call you?" className="mb-6 w-full rounded-xl border border-white/10 bg-[#0c1020]/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/70" />
            {error && <p role="alert" className="mb-4 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200">{error}</p>}
            {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-200">{notice}</p>}
            <button disabled={saving} className="w-full rounded-xl bg-violet-300 px-5 py-4 font-extrabold text-slate-950 transition hover:bg-violet-200 disabled:cursor-wait disabled:opacity-60">{saving ? "Sharing your words…" : "Add to the wall ✨"}</button>
            <p className="mt-3 text-center text-xs leading-5 text-slate-500">Please don't include private details. Posts are visible to everyone who can access this site.</p>
          </form>
        </section>

        <section id="community" className="border-t border-white/[.07] bg-white/[.02]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-200">The community wall</p><h2 className="mt-3 font-['Manrope'] text-4xl font-extrabold tracking-tight sm:text-5xl">Little stories. <span className="text-violet-300">Big meaning.</span></h2><p className="mt-4 text-slate-400">Dreams and hobbies from people like you.</p></div><div className="flex flex-wrap gap-2">{[["all","Everything"],["dream","Dreams"],["hobby","Hobbies"]].map(([value,label])=><button key={value} onClick={()=>setCategory(value)} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${category===value?"border-violet-300 bg-violet-300 text-slate-950":"border-white/10 text-slate-300 hover:bg-white/5"}`}>{label}</button>)}</div></div>
            <div className="mt-8 flex max-w-md items-center gap-3 rounded-xl border border-white/10 bg-[#0c1020]/70 px-4"><Search size={18} className="shrink-0 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dreams, hobbies, people…" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600"/></div>
            {loading ? <div className="py-16 text-center text-slate-400">Gathering stories…</div> : posts.length === 0 ? <div className="mt-8 rounded-3xl border border-dashed border-white/15 px-6 py-16 text-center"><span className="text-4xl">✧</span><h3 className="mt-4 text-xl font-bold">This wall is waiting for a story.</h3><p className="mt-2 text-sm text-slate-400">{search ? "Try a different search." : "Be the first to share a dream or hobby."}</p><a href="#write" className="mt-5 inline-flex items-center gap-2 font-bold text-violet-200">Write the first one <ArrowRight size={16}/></a></div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{posts.map(post=><article key={post._id} className="group rounded-3xl border border-white/[.09] bg-[#11162a]/80 p-6 transition hover:-translate-y-1 hover:border-violet-300/30"><div className="flex items-start justify-between gap-3"><span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.14em] ${post.category==="dream"?"bg-violet-300/10 text-violet-200":"bg-cyan-200/10 text-cyan-100"}`}>{post.category==="dream"?"✧ Dream":"♡ Hobby"}</span><button onClick={()=>deletePost(post._id)} title="Delete post" aria-label={`Delete ${post.title}`} className="rounded-lg p-2 text-slate-600 opacity-60 transition hover:bg-rose-300/10 hover:text-rose-200 sm:opacity-0 sm:group-hover:opacity-100"><Trash2 size={16}/></button></div><h3 className="mt-5 break-words font-['Manrope'] text-xl font-bold leading-snug">{post.title}</h3><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">{post.description}</p><div className="mt-6 flex items-center justify-between border-t border-white/[.08] pt-4 text-xs text-slate-500"><span>by <span className="font-semibold text-slate-300">{post.author || "Dreamer"}</span></span><time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</time></div></article>)}</div>}
            <p className="mt-6 text-xs text-slate-500">Showing {posts.length} {posts.length === 1 ? "story" : "stories"} on this wall.</p>
          </div>
        </section>
      </main>
      <footer className="relative z-10 border-t border-white/[.07] px-5 py-8 text-center text-sm text-slate-500"><p className="font-['Manrope'] font-bold text-slate-300">dreamspace<span className="text-violet-300">.</span></p><p className="mt-2">Dream it. Write it. Take one small step.</p><p className="mt-4 text-xs">Deeloped by Rishi Malla</p></footer>
    </div>
  );
}

export default App;
