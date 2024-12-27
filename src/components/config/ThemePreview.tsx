import { View } from "react-native";
import clsx from "clsx";

export function ThemePreview({
  colorScheme,
  isActive,
  currentTintColor,
}: {
  colorScheme: "light" | "dark" | "system";
  isActive: boolean;
  currentTintColor: string;
}) {
  return (
    <View
      className="h-32 w-20 mx-2 border-2 rounded-md overflow-hidden"
      style={{
        borderColor: isActive
          ? currentTintColor
          : colorScheme === "light"
          ? "#d4d4d8"
          : "#52525b",
      }}
    >
      {colorScheme === "system" ? (
        <View className="flex-1 p-2 bg-white relative">
          <View className="bg-zinc-400 h-3 rounded w-12 mb-2" />
          <View className="bg-zinc-400 h-3 rounded w-16 mb-1" />
          <View className="bg-zinc-400 h-3 rounded w-10" />
          <View className="absolute bg-zinc-800 py-2 top-0 left-9 right-0 bottom-0 overflow-hidden">
            <View className="bg-zinc-400 h-3 rounded-r w-12 mb-2 -translate-x-1/2" />
            <View className="bg-zinc-400 h-3 rounded-r w-16 mb-1 -translate-x-1/2" />
            <View className="bg-zinc-400 h-3 rounded-r w-10 -translate-x-1/2" />
          </View>
        </View>
      ) : (
        <View
          className={clsx(
            "flex-1 p-2",
            colorScheme === "light" && "bg-white text-zinc-800",
            colorScheme === "dark" && "bg-zinc-800 text-white"
          )}
        >
          <View className="bg-zinc-400 h-3 rounded w-12 mb-2" />
          <View className="bg-zinc-400 h-3 rounded w-16 mb-1" />
          <View className="bg-zinc-400 h-3 rounded w-10" />
        </View>
      )}
    </View>
  );
}
