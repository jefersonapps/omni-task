import * as FileSystem from "expo-file-system";
import { normalizeFileUri } from "@/utils/functions";
import { Media, MediaInfo } from "@/contexts/MediaContext";
import { Dispatch, SetStateAction } from "react";

interface MediaData {
  id: string;
  uri: string;
  info?: MediaInfo;
}

type UpdateMediaFn = (
  id: string,
  data: { uri: string; info: MediaInfo }
) => void;

export function useRenameMediaFile(
  media: MediaData,
  updateMedia: UpdateMediaFn,
  setIsPending: (pending: boolean) => void,
  setMedia: Dispatch<SetStateAction<Media>>
) {
  const renameMediaFile = async (newName: string) => {
    try {
      if (!media) {
        console.error("Erro: Nenhuma mídia disponível para renomear.");
        return;
      }

      const newFileName = newName.trim();

      const directory = media.uri.substring(0, media.uri.lastIndexOf("/"));
      const newUri = `${directory}/${newFileName}.${media.info?.type || "mp4"}`;
      const originalFileUri = normalizeFileUri(media.uri);
      const newFileUri = normalizeFileUri(newUri);

      setIsPending(true);
      await FileSystem.moveAsync({
        from: originalFileUri,
        to: newFileUri,
      });

      const prevMediaInfo = media.info || { name: "", type: "", size: 0 };

      const updatedMediaInfo: MediaInfo = {
        ...prevMediaInfo,
        name: newFileName,
      };

      updateMedia(media.id, {
        uri: newUri,
        info: updatedMediaInfo,
      });

      setMedia({
        id: media.id,
        uri: newUri,
        info: updatedMediaInfo,
      });
    } catch (error) {
      console.error("Erro ao renomear o arquivo:", error);
    } finally {
      setIsPending(false);
    }
  };

  return { renameMediaFile };
}
