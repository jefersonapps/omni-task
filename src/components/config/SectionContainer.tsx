import clsx from "clsx";
import { View, ViewProps } from "react-native";

type SectionContainerProps = ViewProps & {
  children: React.ReactNode;
};

export function SectionContainer({ children, ...rest }: SectionContainerProps) {
  return (
    <View
      {...rest}
      className={clsx(
        "bg-white dark:bg-zinc-800 rounded-2xl p-4 gap-4",
        rest.className
      )}
    >
      {children}
    </View>
  );
}
