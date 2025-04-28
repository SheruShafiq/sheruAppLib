import { Button, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { Category } from "../../dataTypeDefinitions";

function SideMenu({ categories }: { categories: Category[] }) {
  return (
    <Stack
      gap={2}
      width={"100%"}
      maxWidth={300}
      className={"standardBorder"}
      py={2}
      px={2}
    >
      <Typography fontWeight={"bold"} variant="h4">
        Categories
      </Typography>
      <Stack flexWrap={"wrap"} direction="row" gap={2}>
        {categories.map((category) => (
          <IconButton
            key={category.id}
            color="primary"
            onClick={() => {
              // Handle category click
              console.log(`Clicked on category: ${category.name}`);
            }}
            sx={{
              width: "fit-content",
              backgroundColor: "#000",
              borderRadius: "100%",
            }}
          >
            <img
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "100%",
              }}
              src={category.iconPath}
            />
            <Typography fontSize={16} textAlign={"center"}>
              {category.posts.length}
            </Typography>
          </IconButton>
        ))}
      </Stack>
    </Stack>
  );
}

export default SideMenu;
