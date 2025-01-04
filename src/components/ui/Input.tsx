import React, { forwardRef } from "react";
import clsx from "clsx";
import { TextInput, TextInputProps, View } from "react-native";
import { Icon } from "./Icon";
import { useTheme } from "@/contexts/ThemeProvider";

interface InputComponent
  extends React.ForwardRefExoticComponent<
    TextInputProps & React.RefAttributes<TextInput>
  > {
  Icon: typeof Icon;
}

const Input = forwardRef<TextInput, TextInputProps>(
  ({ children, ...rest }, ref) => {
    const { currentTintColor } = useTheme();
    return (
      <View
        className={clsx(
          "flex-1 flex-row bg-transparent rounded-lg border border-zinc-300 px-3 w-full min-h-14",
          "dark:border-zinc-700"
        )}
      >
        <TextInput
          ref={ref}
          {...rest}
          cursorColor={currentTintColor}
          selectionHandleColor={currentTintColor}
          className={clsx(
            "flex-1 text-zinc-900",
            "dark:text-white",
            "placeholder:text-zinc-500 dark:placeholder:text-zinc-400",
            rest.className
          )}
        />
        <View className="ml-2 flex-row items-center">{children}</View>
      </View>
    );
  }
);

(Input as InputComponent).Icon = Icon;

const ExportedInput = Input as InputComponent;

export { ExportedInput as Input };
