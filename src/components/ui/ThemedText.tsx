import { Text, type TextProps } from "react-native";
import { useTheme } from "../../contexts/ThemeProvider";
import { useColorScheme } from "nativewind";
import clsx from "clsx";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "primary"
    | "primarySemiBold"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "smallText";
};

export function ThemedText({
  lightColor,
  darkColor,
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  const { colors, currentTintColor } = useTheme();
  const { colorScheme } = useColorScheme();

  const color =
    colorScheme === "light"
      ? lightColor || colors.light.text
      : darkColor || colors.dark.text;

  return (
    <Text
      className={clsx(
        "text-ellipsis",
        {
          "text-base leading-6": type === "default",
          "text-base leading-6 ": type === "primary",
          "text-3xl font-bold leading-8": type === "title",
          "text-base leading-6 font-semibold": type === "defaultSemiBold",
          "text-base leading-6 font-semibold ": type === "primarySemiBold",
          "text-xl font-bold": type === "subtitle",
          "text-base leading-7": type === "link",
          "text-sm leading-6": type === "smallText",
        },
        className
      )}
      style={
        !className?.includes("text") && {
          color:
            type === "primary" || type === "primarySemiBold" || type === "link"
              ? currentTintColor
              : color,
        }
      }
      {...rest}
    />
  );
}
