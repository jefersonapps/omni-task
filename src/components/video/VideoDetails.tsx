import { VideoInfo } from "@/app/(stack)/video/[uri]";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Input } from "../ui/Input";
import { useEffect, useState } from "react";

export function VideoDetails({
  videoInfo,
  onRename,
}: {
  videoInfo: VideoInfo;
  onRename: (newName: string) => void;
}) {
  const [newVideoName, setNewVideoName] = useState("");

  const [isChangingVideoName, setIsChangingVideoName] = useState(false);

  const handleRename = () => {
    onRename(newVideoName);

    setIsChangingVideoName(false);
    setNewVideoName("");
  };

  useEffect(() => {
    setNewVideoName(videoInfo?.name.split(".")[0] || "");
  }, [videoInfo]);

  return (
    <View className="gap-4">
      <View className="min-h-10 justify-center">
        {!isChangingVideoName ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsChangingVideoName(true)}
          >
            <ThemedText type="subtitle" numberOfLines={1}>
              {videoInfo?.name}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <Input
            value={newVideoName}
            onChangeText={setNewVideoName}
            placeholder={"Nome do vídeo..."}
            autoFocus
            onSubmitEditing={handleRename}
            returnKeyType="send"
          >
            <TouchableOpacity activeOpacity={0.8} onPress={handleRename}>
              <Input.Icon name="pencil" />
            </TouchableOpacity>
          </Input>
        )}
      </View>

      <View className="flex-row items-center justify-between">
        <ThemedText
          type="smallText"
          className="text-zinc-500 dark:text-zinc-400"
          numberOfLines={1}
        >
          Formato:{" "}
          {videoInfo?.type.includes("/")
            ? videoInfo?.type.split("/")[1]
            : videoInfo?.type}
        </ThemedText>
        <ThemedText
          type="smallText"
          className="text-zinc-500 dark:text-zinc-400"
          numberOfLines={1}
        >
          Tamanho:{" "}
          {(videoInfo?.size / (1024 * 1024)).toFixed(2).replace(".", ",")} MB
        </ThemedText>
      </View>
    </View>
  );
}
