'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { login } from '@/lib/auth';

const LOGIN_HERO_IMAGE = '/images/Login-Page-Illustration.png';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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
    <main className="min-h-screen bg-[#eef7ff] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-32px)] w-full max-w-6xl items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] lg:gap-10">
        <section className="flex flex-col gap-4 lg:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center ">
              <img src="/images/skillpathkids-logo.png" alt="skillpathkids logo" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black italic leading-tight text-[#004883] sm:text-3xl">
                SkillPath Kids
              </h1>
              <p className="text-xs font-semibold leading-relaxed text-on-surface-variant sm:text-sm">
                Masuk untuk melanjutkan perjalanan belajar si kecil.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-white px-4 py-4 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:px-6 lg:min-h-[460px] lg:px-8 lg:py-8">
            <div className="flex flex-col items-center gap-3 text-center lg:h-full lg:items-start lg:justify-between lg:text-left">
              <div className="max-w-lg">
                <span className="inline-flex rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black text-[#00531d]">
                  Belajar lebih terarah
                </span>
                <h2 className="mt-3 text-xl font-black leading-tight text-on-surface sm:text-2xl lg:text-4xl">
                  Pantau perkembangan anak dengan cara yang ringan dan menyenangkan.
                </h2>
                <p className="mt-2 hidden max-w-md text-sm leading-relaxed text-on-surface-variant sm:block">
                  Asesmen interaktif, rekomendasi aktivitas, dan progress anak tersaji dalam satu dashboard.
                </p>
              </div>

              {!imageError ? (
                <Image
                  src={LOGIN_HERO_IMAGE}
                  alt="Ilustrasi anak belajar bersama SkillPath Kids"
                  width={560}
                  height={420}
                  priority
                  className="h-auto w-full max-w-[220px] transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[280px] lg:max-w-[500px]"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-[150px] w-full max-w-[260px] items-center justify-center rounded-[24px] bg-[#d4e3ff] px-5 text-center lg:h-[260px] lg:max-w-[420px]">
                  <p className="text-sm font-bold leading-relaxed text-[#004883]">
                    Selamat datang kembali di SkillPath Kids.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#d4e3ff] bg-white p-5 shadow-[0_18px_45px_rgba(0,72,131,0.12)] sm:p-6 lg:p-7">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-wide text-[#004883]">Login</p>
            <h2 className="mt-1 text-2xl font-black text-on-surface">Masuk ke akun</h2>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
              Gunakan email dan kata sandi yang sudah terdaftar.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-error-container p-3 text-center text-sm font-bold text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-on-surface">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full rounded-xl border border-surface-container-highest bg-surface-container-low py-3 pl-10 pr-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant transition-all focus:border-[#005DA7] focus:outline-none focus:ring-2 focus:ring-[#005DA7]/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-bold text-on-surface">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full rounded-xl border border-surface-container-highest bg-surface-container-low py-3 pl-10 pr-12 text-sm font-medium text-on-surface placeholder:text-on-surface-variant transition-all focus:border-[#005DA7] focus:outline-none focus:ring-2 focus:ring-[#005DA7]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              className="mt-1 w-full rounded-[16px] bg-[#005DA7] font-black text-white shadow-[0_5px_0_0_#004883] hover:bg-[#004883]"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-on-surface-variant">
            Belum punya akun?{' '}
            <Link href="/signup" className="font-bold text-[#004883] hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
