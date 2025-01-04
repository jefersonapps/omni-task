import { useTheme } from "@/contexts/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { useColorScheme } from "nativewind";
import { isValidElement } from "react";
import { TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";

interface AddMediaButtonProps extends TouchableOpacityProps {
  customIcon?: React.ReactNode;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export function AddMediaButton({
  className,
  customIcon,
  iconName,
  ...rest
}: AddMediaButtonProps) {
  const { colors } = useTheme();
  const { colorScheme } = useColorScheme();
  return (
    <TouchableOpacity
      {...rest}
      className={clsx(
        "rounded-lg border-2 border-zinc-200 dark:border-zinc-500 aspect-square flex items-center justify-center",
        className
      )}
    >
      {isValidElement(customIcon) ? (
        customIcon
      ) : (
        <Ionicons
          name={iconName || "add-circle"}
          size={30}
          color={colors[colorScheme || "light"].icon}
        />
      )}
    </TouchableOpacity>
  );
}
