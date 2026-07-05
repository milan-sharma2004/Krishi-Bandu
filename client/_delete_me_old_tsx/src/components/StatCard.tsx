import type { LucideIcon } from 'lucide-react';

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'primary',
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'primary' | 'blue' | 'purple' | 'orange';
}) {
  const accents: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accents[accent]}`}>
          <Icon size={20} />
        </span>
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
