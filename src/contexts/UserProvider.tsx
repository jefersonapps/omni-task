import { createContext, useContext, useState } from "react";

export interface UserContextProps {
  userName: string;
  setUserName: (text: string) => void;
  userProfilePicture: string;
  setUserProfilePicture: (text: string) => void;
}

export const DEFAULT_USER_NAME = "Digite seu nome...";

export const UserContext = createContext<UserContextProps>({
  userName: DEFAULT_USER_NAME,
  setUserName: () => {},
  userProfilePicture: "",
  setUserProfilePicture: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [userProfilePicture, setUserProfilePicture] = useState("");

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        userProfilePicture,
        setUserProfilePicture,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
