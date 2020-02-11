import React, { createContext } from 'react';

interface PostContextProps {
  postId?: string;
}

export const PostContext = createContext<PostContextProps>({});

type ThemeContextProps = [boolean, (newValue: boolean) => void];

export const ThemeContext = createContext<ThemeContextProps>([
  false,
  () => null
]);

export const WithSearchContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => null);
