import { useTheme } from "@/contexts/ThemeProvider";
import { Entypo } from "@expo/vector-icons";
import clsx from "clsx";
import { cloneElement, isValidElement } from "react";
import { View, ViewProps } from "react-native";

interface IconProps extends ViewProps {
  customIcon?: React.ReactNode;
  name?: keyof typeof Entypo.glyphMap;
  size?: number;
  color?: string;
}

export function Icon({
  customIcon,
  name,
  size = 24,
  color,
  ...rest
}: IconProps) {
  const { currentTintColor } = useTheme();
  return (
    <View
      {...rest}
      className={clsx("flex-row items-center justify-center", rest.className)}
    >
      {isValidElement(customIcon) ? (
        cloneElement(customIcon)
      ) : (
        <Entypo name={name} size={size} color={color ?? currentTintColor} />
      )}
    </View>
  );
}
