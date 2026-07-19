export interface Stat {
  value: string;
  label: string;
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="container -mt-10 md:-mt-12">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-elevated md:grid-cols-4 md:p-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-2xl font-bold text-primary md:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
