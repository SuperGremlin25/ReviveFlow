import React, { useState } from 'react';

export default function JobForm({ clients, onAdd }) {
  const [clientId, setClientId] = useState('');
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');
  const [notes, setNotes] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ client_id: Number(clientId), hours: Number(hours), rate: Number(rate), notes });
    setClientId(''); setHours(''); setRate(''); setNotes('');
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <select required value={clientId} onChange={e => setClientId(e.target.value)} className="border p-1 w-full">
        <option value="">Select Client</option>
        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input required type="number" placeholder="Hours" value={hours} onChange={e => setHours(e.target.value)} className="border p-1 w-full" />
      <input required type="number" placeholder="Rate" value={rate} onChange={e => setRate(e.target.value)} className="border p-1 w-full" />
      <input placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} className="border p-1 w-full" />
      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Add Job</button>
    </form>
  );
}
