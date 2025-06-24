import React from 'react';
import { ShoppingListItem } from './ShoppingListItem';
import { ShoppingItem, CategoryInfo } from '../types/shopping';

interface CategorySectionProps {
  category: CategoryInfo;
  items: ShoppingItem[];
  onTogglePurchased: (id: number) => void;
  onDeleteItem: (id: number) => void;
}

export function CategorySection({ 
  category, 
  items, 
  onTogglePurchased, 
  onDeleteItem 
}: CategorySectionProps): JSX.Element {
  const purchasedCount = items.filter(item => item.purchased).length;
  const totalCount = items.length;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.emoji}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-600">
              {purchasedCount} of {totalCount} completed
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="hidden sm:block w-24">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalCount === 0 ? 0 : (purchasedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <ShoppingListItem
            key={item.id}
            item={item}
            onTogglePurchased={onTogglePurchased}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </div>
    </div>
  );
}