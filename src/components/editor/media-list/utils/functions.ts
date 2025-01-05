import * as VideoThumbnails from "expo-video-thumbnails";

export async function generateThumbnail(videoUri: string) {
  try {
    const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: 0,
      }
    );
    return { thumbUri };
  } catch (e) {
    console.warn(e);
  }
  return { thumbUri: "" };
}
