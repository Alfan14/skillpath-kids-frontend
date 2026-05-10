export const dynamic = 'force-dynamic';

export default function TeacherDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Selamat Datang di Dashboard Guru</h2>
      <p className="text-on-surface-variant">
        Ini adalah tampilan simulasi untuk guru. Anda dapat mengelola kelas dan memantau perkembangan murid dari sini.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Placeholder cards */}
        <div className="bg-white p-6 rounded-card shadow-soft border border-outline-variant/30">
          <h3 className="font-bold mb-2">Kelas Aktif</h3>
          <p className="text-3xl font-black text-primary">3</p>
        </div>
        <div className="bg-white p-6 rounded-card shadow-soft border border-outline-variant/30">
          <h3 className="font-bold mb-2">Total Murid</h3>
          <p className="text-3xl font-black text-primary">42</p>
        </div>
        <div className="bg-white p-6 rounded-card shadow-soft border border-outline-variant/30">
          <h3 className="font-bold mb-2">Laporan Menunggu</h3>
          <p className="text-3xl font-black text-warning">7</p>
        </div>
      </div>
    </div>
  );
}
