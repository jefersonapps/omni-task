import { Media } from "@/contexts/MediaContext";
import { useMediaManager } from "@/hooks/editor/useMediaManager";
import { useColorScheme } from "nativewind";
import { memo, useEffect, useState } from "react";
import { generateThumbnail } from "../utils/functions";
import { MediaItem } from "./MediaItem";
import { router } from "expo-router";
import { VideoInfo } from "@/app/(stack)/video/[uri]";
import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { normalizeVideoUri } from "@/components/video/utils/functions";

export const VideoItem = memo(({ video }: { video: Media }) => {
  const [thumbUri, setThumbUri] = useState<string>("");
  const { deleteMedia } = useMediaManager();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const fetchThumbnail = async () => {
      const fileUri = normalizeVideoUri(video.uri);

      const { thumbUri } = await generateThumbnail(fileUri);
      setThumbUri(thumbUri);
    };

    fetchThumbnail().catch(() => setThumbUri(""));
  }, [video.uri]);

  const handleDelete = async () => {
    await deleteMedia(video.id);
  };

  return (
    <MediaItem
      onPress={() =>
        router.push({
          pathname: "/video/[uri]",
          params: {
            uri: video.uri,
            id: video.id,
            info: JSON.stringify(video.info as VideoInfo),
          },
        })
      }
      onDelete={handleDelete}
      colorScheme={colorScheme}
      renderContent={() => (
        <>
          {thumbUri && (
            <>
              <Image
                source={{ uri: thumbUri }}
                className="rounded-lg w-[100px] aspect-square border border-zinc-300 dark:border-zinc-700"
              />
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
                    {(video.info.size / (1024 * 1024))
                      .toFixed(2)
                      .replace(".", ",")}{" "}
                    MB
                  </Text>
                </View>
              </LinearGradient>
            </>
          )}
        </>
      )}
    />
  );
});
