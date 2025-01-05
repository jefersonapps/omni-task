import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { listFiles, showEditor } from "react-native-video-trim";
import { Video, VideoDimensions } from "@/components/ui/Video";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { VideoDetails } from "@/components/video/VideoDetails";
import { VideoActions } from "@/components/video/VideoActions";
import { editorConfig } from "@/components/video/utils/editor-config";
import { ThemedText } from "@/components/ui/ThemedText";
import { useMediaContext } from "@/contexts/MediaContext";
import * as MediaLibrary from "expo-media-library";

export interface VideoInfo {
  name: string;
  type: string;
  dimensions?: VideoDimensions;
  size: number;
}

export default function VideoScreen() {
  const { uri, id, info } = useLocalSearchParams();
  const videoInfo: VideoInfo = JSON.parse(info as string);
  const source = uri as string;
  const { currentTintColor } = useTheme();
  const { updateMedia } = useMediaContext();

  const [video, setVideo] = useState<{
    id: string;
    uri: string;
    info?: VideoInfo;
  }>({
    id: id as string,
    uri: source,
    info: videoInfo,
  });

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener(
      "VideoTrim",
      async (event) => {
        if (event.name === "onFinishTrimming") {
          const files = await listFiles();
          if (files.length > 0) {
            const trimmedUri = files[files.length - 1];
            const fileInfo = await FileSystem.getInfoAsync(
              `file://${trimmedUri}`
            );

            if (!fileInfo.exists) {
              console.error("Arquivo de vídeo não encontrado.");
              return;
            }

            const asset = await MediaLibrary.createAssetAsync(trimmedUri);
            const updatedVideoInfo: VideoInfo = {
              name: trimmedUri.split("/").pop() || "video.mp4",
              type: trimmedUri.split(".").pop() || "mp4",
              dimensions: {
                width: asset.width || 1920,
                height: asset.height || 1080,
              },
              size: fileInfo.size || 0,
            };

            setVideo({
              id: id as string,
              uri: trimmedUri,
              info: updatedVideoInfo,
            });
          }
        }
      }
    );
    return () => subscription.remove();
  }, [id]);

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(video.uri, {
        mimeType: "video/*",
      });
    } catch (error) {
      console.log("Erro", "Não foi possível compartilhar o vídeo.");
    }
  };

  const handleOpenEditor = async () => {
    showEditor(video.uri, {
      jumpToPositionOnLoad: 1,
      ...editorConfig,
    });
  };

  const handleUpdateMedia = async () => {
    if (video) {
      try {
        updateMedia(video.id, {
          uri: `file://${video.uri}`,
          info: video.info!,
        });
        router.replace({ pathname: "/editor" });
      } catch (error) {
        console.log("Erro", "Falha ao atualizar as informações do vídeo.");
      }
    }
  };

  const handleRenameVideoFile = async (newName: string) => {
    try {
      if (!video) {
        console.log("Erro", "Nenhum vídeo disponível para renomear.");
        return;
      }

      const directory = video.uri.substring(0, video.uri.lastIndexOf("/"));
      const newUri = `${directory}/${newName}.${video.info?.type || "mp4"}`;

      await FileSystem.moveAsync({
        from: video.uri,
        to: newUri,
      });

      if (!video.info) return;

      const updatedVideoInfo: VideoInfo = {
        ...video.info,
        name: `${newName}.${video.info?.type || "mp4"}`,
      };

      setVideo({
        ...video,
        uri: newUri,
        info: updatedVideoInfo,
      });

      updateMedia(video.id, {
        uri: newUri,
        info: updatedVideoInfo,
      });

      console.log("Sucesso", "O arquivo foi renomeado com sucesso!");
    } catch (error) {
      console.error("Erro ao renomear o arquivo:", error);
      console.log("Erro", "Falha ao renomear o arquivo de vídeo.");
    }
  };

  return (
    <ThemedView className="flex-1">
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity activeOpacity={0.6} onPressIn={handleUpdateMedia}>
              <ThemedText type="link">Salvar</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />

      <View className="w-full justify-center items-center">
        <Video
          data={{
            uri: video?.uri,
            dimensions: video?.info?.dimensions ||
              videoInfo.dimensions || { width: 1920, height: 1080 },
          }}
          aspectRatio={16 / 9}
          style={{ borderRadius: 8 }}
          allowsPictureInPicture
        />
      </View>

      <View className="p-4 gap-4">
        <VideoDetails
          videoInfo={video?.info || videoInfo}
          onRename={handleRenameVideoFile}
        />
        <VideoActions
          onEdit={handleOpenEditor}
          onShare={handleShare}
          currentTintColor={currentTintColor}
        />
      </View>
    </ThemedView>
  );
}
