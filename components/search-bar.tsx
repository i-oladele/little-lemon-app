import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/styles';

interface SearchBarProps {
  onSearch?: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.secondary.cloud,
    paddingHorizontal: Spacing.sm,
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
