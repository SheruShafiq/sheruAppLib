'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Stack, Divider } from '@mui/material';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import SauceLayout from '@/components/SauceLayout';
import { fetchCategories, fetchPostById } from '@/lib/api';
import { Post } from '@/lib/definitions';

export default function PostClientPage() {
  const { id } = useParams();
  const [loginDialogue, setLoginDialogue] = useState(false);
  const [categories, setCategories] = useState([]);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, userData, setIsLoggedIn, refreshUserData } = useAuth();

  useEffect(() => {
    // Fetch categories on component mount
    fetchCategories(
      (categoriesData) => {
        setCategories(categoriesData);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (id) {
      fetchPostById({
        id: Array.isArray(id) ? id[0] : id,
        onSuccess: (postData) => {
          setPost(postData);
          setLoading(false);
        },
        onError: (error) => {
          console.error('Error fetching post:', error);
          setLoading(false);
        }
      });
    }
  }, [id]);

  return (
    <SauceLayout 
      isLoggedIn={isLoggedIn} 
      userData={userData} 
      setOpen={setLoginDialogue}
      setIsLoggedIn={setIsLoggedIn}
      categories={categories}
      callerIdentifier="postPage"
    >
      <Divider sx={{ borderColor: "white" }} />
      <Stack
        mt={2}
        pb={4}
        px={2}
        direction="row"
        width="100%"
        maxWidth="1200px"
        mx="auto"
        height={"100%"}
        gap={8}
      >
        <Stack flexGrow={1}>
          {loading ? (
            <div>Loading post...</div>
          ) : (
            <div>
              <h1>{post?.title}</h1>
              <p>{post?.description}</p>
            </div>
          )}
        </Stack>
      </Stack>
    </SauceLayout>
  );
}
