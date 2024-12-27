import { View, Pressable } from "react-native";
import clsx from "clsx";
import { ScrollView } from "react-native-gesture-handler";

export function ColorPicker({
  colors,
  activeColor,
  onSelect,
}: {
  colors: {
    label: string;
    hexValue: string;
  }[];
  activeColor: string;
  onSelect: (color: string) => void;
}) {
  return (
    <View className="flex-row justify-center">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="p-2 flex-row"
        className="border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-100 dark:bg-zinc-800"
      >
        {colors.map((color) => (
          <Pressable
            key={color.label}
            onPress={() => onSelect(color.hexValue)}
            className={clsx(
              "h-10 w-10 rounded-full mx-1",
              activeColor === color.hexValue &&
                "border-[3px] border-zinc-600 dark:border-zinc-200"
            )}
            style={{
              backgroundColor: color.hexValue,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
