import { Media } from "@/contexts/MediaContext";
import { useTheme } from "@/contexts/ThemeProvider";
import { useMediaManager } from "@/hooks/editor/useMediaManager";
import { useColorScheme } from "nativewind";
import { memo } from "react";
import { MediaItem } from "./MediaItem";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export const AudioItem = memo(({ audio }: { audio: Media }) => {
  const { currentTintColor } = useTheme();
  const { colorScheme } = useColorScheme();
  const { deleteMedia } = useMediaManager();

  const handleDelete = async () => {
    await deleteMedia(audio.id);
  };

  return (
    <MediaItem
      onPress={() =>
        router.push({ pathname: "/audio/[id]", params: { id: audio.id } })
      }
      onDelete={handleDelete}
      colorScheme={colorScheme}
      renderContent={() => {
        return (
          <View className="border relative border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 w-[100px] aspect-square justify-center items-center rounded-lg">
            <Ionicons name="musical-note" size={30} color={currentTintColor} />

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              className="absolute left-0 right-0 bottom-0 h-10 justify-end p-1"
            >
              <View className="flex-row gap-0.5">
                <Entypo name="controller-play" size={16} color="white" />
                <Text
                  className="text-white text-xs text-start"
                  numberOfLines={1}
                >
                  {audio.info.name}
                </Text>
              </View>
            </LinearGradient>
          </View>
        );
      }}
    />
  );
});
