import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Input } from "../ui/Input";
import { useEffect, useState } from "react";
import { MediaInfo } from "@/contexts/MediaContext";

export function MediaDetails({
  mediaInfo,
  isRenamePending,
  onRename,
}: {
  mediaInfo: MediaInfo;
  isRenamePending: boolean;
  onRename: (newName: string) => Promise<void>;
}) {
  const [newMediaName, setNewMediaName] = useState("");
  const [isChangingName, setIsChangingName] = useState(false);

  const handleRename = async () => {
    await onRename(newMediaName);
    setIsChangingName(false);
    setNewMediaName("");
  };

  useEffect(() => {
    setNewMediaName(mediaInfo?.name.split(".")[0] || "");
  }, [mediaInfo]);

  return (
    <View className="gap-4">
      <View className="min-h-10 justify-center">
        {!isChangingName ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsChangingName(true)}
          >
            <ThemedText type="subtitle" numberOfLines={1}>
              {mediaInfo?.name}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <Input
            value={newMediaName}
            onChangeText={setNewMediaName}
            placeholder={"Nome da mídia..."}
            autoFocus
            onSubmitEditing={handleRename}
            returnKeyType="send"
          >
            {isRenamePending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <TouchableOpacity activeOpacity={0.8} onPress={handleRename}>
                <Input.Icon name="pencil" />
              </TouchableOpacity>
            )}
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
          {mediaInfo?.type.includes("/")
            ? mediaInfo?.type.split("/")[1]
            : mediaInfo?.type}
        </ThemedText>
        <ThemedText
          type="smallText"
          className="text-zinc-500 dark:text-zinc-400"
          numberOfLines={1}
        >
          Tamanho:{" "}
          {(mediaInfo?.size / (1024 * 1024)).toFixed(2).replace(".", ",")} MB
        </ThemedText>
      </View>
    </View>
  );
}
