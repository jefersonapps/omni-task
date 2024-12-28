import React, { forwardRef } from "react";
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

interface ButtonComponent
  extends React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<View>
  > {
  Text: typeof ThemedText;
  Icon: typeof Icon;
}

const Button = forwardRef<TouchableNativeFeedback, ButtonProps>(
  ({ children, type = "default", className, disabled, ...rest }, ref) => {
    const { currentTintColor } = useTheme();

    return (
      <View className={clsx(disabled && "opacity-50")}>
        <TouchableNativeFeedback
          {...rest}
          background={TouchableNativeFeedback.Ripple(
            type === "primary" ? currentTintColor + 15 : "#a1a1aa",
            false
          )}
          disabled={disabled}
          ref={ref}
        >
          <View
            className={clsx(
              "flex-row items-center justify-center rounded-lg px-4 py-2 gap-2",
              type === "default" &&
                "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white",
              type === "ghost" &&
                "bg-transparent text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700",
              type === "primary" &&
                "text-white border border-zinc-300 dark:text-zinc-900 dark:border-zinc-700",
              className
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
);

(Button as ButtonComponent).Text = ThemedText;
(Button as ButtonComponent).Icon = Icon;

const ExportedButton = Button as ButtonComponent;

export { ExportedButton as Button };
