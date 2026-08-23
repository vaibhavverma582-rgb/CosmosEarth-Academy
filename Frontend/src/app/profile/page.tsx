"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Calendar,
  BookOpen,
  Star,
  Settings,
  Shield,
  Rocket,
  ArrowLeft,
  Palette,
  FileText,
  Images,
  Loader2,
  Camera,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  _count: { enrollments: number; reviews: number };
}

interface DashboardData {
  enrollments: any[];
  watchProgress: any[];
  listeningHistory: any[];
  noteBookmarks: any[];
  notes: any[];
  quizAttempts: any[];
}

const quickLinks = [
  { title: "Admin Panel", href: "/admin", icon: Settings, color: "text-cyan-400" },
  { title: "Blog Posts", href: "/blog/upload", icon: FileText, color: "text-purple-400" },
  { title: "Gallery", href: "/gallery/upload", icon: Images, color: "text-orange-400" },
  { title: "Wallpaper", href: "/admin/wallpaper", icon: Palette, color: "text-green-400" },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [editBio, setEditBio] = useState("");
  const fileInputRef = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      try {
        const headers = { "x-user-id": session.user.id };

        const [profileRes, dashboardRes] = await Promise.all([
          fetch(`${API_URL}/api/auth/me`, { headers }),
          fetch(`${API_URL}/api/dashboard`, { headers }),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.user);
        }

        if (dashboardRes.ok) {
          const dashData = await dashboardRes.json();
          setDashboard(dashData.data);
        }
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  if (status === "loading" || loading) {
    return (
      <div className="admin-layout flex min-h-screen items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const user = session.user;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${API_URL}/api/auth/avatar`, {
        method: "POST",
        headers: { "x-user-id": session.user.id },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setProfile((prev) => prev ? { ...prev, avatar: data.avatar } : prev);
      window.location.reload();
    } catch {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleNameSave = async () => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        setProfile((prev) => prev ? { ...prev, name: editName } : prev);
        setEditingName(false);
      }
    } catch {}
  };

  const handleBioSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ bio: editBio }),
      });
      if (res.ok) {
        setProfile((prev) => prev ? { ...prev, bio: editBio } : prev);
        setEditingBio(false);
      }
    } catch {}
  };
  const enrolledCount = dashboard?.enrollments?.length || profile?._count?.enrollments || 0;
  const completedCount = dashboard?.enrollments?.filter((e: any) => e.status === "completed").length || 0;
  const notesCount = dashboard?.notes?.length || 0;
  const bookmarksCount = dashboard?.noteBookmarks?.length || 0;
  const quizzesTaken = dashboard?.quizAttempts?.length || 0;
  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Dec 2024";

  return (
    <div className="admin-layout min-h-screen pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Your <span className="gradient-text-cyan">Profile</span>
          </h1>
        </div>

        {/* Profile Card */}
        <div className="admin-stat-card mb-8 p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Avatar with upload button */}
            <div className="relative group">
              {(profile?.avatar || user.image) ? (
                <img
                  src={profile?.avatar || user.image || undefined}
                  alt={user.name || "User"}
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-cyan-400/20"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 text-3xl font-bold text-white ring-4 ring-cyan-400/20">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              {/* Upload overlay */}
              <label className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-xl font-bold focus:outline-none focus:border-cyan-400"
                      autoFocus
                    />
                    <button onClick={handleNameSave} className="text-green-400 hover:text-green-300"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingName(false)} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl font-bold text-white">
                      {profile?.name || user.name}
                    </h2>
                    <button
                      onClick={() => { setEditName(profile?.name || user.name || ""); setEditingName(true); }}
                      className="text-white/30 hover:text-cyan-300 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-white/50">{user.email}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="default">
                  <Shield className="mr-1 h-3 w-3" />
                  {profile?.role === "admin" ? "Admin" : "Explorer"}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="mr-1 h-3 w-3" />
                  Joined {joinDate}
                </Badge>
              </div>
            </div>

            <Link href="/admin">
              <button className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-400/20">
                <Settings className="h-4 w-4" />
                Admin Panel
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="admin-stat-card p-5 text-center">
            <BookOpen className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
            <p className="font-display text-2xl font-bold text-white">{enrolledCount}</p>
            <p className="text-xs text-white/40">Enrolled</p>
          </div>
          <div className="admin-stat-card p-5 text-center">
            <Star className="mx-auto mb-2 h-5 w-5 text-amber-400" />
            <p className="font-display text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-xs text-white/40">Completed</p>
          </div>
          <div className="admin-stat-card p-5 text-center">
            <FileText className="mx-auto mb-2 h-5 w-5 text-purple-400" />
            <p className="font-display text-2xl font-bold text-white">{notesCount}</p>
            <p className="text-xs text-white/40">Notes</p>
          </div>
          <div className="admin-stat-card p-5 text-center">
            <Images className="mx-auto mb-2 h-5 w-5 text-orange-400" />
            <p className="font-display text-2xl font-bold text-white">{bookmarksCount}</p>
            <p className="text-xs text-white/40">Bookmarks</p>
          </div>
          <div className="admin-stat-card p-5 text-center col-span-2 sm:col-span-1">
            <User className="mx-auto mb-2 h-5 w-5 text-green-400" />
            <p className="font-display text-2xl font-bold text-white">{quizzesTaken}</p>
            <p className="text-xs text-white/40">Quizzes Taken</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-bold text-white/60 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <div className="admin-stat-card group cursor-pointer p-4 flex items-center gap-3">
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                  <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                    {link.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="admin-stat-card">
          <div className="border-b border-white/5 px-6 py-4">
            <h3 className="font-display text-sm font-bold text-white">Account Information</h3>
          </div>
          <div className="divide-y divide-white/5">
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-white/50">Name</span>
              <span className="text-sm text-white">{profile?.name || user.name}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-white/50">Email</span>
              <span className="text-sm text-white">{user.email}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-white/50">Role</span>
              <Badge variant="default">{profile?.role === "admin" ? "Admin" : "Explorer"}</Badge>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-white/50">Auth Provider</span>
              <span className="text-sm text-white">
                {user.image ? "Google" : "Email/Password"}
              </span>
            </div>
            {/* Bio */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-white/50">Bio</span>
              {editingBio ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-cyan-400 w-64"
                    autoFocus
                  />
                  <button onClick={handleBioSave} className="text-green-400 hover:text-green-300"><Check className="h-4 w-4" /></button>
                  <button onClick={() => setEditingBio(false)} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">{profile?.bio || "No bio yet"}</span>
                  <button
                    onClick={() => { setEditBio(profile?.bio || ""); setEditingBio(true); }}
                    className="text-white/30 hover:text-cyan-300 transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
