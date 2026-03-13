// useFetch Hook - Custom hook for data fetching
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching data
 * @param {Function} fetchFunction - Async function to fetch data
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {boolean} immediate - Whether to fetch immediately
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useFetch = (fetchFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, dependencies);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

