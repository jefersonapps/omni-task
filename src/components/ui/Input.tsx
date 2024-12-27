import clsx from "clsx";
import { TextInput, TextInputProps, View } from "react-native";
import { Icon } from "./Icon";

function Input({ children, ...rest }: TextInputProps) {
  return (
    <View
      className={clsx(
        "flex-1 flex-row bg-transparent rounded-lg border border-zinc-300 px-3 w-full",
        "dark:border-zinc-700"
      )}
    >
      <TextInput
        {...rest}
        className={clsx(
          "flex-1 text-zinc-900",
          "dark:text-white",
          "placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
        )}
      />
      <View className="ml-2 flex-row items-center">{children}</View>
    </View>
  );
}

Input.Icon = Icon;

export { Input };
