import { ShieldCheck, Truck, BadgeCheck, Package } from "lucide-react";

export function TrustBadges() {
  const badges = [
    { icon: Truck, title: "Gratis Ongkir", desc: "Min. belanja Rp50rb" },
    { icon: Package, title: "7 Hari Pengembalian", desc: "Bebas retur" },
    { icon: BadgeCheck, title: "Kualitas Terjamin", desc: "100% Original" },
    { icon: ShieldCheck, title: "Layanan Pelanggan", desc: "24/7 Siap Bantu" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-center">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center mb-3 text-primary">
            <badge.icon className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-on-surface mb-1">{badge.title}</h4>
          <p className="text-[10px] text-on-surface-variant">{badge.desc}</p>
        </div>
      ))}
    </div>
  );
}
