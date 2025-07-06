import React, { useState } from 'react';

export default function ExpenseForm({ jobId, onAdd }) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ item_name: itemName, quantity: Number(quantity), price: Number(price) });
    setItemName(''); setQuantity(''); setPrice('');
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input required placeholder="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} className="border p-1 w-full" />
      <input required type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="border p-1 w-full" />
      <input required type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-1 w-full" />
      <button type="submit" className="bg-purple-600 text-white px-3 py-1 rounded">Add Expense</button>
    </form>
  );
}
