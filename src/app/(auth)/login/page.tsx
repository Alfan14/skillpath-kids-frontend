'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const result = await login(
        email,
        password
      );

      console.log(result);

      if (result.user.role === "ADMINISTRATOR") {
        router.push("/administrator/dashboard");
      } else if (result.user.role === "TEACHER") {
        router.push("/teacher/dashboard");
      } else if (result.user.role === "PARENT" || result.user.role === "STUDENT") {
        router.push("/");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error("Role tidak valid atau tidak didukung.");
      }
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ||
          "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-5xl" aria-hidden="true">🚀</span>
          <h1 className="text-3xl font-black italic text-primary">SkillPath Kids</h1>
          <p className="text-on-surface-variant text-sm">
            Masuk untuk melanjutkan perjalanan belajar si kecil.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,96,172,0.08)] border border-surface-container-highest flex flex-col gap-4">
          {error && <div className="p-3 bg-error-container text-error rounded-xl text-sm font-bold text-center">{error}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-on-surface">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-container-highest
                             bg-surface-container-low text-on-surface text-sm font-medium
                             placeholder:text-on-surface-variant
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                             transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-bold text-on-surface">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-surface-container-highest
                             bg-surface-container-low text-on-surface text-sm font-medium
                             placeholder:text-on-surface-variant
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                             transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              className="w-full mt-1"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-sm text-on-surface-variant">
            Belum punya akun?{' '}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
