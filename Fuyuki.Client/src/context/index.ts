import { createContext } from 'react';

interface PostContextProps {
  postId?: string;
}

export const PostContext = createContext<PostContextProps>({});

type ThemeContextProps = [boolean, (newValue: boolean) => void];

export const ThemeContext = createContext<ThemeContextProps>([
  false,
  () => null
]);
