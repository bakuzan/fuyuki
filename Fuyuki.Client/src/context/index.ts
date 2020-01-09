import { createContext } from 'react';

interface PostContextProps {
  postId?: string;
}

export const PostContext = createContext<PostContextProps>({});
