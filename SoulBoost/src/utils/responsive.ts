import { Dimensions, PixelRatio, useWindowDimensions } from 'react-native';

// Base dimensions (e.g., iPhone 6/7/8)
const baseWidth = 375;
const baseHeight = 667;

// Function to scale sizes based on width (recommended for most UI elements)
export const scale = (size: number, width?: number) => {
  const screenWidth = width || Dimensions.get('window').width;
  const widthScale = screenWidth / baseWidth;
  return Math.round(PixelRatio.roundToNearestPixel(size * widthScale));
};

// Function to scale sizes based on height (useful for vertical elements)
export const verticalScale = (size: number, height?: number) => {
  const screenHeight = height || Dimensions.get('window').height;
  const heightScale = screenHeight / baseHeight;
  return Math.round(PixelRatio.roundToNearestPixel(size * heightScale));
};

// Function to scale sizes based on the smaller scale (to maintain aspect ratio)
export const moderateScale = (size: number, factor: number = 0.5, width?: number) => {
  const scaled = scale(size, width);
  return Math.round(PixelRatio.roundToNearestPixel(size + (scaled - size) * factor));
};

// Hook for dynamic dimensions (updates on orientation change)
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    scale: (size: number) => scale(size, width),
    verticalScale: (size: number) => verticalScale(size, height),
    moderateScale: (size: number, factor: number = 0.5) => moderateScale(size, factor, width),
    isPortrait: height > width,
    isLandscape: width > height,
    isSmallScreen: width < 480,
    isMediumScreen: width >= 480 && width < 768,
    isLargeScreen: width >= 768,
  };
};

// Static versions for initial load
export const getScreenWidth = () => Dimensions.get('window').width;
export const getScreenHeight = () => Dimensions.get('window').height;

// Breakpoints for different screen sizes
export const breakpoints = {
  small: 320,
  medium: 480,
  large: 768,
  xlarge: 1024,
};

// Function to check screen size (static)
export const isSmallScreen = () => getScreenWidth() < breakpoints.medium;
export const isMediumScreen = () => getScreenWidth() >= breakpoints.medium && getScreenWidth() < breakpoints.large;
export const isLargeScreen = () => getScreenWidth() >= breakpoints.large;
export const isXLargeScreen = () => getScreenWidth() >= breakpoints.xlarge;

// Orientation (static)
export const isPortrait = () => getScreenHeight() > getScreenWidth();
export const isLandscape = () => getScreenWidth() > getScreenHeight();