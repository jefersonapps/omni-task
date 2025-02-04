import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  View,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { listFiles, showEditor } from "react-native-video-trim";
import { Video } from "@/components/ui/Video";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { VideoActions } from "@/components/video/VideoActions";
import { editorConfig } from "@/components/video/utils/editor-config";
import { ThemedText } from "@/components/ui/ThemedText";
import { Media, MediaInfo, useMediaContext } from "@/contexts/MediaContext";
import * as MediaLibrary from "expo-media-library";
import { normalizeFileUri } from "@/utils/functions";
import { MediaDetails } from "@/components/ui/MediaDetails";
import { usePreventNavigation } from "@/hooks/usePreventNavigation";
import { useShareMedia } from "@/hooks/useShareMedia";
import { useRenameMediaFile } from "@/hooks/useRenameMediaFile";

export default function AudioScreen() {
  const { id } = useLocalSearchParams();
  const { currentTintColor } = useTheme();
  const { updateMedia } = useMediaContext();
  const [isPending, setIsPending] = useState(false);

  const { media } = useMediaContext();

  const originalMedia = useMemo(() => {
    const mediaData = media.find((media) => media.id === (id as string));

    return mediaData;
  }, []);

  const [audio, setAudio] = useState<Media>({
    id: id as string,
    uri: originalMedia?.uri || "",
    info: originalMedia?.info || {
      name: "audio",
      type: "mp3",
      mimeType: "audio/mp3",
      dimensions: {
        width: 0,
        height: 0,
      },
      size: 0,
    },
  });

  usePreventNavigation(isPending);

  const { renameMediaFile } = useRenameMediaFile(
    audio,
    updateMedia,
    setIsPending,
    setAudio
  );

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
              normalizeFileUri(trimmedUri)
            );

            if (!fileInfo.exists) {
              console.error("Arquivo de áudio não encontrado.");
              return;
            }

            const asset = await MediaLibrary.createAssetAsync(trimmedUri);

            const newAudioName = audio.info?.name
              ? audio.info.name.split(".")[0] + "_cortado"
              : trimmedUri.split("/").pop()?.split(".")[0] || "audio";

            const updatedAudioInfo: MediaInfo = {
              name: newAudioName,
              type: trimmedUri.split(".").pop() || "mp3",
              mimeType: `audio/${trimmedUri.split(".").pop() || "mp3"}`,
              dimensions: {
                width: asset.width || 1920,
                height: asset.height || 1080,
              },
              size: fileInfo.size || 0,
            };

            setAudio({
              id: id as string,
              uri: normalizeFileUri(trimmedUri),
              info: updatedAudioInfo,
            });

            setIsPending(false);
          }
        }
      }
    );
    return () => subscription.remove();
  }, [id, audio]);

  console.log(audio.uri);

  const { handleShare } = useShareMedia({
    uri: audio.uri,
    info: {
      name: audio.info?.name || "audio",
      mimeType: audio.info?.mimeType || "audio/mp3",
    },
  });

  const handleOpenEditor = async () => {
    if (audio && !isPending) {
      showEditor(audio.uri, {
        ...editorConfig,
        type: "audio",
        outputExt: "mp3",
      });
    }
  };

  const handleUpdateMedia = async () => {
    if (audio && !isPending) {
      try {
        updateMedia(audio.id, {
          uri: normalizeFileUri(audio.uri),
          info: audio.info!,
        });
        router.back();
      } catch (error) {
        console.error("Erro", "Falha ao atualizar as informações do vídeo.");
      }
    }
  };

  return (
    <ThemedView className="flex-1">
      <Stack.Screen
        options={{
          title: "Detalhes do Áudio",
          headerRight: () => (
            <TouchableOpacity activeOpacity={0.6} onPressIn={handleUpdateMedia}>
              <ThemedText type="link">Salvar</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerClassName="p-4 gap-4">
        <View className="w-full justify-center items-center">
          <Video
            data={{
              uri: audio?.uri,
              dimensions: audio?.info?.dimensions || {
                width: 1920,
                height: 1080,
              },
            }}
            aspectRatio={16 / 9}
            style={{ borderRadius: 8 }}
            allowsPictureInPicture
            showWavesOverlay
          />
        </View>

        <View className="gap-4">
          <MediaDetails
            isRenamePending={isPending}
            mediaInfo={
              audio?.info || {
                name: "",
                size: 0,
                type: "",
              }
            }
            onRename={renameMediaFile}
          />
          <VideoActions
            onEdit={handleOpenEditor}
            onShare={handleShare}
            currentTintColor={currentTintColor}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
