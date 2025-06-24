import { useCallback } from 'react';
import { ShoppingItem } from '../types/shopping';

export function useUrlSharing() {
  const generateShareUrl = useCallback((items: ShoppingItem[]): string => {
    try {
      const data = JSON.stringify(items);
      const encodedData = btoa(data);
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}?list=${encodedData}`;
    } catch (error) {
      console.error('Error generating share URL:', error);
      return window.location.href;
    }
  }, []);

  const loadFromUrl = useCallback((): ShoppingItem[] => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const listData = urlParams.get('list');
      
      if (!listData) {
        return [];
      }

      const decodedData = atob(listData);
      const items = JSON.parse(decodedData) as ShoppingItem[];
      
      // Validate the data structure
      if (!Array.isArray(items)) {
        throw new Error('Invalid data format');
      }

      // Validate each item has required properties
      const validItems = items.filter(item => 
        item && 
        typeof item.id === 'number' &&
        typeof item.name === 'string' &&
        typeof item.quantity === 'number' &&
        typeof item.category === 'string' &&
        typeof item.purchased === 'boolean' &&
        typeof item.createdAt === 'string'
      );

      // Clear the URL parameter for cleaner URLs
      if (validItems.length > 0) {
        const url = new URL(window.location.href);
        url.searchParams.delete('list');
        window.history.replaceState({}, '', url.toString());
      }

      return validItems;
    } catch (error) {
      console.error('Error loading shared list:', error);
      return [];
    }
  }, []);

  return {
    generateShareUrl,
    loadFromUrl,
  };
}