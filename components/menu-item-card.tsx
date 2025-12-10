import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/styles';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: string;
  image: any; // Image source
  onPress?: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  name,
  description,
  price,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.price}>{price}</Text>
      </View>

      <Image 
        source={image} 
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.cloud,
  },
  leftContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary.dark,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.primary.green,
    marginBottom: 8,
    lineHeight: 22,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.green,
  },
  image: {
    width: 100,
    height: 100,
  },
});
