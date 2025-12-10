import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, StatusBar, SafeAreaView, ActivityIndicator, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationBar } from '@/components/navigation-bar';
import { HeroSection } from '@/components/hero-section';
import { MenuCategories } from '@/components/menu-categories';
import { MenuItems } from '@/components/menu-items';
import { Colors } from '@/constants/styles';
import { profileEvents } from '@/utils/events';
import { 
  openDatabase, 
  createMenuTable, 
  getMenuItems, 
  saveMenuItems,
  filterBySearchAndCategories 
} from '@/database/database';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

export default function HomeScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadUserData = async () => {
    try {
      const avatar = await AsyncStorage.getItem('avatarUri');
      const first = await AsyncStorage.getItem('firstName');
      const last = await AsyncStorage.getItem('lastName');
      
      console.log('Loading user data - Avatar:', avatar);
      
      setAvatarUri(avatar || '');
      setFirstName(first || '');
      setLastName(last || '');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchMenuFromAPI = async () => {
    try {
      console.log('Fetching menu from API...');
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log('Menu fetched from API:', data.menu?.length, 'items');
      return data.menu || [];
    } catch (error) {
      console.error('Error fetching menu from API:', error);
      return [];
    }
  };

  const loadMenuData = async () => {
    try {
      setIsLoading(true);
      const db = openDatabase();
      
      // Create table if it doesn't exist
      createMenuTable(db);
      
      // Check if we have data in the database
      const existingItems = await getMenuItems(db);
      
      if (existingItems && existingItems.length > 0) {
        console.log('Loading menu from database:', existingItems.length, 'items');
        setMenuItems(existingItems);
      } else {
        console.log('No menu data in database, fetching from API...');
        const apiMenuItems = await fetchMenuFromAPI();
        
        if (apiMenuItems.length > 0) {
          await saveMenuItems(db, apiMenuItems);
          setMenuItems(apiMenuItems);
        }
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search query - 500ms delay
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery]);

  // Filter menu items when categories or debounced search query changes
  useEffect(() => {
    const filterMenu = async () => {
      try {
        const db = openDatabase();
        const filtered = await filterBySearchAndCategories(db, debouncedSearchQuery, selectedCategories);
        console.log('Filtered items:', filtered.length, 'Search:', debouncedSearchQuery, 'Categories:', selectedCategories);
        setMenuItems(filtered);
      } catch (error) {
        console.error('Error filtering menu:', error);
      }
    };

    // Only filter if we're not in initial loading state
    if (!isLoading) {
      filterMenu();
    }
  }, [selectedCategories, debouncedSearchQuery, isLoading]);

  const handleCategoriesChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  useEffect(() => {
    loadUserData();
    loadMenuData();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      console.log('Profile updated event received');
      loadUserData();
    };

    profileEvents.on('profileUpdated', handleProfileUpdate);

    return () => {
      profileEvents.off('profileUpdated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    if (params.refresh) {
      console.log('Refresh triggered from profile');
      loadUserData();
    }
  }, [params.refresh]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} translucent={false} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <NavigationBar 
          onProfilePress={() => router.push('/profile')} 
          avatarUri={avatarUri}
          firstName={firstName}
          lastName={lastName}
        />
        <HeroSection onSearch={handleSearchChange} />
        <MenuCategories onCategoriesSelect={handleCategoriesChange} />
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.green} />
          </View>
        ) : (
          <MenuItems items={menuItems} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
