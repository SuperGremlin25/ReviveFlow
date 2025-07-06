import React, { useState } from 'react';

export default function ClientForm({ onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, email, phone });
    setName(''); setEmail(''); setPhone('');
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input required placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-1 w-full" />
      <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-1 w-full" />
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="border p-1 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add Client</button>
    </form>
  );
}
