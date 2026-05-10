'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: replace with real auth (NextAuth / Supabase signUp)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-5xl" aria-hidden="true">🚀</span>
          <h1 className="text-3xl font-black italic text-primary">Buat Akun Baru</h1>
          <p className="text-on-surface-variant text-sm">
            Mulai petualangan belajar si kecil bersama SkillPath Kids.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,96,172,0.08)] border border-surface-container-highest flex flex-col gap-4">
          <form onSubmit={handleSignup} className="flex flex-col gap-4" noValidate>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-bold text-on-surface">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                <input
                  id="name" type="text" autoComplete="name" required
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Budi Santoso"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-container-highest
                             bg-surface-container-low text-on-surface text-sm font-medium
                             placeholder:text-on-surface-variant
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="text-sm font-bold text-on-surface">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                <input
                  id="signup-email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-container-highest
                             bg-surface-container-low text-on-surface text-sm font-medium
                             placeholder:text-on-surface-variant
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-sm font-bold text-on-surface">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                <input
                  id="signup-password" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" required minLength={8}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-surface-container-highest
                             bg-surface-container-low text-on-surface text-sm font-medium
                             placeholder:text-on-surface-variant
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} icon={ArrowRight} className="w-full mt-1">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <p className="text-center text-sm text-on-surface-variant">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
