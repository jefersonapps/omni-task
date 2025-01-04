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
import { useColorScheme } from "nativewind";

type ButtonType = "default" | "ghost" | "primary";
type ButtonVariant = "square" | "rounded" | "pill" | "circle" | "float";

export type ButtonProps = TouchableNativeFeedbackProps & {
  type?: ButtonType;
  filled?: boolean;
  variant?: ButtonVariant;
  className?: string;
  noRipple?: boolean;
};

interface ButtonComponent
  extends React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<View>
  > {
  Text: typeof ThemedText;
  Icon: typeof Icon;
}

const Button = forwardRef<TouchableNativeFeedback, ButtonProps>(
  (
    {
      children,
      type = "default",
      variant = "rounded",
      className,
      disabled,
      noRipple,
      filled,
      ...rest
    },
    ref
  ) => {
    const { currentTintColor, colors } = useTheme();
    const { colorScheme } = useColorScheme();

    const radiusVariants: Record<ButtonVariant, string> = {
      square: "rounded",
      rounded: "rounded-lg",
      circle: "rounded-full",
      pill: "rounded-2xl",
      float: "rounded-xl",
    };

    return (
      <View
        className={clsx(
          variant === "float" && "absolute bottom-4 right-4",
          "overflow-hidden",
          radiusVariants[variant],
          disabled && "opacity-50"
        )}
      >
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
            className={clsx(radiusVariants[variant])}
            style={
              (variant === "float" || filled) && {
                backgroundColor: colors[colorScheme || "light"].background,
              }
            }
          >
            <View
              className={clsx(
                "flex-row items-center justify-center",
                variant === "float" && "px-5 py-3.5",
                variant === "circle" && "h-full aspect-square",
                variant === "pill" && "px-4 py-2 gap-2",
                variant === "square" && "px-4 py-2 gap-2",
                variant === "rounded" && "px-4 py-2 gap-2",
                radiusVariants[variant],
                type === "default" &&
                  "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white",
                type === "ghost" &&
                  "bg-transparent text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700",
                type === "primary" &&
                  "text-white border border-zinc-300 dark:text-zinc-900 dark:border-zinc-700",
                className
              )}
              style={[
                type === "primary" && {
                  backgroundColor: currentTintColor + 15,
                },
              ]}
            >
              {children}
            </View>
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
