import { useState } from "react";
import {
  CoreBridge,
  darkEditorTheme,
  LinkBridge,
  PlaceholderBridge,
  TenTapStartKit,
  useEditorBridge,
} from "@10play/tentap-editor";
import { useColorScheme } from "nativewind";
import { useTheme } from "@/contexts/ThemeProvider";

export function useEditorSetup() {
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const { colorScheme } = useColorScheme();
  const { currentTintColor, colors } = useTheme();

  const customEditorCss = `
  * {
    background-color: ${colors[colorScheme || "light"].background};
    color: ${colors[colorScheme || "light"].text};
  }
  blockquote {
    border-left: 3px solid #babaca;
    padding-left: 1rem;
  }
  .highlight-background {
    background-color: #474749;
  }
  a {
    color: ${currentTintColor};
  }
`;

  const editor = useEditorBridge({
    avoidIosKeyboard: true,
    initialContent: ``,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(customEditorCss),
      PlaceholderBridge.configureExtension({
        placeholder: "Descrição",
      }),
      LinkBridge.configureExtension({ openOnClick: true }),
    ],
    theme:
      colorScheme === "dark"
        ? {
            ...darkEditorTheme,

            toolbar: {
              ...darkEditorTheme.toolbar,
              toolbarBody: {
                backgroundColor: "#27272a",
                borderTopColor: "#27272a",
                borderBottomColor: "#27272a",
              },
              iconWrapper: {
                backgroundColor: "#27272a",
              },
              toolbarButton: {
                backgroundColor: "#27272a",
              },
              iconActive: {
                backgroundColor: "#52525b",
                borderRadius: 4,
              },
            },
            webview: {
              backgroundColor: colors[colorScheme || "light"].background,
            },
          }
        : undefined,
  });

  const handleEditorLoad = () => {
    setIsEditorLoaded(true);
  };

  return { editor, isEditorLoaded, handleEditorLoad };
}
