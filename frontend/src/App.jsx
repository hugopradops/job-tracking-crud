import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import StatusFilter from './components/StatusFilter';
import ApplicationTable from './components/ApplicationTable';
import ApplicationModal from './components/ApplicationModal';
import DeleteDialog from './components/DeleteDialog';
import LoginPage from './components/LoginPage';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from './api/applications';
import { login, register, getMe } from './api/auth';

function Toast({ message, type, onDismiss }) {
  if (!message) return null;
  const bg = type === 'error' ? 'bg-red-500' : 'bg-green-600';
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
      <div
        className={`${bg} flex items-center gap-3 rounded-lg px-5 py-3 text-sm font-medium text-white`}
      >
        {message}
        <button onClick={onDismiss} className="ml-2 font-bold opacity-80 hover:opacity-100">
          &times;
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('joblog_token'));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(!!localStorage.getItem('joblog_token'));

  // App state
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [fetchError, setFetchError] = useState(null);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }
    getMe(token)
      .then((userData) => {
        setUser(userData);
        setAuthLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('joblog_token');
        setToken(null);
        setUser(null);
        setAuthLoading(false);
      });
  }, [token]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  }

  const fetchAll = useCallback(async () => {
    try {
      const data = await getApplications();
      setApplications(Array.isArray(data) ? data : []);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user, fetchAll]);

  // Auth handlers
  async function handleLogin(email, password, mode) {
    const fn = mode === 'signin' ? login : register;
    const data = await fn(email, password);
    localStorage.setItem('joblog_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  }

  function handleLogout() {
    localStorage.removeItem('joblog_token');
    setToken(null);
    setUser(null);
    setApplications([]);
  }

  const filtered =
    filterStatus === 'All'
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  // Add / Edit
  async function handleSubmit(formData) {
    setSubmitting(true);
    try {
      if (editingApp) {
        await updateApplication(editingApp.id, formData);
        showToast('Application updated successfully');
      } else {
        await createApplication(formData);
        showToast('Application added successfully');
      }
      setModalOpen(false);
      setEditingApp(null);
      await fetchAll();
    } catch (err) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function openAdd() {
    setEditingApp(null);
    setModalOpen(true);
  }

  function openEdit(app) {
    setEditingApp(app);
    setModalOpen(true);
  }

  // Delete
  async function handleDelete() {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await deleteApplication(deleteTarget.id);
      showToast('Application deleted');
      setDeleteTarget(null);
      await fetchAll();
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // Loading spinner while validating token
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated — show login
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Authenticated — show dashboard
  return (
    <div className="bg-paper min-h-screen">
      <Header user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Stats */}
        <section className="mb-6">
          <StatsBar applications={applications} />
        </section>

        {/* Toolbar */}
        <section className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusFilter active={filterStatus} onChange={setFilterStatus} />
          <button
            onClick={openAdd}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-default hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add Application
          </button>
        </section>

        {/* Error banner */}
        {fetchError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load applications: {fetchError}
          </div>
        )}

        {/* Table */}
        <section>
          <ApplicationTable applications={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />
        </section>
      </main>

      {/* Modals */}
      <ApplicationModal
        isOpen={modalOpen}
        application={editingApp}
        onClose={() => {
          setModalOpen(false);
          setEditingApp(null);
        }}
        onSubmit={handleSubmit}
        loading={submitting}
      />

      <DeleteDialog
        isOpen={!!deleteTarget}
        application={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={submitting}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
