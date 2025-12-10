import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform, StatusBar, Text } from 'react-native';
import { Colors, Spacing } from '@/constants/styles';

interface NavigationBarProps {
  onProfilePress?: () => void;
  avatarUri?: string;
  firstName?: string;
  lastName?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ onProfilePress, avatarUri, firstName, lastName }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = lastName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`.trim() || '?';
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../images/Logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Profile Icon */}
      <TouchableOpacity style={styles.profileIcon} onPress={onProfilePress}>
        {avatarUri ? (
          <Image 
            key={avatarUri}
            source={{ uri: avatarUri }} 
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initials}>{getInitials()}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.cloud,
  },
  logo: {
    height: 50,
    width: 160,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.secondary.cloud,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
