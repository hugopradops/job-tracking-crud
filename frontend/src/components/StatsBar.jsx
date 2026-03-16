import { FileText, MessageSquare, Trophy, XCircle } from 'lucide-react';

const STATS = [
  { key: 'applied', label: 'Applied', icon: FileText, color: 'text-status-applied', border: 'border-status-applied' },
  { key: 'interview', label: 'Interview', icon: MessageSquare, color: 'text-status-interview', border: 'border-status-interview' },
  { key: 'offer', label: 'Offer', icon: Trophy, color: 'text-status-offer', border: 'border-status-offer' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-status-rejected', border: 'border-status-rejected' },
];

export default function StatsBar({ applications }) {
  const counts = {};
  STATS.forEach((s) => (counts[s.key] = 0));
  applications.forEach((app) => {
    if (counts[app.status] !== undefined) counts[app.status]++;
  });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {STATS.map(({ key, label, icon: Icon, color, border }) => (
        <div
          key={key}
          className={`flex items-center gap-3 rounded-lg border-l-4 ${border} bg-white px-4 py-3`}
        >
          <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} strokeWidth={2} />
          <div>
            <p className="text-2xl font-bold leading-tight text-foreground">{counts[key]}</p>
            <p className="text-xs font-medium text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
