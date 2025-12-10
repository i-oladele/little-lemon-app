import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      setIsOnboardingCompleted(onboardingCompleted === 'true');
    } catch (error) {
      console.error('Error reading onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      console.log('Completing onboarding...');
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setIsOnboardingCompleted(true);
      console.log('Onboarding completed successfully');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      // Clear all user data
      await AsyncStorage.removeItem('onboardingCompleted');
      await AsyncStorage.removeItem('firstName');
      await AsyncStorage.removeItem('lastName');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('phoneNumber');
      await AsyncStorage.removeItem('avatarUri');
      
      // Clear notification preferences
      await AsyncStorage.removeItem('orderStatusNotif');
      await AsyncStorage.removeItem('passwordChangesNotif');
      await AsyncStorage.removeItem('specialOffersNotif');
      await AsyncStorage.removeItem('newsletterNotif');
      
      setIsOnboardingCompleted(false);
      console.log('Logout completed successfully - all data cleared');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isOnboardingCompleted,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
