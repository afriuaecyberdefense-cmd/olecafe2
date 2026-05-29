import { useState, useCallback, useEffect } from 'react';
import type { MenuItem } from '../types/menu';

const MENU_API = '/api/menu/items';

async function loadMenuItemsFromServer(): Promise<MenuItem[]> {
  const res = await fetch(MENU_API, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Failed to load menu items (${res.status})`);
  }
  const data = (await res.json()) as { items: MenuItem[] };
  return data.items;
}

async function saveMenuItemsToServer(items: MenuItem[]): Promise<void> {
  const res = await fetch(MENU_API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    throw new Error(`Failed to save menu items (${res.status})`);
  }
}

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadMenuItemsFromServer()
      .then((data) => {
        setItems(data);
        setLoaded(true);
      })
      .catch(() => {
        // If the API fails (local dev / missing KV env), fail gracefully.
        setItems([]);
        setLoaded(true);
      });
  }, []);

  const persist = useCallback(async (nextItems: MenuItem[]) => {
    try {
      await saveMenuItemsToServer(nextItems);
    } catch {
      // Ignore persistence errors in client; UI still updates immediately.
    }
  }, []);

  const addItem = useCallback(
    (item: MenuItem) => {
      setItems((prev) => {
        const next = [...prev, item];
        void persist(next);
        return next;
      });
    },
    [persist]
  );

  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((item) => item.id !== id);
        void persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateItemImage = useCallback(
    (id: string, imageUrl?: string) => {
      setItems((prev) => {
        const next = prev.map((item) => {
          if (item.id !== id) return item;
          const updated: MenuItem = {
            ...item,
            ...(imageUrl ? { imageUrl } : { imageUrl: undefined }),
          };
          return updated;
        });
        void persist(next);
        return next;
      });
    },
    [persist]
  );

  const resetItems = useCallback(
    (newItems: MenuItem[]) => {
      setItems(newItems);
      void persist(newItems);
    },
    [persist]
  );

  return { items, addItem, deleteItem, updateItemImage, resetItems, loaded };
}


