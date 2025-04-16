import { Autocomplete, Stack, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Post } from "../../dataTypeDefinitions";
import IOSLoader from "./IOSLoader";
import { searchPosts } from "../APICalls";

function HomeInteractions() {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<readonly Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pendingSearchTerm, setPendingSearchTerm] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(pendingSearchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [pendingSearchTerm]);

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      searchPosts(
        searchTerm,
        (data) => {
          setPosts(data);
        },
        (error) => {
          console.error(error);
        }
      );
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setPosts([]);
  };

  return (
    <Stack direction={"row"} width={"100%"}>
      <Autocomplete
        sx={{ width: 300 }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        inputValue={pendingSearchTerm}
        onInputChange={(event, newInputValue) =>
          setPendingSearchTerm(newInputValue)
        }
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={posts}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Asynchronous"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <IOSLoader /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
      />
    </Stack>
  );
}

export default HomeInteractions;
