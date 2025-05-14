'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Typography, Avatar } from '@mui/material';
import { useAuth } from '@/components/AuthProvider';
import { fetchUserById } from '@/lib/api';
import { User } from '@/lib/definitions';

export default function UserProfilePage() {
  const { id } = useParams();
  const { isLoggedIn, userData: loggedInUserData } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUserById(
        Array.isArray(id) ? id[0] : id,
        (user) => {
          setUserData(user);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching user:', error);
          setLoading(false);
        }
      );
    }
  }, [id]);

  return (
    <Stack
      minHeight="100vh"
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap={2}
      padding={4}
    >
      {loading ? (
        <Typography>Loading user profile...</Typography>
      ) : (
        <>
          <Avatar 
            sx={{ width: 100, height: 100 }}
            alt={userData?.displayName}
          />
          <Typography variant="h2">{userData?.displayName}</Typography>
          <Typography>
            User since: {new Date(userData?.dateCreated || '').toLocaleDateString()}
          </Typography>
          <Typography>
            Posts: {userData?.posts.length || 0}
          </Typography>
        </>
      )}
    </Stack>
  );
}
