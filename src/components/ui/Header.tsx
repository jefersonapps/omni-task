import { Text, View } from "react-native";
import { Menu } from "./Menu";

export function Header({ title }: { title: string }) {
  return (
    <View className="flex-row items-center">
      <Menu />
      <View className="flex-1 justify-center">
        <Text className="text-2xl mr-[30px] font-semibold my-3 text-center text-gray-800 dark:text-white">
          {title}
        </Text>
      </View>
    </View>
  );
}
