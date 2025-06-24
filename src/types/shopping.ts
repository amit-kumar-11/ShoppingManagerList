export type Category = 
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'pantry'
  | 'frozen'
  | 'household'
  | 'personal'
  | 'other';

export interface CategoryInfo {
  id: Category;
  name: string;
  emoji: string;
}

export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  category: Category;
  purchased: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'pending' | 'purchased';