import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizeStyles = {
    small: { container: 40, emoji: 24, text: 14 },
    medium: { container: 80, emoji: 48, text: 24 },
    large: { container: 120, emoji: 72, text: 32 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            width: currentSize.container,
            height: currentSize.container,
            borderRadius: currentSize.container / 2,
          },
        ]}>
        <Text style={[styles.emoji, { fontSize: currentSize.emoji }]}>✨</Text>
      </View>
      {showText && (
        <Text style={[styles.text, { fontSize: currentSize.text }]}>
          Soul Boost
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#9B6FDD',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7B4FD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emoji: {
    textAlign: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: '#2D1B4E',
    marginTop: 12,
    letterSpacing: 1,
  },
});

export default Logo;
