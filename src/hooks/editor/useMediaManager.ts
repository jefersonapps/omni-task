import { useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { ShareIntentFile, useShareIntentContext } from "expo-share-intent";
import { Media, useMediaContext } from "@/contexts/MediaContext";

export function useMediaManager() {
  const { shareIntent } = useShareIntentContext();
  const { media, setMedia, updateMedia } = useMediaContext();

  const addMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia: Media[] = await Promise.all(
        result.assets.map(async (asset) => {
          const newId = Crypto.randomUUID();
          const type = asset.mimeType?.split("/")[1];

          return {
            id: newId,
            uri: asset.uri,
            info: {
              dimensions: {
                width: asset.width || 0,
                height: asset.height || 0,
              },
              size: asset.fileSize || 0,
              name: asset.fileName?.split(".")[0] || `file-${Date.now()}`,
              type: type || "jpg",
              mimeType: asset.mimeType || "image/jpeg",
            },
          };
        })
      );

      setMedia((prev) => [...prev, ...newMedia]);
    }
  };

  const deleteMedia = async (mediaId: string) => {
    try {
      const mediaUri = media.find((media) => media.id === mediaId)?.uri;

      if (!mediaUri) {
        console.log("Erro", "Nenhum arquivo de mídia disponível para excluir.");
        return;
      }

      console.log("Deleting media:", mediaUri);

      const mediaToDelete = await FileSystem.getInfoAsync(mediaUri);

      if (mediaToDelete.exists) {
        await FileSystem.deleteAsync(mediaToDelete.uri);
        setMedia((prev) => prev.filter((media) => media.id !== mediaId));
      } else {
        console.log("Arquivo não encontrado no diretório.");
      }
    } catch (error) {
      console.error("Erro ao deletar a mídia:", error);
      console.log("Erro", "Falha ao excluir o arquivo de mídia.");
    }
  };

  const deleteAllMedia = async () => {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (cacheDir) {
        const dirContent = await FileSystem.readDirectoryAsync(cacheDir);
        for (const file of dirContent) {
          try {
            const fileUri = cacheDir + file;
            await FileSystem.deleteAsync(fileUri, { idempotent: true });
            // console.log(`Arquivo do cache ${file} excluído.`);
          } catch (err) {
            console.error(`Erro ao deletar arquivo do cache ${file}:`, err);
          }
        }
      }

      const docDir = FileSystem.documentDirectory;
      if (docDir) {
        const dirContent = await FileSystem.readDirectoryAsync(docDir);
        for (const file of dirContent) {
          try {
            const fileUri = docDir + file;
            await FileSystem.deleteAsync(fileUri, { idempotent: true });
            // console.log(`Arquivo do documento ${file} excluído.`);
          } catch (err) {
            console.error(`Erro ao deletar arquivo do documento ${file}:`, err);
          }
        }
      }

      setMedia([]);
    } catch (error) {
      console.error("Erro ao limpar diretórios:", error);
    }
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia: Media[] = await Promise.all(
        result.assets.map(async (file) => {
          const newId = Crypto.randomUUID();
          const type = file.mimeType?.split("/")[1];

          return {
            id: newId,
            uri: file.uri,
            info: {
              size: file.size || 0,
              name: file.name?.split(".")[0] || `audio-${Date.now()}`,
              type: type || "mp3",
              mimeType: file.mimeType || "audio/mp3",
            },
          };
        })
      );

      setMedia((prev) => [...prev, ...newMedia]);
    }
  };

  async function handleSetFilesFromShareIntent(files: ShareIntentFile[]) {
    const newFiles: Media[] = [];

    await Promise.all(
      files.map(async (file) => {
        if (file.path.includes("OmniTask")) return;
        const fileName = file.fileName?.split(".")[0] || `file-${Date.now()}`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.moveAsync({
          from: file.path,
          to: fileUri,
        });

        const fileExists = await FileSystem.getInfoAsync(fileUri);
        if (!fileExists.exists) {
          console.error("Arquivo não encontrado no local esperado:", fileUri);
          return;
        }
        const newId = Crypto.randomUUID();

        const type = file.mimeType.split("/")[1];

        newFiles.push({
          id: newId,
          uri: fileUri,
          info: {
            name: fileName,
            size: fileExists.size,
            type: type || "jpg",
            mimeType: file.mimeType || "image/jpeg",
            dimensions: {
              width: file.width || 0,
              height: file.height || 0,
            },
          },
        });
      })
    );

    setMedia((prevMedia) => [...prevMedia, ...newFiles]);
  }

  function handleSetIntentFiles() {
    if (!shareIntent.files) return;

    if (Array.isArray(shareIntent.files) && shareIntent.files.length > 0) {
      handleSetFilesFromShareIntent(shareIntent.files);
    }
  }

  useEffect(() => {
    if (shareIntent.files) {
      handleSetIntentFiles();
    }
  }, [shareIntent]);

  return { addMedia, updateMedia, deleteMedia, deleteAllMedia, pickAudio };
}
