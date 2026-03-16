const STATUS_MAP = {
  applied: { bg: 'bg-blue-100', text: 'text-status-applied', dot: 'bg-status-applied', label: 'Applied' },
  interview: { bg: 'bg-amber-100', text: 'text-status-interview', dot: 'bg-status-interview', label: 'Interview' },
  offer: { bg: 'bg-green-100', text: 'text-status-offer', dot: 'bg-status-offer', label: 'Offer' },
  rejected: { bg: 'bg-red-100', text: 'text-status-rejected', dot: 'bg-status-rejected', label: 'Rejected' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_MAP[status] || STATUS_MAP.applied;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
