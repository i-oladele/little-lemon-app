import React from 'react';
import { Text, StyleSheet, ScrollView, FlatList, View as RNView } from 'react-native';
import { MenuItemCard } from './menu-item-card';
import { Colors, Typography, Spacing } from '@/constants/styles';

interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  image: string;
}

interface MenuItemsProps {
  items?: MenuItem[];
}

const getImageUrl = (imageName: string) => {
  return `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageName}?raw=true`;
};

export const MenuItems: React.FC<MenuItemsProps> = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <RNView style={styles.container}>
        <Text style={styles.sectionTitle}>Menu Items</Text>
        <Text style={styles.emptyText}>No menu items available</Text>
      </RNView>
    );
  }

  return (
    <RNView style={styles.container}>
      <Text style={styles.sectionTitle}>Menu Items</Text>
      <FlatList
        data={items}
        scrollEnabled={false}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <MenuItemCard
            name={item.name}
            description={item.description}
            price={`$${item.price.toFixed(2)}`}
            image={{ uri: getImageUrl(item.image) }}
            onPress={() => console.log(`Selected: ${item.name}`)}
          />
        )}
      />
    </RNView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sectionTitle.fontSize,
    fontWeight: Typography.sectionTitle.fontWeight,
    color: Colors.secondary.dark,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  emptyText: {
    fontSize: Typography.paragraph.fontSize,
    color: Colors.secondary.dark,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
