import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

interface Episode {
  season: number;
  episode: number;
  title: string;
  url?: string;
}

const tmdbId = "tt0182576"; // Family Guy TMDB id

async function fetchEpisodeUrl(
  season: number,
  episode: number,
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://vidsrc.xyz/api/episode/${tmdbId}/${season}/${episode}`,
    );
    const data = await res.json();
    return (
      data?.sources?.find((s: { type: string }) => s.type === "hls")?.url ||
      data?.stream
    );
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export default function FamilyGuyPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playlist, setPlaylist] = useState<Episode[]>([
    { season: 1, episode: 1, title: "S1E1" },
    { season: 1, episode: 2, title: "S1E2" },
  ]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);
  const hlsRef = useRef<Hls | null>(null);

  // load video source when current changes
  useEffect(() => {
    const load = async () => {
      const ep = playlist[current];
      if (!ep) return;
      if (!ep.url) {
        const url = await fetchEpisodeUrl(ep.season, ep.episode);
        setPlaylist((p) =>
          p.map((e, i) => (i === current ? { ...e, url } : e)),
        );
        if (!url) return;
      }
      const url = ep.url || (await fetchEpisodeUrl(ep.season, ep.episode));
      const video = videoRef.current;
      if (!video || !url) return;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      }
      if (started.current) {
        try {
          await video.play();
        } catch {
          /* ignore */
        }
        setPlaying(true);
      }
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `Family Guy - ${ep.title}`,
          artist: "Family Guy",
          album: `Season ${ep.season}`,
        });
      }
    };
    load();
  }, [current, playlist]);

  // handle ended
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = () => {
      setCurrent((c) => (c + 1) % playlist.length);
    };
    video.addEventListener("ended", next);
    return () => {
      video.removeEventListener("ended", next);
    };
  }, [playlist.length]);

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      started.current = true;
      try {
        await video.play();
        setPlaying(true);
      } catch {
        /* ignored */
      }
    }
  };

  const handleNext = () => {
    setCurrent((c) => (c + 1) % playlist.length);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <video ref={videoRef} controls style={{ width: "100%" }} />
      <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
        <IconButton onClick={handlePlayPause} size="large" color="primary">
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={handleNext} size="large" color="primary">
          <SkipNextIcon />
        </IconButton>
        <Select
          value={current}
          onChange={(e) => setCurrent(e.target.value as number)}
          size="small"
          sx={{ ml: 2 }}
        >
          {playlist.map((ep, idx) => (
            <MenuItem value={idx} key={idx}>{ep.title}</MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
}
