import { VideoInfo } from "@/app/(stack)/video/[uri]";
import { View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { formatDuration } from "@/utils/functions";

export function VideoDetails({ videoInfo }: { videoInfo: VideoInfo }) {
  return (
    <View className="space-y-2">
      <ThemedText type="subtitle">{videoInfo?.name}</ThemedText>
      <ThemedText type="smallText" className="text-zinc-500 dark:text-zinc-400">
        Formato: {videoInfo?.type.split("/")[1]}
      </ThemedText>
      <ThemedText type="smallText" className="text-zinc-500 dark:text-zinc-400">
        Tamanho:{" "}
        {(videoInfo?.size / (1024 * 1024)).toFixed(2).replace(".", ",")} MB
      </ThemedText>
      {videoInfo?.duration && (
        <ThemedText
          type="smallText"
          className="text-zinc-500 dark:text-zinc-400"
        >
          Duração: {formatDuration(videoInfo.duration / 1000)}
        </ThemedText>
      )}
    </View>
  );
}
