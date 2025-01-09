export function normalizeVideoUri(uri: string) {
  return uri.startsWith("file://") ? uri : `file://${uri}`;
}
