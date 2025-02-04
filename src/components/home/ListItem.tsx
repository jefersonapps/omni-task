import { memo } from "react";
import { View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

interface Item {
  id: string;
  title: string;
}

const ListComponent = ({ item }: { item: Item }) => {
  return (
    <View className="p-4 border rounded-md border-gray-300">
      <ThemedText>{item.title}</ThemedText>
      <ThemedText>{item.title}</ThemedText>
      <ThemedText>{item.title}</ThemedText>
      <ThemedText>{item.title}</ThemedText>
      <ThemedText>{item.title}</ThemedText>
    </View>
  );
};

export const ListItem = memo(ListComponent);
