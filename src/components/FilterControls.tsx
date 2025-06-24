import React from 'react';
import { List, Clock, CheckCircle2 } from 'lucide-react';
import { FilterType } from '../types/shopping';

interface FilterControlsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  itemCounts: {
    total: number;
    pending: number;
    purchased: number;
  };
}

export function FilterControls({ currentFilter, onFilterChange, itemCounts }: FilterControlsProps): JSX.Element {
  const filters = [
    {
      id: 'all' as FilterType,
      label: 'All Items',
      icon: List,
      count: itemCounts.total,
      color: 'text-gray-600',
      activeColor: 'bg-gray-600',
    },
    {
      id: 'pending' as FilterType,
      label: 'Pending',
      icon: Clock,
      count: itemCounts.pending,
      color: 'text-amber-600',
      activeColor: 'bg-amber-600',
    },
    {
      id: 'purchased' as FilterType,
      label: 'Purchased',
      icon: CheckCircle2,
      count: itemCounts.purchased,
      color: 'text-emerald-600',
      activeColor: 'bg-emerald-600',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = currentFilter === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${isActive 
                ? `${filter.activeColor} text-white shadow-md transform scale-105` 
                : `bg-white/70 backdrop-blur-sm ${filter.color} hover:bg-white border border-gray-200/50`
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{filter.label}</span>
            <span className={`
              text-xs px-2 py-1 rounded-full
              ${isActive 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}