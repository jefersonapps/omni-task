import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";

type Item = Record<string, any>;

export const useSearchItems = <T extends Item>(
  items: T[],
  keys: (keyof T)[]
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredItems = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return items;
    }

    const searchLower = debouncedSearch.toLowerCase();
    return items.filter((item) =>
      keys.some((key) => String(item[key]).toLowerCase().includes(searchLower))
    );
  }, [debouncedSearch, items, keys]);

  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  return {
    searchTerm,
    filteredItems,
    handleSearch,
    handleSearchSubmit,
  };
};
