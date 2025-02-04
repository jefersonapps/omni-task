import { MediaDimensions } from "@/contexts/MediaContext";
import {
  isPictureInPictureSupported,
  useVideoPlayer,
  VideoView,
  VideoViewProps,
} from "expo-video";

import LottieView from "lottie-react-native";

import { View, useWindowDimensions, ViewStyle } from "react-native";

import { useMemo } from "react";
import {
  getModifiedAnimation,
  hexToRgb,
  lightenRGBColor,
  saturateRGBColor,
} from "@/utils/functions";
import { useTheme } from "@/contexts/ThemeProvider";

export interface VideoProps extends Omit<VideoViewProps, "player"> {
  data: {
    uri: string;
    dimensions: MediaDimensions;
  };
  allowsPictureInPicture?: boolean;
  allowsNativeControls?: boolean;
  showWavesOverlay?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: number;
  style: ViewStyle;
}

export function Video({
  data,
  allowsPictureInPicture = false,
  allowsNativeControls = true,
  showWavesOverlay = false,
  width: providedWidth,
  height: providedHeight,
  aspectRatio: providedAspectRatio,
  style,
  ...rest
}: VideoProps) {
  const player = useVideoPlayer(data.uri, (player) => {
    player.loop = false;
    player.showNowPlayingNotification = true;
  });

  const { width: containerWidth } = useWindowDimensions();

  const { currentTintColor } = useTheme();

  const aspectRatio =
    providedAspectRatio || data.dimensions.width / data.dimensions.height;

  let width = (providedWidth || containerWidth) - 16;
  let height = width / aspectRatio + 150;

  if (providedHeight && (!providedWidth || height > providedHeight)) {
    height = providedHeight;
    width = height * aspectRatio;
  }

  const modifiedAnimation = useMemo(() => {
    const tintColor = hexToRgb(currentTintColor);
    const color2 = saturateRGBColor(tintColor, 1);
    const color1 = lightenRGBColor(tintColor, 0.4);

    return getModifiedAnimation(color1, color2);
  }, []);

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
      {showWavesOverlay && (
        <View className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none rounded-lg overflow-hidden">
          <LottieView
            autoPlay
            style={{
              width: containerWidth,
              height: 200,
              transform: [{ scaleX: 1.5 }, { scaleY: -3 }, { translateY: 5 }],
            }}
            source={modifiedAnimation}
          />
        </View>
      )}
    </View>
  );
}
