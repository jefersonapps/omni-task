import { Media } from "@/contexts/MediaContext";
import { useMediaManager } from "@/hooks/editor/useMediaManager";
import { useColorScheme } from "nativewind";
import { memo } from "react";
import { MediaItem } from "./MediaItem";
import { Image } from "react-native";
import { router } from "expo-router";

export const ImageItem = memo(({ image }: { image: Media }) => {
  const { colorScheme } = useColorScheme();
  const { deleteMedia } = useMediaManager();

  const handleDelete = async () => {
    await deleteMedia(image.id);
  };

  const handleCropImage = () => {
    router.push({
      pathname: "/image/[id]",
      params: {
        id: image.id,
      },
    });
  };

  return (
    <MediaItem
      onPress={handleCropImage}
      onDelete={handleDelete}
      colorScheme={colorScheme}
      renderContent={() => (
        <Image
          source={{ uri: image.uri }}
          className="rounded-lg w-[100px] aspect-square border border-zinc-300 dark:border-zinc-700"
        />
      )}
    />
  );
});
