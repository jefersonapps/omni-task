// hooks/useShareMedia.ts
import Share, { ShareOptions } from "react-native-share";

interface MediaShare {
  uri: string;
  info: {
    name: string;
    type: string;
  };
}

export function useShareMedia(media: MediaShare) {
  const hasAudio = media.info?.type.includes("audio");
  const hasVideo = media.info?.type.includes("video");

  const type = hasAudio ? "audio/*" : hasVideo ? "video/*" : "image/*";
  const handleShare = async () => {
    const options: ShareOptions = {
      url: media.uri,
      filename: media.info?.name || "media",
      type,
      excludedActivityTypes: ["com.jefersonapps.OmniTask"],
      failOnCancel: false,
    };
    try {
      await Share.open(options);
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return { handleShare };
}
