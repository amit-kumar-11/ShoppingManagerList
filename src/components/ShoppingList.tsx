import React, { useState, useEffect } from 'react';
import { Share2, Trash2, CheckCircle2, ShoppingCart } from 'lucide-react';
import { AddItemForm } from './AddItemForm';
import { FilterControls } from './FilterControls';
import { CategorySection } from './CategorySection';
import { ShareDialog } from './ShareDialog';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useUrlSharing } from '../hooks/useUrlSharing';
import { ShoppingItem, FilterType, Category } from '../types/shopping';
import { CATEGORIES } from '../utils/constants';

export function ShoppingList(): JSX.Element {
  const [items, setItems] = useLocalStorage<ShoppingItem[]>('shopping-list', []);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { loadFromUrl } = useUrlSharing();

  useEffect(() => {
    const sharedItems = loadFromUrl();
    if (sharedItems.length > 0) {
      setItems(sharedItems);
    }
  }, [loadFromUrl, setItems]);

  const addItem = (name: string, quantity: number, category: Category) => {
    const newItem: ShoppingItem = {
      id: Date.now(),
      name: name.trim(),
      quantity,
      category,
      purchased: false,
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const togglePurchased = (id: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearPurchased = () => {
    setItems(prev => prev.filter(item => !item.purchased));
  };

  const clearAll = () => {
    if (items.length === 0) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to clear your entire shopping list? This action cannot be undone.'
    );
    
    if (confirmed) {
      setItems([]);
    }
  };

  const getFilteredItems = () => {
    switch (filter) {
      case 'pending':
        return items.filter(item => !item.purchased);
      case 'purchased':
        return items.filter(item => item.purchased);
      default:
        return items;
    }
  };

  const groupItemsByCategory = (items: ShoppingItem[]) => {
    return CATEGORIES.reduce((groups, category) => {
      const categoryItems = items.filter(item => item.category === category.id);
      if (categoryItems.length > 0) {
        groups[category.id] = categoryItems;
      }
      return groups;
    }, {} as Record<string, ShoppingItem[]>);
  };

  const filteredItems = getFilteredItems();
  const groupedItems = groupItemsByCategory(filteredItems);
  const totalItems = items.length;
  const purchasedItems = items.filter(item => item.purchased).length;
  const pendingItems = totalItems - purchasedItems;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <ShoppingCart className="w-12 h-12 text-emerald-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Shopping List</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Organize your shopping with style and efficiency
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
          <div className="text-gray-600">Total Items</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 shadow-sm">
          <div className="text-2xl font-bold text-amber-600">{pendingItems}</div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">{purchasedItems}</div>
          <div className="text-gray-600">Purchased</div>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="mb-8">
        <AddItemForm onAddItem={addItem} />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <FilterControls
            currentFilter={filter}
            onFilterChange={setFilter}
            itemCounts={{ total: totalItems, pending: pendingItems, purchased: purchasedItems }}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowShareDialog(true)}
            disabled={items.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          
          {purchasedItems > 0 && (
            <button
              onClick={clearPurchased}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Clear Purchased
            </button>
          )}
          
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Shopping List */}
      <div className="space-y-6">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'Your shopping list is empty' : `No ${filter} items`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Add your first item to get started!' 
                : `Switch to "All" to see your complete list`}
            </p>
          </div>
        ) : (
          CATEGORIES.map(category => {
            const categoryItems = groupedItems[category.id];
            if (!categoryItems) return null;
            
            return (
              <CategorySection
                key={category.id}
                category={category}
                items={categoryItems}
                onTogglePurchased={togglePurchased}
                onDeleteItem={deleteItem}
              />
            );
          })
        )}
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <ShareDialog
          items={items}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}