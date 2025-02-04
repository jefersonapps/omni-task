import React, { createContext, useContext, useState } from "react";

export interface MediaDimensions {
  width: number;
  height: number;
}

export interface MediaInfo {
  name: string;
  type: string;
  mimeType: string;
  dimensions?: MediaDimensions;
  size: number;
}

export interface Media {
  id: string;
  uri: string;
  info: MediaInfo;
}

const MediaContext = createContext<{
  media: Media[];
  addMedia: (media: Media) => void;
  updateMedia: (id: string, updatedMedia: Partial<Media>) => void;
  setMedia: React.Dispatch<React.SetStateAction<Media[]>>;
}>({
  media: [],
  addMedia: () => {},
  updateMedia: () => {},
  setMedia: () => {},
});

export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
  const [media, setMedia] = useState<Media[]>([]);

  const addMedia = (newMedia: Media) => {
    setMedia((prev) => [...prev, newMedia]);
  };

  const updateMedia = (id: string, updatedMedia: Partial<Media>) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedMedia } : m))
    );
  };

  return (
    <MediaContext.Provider value={{ media, setMedia, addMedia, updateMedia }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaContext = () => useContext(MediaContext);
