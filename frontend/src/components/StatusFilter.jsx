const STATUSES = [
  { value: 'All', label: 'All' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const ACTIVE_COLORS = {
  All: 'bg-primary text-white',
  applied: 'bg-status-applied text-white',
  interview: 'bg-status-interview text-white',
  offer: 'bg-status-offer text-white',
  rejected: 'bg-status-rejected text-white',
};

export default function StatusFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((status) => {
        const isActive = active === status.value;
        return (
          <button
            key={status.value}
            onClick={() => onChange(status.value)}
            className={`min-h-[44px] min-w-[44px] rounded-lg px-4 py-2 text-sm transition-default ${
              isActive
                ? `${ACTIVE_COLORS[status.value]} font-bold border-transparent shadow-sm`
                : 'bg-white text-slate-600 font-semibold hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
}
