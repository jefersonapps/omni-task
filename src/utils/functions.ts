import * as FileSystem from "expo-file-system";
import { Media } from "@/contexts/MediaContext";
import wavesAnimation from "../../assets/lottie/waves.json";

export function capitalizeFirstLetter(text: string) {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

export function normalizeFileUri(uri: string) {
  return uri.startsWith("file://") ? uri : `file://${uri}`;
}

export function getAspectRatio(width: number, height: number) {
  const aspectRatio = width / height;
  return aspectRatio;
}

export async function renameFile(media: Media, newName: string) {
  const newFileName = newName.trim();

  const directory = media.uri.substring(0, media.uri.lastIndexOf("/"));
  const newUri = `${directory}/${newFileName}.${media.info?.type || "mp4"}`;
  const originalFileUri = normalizeFileUri(media.uri);
  const newFileUri = normalizeFileUri(newUri);

  await FileSystem.moveAsync({
    from: originalFileUri,
    to: newFileUri,
  });

  return { newFileName, newFileUri };
}

type RGBColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export function getModifiedAnimation(color1: RGBColor, color2: RGBColor) {
  const normalizeColor = ({ r, g, b, a = 1 }: RGBColor): number[] => [
    r / 255,
    g / 255,
    b / 255,
    a,
  ];

  const animationJson = JSON.parse(JSON.stringify(wavesAnimation));

  try {
    animationJson.layers[0].shapes[0].it[2].c.k = normalizeColor(color1);
    animationJson.layers[1].shapes[0].it[2].c.k = normalizeColor(color2);
  } catch (error) {
    console.error("Erro ao modificar animação:", error);
  }

  return animationJson;
}

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const defaultRGBTintColor = { r: 79, g: 133, b: 255 };
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : defaultRGBTintColor;
}

export function lightenRGBColor(
  color: { r: number; g: number; b: number },
  percent: number
) {
  percent = Math.min(1, Math.max(0, percent));

  return {
    r: Math.round(color.r + (255 - color.r) * percent),
    g: Math.round(color.g + (255 - color.g) * percent),
    b: Math.round(color.b + (255 - color.b) * percent),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function saturateRGBColor(
  color: { r: number; g: number; b: number },
  percent: number
) {
  percent = Math.min(1, Math.max(0, percent));

  const { h, s, l } = rgbToHsl(color.r, color.g, color.b);

  const newS = Math.min(1, s * (1 + percent));

  return hslToRgb(h, newS, l);
}
