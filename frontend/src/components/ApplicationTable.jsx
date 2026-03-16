import { Pencil, Trash2, Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function MobileCard({ app, onEdit, onDelete }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-foreground">{app.company}</p>
          <p className="text-sm text-slate-500">{app.position}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>
      <p className="mb-1 text-xs text-slate-400">{formatDate(app.date_applied)}</p>
      {app.notes && (
        <p className="mb-3 text-xs text-slate-500 line-clamp-2">{app.notes}</p>
      )}
      <div className="flex gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={() => onEdit(app)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-primary transition-default hover:bg-blue-50"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button
          onClick={() => onDelete(app)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-red-500 transition-default hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  );
}

export default function ApplicationTable({ applications, onEdit, onDelete }) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
        <Inbox className="mb-3 h-12 w-12 text-slate-300" strokeWidth={1.5} />
        <p className="text-lg font-semibold text-slate-400">No applications yet</p>
        <p className="mt-1 text-sm text-slate-400">
          Click the button above to add your first job application.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {applications.map((app) => (
          <MobileCard key={app.id} app={app} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 font-semibold text-slate-600">Company</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Position</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Date Applied</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Notes</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-b border-slate-100 last:border-b-0 transition-default hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-foreground">{app.company}</td>
                <td className="px-4 py-3 text-slate-600">{app.position}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(app.date_applied)}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-slate-500" title={app.notes || undefined}>
                  {app.notes || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(app)}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 transition-default hover:bg-blue-50 hover:text-primary"
                      aria-label={`Edit ${app.company}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(app)}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 transition-default hover:bg-red-50 hover:text-red-500"
                      aria-label={`Delete ${app.company}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
