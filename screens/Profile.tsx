import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { profileEvents } from '@/utils/events';
import { Colors, Spacing, BorderRadius } from '@/constants/styles';

export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  
  // Email notification preferences
  const [orderStatusNotif, setOrderStatusNotif] = useState(false);
  const [passwordChangesNotif, setPasswordChangesNotif] = useState(false);
  const [specialOffersNotif, setSpecialOffersNotif] = useState(false);
  const [newsletterNotif, setNewsletterNotif] = useState(false);
  
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('firstName');
      const last = await AsyncStorage.getItem('lastName');
      const userEmail = await AsyncStorage.getItem('email');
      const phone = await AsyncStorage.getItem('phoneNumber');
      const avatar = await AsyncStorage.getItem('avatarUri');
      
      // Load notification preferences
      const orderStatus = await AsyncStorage.getItem('orderStatusNotif');
      const passwordChanges = await AsyncStorage.getItem('passwordChangesNotif');
      const specialOffers = await AsyncStorage.getItem('specialOffersNotif');
      const newsletter = await AsyncStorage.getItem('newsletterNotif');
      
      if (name) setFirstName(name);
      if (last) setLastName(last);
      if (userEmail) setEmail(userEmail);
      if (phone) setPhoneNumber(phone);
      if (avatar) setAvatarUri(avatar);
      
      if (orderStatus) setOrderStatusNotif(orderStatus === 'true');
      if (passwordChanges) setPasswordChangesNotif(passwordChanges === 'true');
      if (specialOffers) setSpecialOffersNotif(specialOffers === 'true');
      if (newsletter) setNewsletterNotif(newsletter === 'true');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload a profile picture.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      console.log('Image picked:', uri);
      setAvatarUri(uri);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Picture',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setAvatarUri('') 
        },
      ]
    );
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = cleaned.substring(0, 10);
    
    // Format as (XXX) XXX-XXXX
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    // Validate phone number if provided
    if (phoneNumber) {
      const cleaned = phoneNumber.replace(/\D/g, '');
      if (cleaned.length !== 10) {
        Alert.alert('Validation Error', 'Please enter a valid 10-digit USA phone number');
        return false;
      }
    }
    
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    
    try {
      console.log('Saving avatar URI:', avatarUri);
      
      // Save all data to AsyncStorage
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      await AsyncStorage.setItem('avatarUri', avatarUri);
      
      // Save notification preferences
      await AsyncStorage.setItem('orderStatusNotif', orderStatusNotif.toString());
      await AsyncStorage.setItem('passwordChangesNotif', passwordChangesNotif.toString());
      await AsyncStorage.setItem('specialOffersNotif', specialOffersNotif.toString());
      await AsyncStorage.setItem('newsletterNotif', newsletterNotif.toString());
      
      console.log('Avatar saved successfully');
      
      // Emit event to notify other screens
      profileEvents.emit('profileUpdated');
      
      Alert.alert('Success', 'Your changes have been saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard all changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => loadUserData()
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getInitials = () => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`.trim() || '?';
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Personal information</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionLabel}>Avatar</Text>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              {avatarUri ? (
                <Image 
                  key={avatarUri}
                  source={{ uri: avatarUri }} 
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.initialsContainer}>
                  <Text style={styles.initials}>{getInitials()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor={Colors.secondary.cloud}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor={Colors.secondary.cloud}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor={Colors.secondary.cloud}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              placeholder="(555) 123-4567"
              placeholderTextColor={Colors.secondary.cloud}
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>
        </View>

        {/* Email Notifications Section */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setOrderStatusNotif(!orderStatusNotif)}
          >
            <View style={styles.checkbox}>
              {orderStatusNotif && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>Order statuses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setPasswordChangesNotif(!passwordChangesNotif)}
          >
            <View style={styles.checkbox}>
              {passwordChangesNotif && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>Password changes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setSpecialOffersNotif(!specialOffersNotif)}
          >
            <View style={styles.checkbox}>
              {specialOffersNotif && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>Special offers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setNewsletterNotif(!newsletterNotif)}
          >
            <View style={styles.checkbox}>
              {newsletterNotif && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>Newsletter</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
            <Text style={styles.discardButtonText}>Discard Changes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.cloud,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary.dark,
  },
  avatarSection: {
    padding: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    marginBottom: Spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary.green,
    marginRight: Spacing.md,
  },
  avatar: {
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
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.white,
  },
  changeButton: {
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  changeButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: Colors.primary.green,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  removeButtonText: {
    color: Colors.primary.green,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary.dark,
    marginBottom: Spacing.sm,
  },
  formSection: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.cloud,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 12,
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
    fontSize: 16,
    color: Colors.secondary.dark,
    backgroundColor: Colors.white,
  },
  notificationsSection: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.cloud,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.primary.green,
    borderRadius: 4,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: Colors.primary.green,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.secondary.dark,
  },
  actionsSection: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  discardButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.primary.green,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.green,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary.green,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  logoutSection: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    backgroundColor: Colors.primary.yellow,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary.green,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary.dark,
  },
});
