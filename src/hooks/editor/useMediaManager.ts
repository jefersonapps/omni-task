import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { ShareIntentFile, useShareIntentContext } from "expo-share-intent";
import { VideoInfo } from "@/app/(stack)/video/[uri]";

export interface Media {
  id: string;
  uri: string;
  info: VideoInfo;
}

export function useMediaManager() {
  const { shareIntent } = useShareIntentContext();
  const [media, setMedia] = useState<Media[]>([]);

  const addMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newId = Crypto.randomUUID();
      setMedia((prev) => [
        ...prev,
        {
          id: newId,
          uri: result.assets[0].uri,

          info: {
            title: result.assets[0].fileName || "image.jpg",
            dimensions: {
              width: result.assets[0].width,
              height: result.assets[0].height,
            },
            size: result.assets[0].fileSize || 0,
            duration: result.assets[0].duration || 0,
            name: result.assets[0].fileName || "image.jpg",
            type: result.assets[0].mimeType || "image/jpg",
          },
        },
      ]);
    }
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (!result.canceled) {
      const newId = Crypto.randomUUID();
      setMedia((prev) => [
        ...prev,
        {
          id: newId,
          uri: result.assets[0].uri,

          info: {
            title: result.assets[0].file?.name || "audio.mp3",
            dimensions: { width: 0, height: 0 },
            size: result.assets[0].file?.size || 0,
            duration: 0,
            name: result.assets[0].file?.name || "audio.mp3",
            type: result.assets[0].mimeType || "audio/mp3",
          },
        },
      ]);
    }
  };

  async function handleSetImageFromShareIntent(files: ShareIntentFile[]) {
    const newImages: Media[] = [];

    await Promise.all(
      files.map(async (file) => {
        const fileName = file.fileName || `image-${Date.now()}.jpg`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.moveAsync({
          from: file.path,
          to: fileUri,
        });

        const fileExists = await FileSystem.getInfoAsync(fileUri);
        if (!fileExists.exists) {
          console.error("Imagem não encontrada no local esperado:", fileUri);
          return;
        }
        const newId = Crypto.randomUUID();

        newImages.push({
          id: newId,
          uri: fileUri,
          info: {
            name: fileName,
            size: fileExists.size,
            type: file.mimeType || "image/jpg",
            duration: file.duration || 0,
            dimensions: {
              width: file.width || 0,
              height: file.height || 0,
            },
          },
        });
      })
    );

    setMedia((prevMedia) => [...prevMedia, ...newImages]);
  }

  function handleSetIntentImage() {
    if (!shareIntent.files) return;

    if (Array.isArray(shareIntent.files) && shareIntent.files.length > 0) {
      handleSetImageFromShareIntent(shareIntent.files);
    }
  }

  useEffect(() => {
    if (shareIntent.files) {
      handleSetIntentImage();
    }
  }, [shareIntent]);

  return { media, addMedia, pickAudio };
}
