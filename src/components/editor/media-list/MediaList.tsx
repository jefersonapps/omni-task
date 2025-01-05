import { useCallback, memo } from "react";
import { FlatList } from "react-native";

import { Media } from "@/contexts/MediaContext";
import { VideoItem } from "./components/VideoItem";
import { AudioItem } from "./components/AudioItem";
import { ImageItem } from "./components/ImageItem";

interface MediaListProps {
  media: Media[];
}

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
      if (isAudio(item.uri)) return <AudioItem audio={item} />;
      return <ImageItem image={item} />;
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
