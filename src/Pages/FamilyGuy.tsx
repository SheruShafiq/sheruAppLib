import { useRef, useEffect, useState } from "react";
import { WebExtensionBlocker } from "@ghostery/adblocker-webextension";
import { TextGlitchEffect } from "@/Components/TextGlitchEffect";
import {
  Box,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Type declaration for Vite environment variables
declare global {
  interface ImportMetaEnv {
    readonly VITE_TMDB_API_KEY?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface SeasonData {
  season_number: number;
  episode_count: number;
}

function Page() {
  const tmdb_id = "tt0182576"; // Family Guy TMDB ID
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [seasons, setSeasons] = useState<SeasonData[]>([
    { season_number: 1, episode_count: 7 },
    { season_number: 2, episode_count: 21 },
    { season_number: 3, episode_count: 22 },
    { season_number: 4, episode_count: 30 },
    { season_number: 5, episode_count: 18 },
    { season_number: 6, episode_count: 12 },
    { season_number: 7, episode_count: 16 },
    { season_number: 8, episode_count: 21 },
    { season_number: 9, episode_count: 18 },
    { season_number: 10, episode_count: 23 },
    { season_number: 11, episode_count: 22 },
    { season_number: 12, episode_count: 21 },
    { season_number: 13, episode_count: 18 },
    { season_number: 14, episode_count: 20 },
    { season_number: 15, episode_count: 20 },
    { season_number: 16, episode_count: 20 },
    { season_number: 17, episode_count: 20 },
    { season_number: 18, episode_count: 20 },
    { season_number: 19, episode_count: 20 },
    { season_number: 20, episode_count: 20 },
    { season_number: 21, episode_count: 20 },
    { season_number: 22, episode_count: 15 },
    { season_number: 23, episode_count: 15 }, // ongoing
  ]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const src = `https://vidsrc.xyz/embed/tv/${tmdb_id}/${currentSeason}-${currentEpisode}?autoplay=1&autonext=1&mute=0`;

  // Ad blocking and popup prevention
  useEffect(() => {
    // Block popups and redirects
    const originalOpen = window.open;
    window.open = () => null;

    const originalLocation = window.location;

    // Prevent unwanted navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    // Block common popup events
    const blockPopups = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Add event listeners to block popups
    document.addEventListener(
      "click",
      (e) => {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === "A" ||
            target.closest("a") ||
            target.onclick ||
            target.getAttribute("onclick"))
        ) {
          const link = target.closest("a") || target;
          const href = link.getAttribute?.("href");
          if (
            href &&
            (href.includes("ad") ||
              href.includes("popup") ||
              href.startsWith("javascript:"))
          ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
      },
      true
    );

    // Block context menu on iframe
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("contextmenu", blockPopups);
    }

    // Cleanup
    return () => {
      window.open = originalOpen;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (iframe) {
        iframe.removeEventListener("contextmenu", blockPopups);
      }
    };
  }, []);

  const getCurrentSeasonData = () => {
    return seasons.find((s) => s.season_number === currentSeason);
  };

  const handlePreviousEpisode = () => {
    if (currentEpisode > 1) {
      setCurrentEpisode(currentEpisode - 1);
    } else if (currentSeason > 1) {
      const previousSeason = seasons.find(
        (s) => s.season_number === currentSeason - 1
      );
      if (previousSeason) {
        setCurrentSeason(currentSeason - 1);
        setCurrentEpisode(previousSeason.episode_count);
      }
    }
  };

  const handleNextEpisode = () => {
    const currentSeasonData = getCurrentSeasonData();
    if (currentSeasonData && currentEpisode < currentSeasonData.episode_count) {
      setCurrentEpisode(currentEpisode + 1);
    } else {
      const nextSeason = seasons.find(
        (s) => s.season_number === currentSeason + 1
      );
      if (nextSeason) {
        setCurrentSeason(currentSeason + 1);
        setCurrentEpisode(1);
      }
    }
  };

  const handlePreviousSeason = () => {
    if (currentSeason > 1) {
      setCurrentSeason(currentSeason - 1);
      setCurrentEpisode(1);
    }
  };

  const handleNextSeason = () => {
    const maxSeason = Math.max(...seasons.map((s) => s.season_number));
    if (currentSeason < maxSeason) {
      setCurrentSeason(currentSeason + 1);
      setCurrentEpisode(1);
    }
  };

  const handleSeasonChange = (newSeason: number) => {
    setCurrentSeason(newSeason);
    setCurrentEpisode(1);
  };

  const handleEpisodeChange = (newEpisode: number) => {
    setCurrentEpisode(newEpisode);
  };

  useEffect(() => {
    WebExtensionBlocker.fromPrebuiltAdsAndTracking().then((blocker) => {
      blocker.enableBlockingInBrowser(window);
    });
  }, []);

  return (
    <>
      <Stack height="100vh" flexDirection="column" sx={{ overflow: "hidden" }}>
        <Box
          p={{ xs: 1, sm: 2 }}
          sx={{
            flexShrink: 0,
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <TextGlitchEffect
            className="HeaderLogo"
            text={`Family Guy S${currentSeason}E${currentEpisode}`}
          />
          {/* Mobile-first responsive controls */}
          <Stack spacing={2} mt={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 120 },
                  flex: { sm: 1, md: "none" },
                }}
              >
                <InputLabel id="season-select-label">Season</InputLabel>
                <Select
                fullWidth
                  labelId="season-select-label"
                  id="season-select"
                  value={currentSeason}
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                  label="Season"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: "50vh", // Limit height of dropdown
                        overflowY: "auto", // Enable scrolling if needed
                      },
                    },
                  }}
                >
                  {seasons.map((s) => (
                    <MenuItem key={s.season_number} value={s.season_number}>
                      Season {s.season_number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Episode Controls Row */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 120 },
                  flex: { sm: 1, md: "none" },
                }}
              >
                <InputLabel id="episode-select-label">Episode</InputLabel>
                <Select
                fullWidth
                  labelId="episode-select-label"
                  id="episode-select"
                  value={currentEpisode}
                  onChange={(e) => handleEpisodeChange(Number(e.target.value))}
                  label="Episode"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: "50vh", // Limit height of dropdown
                        overflowY: "auto", // Enable scrolling if needed
                      },
                    },
                  }}
                >
                  {(() => {
                    const seasonData = getCurrentSeasonData();
                    if (!seasonData || seasonData.episode_count <= 0)
                      return null;

                    return Array.from(
                      { length: seasonData.episode_count },
                      (_, i) => i + 1
                    ).map((ep) => (
                      <MenuItem key={ep} value={ep}>
                        Episode {ep}
                      </MenuItem>
                    ));
                  })()}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Box>
        <Box
          flex={1}
          sx={{
            overflow: "hidden",
            position: "relative",
            height: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 180px)" },
          }}
        >
          <iframe
            ref={iframeRef}
            src={src}
            allow="autoplay"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => {
              // Additional ad blocking for iframe content
              try {
                const iframe = iframeRef.current;
                if (iframe && iframe.contentWindow) {
                  const iframeWindow = iframe.contentWindow as any;
                  if (iframeWindow.open) {
                    iframeWindow.open = () => null;
                  }
                }
              } catch (e) {
                // Cross-origin restrictions prevent access, which is expected
                console.log(
                  "Cross-origin iframe access blocked (this is normal)"
                );
              }
            }}
          />
        </Box>
        <Stack direction="row" gap={1} p={0.5}>
          <Button
          fullWidth
            color="secondary"
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            onClick={handlePreviousEpisode}
            disabled={currentSeason === 1 && currentEpisode === 1}
            size="small"
          >
            Prev Episode
          </Button>
          <Button
          fullWidth
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            onClick={handleNextEpisode}
            disabled={
              getCurrentSeasonData()?.episode_count === currentEpisode &&
              currentSeason === Math.max(...seasons.map((s) => s.season_number))
            }
            size="small"
          >
            Next Episode
          </Button>
        </Stack>
        <Stack direction="row" gap={1} p={0.5}>
          <Button
          fullWidth
            color="secondary"
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            onClick={handlePreviousSeason}
            disabled={currentSeason === 1}
            size="small"
          >
            Prev Season
          </Button>
          <Button
          fullWidth
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            onClick={handleNextSeason}
            disabled={
              currentSeason === Math.max(...seasons.map((s) => s.season_number))
            }
            size="small"
          >
            Next Season
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default Page;
