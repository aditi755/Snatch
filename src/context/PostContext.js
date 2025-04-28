'use client';
import React, { createContext, useContext } from 'react';

const PostsContext = createContext({
  allPosts: [],
  username: ''
});

export const PostsProvider = ({ children, value }) => {
  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};

export { PostsContext };