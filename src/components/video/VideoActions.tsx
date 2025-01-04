import CutVideoIcon from "../../../assets/icons/cut-video.svg";
import ShareIcon from "../../../assets/icons/share.svg";

import { ScrollView, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

export function VideoActions({
  onEdit,
  onShare,
  currentTintColor,
}: {
  onEdit: () => void;
  onShare: () => void;
  currentTintColor: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
    >
      <ActionButton
        label="Editar"
        icon={<CutVideoIcon width={24} height={24} fill={currentTintColor} />}
        onPress={onEdit}
      />
      <ActionButton
        label="Compartilhar"
        icon={<ShareIcon width={24} height={24} fill={currentTintColor} />}
        onPress={onShare}
      />
    </ScrollView>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <View
      className="items-center flex-row gap-2 rounded-full px-4 py-2 bg-zinc-200 dark:bg-zinc-800"
      onTouchEnd={onPress}
    >
      {icon}
      <ThemedText type="smallText">{label}</ThemedText>
    </View>
  );
}
