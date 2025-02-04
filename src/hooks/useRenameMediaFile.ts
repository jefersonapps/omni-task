import { renameFile } from "@/utils/functions";
import { Media, MediaInfo } from "@/contexts/MediaContext";
import { Dispatch, SetStateAction } from "react";

type UpdateMediaFn = (
  id: string,
  data: { uri: string; info: MediaInfo }
) => void;

export function useRenameMediaFile(
  media: Media,
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

      setIsPending(true);
      const { newFileName, newFileUri } = await renameFile(media, newName);

      const prevMediaInfo = media.info || { name: "", type: "", size: 0 };

      const updatedMediaInfo: MediaInfo = {
        ...prevMediaInfo,
        name: newFileName,
      };

      updateMedia(media.id, {
        uri: newFileUri,
        info: updatedMediaInfo,
      });

      setMedia({
        id: media.id,
        uri: newFileUri,
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
