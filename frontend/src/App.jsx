import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ClientForm from './components/ClientForm';
import JobForm from './components/JobForm';
import ExpenseForm from './components/ExpenseForm';
import JobSummaryCard from './components/JobSummaryCard';

const API = 'http://localhost:8000';
const queryClient = new QueryClient();

function Dashboard() {
  try {
    const qc = useQueryClient();
    const [selectedJob, setSelectedJob] = useState(null);
    const [summary, setSummary] = useState(null);

    // Clients
    const { data: clientsRaw, refetch: refetchClients } = useQuery({
      queryKey: ['clients'],
      queryFn: async () => {
        const res = await fetch(`${API}/clients`);
        return res.json();
      }
    });
    const clients = Array.isArray(clientsRaw) ? clientsRaw : [];

    const addClient = useMutation({
      mutationFn: async (data) => {
        const res = await fetch(`${API}/clients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        return res.json();
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] })
    });

    // Jobs
    const { data: jobsRaw, refetch: refetchJobs } = useQuery({
      queryKey: ['jobs'],
      queryFn: async () => {
        const res = await fetch(`${API}/jobs`);
        return res.json();
      }
    });
    const jobs = Array.isArray(jobsRaw) ? jobsRaw : [];

    const addJob = useMutation({
      mutationFn: async (data) => {
        const res = await fetch(`${API}/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        return res.json();
      },
      onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); refetchJobs(); }
    });

    // Expenses
    const [expenseError, setExpenseError] = useState(null);
    const addExpense = useMutation({
      mutationFn: async ({ jobId, ...data }) => {
        setExpenseError(null);
        const res = await fetch(`${API}/jobs/${jobId}/expenses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) {
          let msg = 'Failed to add expense.';
          try {
            const err = await res.json();
            msg = err.detail || JSON.stringify(err);
          } catch {}
          throw new Error(msg);
        }
        return res.json();
      },
      onSuccess: () => { if (selectedJob) fetchSummary(selectedJob); },
      onError: (error) => {
        setExpenseError(error.message || 'Failed to add expense.');
      }
    });

    // Job summary
    const fetchSummary = async (jobId) => {
      const res = await fetch(`${API}/jobs/${jobId}/summary`);
      const data = await res.json();
      setSummary(data);
    };

    // Invoice download
    const downloadInvoice = async () => {
      if (!selectedJob) return;
      const res = await fetch(`${API}/jobs/${selectedJob}/invoice`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-job${selectedJob}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    return (
      <div className="min-h-screen bg-bg-dark text-white font-sans">
        {/* SVG Wave Header */}
        <div className="relative">
          <svg className="absolute top-0 left-0 w-full h-40" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#a855f7" fillOpacity="0.15" d="M0,160L60,170.7C120,181,240,203,360,192C480,181,600,139,720,128C840,117,960,139,1080,144C1200,149,1320,139,1380,133.3L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"/>
          </svg>
          <header className="relative z-10 pt-10 pb-6 flex flex-col items-center">
            <div className="flex items-center gap-3">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#a855f7"/><path d="M8 13l2.5 2.5L16 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-dark">ReviveFlow</h1>
            </div>
            <p className="mt-2 text-accent-dark text-sm opacity-80">Modern Home Stager Billing MVP</p>
          </header>
        </div>
        <main className="max-w-2xl mx-auto p-4 space-y-7 relative z-10">
          {/* Error boundary fallback */}
          {typeof window.__DASHBOARD_ERROR === 'string' && (
            <div className="bg-red-500/20 text-red-300 p-2 rounded mb-2 shadow-glass">Dashboard Error: {window.__DASHBOARD_ERROR}</div>
          )}
          {/* Add Client */}
          <section className="bg-bg-card/80 backdrop-blur rounded-xl shadow-glass p-5 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#a855f7"/><rect x="4" y="16" width="16" height="4" rx="2" fill="#a855f7"/></svg>
              <h2 className="font-semibold text-lg">Add Client</h2>
            </div>
            <ClientForm onAdd={data => addClient.mutate(data)} />
          </section>
          {/* Add Job */}
          <section className="bg-bg-card/80 backdrop-blur rounded-xl shadow-glass p-5 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#a855f7"/><path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              <h2 className="font-semibold text-lg">Add Job</h2>
            </div>
            <JobForm clients={clients} onAdd={data => addJob.mutate(data)} />
          </section>
          {/* Select Job */}
          <section className="bg-bg-card/80 backdrop-blur rounded-xl shadow-glass p-5 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#a855f7"/><path d="M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              <h2 className="font-semibold text-lg">Select Job</h2>
            </div>
            <select className="border border-zinc-700 bg-zinc-900 rounded p-2 w-full text-white focus:ring-accent focus:border-accent-dark outline-none" value={selectedJob || ''} onChange={e => { setSelectedJob(e.target.value); fetchSummary(e.target.value); }}>
              <option value="">Select</option>
              {jobs.map(j => <option key={j.id} value={j.id}>Job #{j.id} (Client {j.client_id})</option>)}
            </select>
          </section>
          {/* Add Expense */}
          {selectedJob && (
            <section className="bg-bg-card/80 backdrop-blur rounded-xl shadow-glass p-5 border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#a855f7"/><path d="M8 13l2.5 2.5L16 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <h2 className="font-semibold text-lg">Add Expense</h2>
              </div>
              <ExpenseForm jobId={selectedJob} onAdd={data => addExpense.mutate({ jobId: selectedJob, ...data })} />
              {expenseError && (
                <div className="bg-red-500/20 text-red-300 p-2 rounded mt-2 shadow-glass">Expense Error: {expenseError}</div>
              )}
            </section>
          )}
          {/* Job Summary */}
          <section className="bg-bg-card/80 backdrop-blur rounded-xl shadow-glass p-5 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#a855f7"/><path d="M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              <h2 className="font-semibold text-lg">Job Summary</h2>
            </div>
            <JobSummaryCard summary={summary} onDownload={downloadInvoice} />
          </section>
        </main>
      </div>
    );
  } catch (err) {
    console.error('Dashboard render error:', err);
    window.__DASHBOARD_ERROR = err.message || String(err);
    return <div style={{color: 'red'}}>Dashboard crashed: {err.message || String(err)}</div>;
  }
}

export default function App() {
  // Clear dashboard error on rerender
  if (typeof window !== 'undefined') window.__DASHBOARD_ERROR = undefined;
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
