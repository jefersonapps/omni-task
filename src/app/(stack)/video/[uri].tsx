import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Alert, NativeEventEmitter, NativeModules } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { listFiles, showEditor } from "react-native-video-trim";
import { Video, VideoDimensions } from "@/components/ui/Video";
import { ThemedView } from "@/components/ui/ThemedView";

import { useTheme } from "@/contexts/ThemeProvider";
import { VideoDetails } from "@/components/video/VideoDetails";
import { VideoActions } from "@/components/video/VideoActions";
import { editorConfig } from "@/components/video/utils/editor-config";

export interface VideoInfo {
  name: string;
  type: string;
  duration?: number;
  dimensions?: VideoDimensions;
  size: number;
}

export default function VideoScreen() {
  const { uri, info } = useLocalSearchParams();
  const videoInfo: VideoInfo = JSON.parse(info as string);
  const source = uri as string;
  const { currentTintColor } = useTheme();

  const [media, setMedia] = useState<{ id: string; uri: string }>();

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener(
      "VideoTrim",
      async (event) => {
        if (event.name === "onFinishTrimming") {
          const files = await listFiles();
          if (files.length > 0) {
            const trimmedUri = files[files.length - 1];
            const newId = Crypto.randomUUID();
            setMedia({ id: newId, uri: trimmedUri });
          }
        }
      }
    );
    return () => subscription.remove();
  }, []);

  const handleShare = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(source);
      if (!fileInfo.exists) {
        Alert.alert("Erro", "O arquivo de vídeo não foi encontrado.");
        return;
      }
      await Sharing.shareAsync(source, {
        mimeType: videoInfo?.type || "video/mp4",
        dialogTitle: `Compartilhar vídeo: ${videoInfo?.name}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o vídeo.");
    }
  };

  const handleOpenEditor = async () => {
    showEditor(source, {
      maxDuration: videoInfo.duration || 60,
    });
  };

  return (
    <ThemedView className="flex-1">
      <View className="w-full justify-center items-center">
        <Video
          data={{
            uri: media && media.uri ? media.uri : source,
            dimensions: videoInfo.dimensions || { width: 1920, height: 1080 },
            ...editorConfig,
          }}
          aspectRatio={16 / 9}
          style={{ borderRadius: 8 }}
          allowsPictureInPicture
        />
      </View>

      <View className="p-4 gap-4">
        <VideoDetails videoInfo={videoInfo} />

        <VideoActions
          onEdit={handleOpenEditor}
          onShare={handleShare}
          currentTintColor={currentTintColor}
        />
      </View>
    </ThemedView>
  );
}
