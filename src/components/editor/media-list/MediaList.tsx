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
  const isVideo = useCallback(
    (media: Media) => media.info.mimeType.includes("video"),
    []
  );
  const isAudio = useCallback(
    (item: Media) => item.info.mimeType.includes("audio"),
    []
  );

  const renderMediaItem = useCallback(
    ({ item }: { item: Media }) => {
      if (isVideo(item)) return <VideoItem video={item} />;
      if (isAudio(item)) return <AudioItem audio={item} />;
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
