import { useCallback, useState, useEffect, memo } from "react";
import { FlatList, View, TouchableOpacity, Image, Text } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Media } from "@/hooks/editor/useMediaManager";
import { VideoInfo } from "@/app/(stack)/video/[uri]";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeProvider";
import * as VideoThumbnails from "expo-video-thumbnails";
import { formatDuration } from "@/utils/functions";
import { LinearGradient } from "expo-linear-gradient";

interface MediaListProps {
  media: Media[];
}

const generateThumbnail = async (videoUri: string) => {
  try {
    const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: 0,
      }
    );
    return { thumbUri };
  } catch (e) {
    console.warn(e);
  }
  return { thumbUri: "" };
};

const VideoItem = memo(({ video }: { video: Media }) => {
  const [thumbUri, setThumbUri] = useState<string>("");

  useEffect(() => {
    const fetchThumbnail = async () => {
      const { thumbUri } = await generateThumbnail(video.uri);
      setThumbUri(thumbUri);
    };

    fetchThumbnail().catch(() => setThumbUri(""));
  }, [video.uri]);

  return (
    <View>
      {thumbUri && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/video/[uri]",
              params: {
                uri: video.uri,
                info: JSON.stringify(video.info as VideoInfo),
              },
            })
          }
        >
          <View className="relative">
            <Image
              source={{ uri: thumbUri }}
              className="rounded-lg w-[100px] aspect-square border border-zinc-300 dark:border-zinc-700"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              className="absolute left-0 right-0 bottom-0 h-10 justify-end p-1"
            >
              <View className="flex-row gap-0.5">
                <Entypo name="controller-play" size={16} color="white" />
                <Text
                  className="text-white text-xs text-start"
                  numberOfLines={1}
                >
                  {formatDuration((video.info.duration || 0) / 1000)}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
});

const AudioItem = memo(({ uri }: { uri: string }) => {
  const { currentTintColor } = useTheme();

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => console.log(`Tocar áudio: ${uri}`)}
      >
        <View className="border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 w-[100px] aspect-square justify-center items-center rounded-lg">
          <Ionicons name="musical-note" size={30} color={currentTintColor} />
        </View>
      </TouchableOpacity>
    </View>
  );
});

const ImageItem = memo(({ uri }: { uri: string }) => (
  <Image
    source={{ uri }}
    className="rounded-lg w-[100px] aspect-square border border-zinc-300 dark:border-zinc-700"
  />
));

export const MediaList = memo(({ media }: MediaListProps) => {
  const isVideo = useCallback((uri: string) => uri.endsWith(".mp4"), []);
  const isAudio = useCallback(
    (uri: string) =>
      uri.match(
        /\.(mp3|wav|ogg|aac|flac|m4a|aiff|wma|ape|ac3|alac|mka|opus|m4p|oga|spx|tta)$/
      ),
    []
  );

  const renderMediaItem = useCallback(
    ({ item }: { item: Media }) => {
      if (isVideo(item.uri)) return <VideoItem video={item} />;
      if (isAudio(item.uri)) return <AudioItem uri={item.uri} />;
      return <ImageItem uri={item.uri} />;
    },
    [isVideo, isAudio]
  );

  return (
    <FlatList
      data={media}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
      horizontal
      renderItem={renderMediaItem}
      keyExtractor={(item) => item.id}
    />
  );
});
