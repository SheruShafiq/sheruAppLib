import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { Category } from "../../dataTypeDefinitions";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
function SideMenu({ categories }: { categories: Category[] }) {
  return (
    <Stack
      gap={4}
      width={"100%"}
      maxWidth={300}
      className={"standardBorder"}
      py={2}
      px={2}
      height={"fit-content"}
      position={"sticky"}
      top={16}
    >
      <Stack gap={2}>
        <Typography fontSize={20} fontWeight={"bold"}>
          Categories
        </Typography>
        <Stack flexWrap={"wrap"} direction="row" gap={2}>
          {categories.map((category) => (
            <Button
              key={category.id}
              color="primary"
              onClick={() => {
                console.log(`Clicked on category: ${category.name}`);
              }}
              sx={{
                width: "fit-content",
                backgroundColor: "#000",
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
            </Button>
          ))}
        </Stack>
      </Stack>
      <Divider
        sx={{
          borderColor: "white",
        }}
      />
      <Stack gap={2}>
        <Typography fontWeight={"bold"} variant="h5">
          Sheru's App Library
        </Typography>
        <Stack gap={1}>
          <Button
            sx={{
              justifyContent: "space-between",
            }}
            fullWidth
          >
            <span>Badge Maker</span>
            <ArrowOutwardIcon />
          </Button>
          <Button
            sx={{
              justifyContent: "space-between",
            }}
            fullWidth
          >
            <span>CV</span>
            <ArrowOutwardIcon />
          </Button>
          <Button
            sx={{
              justifyContent: "space-between",
            }}
            fullWidth
          >
            <span>Sauce</span>
            <ArrowOutwardIcon />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default SideMenu;
