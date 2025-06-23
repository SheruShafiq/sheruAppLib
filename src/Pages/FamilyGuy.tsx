import { useRef, useEffect, useState } from 'react';

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

interface TMDBResponse {
  seasons: SeasonData[];
}

function Page() {
  const tmdb_id = "tt0182576"; // Family Guy TMDB ID
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [seasons, setSeasons] = useState<SeasonData[]>([]);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // include mute=0 and allow autoplay
  const src = `https://vidsrc.xyz/embed/tv/${tmdb_id}/${currentSeason}-${currentEpisode}?autoplay=1&autonext=1&mute=0`;

  // Fetch season and episode data from TMDB
  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        // Replace with your TMDB API key or use import.meta.env for Vite
        const apiKey = import.meta.env?.VITE_TMDB_API_KEY || 'your-api-key-here';
        if (!apiKey || apiKey === 'your-api-key-here') {
          throw new Error('TMDB API key not found');
        }
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/1434?api_key=${apiKey}`
        );
        const data: TMDBResponse = await response.json();
        setSeasons(data.seasons.filter(season => season.season_number > 0));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch season data:', error);
        // Fallback data for Family Guy (approximate)
        setSeasons([
          { season_number: 1, episode_count: 7 },
          { season_number: 2, episode_count: 21 },
          { season_number: 3, episode_count: 22 },
          { season_number: 4, episode_count: 30 },
          { season_number: 5, episode_count: 18 },
          { season_number: 6, episode_count: 12 },
          { season_number: 7, episode_count: 16 },
          { season_number: 8, episode_count: 20 },
          { season_number: 9, episode_count: 18 },
          { season_number: 10, episode_count: 24 },
        ]);
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, []);

  const getCurrentSeasonData = () => {
    return seasons.find(s => s.season_number === currentSeason);
  };

  const handlePreviousEpisode = () => {
    if (currentEpisode > 1) {
      setCurrentEpisode(currentEpisode - 1);
    } else if (currentSeason > 1) {
      const previousSeason = seasons.find(s => s.season_number === currentSeason - 1);
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
      const nextSeason = seasons.find(s => s.season_number === currentSeason + 1);
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
    const maxSeason = Math.max(...seasons.map(s => s.season_number));
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

  // ...existing code...

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px' }}>
        <h1>Family Guy Sleep Client</h1>
        
        {loading ? (
          <p>Loading season data...</p>
        ) : (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Season Controls */}
            <button onClick={handlePreviousSeason} disabled={currentSeason === 1}>
              ← Previous Season
            </button>
            
            <select 
              value={currentSeason} 
              onChange={(e) => handleSeasonChange(Number(e.target.value))}
            >
              {seasons.map(season => (
                <option key={season.season_number} value={season.season_number}>
                  Season {season.season_number}
                </option>
              ))}
            </select>

            <button 
              onClick={handleNextSeason} 
              disabled={currentSeason === Math.max(...seasons.map(s => s.season_number))}
            >
              Next Season →
            </button>

            {/* Episode Controls */}
            <button onClick={handlePreviousEpisode} disabled={currentSeason === 1 && currentEpisode === 1}>
              ← Previous Episode
            </button>

            <select 
              value={currentEpisode} 
              onChange={(e) => handleEpisodeChange(Number(e.target.value))}
            >
              {getCurrentSeasonData() && Array.from(
                { length: getCurrentSeasonData()!.episode_count }, 
                (_, i) => i + 1
              ).map(ep => (
                <option key={ep} value={ep}>
                  Episode {ep}
                </option>
              ))}
            </select>

            <button 
              onClick={handleNextEpisode} 
              disabled={
                getCurrentSeasonData() && 
                currentEpisode === getCurrentSeasonData()!.episode_count &&
                currentSeason === Math.max(...seasons.map(s => s.season_number))
              }
            >
              Next Episode →
            </button>

            <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>
              S{currentSeason}E{currentEpisode}
            </span>
          </div>
        )}
      </div>

      <iframe
        ref={iframeRef}
        src={src}
        allow="autoplay"
        style={{ flex: 1, border: 'none' }}
      />
    </div>
  );
}

export default Page;
