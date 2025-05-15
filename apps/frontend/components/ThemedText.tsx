import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'header' | 'subheader' | 'button' | 'bodytext' | 'caption' | 'light';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'bodytext',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const getTextClasses = () => {
    switch (type) {
      case 'header':
        return 'font-header text-header';
      case 'subheader':
        return 'font-subheader text-subheader';
      case 'button':
        return 'font-button text-button';
      case 'caption':
        return 'font-caption text-caption';
      case 'light':
        return 'font-light text-light';
      default:
        return 'font-bodytext text-bodytext';
    }
  };

  return (
    <Text className={getTextClasses()} style={[{ color }, style]} {...rest} />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
