import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/styles';

export default function Onboarding() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  // Validation functions
  const isValidName = (name: string): boolean => {
    // Check if name is not empty and contains only letters and spaces
    return name.trim().length > 0 && /^[a-zA-Z\s]+$/.test(name);
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if form is valid
  const isFormValid = isValidName(firstName) && isValidEmail(email);

  const handleNext = async () => {
    if (isFormValid) {
      try {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('firstName', firstName);
        await AsyncStorage.setItem('email', email);
        
        // Complete onboarding (updates context and AsyncStorage)
        await completeOnboarding();
        
        console.log('Onboarding complete:', { firstName, email });
        
        // Navigation will happen automatically via the auth context
      } catch (error) {
        console.error('Error saving onboarding data:', error);
        Alert.alert('Error', 'Failed to save your information. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.secondary.cloud} translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>Little Lemon</Text>
          <Text style={styles.heroSubtitle}>Chicago</Text>
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroDescription}>
                We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
              </Text>
            </View>
            <Image
              source={require('../images/Hero image.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
        </View>        {/* Form Section */}
        <View style={styles.formSection}>
          {/* First Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={[
                styles.input,
                firstName.length > 0 && !isValidName(firstName) && styles.inputError,
              ]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {firstName.length > 0 && !isValidName(firstName) && (
              <Text style={styles.errorText}>
                Please enter a valid name (letters only)
              </Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[
                styles.input,
                email.length > 0 && !isValidEmail(email) && styles.inputError,
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {email.length > 0 && !isValidEmail(email) && (
              <Text style={styles.errorText}>
                Please enter a valid email address
              </Text>
            )}
          </View>
        </View>

        {/* Spacer to push button to bottom */}
        <View style={styles.spacer} />

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !isFormValid && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!isFormValid}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.nextButtonText,
                !isFormValid && styles.nextButtonTextDisabled,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
  heroSection: {
    backgroundColor: Colors.primary.green,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logo: {
    height: 40,
    width: 140,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '500',
    color: Colors.primary.yellow,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 32,
    fontWeight: '400',
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  heroDescription: {
    fontSize: 16,
    color: Colors.white,
    lineHeight: 22,
  },
  heroImage: {
    width: 120,
    height: 140,
    borderRadius: BorderRadius.md,
  },
  formSection: {
    paddingHorizontal: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary.cloud,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.paragraph.fontSize,
    color: Colors.secondary.dark,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: '#DC3545',
  },
  errorText: {
    fontSize: 12,
    color: '#DC3545',
    marginTop: Spacing.xs,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  nextButton: {
    backgroundColor: Colors.primary.green,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: Colors.secondary.cloud,
  },
  nextButtonText: {
    fontSize: Typography.paragraph.fontSize,
    fontWeight: 'bold',
    color: Colors.white,
    textTransform: 'uppercase',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
});
