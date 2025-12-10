import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/styles';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  state?: 'default' | 'selected';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  state = 'default',
  style,
  textStyle,
}) => {
  const isSelected = state === 'selected';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        isSelected ? styles.buttonSelected : styles.buttonDefault,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isSelected ? styles.textSelected : styles.textDefault,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDefault: {
    backgroundColor: Colors.secondary.cloud,
    borderColor: Colors.secondary.cloud,
  },
  buttonSelected: {
    backgroundColor: Colors.primary.green,
    borderColor: Colors.primary.green,
  },
  text: {
    fontSize: Typography.paragraph.fontSize,
    fontWeight: Typography.paragraph.fontWeight,
    textTransform: 'uppercase',
  },
  textDefault: {
    color: Colors.primary.green,
  },
  textSelected: {
    color: Colors.primary.yellow,
  },
});
