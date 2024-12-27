import {
  TouchableNativeFeedback,
  View,
  TouchableNativeFeedbackProps,
} from "react-native";
import clsx from "clsx";
import { ThemedText } from "./ThemedText";
import { Icon } from "./Icon";
import { useTheme } from "@/contexts/ThemeProvider";

export type ButtonProps = TouchableNativeFeedbackProps & {
  type?: "default" | "ghost" | "primary";
  className?: string;
};

function Button({
  children,
  type = "default",
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const { currentTintColor } = useTheme();
  return (
    <View className={clsx(disabled && "opacity-50", className)}>
      <TouchableNativeFeedback
        {...rest}
        background={TouchableNativeFeedback.Ripple(
          type === "primary" ? currentTintColor + 15 : "#a1a1aa",
          false
        )}
        disabled={disabled}
      >
        <View
          className={clsx(
            "flex-row items-center justify-center rounded-lg px-4 py-2 gap-2",

            type === "default" &&
              "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white",
            type === "ghost" &&
              "bg-transparent text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700",
            type === "primary" &&
              "text-white border border-zinc-300 dark:text-zinc-900 dark:border-zinc-700"
          )}
          style={
            type === "primary" && {
              backgroundColor: currentTintColor + 15,
            }
          }
        >
          {children}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

Button.Text = ThemedText;
Button.Icon = Icon;

export { Button };
