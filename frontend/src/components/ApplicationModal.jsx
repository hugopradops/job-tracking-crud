import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUSES = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const EMPTY_FORM = {
  company: '',
  position: '',
  status: 'applied',
  date_applied: new Date().toISOString().split('T')[0],
  notes: '',
};

export default function ApplicationModal({ isOpen, onClose, onSubmit, application, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (application) {
      setForm({
        company: application.company || '',
        position: application.position || '',
        status: application.status || 'Applied',
        date_applied: application.date_applied
          ? application.date_applied.split('T')[0]
          : '',
        notes: application.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [application, isOpen]);

  if (!isOpen) return null;

  function validate() {
    const e = {};
    if (!form.company.trim()) e.company = 'Company is required';
    if (!form.position.trim()) e.position = 'Position is required';
    if (!form.date_applied) e.date_applied = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      company: form.company.trim(),
      position: form.position.trim(),
      notes: form.notes.trim(),
    });
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const isEdit = !!application;

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-bold text-foreground">
            {isEdit ? 'Edit Application' : 'Add Application'}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 transition-default hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Company */}
          <div>
            <label htmlFor="company" className="mb-1 block text-sm font-medium text-foreground">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className={`min-h-[44px] w-full rounded-lg border px-3 py-2.5 text-sm text-foreground placeholder:text-slate-400 transition-default focus:border-primary focus:ring-0 ${
                errors.company ? 'border-red-400' : 'border-slate-200'
              }`}
              placeholder="e.g. Google"
            />
            {errors.company && <p role="alert" className="mt-1 text-xs text-red-500">{errors.company}</p>}
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="mb-1 block text-sm font-medium text-foreground">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              id="position"
              type="text"
              value={form.position}
              onChange={(e) => handleChange('position', e.target.value)}
              className={`min-h-[44px] w-full rounded-lg border px-3 py-2.5 text-sm text-foreground placeholder:text-slate-400 transition-default focus:border-primary focus:ring-0 ${
                errors.position ? 'border-red-400' : 'border-slate-200'
              }`}
              placeholder="e.g. Frontend Engineer"
            />
            {errors.position && <p role="alert" className="mt-1 text-xs text-red-500">{errors.position}</p>}
          </div>

          {/* Status + Date row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-foreground">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="min-h-[44px] w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-foreground transition-default hover:border-slate-300 focus:border-primary focus:ring-0"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date_applied" className="mb-1 block text-sm font-medium text-foreground">
                Date Applied <span className="text-red-500">*</span>
              </label>
              <input
                id="date_applied"
                type="date"
                value={form.date_applied}
                onChange={(e) => handleChange('date_applied', e.target.value)}
                className={`min-h-[44px] w-full rounded-lg border px-3 py-2.5 text-sm text-foreground transition-default focus:border-primary focus:ring-0 ${
                  errors.date_applied ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              {errors.date_applied && (
                <p role="alert" className="mt-1 text-xs text-red-500">{errors.date_applied}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-foreground">
              Notes
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-foreground placeholder:text-slate-400 transition-default focus:border-primary focus:ring-0"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-default hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="min-h-[44px] rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-default hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving...
                </span>
              ) : isEdit ? (
                'Update'
              ) : (
                'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
