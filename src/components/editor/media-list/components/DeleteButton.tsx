import { Button } from "@/components/ui/Button";
import { View } from "react-native";

interface DeleteButtonProps {
  onPress: () => void;
  colorScheme?: string;
}

export function DeleteButton({ onPress, colorScheme }: DeleteButtonProps) {
  return (
    <View className="absolute right-2 top-2 z-50">
      <Button type="primary" variant="tinyCircle" filled onPress={onPress}>
        <Button.Icon
          name="cross"
          color={colorScheme === "dark" ? "white" : "black"}
          size={18}
        />
      </Button>
    </View>
  );
}
