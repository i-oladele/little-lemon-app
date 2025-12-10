# Menu Filtering and Search Implementation

## Overview
This document describes the implementation of filtering and search functionality for the Little Lemon menu app.

## Features Implemented

### 1. Multi-Select Category Filtering
**File:** `components/menu-categories.tsx`

- Categories now support multiple selections (checkbox-like behavior)
- Users can select/deselect multiple categories simultaneously
- Selected categories are highlighted with different colors
- Categories include: Starters, Mains, Desserts, Drinks
- Horizontal scrollable list for better UX

**Key Changes:**
- Changed from single `activeCategory` state to `selectedCategories` array
- Modified `onCategorySelect` callback to `onCategoriesSelect` that passes array of selected categories
- Toggle logic: clicking a selected category deselects it, clicking an unselected one adds it

### 2. Integrated Search Bar in Hero Section
**File:** `components/hero-section.tsx`

- Search bar moved from separate component into HeroSection
- Positioned below the restaurant description
- Full-width search input with search icon
- Properly styled to match the design system

**Layout:**
```
┌──────────────────────────────┐
│ Little Lemon                 │
│ Chicago                      │
│ Description        [Image]   │
│ [🔍 Search bar...]          │
└──────────────────────────────┘
```

### 3. Database Filtering Functions
**File:** `database/database.ts`

Added three new filtering functions:

#### `filterByCategories(db, categories)`
- Filters menu items by multiple categories using SQL `IN` clause
- Returns all items if no categories selected
- Dynamic placeholder generation for SQL safety

#### `filterBySearchAndCategories(db, searchQuery, categories)`
- Combined filtering by search text AND categories (intersection)
- Searches in both `name` and `description` fields
- Uses SQL `LIKE` for partial matching
- Handles all combinations:
  - No filters → all items
  - Only search → text match
  - Only categories → category match
  - Both → intersection (AND logic)

### 4. Debounced Search with useEffect
**File:** `app/(tabs)/index.tsx`

#### Search Debouncing (500ms)
```typescript
useEffect(() => {
  const timeout = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500);
  return () => clearTimeout(timeout);
}, [searchQuery]);
```

- User types in search bar
- 500ms delay before executing query
- Minimizes unnecessary database hits
- Improves performance during typing

#### Automatic Filtering
```typescript
useEffect(() => {
  const db = openDatabase();
  const filtered = filterBySearchAndCategories(
    db, 
    debouncedSearchQuery, 
    selectedCategories
  );
  setMenuItems(filtered);
}, [selectedCategories, debouncedSearchQuery]);
```

- Automatically filters when categories change
- Automatically filters when debounced search query updates
- Updates menu display in real-time

### 5. Component Updates

**MenuItems Component:**
- Removed internal category filtering logic
- Now receives pre-filtered items from parent
- Simplified component responsibilities

**HomeScreen Component:**
- Manages filter state (categories, search query)
- Handles debouncing logic
- Coordinates filtering operations
- Passes appropriate callbacks to child components

## User Experience Flow

1. **Initial Load:**
   - All menu items displayed
   - No categories selected
   - Empty search bar

2. **Category Selection:**
   - User taps one or more category buttons
   - Selected categories are highlighted
   - Menu updates immediately to show only items in selected categories
   - User can tap again to deselect

3. **Search Input:**
   - User types in search bar
   - After 500ms delay (debouncing), search executes
   - Results show items matching search text in name or description
   - If categories are also selected, shows intersection (items that match both search AND selected categories)

4. **Combined Filtering:**
   - Example: User selects "Starters" and types "Gr"
   - Results: Only starters with "Gr" in name/description (e.g., "Greek Salad")
   - Boolean AND logic ensures precise filtering

## SQL Query Examples

### Multiple Categories:
```sql
SELECT * FROM menu 
WHERE category IN ('starters', 'mains')
```

### Search Only:
```sql
SELECT * FROM menu 
WHERE name LIKE '%Gr%' OR description LIKE '%Gr%'
```

### Combined (Search + Categories):
```sql
SELECT * FROM menu 
WHERE (name LIKE '%Gr%' OR description LIKE '%Gr%') 
AND category IN ('starters', 'mains')
```

## Performance Considerations

1. **Debouncing:** Prevents excessive database queries during typing
2. **SQL Optimization:** Uses indexed queries and parameterized statements
3. **State Management:** Efficient React state updates with useCallback
4. **Memory Management:** Proper cleanup of timeouts in useEffect

## Testing Recommendations

1. Test category selection (single and multiple)
2. Test search with various terms
3. Test combined filtering (search + categories)
4. Test debouncing (type quickly, ensure only one query after 500ms)
5. Test edge cases (no results, special characters, empty inputs)
6. Test category deselection (clearing filters)

## Future Enhancements

- Add "Clear All" button for categories
- Add sorting options (price, name, popularity)
- Add dietary filters (vegetarian, gluten-free, etc.)
- Implement search history
- Add autocomplete suggestions
- Performance monitoring for large datasets
