'use client';

import React, { useEffect, useState } from 'react';
import { Stack, Divider, Typography } from '@mui/material';
import { useAuth } from '@/components/AuthProvider';
import SauceLayout from '@/components/SauceLayout';
import { fetchCategories } from '@/lib/api';

export default function SauceClientPage() {
  const [loginDialogue, setLoginDialogue] = useState(false);
  const [categories, setCategories] = useState([]);
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

  return (
    <SauceLayout 
      isLoggedIn={isLoggedIn} 
      userData={userData} 
      setOpen={setLoginDialogue}
      setIsLoggedIn={setIsLoggedIn}
      categories={categories}
      callerIdentifier="homePage"
      onPostCreated={() => {
        // Refresh posts function
      }}
    >
      <Stack height={"100%"} minHeight={"100vh"} gap={2} pb={2}>
        <Divider sx={{ borderColor: "white" }} />
        <Stack
          px={2}
          maxWidth={"1200px"}
          alignSelf={"center"}
          width={"100%"}
          gap={2}
        >
          <Typography variant="h4">Sauce Home Page</Typography>
          <Typography>
            This page will be built out with post fetching and display functionality
          </Typography>
          {/* Posts would be displayed here */}
        </Stack>
      </Stack>
    </SauceLayout>
  );
}
