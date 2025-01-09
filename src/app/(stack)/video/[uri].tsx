import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
} from "react-native";
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
import { normalizeVideoUri } from "@/components/video/utils/functions";
import { ShareOptions } from "react-native-share";
import Share from "react-native-share";

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
  const [isPending, setIsPending] = useState(false);

  const [video, setVideo] = useState<{
    id: string;
    uri: string;
    info?: VideoInfo;
  }>({
    id: id as string,
    uri: source,
    info: videoInfo,
  });

  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (!isPending) {
        navigation.dispatch(e.data.action);
      }
    });
  }, []);

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener(
      "VideoTrim",
      async (event) => {
        if (event.name === "onFinishTrimming") {
          setIsPending(true);
          const files = await listFiles();
          if (files.length > 0) {
            const trimmedUri = files[files.length - 1];
            const fileInfo = await FileSystem.getInfoAsync(
              normalizeVideoUri(trimmedUri)
            );

            if (!fileInfo.exists) {
              console.error("Arquivo de vídeo não encontrado.");
              return;
            }

            const asset = await MediaLibrary.createAssetAsync(trimmedUri);

            const newVideoName = video.info?.name
              ? video.info.name.split(".")[0] + "_cortado"
              : trimmedUri.split("/").pop()?.split(".")[0] || "video";

            const updatedVideoInfo: VideoInfo = {
              name: newVideoName,
              type: trimmedUri.split(".").pop() || "mp4",
              dimensions: {
                width: asset.width || 1920,
                height: asset.height || 1080,
              },
              size: fileInfo.size || 0,
            };

            setVideo({
              id: id as string,
              uri: normalizeVideoUri(trimmedUri),
              info: updatedVideoInfo,
            });
            setIsPending(false);
          }
        }
      }
    );
    return () => subscription.remove();
  }, [id, video]);

  const handleShare = async () => {
    const options = {
      url: video.uri,
      filename: video.info?.name || "video",
      type: "video/*",
      excludedActivityTypes: ["com.jefersonapps.OmniTask"],
      failOnCancel: false,
    } as ShareOptions;
    try {
      await Share.open(options);
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  const handleOpenEditor = async () => {
    if (video && !isPending) {
      showEditor(video.uri, {
        jumpToPositionOnLoad: 1,
        ...editorConfig,
      });
    }
  };

  const handleUpdateMedia = async () => {
    if (video && !isPending) {
      try {
        updateMedia(video.id, {
          uri: normalizeVideoUri(video.uri),
          info: video.info!,
        });
        router.back();
      } catch (error) {
        console.error("Erro", "Falha ao atualizar as informações do vídeo.");
      }
    }
  };

  const handleRenameVideoFile = async (newName: string) => {
    try {
      if (!video) {
        console.error("Erro", "Nenhum vídeo disponível para renomear.");
        return;
      }

      const directory = video.uri.substring(0, video.uri.lastIndexOf("/"));
      const newUri = `${directory}/${newName}.${video.info?.type || "mp4"}`;

      const originalFileUri = normalizeVideoUri(video.uri);
      const newFileUri = normalizeVideoUri(newUri);

      setIsPending(true);
      await FileSystem.moveAsync({
        from: originalFileUri,
        to: newFileUri,
      });

      if (!video.info) return;

      const updatedVideoInfo: VideoInfo = {
        ...video.info,
        name: newName,
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
      setIsPending(false);
    } catch (error) {
      console.error("Erro ao renomear o arquivo:", error);
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
            dimensions: video?.info?.dimensions || {
              width: 1920,
              height: 1080,
            },
          }}
          aspectRatio={16 / 9}
          style={{ borderRadius: 8 }}
          allowsPictureInPicture
        />
      </View>

      <View className="p-4 gap-4">
        <VideoDetails
          videoInfo={
            video?.info || {
              name: "",
              size: 0,
              type: "",
            }
          }
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
