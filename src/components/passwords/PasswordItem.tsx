import { memo } from "react";
import { View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

interface Item {
  id: string;
  serviceName: string;
}

const PasswordItemComponent = ({ item }: { item: Item }) => {
  return (
    <View className="p-4 border border-gray-300">
      <ThemedText>{item.serviceName}</ThemedText>
    </View>
  );
};

export const PasswordItem = memo(PasswordItemComponent);
