'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClipboardCheck, Filter, ShieldAlert, ChevronLeft, ChevronRight, X, AlertTriangle, Eye } from 'lucide-react';
import { getAdminAssessments } from '@/actions/admin-actions';
import { getToken, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import type { AdminAssessmentsData } from '@/actions/admin-actions';
import { Button } from '@/components/ui/button';

type AssessmentItem = AdminAssessmentsData['assessments'][number];

function safeParse(data: any): any {
  if (!data) return null;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function AssessmentsClient() {
  const router = useRouter();
  
  const [data, setData] = useState<AdminAssessmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [role, setRole] = useState<string>('Semua');
  const [categoryResult, setCategoryResult] = useState<string>('Semua');
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Modal State
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentItem | null>(null);

  useEffect(() => {
    setPage(1);
  }, [role, categoryResult]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        logout();
        router.push('/login');
        return;
      }
      const response = await getAdminAssessments(
        { role, categoryResult, page, limit },
        token
      );
      setData(response);
    } catch (err: any) {
      if (err.message.includes('401') || err.message.toLowerCase().includes('sesi') || err.message.toLowerCase().includes('unauthorized')) {
        logout();
        router.push('/login');
      } else if (err.message.includes('403') || err.message.toLowerCase().includes('forbidden')) {
        setError('Akses ditolak. Anda tidak memiliki izin.');
      } else {
        setError(err.message || 'Terjadi kesalahan saat memuat hasil asesmen.');
      }
    } finally {
      setLoading(false);
    }
  }, [role, categoryResult, page, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const roleColors: Record<string, string> = {
    ADMINISTRATOR: 'bg-error-container text-error',
    TEACHER: 'bg-primary-container text-primary',
    PARENT: 'bg-secondary-container text-on-secondary-container',
    STUDENT: 'bg-tertiary-container text-tertiary',
  };

  const getCategoryColor = (cat: string) => {
    if (cat === 'Sangat Baik' || cat === 'excellent') return 'bg-tertiary-container text-tertiary';
    if (cat === 'Perlu Perhatian' || cat === 'warning') return 'bg-secondary-container text-on-secondary-container';
    if (cat === 'Perlu Bantuan' || cat === 'low') return 'bg-error-container text-error';
    return 'bg-surface-container text-on-surface-variant';
  };

  const defaultPagination = {
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  };
  const assessments = data?.assessments ?? [];
  const pagination = data?.pagination ?? defaultPagination;

  const getAssessmentUserName = (item: any) => item.userName ?? item.user?.name ?? '-';
  const getAssessmentUserEmail = (item: any) => item.userEmail ?? item.user?.email ?? '-';
  const getAssessmentUserRole = (item: any) => item.userRole ?? item.user?.role ?? '-';
  const getAssessmentChildName = (item: any) => item.childName ?? item.childProfile?.name ?? '-';
  const getAssessmentScore = (item: any) => Number(item.overallScore ?? 0);

  const formatDate = (value?: string) => {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">Hasil Asesmen</h1>
          <p className="text-sm text-on-surface-variant">Daftar semua hasil asesmen yang telah dikerjakan pengguna.</p>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative shrink-0 w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-container-highest bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
          >
            <option value="Semua">Semua Role</option>
            <option value="PARENT">Parent</option>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
        <div className="relative shrink-0 w-full sm:w-56">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <select
            value={categoryResult}
            onChange={(e) => setCategoryResult(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-container-highest bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
          >
            <option value="Semua">Semua Hasil</option>
            <option value="Sangat Baik">Sangat Baik</option>
            <option value="Perlu Perhatian">Perlu Perhatian</option>
            <option value="Perlu Bantuan">Perlu Bantuan</option>
          </select>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      {error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-[24px] bg-error-container/20 border-2 border-dashed border-error/50">
          <ShieldAlert className="h-12 w-12 text-error mb-4" />
          <h3 className="text-lg font-black text-on-surface mb-2">Gagal Memuat Data</h3>
          <p className="text-sm text-on-surface-variant mb-6">{error}</p>
          <Button onClick={fetchData} variant="outline">Coba Lagi</Button>
        </div>
      ) : (
        <div className="rounded-[22px] border border-outline-variant/30 bg-white shadow-[0_4px_16px_rgba(0,93,167,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container-lowest text-[10px] font-black uppercase tracking-wide text-on-surface-variant whitespace-nowrap">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Target Child</th>
                  <th className="px-5 py-4 text-center">Score</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {loading && !data ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : assessments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                      <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada hasil asesmen ditemukan.</p>
                    </td>
                  </tr>
                ) : (
                  assessments.map((item) => {
                    const userName = getAssessmentUserName(item);
                    const userEmail = getAssessmentUserEmail(item);
                    const userRole = getAssessmentUserRole(item);
                    const childName = getAssessmentChildName(item);
                    const overallScore = getAssessmentScore(item);

                    return (
                      <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface leading-tight text-[13px]">{userName}</span>
                            <span className="text-[10px] text-on-surface-variant">{userEmail}</span>
                            <div className="mt-1">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${roleColors[userRole] || 'bg-surface-container text-on-surface'}`}>
                                {userRole}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          {childName !== '-' ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-on-surface text-[12px]">{childName}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-on-surface-variant italic">-</span>
                          )}
                        </td>

                        <td className="px-5 py-3 text-center font-black text-[15px] text-on-surface">
                          {Math.round(overallScore)}
                        </td>

                        <td className="px-5 py-3">
                          <span className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-[10px] font-black ${getCategoryColor(item.categoryResult)}`}>
                            {item.categoryResult || '-'}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-on-surface-variant text-[11px] whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="px-5 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg px-3 text-xs"
                            onClick={() => setSelectedAssessment(item)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> Detail
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/20 bg-surface-container-lowest">
              <span className="text-xs text-on-surface-variant font-medium">
                Halaman {pagination.page} dari {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl px-3 py-1.5 h-auto text-xs"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl px-3 py-1.5 h-auto text-xs"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Detail Modal ──────────────────────────────────────────────────────── */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
            <div className="shrink-0 flex items-center justify-between border-b border-outline-variant/30 px-6 py-4">
              <h2 className="text-lg font-black text-on-surface">Detail Asesmen</h2>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-[16px] text-2xl font-black ${getCategoryColor(selectedAssessment.categoryResult)}`}>
                    {Math.round(getAssessmentScore(selectedAssessment))}
                  </div>
                  <div>
                    <h3 className="font-black text-on-surface">
                      {getAssessmentUserName(selectedAssessment)}
                    </h3>                    
                    <p className={`text-xs font-bold mt-0.5 ${getCategoryColor(selectedAssessment.categoryResult).split(' ').find(c => c.startsWith('text-')) || 'text-on-surface-variant'}`}>
                      {selectedAssessment.categoryResult}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-primary-container p-4">
                  <p className="text-sm font-medium text-on-primary-container leading-relaxed">
                    {selectedAssessment.focusSummary || 'Tidak ada summary tersedia.'}
                  </p>
                </div>

                {/* Focus Areas */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wide text-on-surface-variant">Area Fokus</h4>
                  {(() => {
                    const parsedFocus = safeParse(selectedAssessment.focusAreas);
                    const focusAreas = Array.isArray(parsedFocus) ? parsedFocus : [];
                    if (focusAreas.length === 0) {
                      return (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-lowest text-on-surface-variant text-sm">
                          <AlertTriangle className="h-4 w-4" /> Data detail area fokus belum tersedia.
                        </div>
                      );
                    }
                    return (
                      <div className="flex flex-wrap gap-2">
                        {focusAreas.map((f: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold">
                            {f}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Skills Data */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wide text-on-surface-variant">Data Keterampilan</h4>
                  {(() => {
                    const parsedSkills = safeParse(selectedAssessment.skillsData);
                    const skillsData = parsedSkills && typeof parsedSkills === 'object' ? parsedSkills : {};
                    if (Object.keys(skillsData).length === 0) {
                      return (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-lowest text-on-surface-variant text-sm">
                          <AlertTriangle className="h-4 w-4" /> Data detail keterampilan belum tersedia.
                        </div>
                      );
                    }
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(skillsData).map(([skill, data]: [string, any], i: number) => (
                          <div key={i} className="p-3 border border-outline-variant/30 rounded-xl bg-surface-container-lowest flex items-center justify-between">
                            <span className="text-sm font-bold text-on-surface truncate pr-2">{skill}</span>
                            <span className={`text-xs font-black px-2 py-1 rounded-md ${
                              (data?.score || 0) >= 80 ? 'bg-[#96f89f] text-[#006b28]' :
                              (data?.score || 0) >= 50 ? 'bg-[#d4e3ff] text-[#005da7]' : 'bg-[#ffd6d6] text-[#ba1a1a]'
                            }`}>
                              {Math.round(data?.score || 0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>
            
            <div className="shrink-0 border-t border-outline-variant/30 p-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedAssessment(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
