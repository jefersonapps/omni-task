import { TouchableOpacity, View } from "react-native";
import { DeleteButton } from "./DeleteButton";

interface MediaItemProps {
  renderContent: () => React.ReactNode;
  onPress: () => void;
  onDelete: () => void;
  colorScheme?: string;
}

export function MediaItem({
  renderContent,
  onPress,
  onDelete,
  colorScheme,
}: MediaItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View className="relative rounded-lg overflow-hidden">
        {renderContent()}
        <DeleteButton onPress={onDelete} colorScheme={colorScheme} />
      </View>
    </TouchableOpacity>
  );
}
