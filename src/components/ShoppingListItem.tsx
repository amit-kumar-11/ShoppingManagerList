import React, { useState } from 'react';
import { Check, Trash2, RotateCcw } from 'lucide-react';
import { ShoppingItem } from '../types/shopping';

interface ShoppingListItemProps {
  item: ShoppingItem;
  onTogglePurchased: (id: number) => void;
  onDeleteItem: (id: number) => void;
}

export function ShoppingListItem({ 
  item, 
  onTogglePurchased, 
  onDeleteItem 
}: ShoppingListItemProps): JSX.Element {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    // Small delay for animation
    await new Promise(resolve => setTimeout(resolve, 200));
    onDeleteItem(item.id);
  };

  return (
    <div className={`
      group flex items-center gap-3 p-4 rounded-xl border transition-all duration-300
      ${isDeleting ? 'scale-95 opacity-50' : 'hover:shadow-md hover:scale-[1.01]'}
      ${item.purchased 
        ? 'bg-emerald-50 border-emerald-200 opacity-75' 
        : 'bg-white border-gray-200 hover:border-gray-300'
      }
    `}>
      {/* Toggle Button */}
      <button
        onClick={() => onTogglePurchased(item.id)}
        className={`
          flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
          ${item.purchased
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
          }
        `}
        disabled={isDeleting}
      >
        {item.purchased ? (
          <Check className="w-4 h-4" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-emerald-200 transition-colors" />
        )}
      </button>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`
            font-medium transition-all
            ${item.purchased ? 'line-through text-gray-500' : 'text-gray-900'}
          `}>
            {item.name}
          </span>
          {item.quantity > 1 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              ×{item.quantity}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Added {new Date(item.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.purchased && (
          <button
            onClick={() => onTogglePurchased(item.id)}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Mark as pending"
            disabled={isDeleting}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete item"
          disabled={isDeleting}
        >
          <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
        </button>
      </div>
    </div>
  );
}