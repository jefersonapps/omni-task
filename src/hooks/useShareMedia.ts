import Share, { ShareOptions } from "react-native-share";

interface MediaShare {
  uri: string;
  info: {
    name: string;
    mimeType: string;
  };
}

export function useShareMedia(media: MediaShare) {
  const hasAudio = media.info?.mimeType.includes("audio");
  const hasVideo = media.info?.mimeType.includes("video");

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
