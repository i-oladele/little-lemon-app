# Onboarding Screen Implementation

## ✅ Completed Features

### File Structure
- Created `screens/` folder at root level
- Created `screens/Onboarding.tsx` component
- Created `app/onboarding.tsx` route

### Components Implemented

#### 1. Header with Logo
- Little Lemon logo centered in header
- Light gray background (#EDEFEE)
- Proper spacing and alignment

#### 2. Welcome Section
- "Let us get to know you" text
- Styled with brand colors (Primary Green)
- Centered alignment

#### 3. Form Inputs

**First Name Input:**
- Label: "First Name"
- Validation: 
  - Cannot be empty
  - Must contain only letters and spaces
  - Uses regex: `/^[a-zA-Z\s]+$/`
- Real-time validation with error message
- Red border when invalid

**Email Input:**
- Label: "Email"
- Validation:
  - Must be properly formatted email
  - Uses regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Keyboard type: email-address
- Auto-capitalization disabled
- Real-time validation with error message
- Red border when invalid

#### 4. Next Button
- Located at bottom of screen
- Text: "NEXT" (uppercase)
- Behavior:
  - **Disabled state**: Gray background, gray text when form is invalid
  - **Enabled state**: Primary Green background, white text
  - Button only active when both name and email are valid
- Console logs data on press (action placeholder for navigation)

### UX Features

✅ **KeyboardAvoidingView** - Prevents keyboard from covering inputs  
✅ **ScrollView** - Ensures content is accessible on smaller screens  
✅ **Real-time validation** - Immediate feedback as user types  
✅ **Visual feedback** - Error borders and messages for invalid inputs  
✅ **Disabled state** - Button cannot be pressed until form is valid  
✅ **Placeholder text** - Helpful hints in input fields  
✅ **Proper keyboard types** - Email keyboard for email input  

### Styling

All styles follow Little Lemon brand guidelines:
- Colors: Primary Green (#495E57), Cloud (#EDEFEE), White
- Typography: Using brand typography scale
- Spacing: Consistent spacing system (sm, md, lg, xl)
- Border radius: 8px for inputs and buttons

## How to View

The onboarding screen is now accessible at the route `/onboarding` in your app.

To navigate to it programmatically (when navigation is set up):
```typescript
import { router } from 'expo-router';
router.push('/onboarding');
```

## Form Validation Logic

```typescript
// Name validation
const isValidName = (name: string): boolean => {
  return name.trim().length > 0 && /^[a-zA-Z\s]+$/.test(name);
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Form is valid when both are true
const isFormValid = isValidName(firstName) && isValidEmail(email);
```

## Next Steps

When navigation is implemented, the `handleNext` function will:
1. Store user data (AsyncStorage or state management)
2. Navigate to the main app screens
3. Potentially show additional onboarding steps

## Testing Validation

**Valid inputs:**
- First Name: "John", "Mary Jane", "Carlos"
- Email: "user@example.com", "test@domain.co.uk"

**Invalid inputs:**
- First Name: "John123", "abc!", "" (empty)
- Email: "notanemail", "missing@domain", "@nodomain.com"
