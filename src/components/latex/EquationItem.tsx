import { memo } from "react";
import { View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

interface Item {
  id: string;
  equation: string;
}

const EquationItemComponent = ({ item }: { item: Item }) => {
  return (
    <View className="p-4 border border-gray-300">
      <ThemedText>{item.equation}</ThemedText>
    </View>
  );
};

export const EquationItem = memo(EquationItemComponent);
