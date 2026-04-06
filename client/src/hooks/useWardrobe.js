import { useState, useEffect } from 'react';
import { fetchClothingItems } from '../services/api';

export const useWardrobe = (initialFilters = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchClothingItems(filters);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadItems();
  };

  return { items, loading, error, filters, setFilters, refresh };
};