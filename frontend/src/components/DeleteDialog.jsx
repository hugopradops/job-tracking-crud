import { AlertTriangle } from 'lucide-react';

export default function DeleteDialog({ isOpen, application, onConfirm, onCancel, loading }) {
  if (!isOpen || !application) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white px-6 py-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Delete Application</h3>
        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete the application for{' '}
          <span className="font-semibold text-foreground">{application.position}</span> at{' '}
          <span className="font-semibold text-foreground">{application.company}</span>? This
          action cannot be undone.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="min-h-[44px] rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-default hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="min-h-[44px] rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-default hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
