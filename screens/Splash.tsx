import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/styles';

export default function Splash() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../images/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={Colors.primary.green} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});
