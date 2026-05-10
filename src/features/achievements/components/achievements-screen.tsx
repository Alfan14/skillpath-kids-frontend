import { Medal } from 'lucide-react';
import { BadgeCard } from '@/components/ui/badge-card';
import { badges } from '@/data/badges';

/**
 * AchievementsScreen — Server Component.
 * BadgeCard uses framer-motion internally (Client Component) but
 * this wrapper can remain a Server Component because Next.js
 * handles the client boundary at the BadgeCard import level.
 */
export function AchievementsScreen() {
  const unlocked = badges.filter((b) => b.unlocked);
  const locked   = badges.filter((b) => !b.unlocked);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">

      <div className="flex items-center gap-4 pt-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-secondary-container">
          <Medal className="w-7 h-7 text-on-secondary-container" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-black italic text-on-surface">Koleksi Lencana</h1>
          <p className="text-sm text-on-surface-variant">
            Setiap langkah kecil adalah pencapaian besar dalam perjalanan si kecil.
          </p>
        </div>
      </div>

      {unlocked.length > 0 && (
        <section aria-labelledby="unlocked-heading">
          <h2
            id="unlocked-heading"
            className="text-xs font-black uppercase tracking-widest text-tertiary mb-3"
          >
            ✓ Lencana Diraih ({unlocked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {unlocked.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                animateOnMount
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Locked badges ──────────────────────────────────────────────────── */}
      {locked.length > 0 && (
        <section aria-labelledby="locked-heading">
          <h2
            id="locked-heading"
            className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3"
          >
            🔒 Tantangan Berikutnya ({locked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {locked.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                animateOnMount={false}
              />
            ))}
          </div>
        </section>
      )}

      <footer className="text-center text-xs text-on-surface-variant pb-4">
        © 2026 SkillPath Kids. Didesain dengan penuh kasih sayang.
      </footer>
    </div>
  );
}
