import { ImageResult } from "expo-image-manipulator";
import { SharedValue } from "react-native-reanimated";

export interface ImageCropperProps {
  imageUri: string;
  onCropComplete: (manipulatedResult: ImageResult) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CropAreaDimensions {
  originX: SharedValue<number>;
  originY: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
}
