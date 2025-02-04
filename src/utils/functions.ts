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
