import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { ThemedText } from "@/components/ui/ThemedText";
import { Media, useMediaContext } from "@/contexts/MediaContext";
import { getAspectRatio, normalizeFileUri } from "@/utils/functions";
import { ImageCropper } from "@/components/image/image-cropper/ImageCropper";
import { Button } from "@/components/ui/Button";
import { ImageView } from "@/components/image/image-viewing/ImageView";
import { Feather, Octicons } from "@expo/vector-icons";
import ShareIcon from "../../../../assets/icons/share.svg";
import { MediaDetails } from "@/components/ui/MediaDetails";
import { usePreventNavigation } from "@/hooks/usePreventNavigation";
import { useShareMedia } from "@/hooks/useShareMedia";
import { useRenameMediaFile } from "@/hooks/useRenameMediaFile";

export default function ImageScreen() {
  const { id } = useLocalSearchParams();
  const { currentTintColor } = useTheme();
  const { updateMedia } = useMediaContext();
  const [isPending, setIsPending] = useState(false);
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  const { media } = useMediaContext();

  const originalMedia = useMemo(() => {
    const mediaData = media.find((media) => media.id === (id as string));

    return mediaData;
  }, []);

  const [image, setImage] = useState<Media>(() => {
    const newMedia: Media = {
      id: id as string,
      uri: originalMedia?.uri || "",
      info: originalMedia?.info || {
        name: "image",
        type: "jpg",
        dimensions: {
          width: 0,
          height: 0,
        },
        size: 0,
      },
    };

    return newMedia;
  });

  usePreventNavigation(isPending);

  const { handleShare } = useShareMedia({
    uri: image.uri,
    info: {
      name: image.info?.name || "image",
      type: image.info?.type || "image/jpg",
    },
  });

  const handleUpdateMedia = async () => {
    if (image && !isPending) {
      try {
        updateMedia(image.id, {
          uri: normalizeFileUri(image.uri),
          info: image.info!,
        });
        router.back();
      } catch (error) {
        console.error("Erro", "Falha ao atualizar as informações do vídeo.");
      }
    }
  };

  const { renameMediaFile } = useRenameMediaFile(
    image,
    updateMedia,
    setIsPending,
    setImage
  );

  return (
    <ThemedView className="flex-1">
      <Stack.Screen
        options={{
          title: "Detalhes da Imagem",
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPressIn={handleUpdateMedia}
              className="pr-4"
            >
              <ThemedText type="link" className="text-lg">
                Salvar
              </ThemedText>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerClassName="flex-1 p-4 gap-4">
        <TouchableOpacity
          onPress={() => setIsImageViewerVisible(true)}
          activeOpacity={0.8}
        >
          <View className="bg-transparent rounded-2xl justify-center items-center overflow-hidden shadow-lg shadow-black/30">
            <Image
              source={{ uri: image?.uri }}
              className="rounded-xl"
              style={{
                width: "100%",
                maxHeight: 300,
                aspectRatio:
                  image.info?.dimensions?.width && image.info.dimensions.height
                    ? getAspectRatio(
                        image.info.dimensions.width,
                        image.info.dimensions.height
                      )
                    : 16 / 9,
              }}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
        <MediaDetails
          isRenamePending={isPending}
          mediaInfo={image.info}
          onRename={renameMediaFile}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-2"
        >
          <Button
            type="primary"
            variant="rounded"
            onPress={() => setIsImageViewerVisible(true)}
          >
            <Button.Icon
              customIcon={
                <Octicons
                  name="screen-full"
                  size={20}
                  color={currentTintColor}
                />
              }
            />
            <Button.Text>Ampliar</Button.Text>
          </Button>
          <Button
            type="primary"
            variant="rounded"
            onPress={() => setIsImageCropperOpen(true)}
          >
            <Button.Icon
              customIcon={
                <Feather name="edit" size={20} color={currentTintColor} />
              }
            />
            <Button.Text>Editar</Button.Text>
          </Button>

          <Button type="primary" variant="rounded" onPress={handleShare}>
            <Button.Icon
              customIcon={
                <ShareIcon width={24} height={24} fill={currentTintColor} />
              }
            />
            <Button.Text>Compartilhar</Button.Text>
          </Button>
        </ScrollView>
      </ScrollView>

      <ImageView
        image={{ uri: image?.uri }}
        imageIndex={0}
        visible={isImageViewerVisible}
        onRequestClose={() => setIsImageViewerVisible(false)}
      />

      {originalMedia && (
        <ImageCropper
          imageUri={originalMedia.uri}
          isOpen={isImageCropperOpen}
          setIsOpen={setIsImageCropperOpen}
          onCropComplete={(manipulatedResult) => {
            setImage({
              ...image,
              uri: manipulatedResult.uri,
            });
          }}
        />
      )}
    </ThemedView>
  );
}
