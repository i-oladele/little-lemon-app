import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/styles';

interface HeroSectionProps {
  onSearch?: (text: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.restaurantName}>Little Lemon</Text>
        <Text style={styles.location}>Chicago</Text>
        <View style={styles.descriptionRow}>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
          
          {/* Hero Image */}
          <Image 
            source={require('../images/Hero image.png')} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search for a dish..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary.green,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
  },
  content: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 48, // Adjusted from 64 for mobile
    fontWeight: '500',
    color: Colors.primary.yellow,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: 32, // Adjusted from 40 for mobile
    fontWeight: '400',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  description: {
    flex: 1,
    fontSize: Typography.leadText.fontSize,
    fontWeight: Typography.leadText.fontWeight,
    color: Colors.white,
    lineHeight: 24,
    paddingRight: Spacing.sm,
  },
  heroImage: {
    width: 120,
    height: 140,
    borderRadius: BorderRadius.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: Typography.paragraph.fontSize,
    color: Colors.secondary.dark,
  },
});
