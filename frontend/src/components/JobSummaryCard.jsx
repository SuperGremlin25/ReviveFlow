import React from 'react';

export default function JobSummaryCard({ summary, onDownload }) {
  if (!summary) return null;
  return (
    <div className="border p-4 rounded shadow bg-gray-50 mt-4">
      <h2 className="text-xl font-bold mb-2">Job Summary</h2>
      <div>Hours: {summary.hours}</div>
      <div>Rate: ${summary.rate}</div>
      <div>Total: <span className="font-bold">${summary.total.toFixed(2)}</span></div>
      <h3 className="mt-2 font-semibold">Expenses</h3>
      <ul>
        {summary.expenses.map(e => (
          <li key={e.id}>{e.item_name} — {e.quantity} × ${e.price.toFixed(2)}</li>
        ))}
      </ul>
      <button onClick={onDownload} className="mt-3 bg-black text-white px-3 py-1 rounded">Download Invoice PDF</button>
    </div>
  );
}
