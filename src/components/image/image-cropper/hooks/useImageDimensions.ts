import { useState, useEffect } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import { MediaDimensions } from "@/contexts/MediaContext";

export const useImageDimensions = (imageUri: string) => {
  const [dimensions, setDimensions] = useState<MediaDimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    async function getImageDimensions(uri: string) {
      const { width, height } = await ImageManipulator.manipulateAsync(uri);
      setDimensions({ width, height });
    }
    getImageDimensions(imageUri);
  }, [imageUri]);

  return dimensions;
};
