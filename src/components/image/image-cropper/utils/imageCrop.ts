import * as ImageManipulator from "expo-image-manipulator";
import { CropAreaDimensions } from "../types/ImageCropper.types";
import { MediaDimensions } from "@/contexts/MediaContext";

export const cropImage = async (
  imageUri: string,
  cropArea: CropAreaDimensions,
  containerDimensions: MediaDimensions,
  imageDimensions: MediaDimensions
) => {
  try {
    const imageScaleX = containerDimensions.width / imageDimensions.width;
    const imageScaleY = imageDimensions.height / imageDimensions.height;

    const cropData = {
      originX: cropArea.originX.value / imageScaleX,
      originY: cropArea.originY.value / imageScaleY,
      width: cropArea.width.value / imageScaleX,
      height: cropArea.height.value / imageScaleY,
    };

    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ crop: cropData }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );

    return manipResult;
  } catch (error) {
    console.error("Erro ao cortar a imagem:", error);
    const result: ImageManipulator.ImageResult = {
      height: imageDimensions.height,
      width: imageDimensions.width,
      uri: imageUri,
    };
    return result;
  }
};
