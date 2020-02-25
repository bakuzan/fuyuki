import React, { createContext } from 'react';

interface PostContextProps {
  postId?: string;
}

export const PostContext = createContext<PostContextProps>({});

interface HeaderContextProps {
  messageKey: string;
  isDarkTheme: boolean;
  onThemeToggle: (newValue: boolean) => void;
}

export const HeaderContext = createContext<HeaderContextProps>({
  isDarkTheme: false,
  messageKey: '',
  onThemeToggle: () => null
});

interface MainContextProps {
  onMessageRefresh: React.Dispatch<React.SetStateAction<void>>;
  onSetSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MainContext = createContext<MainContextProps>({
  onMessageRefresh: () => null,
  onSetSearch: () => null
});
