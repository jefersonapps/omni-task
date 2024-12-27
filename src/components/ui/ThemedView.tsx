import { View, type ViewProps } from "react-native";
import { useTheme } from "../../contexts/ThemeProvider";
import { useColorScheme } from "nativewind";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { colors } = useTheme();
  const { colorScheme } = useColorScheme();

  const backgroundColor =
    colorScheme === "light"
      ? lightColor || colors.light.background
      : darkColor || colors.dark.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
