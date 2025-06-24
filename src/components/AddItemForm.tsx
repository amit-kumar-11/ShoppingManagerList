import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Category } from '../types/shopping';
import { CATEGORIES } from '../utils/constants';

interface AddItemFormProps {
  onAddItem: (name: string, quantity: number, category: Category) => void;
}

export function AddItemForm({ onAddItem }: AddItemFormProps): JSX.Element {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<Category>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Small delay for better UX feedback
    await new Promise(resolve => setTimeout(resolve, 150));
    
    onAddItem(name, quantity, category);
    
    // Reset form
    setName('');
    setQuantity(1);
    setCategory('other');
    setIsSubmitting(false);
    
    // Focus back to name input
    const nameInput = document.getElementById('item-name') as HTMLInputElement;
    nameInput?.focus();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Item</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item Name */}
          <div className="lg:col-span-2">
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="item-quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              id="item-quantity"
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="item-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              disabled={isSubmitting}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!name.trim() || isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}