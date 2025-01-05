import { useEffect, useRef, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Stack } from "expo-router";

import { useColorScheme } from "nativewind";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";

import { useMediaManager } from "@/hooks/editor/useMediaManager";
import clsx from "clsx";
import { ThemedText } from "@/components/ui/ThemedText";
import { EditorMediaMenu } from "@/components/editor/EditorMediaMenu";
import { useKeyboard } from "@/hooks/useKeyboard";
import {
  MarkdownTextInput,
  parseExpensiMark,
} from "@expensify/react-native-live-markdown";
import { useShareIntentContext } from "expo-share-intent";
import { useMediaContext } from "@/contexts/MediaContext";
import { MediaList } from "@/components/editor/media-list/MediaList";

// const DEFAULT_CONTENT = `#destaque

// www.github.com/jefersonapps

// > bloco

// *negrito*
// _itálico_`

const DEFAULT_CONTENT = "";

export type Video = { id: string; uri: string };

export default function EditorScreen() {
  const { shareIntent } = useShareIntentContext();
  const { addMedia, pickAudio } = useMediaManager();

  const { media } = useMediaContext();

  const [content, setContent] = useState(DEFAULT_CONTENT);

  const markdownTextInputRef = useRef<MarkdownTextInput>(null);

  const { height } = useWindowDimensions();

  const { keyboardHeight } = useKeyboard();

  const [title, setTitle] = useState("");

  const { colors, currentTintColor } = useTheme();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (shareIntent.webUrl) {
      setContent((prev) => prev + "\n" + shareIntent.webUrl);
    }
  }, [shareIntent]);

  return (
    <ThemedView className="flex-1 gap-4 px-4">
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity activeOpacity={0.6} onPressIn={async () => {}}>
              <ThemedText type="link">Adicionar</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 mt-4 gap-4">
        {media.length > 0 && (
          <View>
            <MediaList media={media} />
          </View>
        )}

        <View className="h-14 flex-row items-center gap-4">
          <TextInput
            placeholder="Título"
            autoFocus
            onSubmitEditing={() =>
              setTimeout(() => {
                markdownTextInputRef.current?.focus();
                markdownTextInputRef.current?.setSelection(
                  content.length,
                  content.length
                );
              }, 100)
            }
            cursorColor={currentTintColor}
            selectionHandleColor={currentTintColor}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
            className={clsx(
              "flex-1 text-3xl font-semibold text-zinc-800 dark:text-zinc-200",
              "placeholder:text-zinc-600 dark:placeholder:text-zinc-400"
            )}
          />

          <EditorMediaMenu addMedia={addMedia} pickAudio={pickAudio} />
        </View>

        <MarkdownTextInput
          placeholder="Escreva uma descrição..."
          parser={parseExpensiMark}
          ref={markdownTextInputRef}
          value={content}
          defaultValue={content}
          placeholderTextColor="gray"
          onChangeText={setContent}
          cursorColor={currentTintColor}
          selectionHandleColor={currentTintColor}
          markdownStyle={{
            syntax: {
              color: currentTintColor,
            },
            link: {
              color: currentTintColor,
            },
            mentionReport: {
              color: currentTintColor,
              backgroundColor: currentTintColor + 30,
            },
          }}
          style={{
            color: colors[colorScheme || "dark"].text,
            lineHeight: 28,
            height:
              media.length > 0
                ? height - 90 - keyboardHeight - 100
                : height - 90 - keyboardHeight,
            width: "100%",

            textAlignVertical: "top",
          }}
          multiline
        />
      </View>
    </ThemedView>
  );
}
