/*
LearnHubDashboard.tsx
- Single-file React component (default export) that reproduces the provided dashboard UI using Tailwind CSS.
- Drop this file into a Vite + React + TypeScript project (created with `npm create vite@latest myapp --template react-ts`) with Tailwind configured.
- The header logo uses the uploaded image at: /mnt/data/32313105-18c4-40ec-b5aa-c0f0a058430b.png
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "@/utils/auth";
import { listS3Objects, S3ObjectInfo } from '@/services/s3';
import { toast } from 'sonner';
import { DownloadCloud, RefreshCw, FileText, ExternalLink, Lock } from 'lucide-react';

// Type definitions
interface StatItem {
  title: string;
  value: string | number;
  icon: () => JSX.Element;
  color: string;
}

interface CourseItem {
  title: string;
  desc: string;
  progress: number;
  hours: string;
  accent: string;
}

export default function LearnHubDashboard(): JSX.Element {
  const navigate = useNavigate();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(s?: string) {
    if (!s) return 'Unknown';
    try {
      const d = new Date(s);
      return d.toLocaleString();
    } catch {
      return s;
    }
  }
  const user = getUser();
  const displayName = user?.name || user?.id || 'Guest';
  const displayEmail = user?.email || 'guest@example.com';
  const roleLabel = user?.userType ? (user.userType.charAt(0).toUpperCase() + user.userType.slice(1)) : 'Guest';
  const avatarLetter = (user?.name || user?.id || 'G')[0].toUpperCase();
  const stats: StatItem[] = [
    { title: "Courses Enrolled", value: "4", icon: BookIcon, color: "bg-blue-600" },
    { title: "Hours Learned", value: "18.5", icon: ClockIcon, color: "bg-orange-500" },
    { title: "Completed", value: "1", icon: TargetIcon, color: "bg-green-500" },
    { title: "Average Progress", value: "44%", icon: SparklineIcon, color: "bg-blue-600" },
  ];

  const courses: CourseItem[] = [
    {
      title: "Introduction to Web Development",
      desc: "Learn HTML, CSS, and JavaScript fundamentals to build modern websites",
      progress: 65,
      hours: "8 hours",
      accent: "border-blue-500",
    },
    {
      title: "Advanced React Patterns",
      desc: "Master advanced React concepts including hooks, context, and performance optimization",
      progress: 30,
      hours: "12 hours",
      accent: "border-orange-400",
    },
    {
      title: "Database Design & SQL",
      desc: "Design efficient databases and write complex SQL queries",
      progress: 80,
      hours: "10 hours",
      accent: "border-green-400",
    },
  ];

  const [s3Files, setS3Files] = React.useState<S3ObjectInfo[] | null>(null);
  const [loadingS3, setLoadingS3] = React.useState(false);
  const filesRef = React.useRef<HTMLDivElement | null>(null);
  const [filesMounted, setFilesMounted] = React.useState(false);

  const fetchS3 = async () => {
    setLoadingS3(true);
    setS3Files(null);
    setFilesMounted(false);
    try {
      const files = await listS3Objects();
      setS3Files(files);
      // Wait a tick, then animate files and scroll into view
      setTimeout(() => {
        setFilesMounted(true);
        const el = filesRef.current;
        if (el && typeof el.scrollIntoView === 'function') {
          try {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (e) {
            // ignore scroll errors
            console.warn('scrollIntoView failed', e);
          }
        }
      }, 80);
      if (!files.length) {
        toast('No files found in the configured S3 bucket');
      }
    } catch (err: unknown) {
      console.error('Failed to list S3 objects', err);
      const msg = err instanceof Error ? err.message : String(err);
      try { toast(msg); } catch { console.error(msg); }
    } finally {
      setLoadingS3(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-slate-200">

      {/* Top Navigation - restored with logo and cyber styling */}
      <header className="bg-card/60 backdrop-blur-sm border-b border-border fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="../img.png" alt="logo" className="w-12 h-12 rounded-md object-cover" />
            <div>
              <div className="text-lg font-semibold font-mono cyber-glow">LearnHub</div>
              <div className="text-xs text-muted-foreground">Student Portal</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
              <button className="p-2 rounded-full hover:bg-card/40">🔔</button>
              <button className="p-2 rounded-full hover:bg-card/40">⚙️</button>
              <div className="text-right">
                <div className="font-medium font-mono">{roleLabel}</div>
                <div className="text-xs text-muted-foreground">{displayEmail}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                {avatarLetter}
              </div>
              <button onClick={handleLogout} className="ml-2 text-sm text-red-500 hover:underline font-mono">Logout</button>
            </div>

            <div className="sm:hidden">
              <button className="p-2">☰</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content (no centered card container) */}
      <main className="pt-28 max-w-7xl mx-auto px-6 lg:px-8 pb-20">

        <section className={`mb-8 transition-all duration-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl font-bold cyber-glow font-mono">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground mt-2">Continue your learning journey</p>
        </section>

        {/* Stats row */}
        <section className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10`}> 
          {stats.map((s, i) => (
            <div
              key={i}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`bg-card rounded-xl shadow-sm border p-5 flex items-center gap-4 transition-all duration-500 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className={`p-3 rounded-lg text-white ${s.color}`}>
                <s.icon />
              </div>
              <div className="flex-1">
                <div className="text-sm font-mono text-sky-200">{s.title}</div>
                <div className="text-2xl font-semibold mt-1 text-sky-300">{s.value}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Courses + fetch button */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold mb-6">Your Courses</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchS3}
                aria-label="Fetch all files from S3"
                disabled={loadingS3}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-primary-foreground font-mono font-semibold shadow-[0_0_20px_rgba(0,245,255,0.25)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-300 ${
                  loadingS3
                    ? 'bg-primary/80 cursor-wait'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {loadingS3 ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Fetching...
                  </span>
                ) : (
                  <>
                    <DownloadCloud className="h-4 w-4" />
                    Fetch all Files
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, idx) => (
              <article
                key={idx}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className={`bg-card rounded-xl shadow-sm border-t-4 ${c.accent} overflow-hidden transition-all duration-400 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">{c.title}</h3>
                    <div className="text-sky-400">📘</div>
                  </div>

                  <p className="text-muted-foreground mt-3 text-sm">{c.desc}</p>

                  <div className="mt-6 text-sm text-muted-foreground">Progress</div>
                  <div className="w-full bg-gray-800 rounded-full h-3 mt-2 overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-sky-500"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-muted-foreground">{c.hours}</div>
                    <div className="text-sm text-primary-foreground font-semibold">{c.progress}%</div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-sm hover:brightness-95 font-mono">
                      Continue
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* S3 file list (if fetched) */}
          {s3Files && (
            <div className="mt-8">
              <h3 className="text-lg font-large mb-3">List of All Files</h3>

              {s3Files.length === 0 ? (
                <div className="text-sm text-muted-foreground">No files found.</div>
                ) : (
                <div ref={filesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {s3Files.map((f, idx) => (
                    <article
                      key={f.key}
                      style={{ transitionDelay: `${idx * 80}ms` }}
                      className={`bg-card border rounded-xl p-4 shadow-sm transition-all duration-400 transform ${filesMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} hover:shadow-md hover:-translate-y-1 hover:scale-105`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-none w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-sky-400">
                          <FileText className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <a href={f.url} target="_blank" rel="noreferrer" className="block text-sm font-medium text-sky-300 truncate hover:underline">
                            {f.key}
                          </a>
                          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
                            <span>{formatBytes(f.size || 0)}</span>
                            <span>•</span>
                            <span>{formatDate(f.lastModified)}</span>
                          </div>
                        </div>

                        <div className="flex-none ml-2 flex items-center gap-2">
                          <a href={f.url} target="_blank" rel="noreferrer" title="Open" className="p-2 rounded-full hover:bg-card/40">
                            <ExternalLink className="w-4 h-4 text-primary-foreground" />
                          </a>
                          <a href={f.url} download title="Download" className="p-2 rounded-full hover:bg-card/40">
                            <DownloadCloud className="w-4 h-4 text-primary-foreground" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

        </section>

      </main>

    </div>
  );
}

/* Icons */
function BookIcon(): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6 2a2 2 0 00-2 2v11a2 2 0 002 2h8v-1a3 3 0 00-3-3H6V4h8V3H6z" />
    </svg>
  );
}

function ClockIcon(): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8H9V6h2v4z" />
    </svg>
  );
}

function TargetIcon(): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  );
}

function SparklineIcon(): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 14l3-3 4 4 5-5 2 2v3H3v-1z" />
    </svg>
  );
}
