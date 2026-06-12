import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bot, Code2, Database, Play, Sparkles, Terminal, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent text-zinc-800 dark:text-zinc-100 flex flex-col items-center justify-start overflow-hidden transition-colors duration-300">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/5 dark:bg-red-500/10 blur-[120px] pointer-events-none transition-all" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[120px] pointer-events-none transition-all" />

      {/* Hero Section */}
      <div className="w-full max-w-6xl px-6 pt-20 pb-16 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-6 animate-pulse transition-all">
          <Sparkles className="w-3.5 h-3.5" />
          Next-Gen Browser IDE
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-red-500 to-pink-600 dark:from-rose-400 dark:via-red-400 dark:to-pink-400">
          VibeCode Editor
        </h1>
        <p className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-300 tracking-tight leading-[1.3] max-w-3xl mb-8 transition-colors duration-300">
          Vibe Code with AI-Powered Web Intelligence
        </p>
        <p className="text-base md:text-lg text-zinc-650 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed transition-colors duration-300">
          A full-featured, zero-latency browser IDE implementing containerized code runtimes,
          offline AI autocomplete suggestions, and multi-model code diagnostics.
        </p>

        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-500/20 dark:shadow-rose-950/30 border-0 h-12 px-6 transition-all duration-300">
              Launch Editor
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Visual Element */}
      <div className="w-full max-w-5xl px-6 mb-24 z-10">
        <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 p-2 shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent pointer-events-none" />
          {/* Mockup Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-zinc-500 font-mono">vibecode-workspace</span>
            <div className="w-10" />
          </div>
          {/* Mockup Image */}
          <div className="flex justify-center items-center py-10 bg-zinc-100/60 dark:bg-zinc-950/60 rounded-b-xl border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
            <Image
              src="/hero.svg"
              alt="Developer Workspace Screenshot"
              height={500}
              width={700}
              className="rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800/80 object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Tech Stack Analysis */}
      <div className="w-full max-w-6xl px-6 mb-28 z-10">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-4 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
          Core Architectural Tech Stack
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-center mb-12 max-w-xl mx-auto transition-colors duration-300">
          Built on a highly optimized tech stack that bridges frontend sandboxing with native-like performance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Core Tech Stack Cards */}
          <div className="flex flex-col p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/20 backdrop-blur-md transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 border border-rose-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">Frontend IDE</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Built with **React & Next.js App Router** for fluid, responsive server-rendered layout configurations. Employs the Monaco Editor for professional editing features, syntax configurations, and formatting capabilities.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">Next.js 16</span>
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">Monaco Editor</span>
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">TailwindCSS</span>
            </div>
          </div>

          <div className="flex flex-col p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/20 backdrop-blur-md transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 border border-purple-500/20">
              <Play className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">Browser Sandboxing</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Integrates WebContainers API to run Node.js processes directly within the browser tab. Sandboxed environment boots node modules, dev servers, and routes on the client side with zero server-side sandbox overhead.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">WebContainers</span>
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">xterm.js</span>
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">SharedArrayBuffer</span>
            </div>
          </div>

          <div className="flex flex-col p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/20 backdrop-blur-md transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">Data & Authentication</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Uses Prisma ORM connecting to a secure MongoDB database. Workspace states, file structures, and templates are persisted safely. Authentication is managed via secure NextAuth OAuth integrations.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">MongoDB</span>
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">Prisma Client</span>
              <span className="text-[10px] bg-zinc-250 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300">NextAuth OAuth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resume X-Y-Z Features Section */}
      <div className="w-full max-w-5xl px-6 mb-28 z-10">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-4 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
          Technical Accomplishments & Core Features
        </h2>
        <p className="text-zinc-650 dark:text-zinc-400 text-center mb-12 max-w-xl mx-auto transition-colors duration-300">
          Enabling developers to build, run, and scale applications in a unified, sandboxed workspace.
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/20 dark:bg-zinc-900/10 backdrop-blur-md hover:border-rose-500/30 dark:hover:border-rose-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 flex-shrink-0">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1 text-zinc-800 dark:text-zinc-200">
                  Containerized Client-Side Web Runtime
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">Accomplished</span> zero-latency code execution and dev server boots in-browser <span className="text-rose-600 dark:text-rose-400 font-semibold">as measured by</span> 0ms sandbox container creation latency <span className="text-rose-600 dark:text-rose-400 font-semibold">by doing</span> WebContainer API integration with SharedArrayBuffer memory sharing.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/20 dark:bg-zinc-900/10 backdrop-blur-md hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20 flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1 text-zinc-800 dark:text-zinc-200">
                  Offline Monacopilot Code Suggestion
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">Accomplished</span> fluid, native-feeling inline autocomplete suggestions <span className="text-purple-600 dark:text-purple-400 font-semibold">as measured by</span> immediate local completion triggers (less than 150ms response latency) <span className="text-purple-600 dark:text-purple-400 font-semibold">by doing</span> Monacopilot integration connected to a localized Ollama service.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/20 dark:bg-zinc-900/10 backdrop-blur-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1 text-zinc-800 dark:text-zinc-200">
                  Multi-Model Dialog Diagnostics
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Accomplished</span> deep, structured code diagnostic review and error fixing <span className="text-blue-600 dark:text-blue-400 font-semibold">as measured by</span> 4 specialized AI execution tasks (Review, Fix, Optimize, Chat) <span className="text-blue-600 dark:text-blue-400 font-semibold">by doing</span> multi-model selector routing connected directly to local model registries.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/20 dark:bg-zinc-900/10 backdrop-blur-md hover:border-pink-500/30 dark:hover:border-pink-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20 flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1 text-zinc-800 dark:text-zinc-200">
                  Secure OAuth User Workspace Orchestration
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  <span className="text-pink-600 dark:text-pink-400 font-semibold">Accomplished</span> private repository layout mapping and persistent code storage <span className="text-pink-600 dark:text-pink-400 font-semibold">as measured by</span> secure OAuth profile authorization and Prisma DB schema states <span className="text-pink-600 dark:text-pink-400 font-semibold">by doing</span> NextAuth session routing and MongoDB persistence integrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
