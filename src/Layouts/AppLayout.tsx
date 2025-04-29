import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Stack } from "@mui/material";

function AppLayout({
  children,
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  categories,
  onPostCreated,
  callerIdentifier,
}) {
  return (
    <Stack height={"100%"} minHeight={"100vh"} width={"100%"}>
      <Header
        isLoggedIn={isLoggedIn}
        userData={userData}
        setOpen={setOpen}
        setIsLoggedIn={setIsLoggedIn}
        categories={categories}
        onPostCreated={onPostCreated}
        callerIdentifier={callerIdentifier}
      />
      {children}
      <Footer />
    </Stack>
  );
}

export default AppLayout;
