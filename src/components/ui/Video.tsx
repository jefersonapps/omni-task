import { MediaDimensions } from "@/contexts/MediaContext";
import {
  isPictureInPictureSupported,
  useVideoPlayer,
  VideoView,
  VideoViewProps,
} from "expo-video";

import { View, useWindowDimensions, ViewStyle } from "react-native";

export interface VideoProps extends Omit<VideoViewProps, "player"> {
  data: {
    uri: string;
    dimensions: MediaDimensions;
  };
  allowsPictureInPicture?: boolean;
  allowsNativeControls?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: number;
  style: ViewStyle;
}

export function Video({
  data,
  allowsPictureInPicture = false,
  allowsNativeControls = true,
  width: providedWidth,
  height: providedHeight,
  aspectRatio: providedAspectRatio,
  style,
  ...rest
}: VideoProps) {
  const player = useVideoPlayer(data.uri, (player) => {
    player.loop = false;
  });

  const { width: containerWidth } = useWindowDimensions();

  const aspectRatio =
    providedAspectRatio || data.dimensions.width / data.dimensions.height;

  let width = (providedWidth || containerWidth) - 16;
  let height = width / aspectRatio + 150;

  if (providedHeight && (!providedWidth || height > providedHeight)) {
    height = providedHeight;
    width = height * aspectRatio;
  }

  return (
    <View className="w-full items-center justify-center border border-zinc-300 dark:border-zinc-700 bg-zinc-950 rounded-xl">
      <VideoView
        {...rest}
        style={{
          width: width - 28,
          height,
          ...style,
        }}
        player={player}
        allowsPictureInPicture={
          isPictureInPictureSupported() && allowsPictureInPicture
        }
        startsPictureInPictureAutomatically={
          isPictureInPictureSupported() && allowsPictureInPicture
        }
        allowsFullscreen
        nativeControls={allowsNativeControls}
        showsTimecodes={false}
      />
    </View>
  );
}
