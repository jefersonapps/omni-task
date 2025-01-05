import { Media } from "@/contexts/MediaContext";
import { useTheme } from "@/contexts/ThemeProvider";
import { useMediaManager } from "@/hooks/editor/useMediaManager";
import { useColorScheme } from "nativewind";
import { memo } from "react";
import { MediaItem } from "./MediaItem";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const AudioItem = memo(({ audio }: { audio: Media }) => {
  const { currentTintColor } = useTheme();
  const { colorScheme } = useColorScheme();
  const { deleteMedia } = useMediaManager();

  const handleDelete = async () => {
    await deleteMedia(audio.id);
  };

  return (
    <MediaItem
      onPress={() => console.log(`Tocar áudio: ${audio.uri}`)}
      onDelete={handleDelete}
      colorScheme={colorScheme}
      renderContent={() => (
        <View className="border relative border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 w-[100px] aspect-square justify-center items-center rounded-lg">
          <Ionicons name="musical-note" size={30} color={currentTintColor} />
        </View>
      )}
    />
  );
});
