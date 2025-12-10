import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, Image } from 'react-native';
import { Button } from '@/components/button';
import { Colors, Typography, Spacing } from '@/constants/styles';

interface MenuCategory {
  id: string;
  name: string;
}

const CATEGORIES: MenuCategory[] = [
  { id: 'starters', name: 'Starters' },
  { id: 'mains', name: 'Mains' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
];

interface MenuCategoriesProps {
  onCategoriesSelect?: (categories: string[]) => void;
}

export const MenuCategories: React.FC<MenuCategoriesProps> = ({ onCategoriesSelect }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const animationValue = new Animated.Value(0);

  const handleCategoryPress = (categoryId: string) => {
    // Trigger animation on button press
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    // Toggle category selection (multi-select behavior)
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
    onCategoriesSelect?.(updatedCategories);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.deliveryText}>ORDER FOR DELIVERY!</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            label={category.name}
            state={selectedCategories.includes(category.id) ? 'selected' : 'default'}
            onPress={() => handleCategoryPress(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary.cloud,
  },
  deliveryText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.secondary.dark,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.md,
  },
  categoriesContent: {
    paddingRight: Spacing.md,
  },
});
