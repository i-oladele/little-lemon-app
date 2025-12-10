import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATABASE_NAME = 'little_lemon';
const MENU_STORAGE_KEY = '@little_lemon_menu';

// Open database
export const openDatabase = () => {
  if (Platform.OS === 'web') {
    return null; // Web will use AsyncStorage instead
  }
  return SQLite.openDatabaseSync(DATABASE_NAME);
};

// Create menu table
export const createMenuTable = (db: SQLite.SQLiteDatabase | null) => {
  if (Platform.OS === 'web' || !db) {
    // No table creation needed for web (uses AsyncStorage)
    return;
  }
  db.execSync(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT,
      category TEXT
    );
  `);
};

// Check if menu data exists
export const getMenuItems = async (db: SQLite.SQLiteDatabase | null) => {
  try {
    if (Platform.OS === 'web' || !db) {
      const data = await AsyncStorage.getItem(MENU_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    const result = db.getAllSync('SELECT * FROM menu');
    return result;
  } catch (error) {
    console.error('Error getting menu items:', error);
    return [];
  }
};

// Save menu items to database
export const saveMenuItems = async (db: SQLite.SQLiteDatabase | null, menuItems: any[]) => {
  try {
    if (Platform.OS === 'web' || !db) {
      await AsyncStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
      console.log(`Saved ${menuItems.length} menu items to AsyncStorage`);
      return;
    }
    
    db.execSync('DELETE FROM menu'); // Clear existing data
    
    const insertStatement = db.prepareSync(
      'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)'
    );

    menuItems.forEach((item: any) => {
      insertStatement.executeSync([
        item.name,
        item.price,
        item.description || '',
        item.image || '',
        item.category || ''
      ]);
    });

    insertStatement.finalizeSync();
    console.log(`Saved ${menuItems.length} menu items to database`);
  } catch (error) {
    console.error('Error saving menu items:', error);
    throw error;
  }
};

// Filter menu items by search query
export const filterMenuItems = async (
  db: SQLite.SQLiteDatabase | null,
  searchQuery: string
) => {
  try {
    if (!searchQuery) {
      return await getMenuItems(db);
    }
    
    if (Platform.OS === 'web' || !db) {
      const items = await getMenuItems(db);
      return items.filter((item: any) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const result = db.getAllSync(
      'SELECT * FROM menu WHERE name LIKE ? OR description LIKE ?',
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );
    return result;
  } catch (error) {
    console.error('Error filtering menu items:', error);
    return [];
  }
};

// Filter by category
export const filterByCategory = async (
  db: SQLite.SQLiteDatabase | null,
  category: string
) => {
  try {
    if (!category) {
      return await getMenuItems(db);
    }
    
    if (Platform.OS === 'web' || !db) {
      const items = await getMenuItems(db);
      return items.filter((item: any) => item.category === category);
    }
    
    const result = db.getAllSync(
      'SELECT * FROM menu WHERE category = ?',
      [category]
    );
    return result;
  } catch (error) {
    console.error('Error filtering by category:', error);
    return [];
  }
};

// Filter by multiple categories
export const filterByCategories = async (
  db: SQLite.SQLiteDatabase | null,
  categories: string[]
) => {
  try {
    if (!categories || categories.length === 0) {
      return await getMenuItems(db);
    }
    
    if (Platform.OS === 'web' || !db) {
      const items = await getMenuItems(db);
      return items.filter((item: any) => categories.includes(item.category));
    }
    
    // Create placeholders for SQL IN clause (?, ?, ?)
    const placeholders = categories.map(() => '?').join(', ');
    const query = `SELECT * FROM menu WHERE category IN (${placeholders})`;
    
    const result = db.getAllSync(query, categories);
    return result;
  } catch (error) {
    console.error('Error filtering by categories:', error);
    return [];
  }
};

// Filter by search query and categories (with intersection)
export const filterBySearchAndCategories = async (
  db: SQLite.SQLiteDatabase | null,
  searchQuery: string,
  categories: string[]
) => {
  try {
    // No filters applied - return all items
    if ((!searchQuery || searchQuery.trim() === '') && (!categories || categories.length === 0)) {
      return await getMenuItems(db);
    }
    
    if (Platform.OS === 'web' || !db) {
      let items = await getMenuItems(db);
      
      // Apply search filter
      if (searchQuery && searchQuery.trim() !== '') {
        const lowerQuery = searchQuery.toLowerCase();
        items = items.filter((item: any) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery)
        );
      }
      
      // Apply category filter
      if (categories && categories.length > 0) {
        items = items.filter((item: any) => categories.includes(item.category));
      }
      
      return items;
    }
    
    // Only search query
    if (searchQuery && searchQuery.trim() !== '' && (!categories || categories.length === 0)) {
      const result = db.getAllSync(
        'SELECT * FROM menu WHERE name LIKE ? OR description LIKE ?',
        [`%${searchQuery}%`, `%${searchQuery}%`]
      );
      return result;
    }
    
    // Only categories
    if ((!searchQuery || searchQuery.trim() === '') && categories && categories.length > 0) {
      return await filterByCategories(db, categories);
    }
    
    // Both search query and categories (intersection - AND)
    const placeholders = categories.map(() => '?').join(', ');
    const query = `
      SELECT * FROM menu 
      WHERE (name LIKE ? OR description LIKE ?) 
      AND category IN (${placeholders})
    `;
    
    const params = [`%${searchQuery}%`, `%${searchQuery}%`, ...categories];
    const result = db.getAllSync(query, params);
    return result;
  } catch (error) {
    console.error('Error filtering by search and categories:', error);
    return [];
  }
};
