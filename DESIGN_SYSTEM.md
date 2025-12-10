# Little Lemon App - High-Fidelity Design Implementation

## Design System

This implementation follows the **Little Lemon Brand Style Guide** specifications.

### Brand Colors

#### Primary Colors
- **Primary Green**: `#495E57` - Used for navigation, buttons (selected state), text
- **Primary Yellow**: `#F4CE14` - Used for headings, selected button text, accents

#### Secondary Colors
- **Salmon**: `#EE9972` - Used for pricing
- **Peach**: `#FBDABB` - Reserved for highlights
- **Cloud**: `#EDEFEE` - Used for backgrounds, borders, button default state
- **Dark**: `#333333` - Used for body text

### Typography

Based on the style guide specifications:

- **Display** (Markazi Text, 64pt → 48pt mobile, Medium)
  - Restaurant name "Little Lemon"
  
- **Subtitle** (Markazi Text, 40pt → 32pt mobile, Regular)
  - Location "Chicago"
  
- **Lead Text** (Karla, 18pt, Medium)
  - Hero description text
  
- **Section Title** (Karla, 20pt, Bold, UPPERCASE)
  - "ORDER FOR DELIVERY", "MENU ITEMS"
  
- **Card Title** (Karla, 18pt, Bold)
  - Menu item names
  
- **Paragraph** (Karla, 16pt, Regular)
  - Menu descriptions, button labels

### Design Components

#### 1. Navigation Bar
- **Elements**: Logo image, Profile icon
- **Styling**: White background, clean separation
- **Images**: `Logo.png`, `Profile.png`

#### 2. Hero Section
- **Background**: Primary Green (#495E57)
- **Content**: 
  - Restaurant name (Primary Yellow)
  - Location (White)
  - Description (White, Lead Text)
  - Hero image with 16px border radius
- **Image**: `Hero image.png`

#### 3. Search Bar
- **Icon**: Magnifying glass (🔍)
- **Styling**: White background, Cloud border, 8px border radius
- **Placeholder**: "Search for a dish..."

#### 4. Menu Categories (Interactive Buttons)
- **Delivery Icon**: `Delivery van.png`
- **Categories**: Starters, Mains, Desserts, Sides
- **States**:
  - **Default**: Cloud background, Primary Green text, uppercase
  - **Selected**: Primary Green background, Primary Yellow text, uppercase
- **Interaction**: 600ms animation on state change

#### 5. Menu Items
- **Component**: Reusable `MenuItemCard`
- **Content**: 
  - Dish name (Card Title)
  - Description (truncated to 2 lines)
  - Price (Salmon color, bold)
  - Dish image (90x90, 8px border radius)
- **Images**: 
  - `Greek salad.png`
  - `Bruschetta.png`
  - `Grilled fish.png`
  - `Pasta.png`
  - `Lemon dessert.png`

### Layout Grid
- **Margins**: 16px (Spacing.md)
- **Gutters**: 8px (Spacing.sm)
- **Border Radius**: 8px (small), 16px (medium), 24px (large)

## Files Created/Modified

### New Files
- `constants/styles.ts` - Centralized design system constants
- `components/menu-item-card.tsx` - Reusable menu item component

### Updated Files
- `components/navigation-bar.tsx` - Added logo and profile images
- `components/hero-section.tsx` - Implemented brand colors and hero image
- `components/search-bar.tsx` - Added search icon and brand styling
- `components/button.tsx` - Implemented interactive button states
- `components/menu-categories.tsx` - Added delivery icon and proper styling
- `components/menu-items.tsx` - Integrated real dish images and menu data
- `app/(tabs)/index.tsx` - Applied white background and status bar

## Features Implemented

✅ Brand-compliant color palette  
✅ Typography hierarchy following style guide  
✅ Real images from assets folder  
✅ Interactive button components with state management  
✅ Smooth animations (600ms transitions)  
✅ Reusable component architecture  
✅ Responsive layout with proper spacing  
✅ High-fidelity mock-up matching wireframe structure  

## Running the App

```bash
npm start
# or
expo start
```

Then choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

## Design Decisions

1. **Font Sizes Adjusted**: Display and subtitle fonts scaled down (64→48, 40→32) for better mobile readability
2. **Button States**: Used Cloud (#EDEFEE) for default state instead of yellow to reduce visual noise
3. **Image Integration**: All placeholder content replaced with actual brand images
4. **Component Reusability**: Created `MenuItemCard` for consistent dish presentation
5. **Centralized Styles**: All brand constants in `constants/styles.ts` for easy maintenance

## Next Steps

To further enhance the app:
- [ ] Install custom fonts (Markazi Text, Karla)
- [ ] Add font loading with `expo-font`
- [ ] Implement search functionality
- [ ] Add navigation to detail screens
- [ ] Integrate with backend API
- [ ] Add animations for menu item cards
- [ ] Implement cart functionality
