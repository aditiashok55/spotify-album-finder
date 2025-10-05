
import './App.css';
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";

// App.jsx
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  
const [searchInput, setSearchInput] = useState("")
const [accessToken, setAccessToken] = useState("")
const [albums, setAlbums] = useState([]);
const [isLoading, setIsLoading] = useState(false); 


useEffect(() => {
  let authParams = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "grant_type=client_credentials&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret,
  };

  fetch("https://accounts.spotify.com/api/token", authParams)
    .then((result) => result.json())
    .then((data) => {
      setAccessToken(data.access_token);
    });
}, []);

  async function search() {
    setIsLoading(true);
    setAlbums([]);
  let artistParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    };
    try {

  // Get Artist
  const artistID = await fetch(
    "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
    artistParams
  )
    .then((result) => result.json())
    .then((data) => {
      return data.artists.items[0].id;
    });

  // Get Artist Albums
  await fetch(
    "https://api.spotify.com/v1/artists/" +
      artistID +
      "/albums?include_groups=album&market=US&limit=50",
    artistParams
  )
    .then((result) => result.json())
    .then((data) => {
      setAlbums(data.items);
      setIsLoading(false);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    setIsLoading(false); // Stop loading on error
  }
}

  return (
      <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        {/* Floating music notes decoration */}
        <div className="music-note note-1">♪</div>
        <div className="music-note note-2">♫</div>
        <div className="music-note note-3">♪</div>
        <div className="music-note note-4">♫</div>
    
        {/* Header Section */}
        <div className="app-header">
          <h1 className="app-title">Spotify Album Finds!</h1>
          <p className="app-subtitle">Discover your favorite artist's albums</p>
        </div>
    
        {/* Search Section */}
        <Container className="search-container">
          <InputGroup>
            <FormControl
              className="search-input"
              placeholder="Search for an artist..."
              type="input"
              aria-label="Search for an Artist"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  search();
                }
              }}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <Button className="search-button" onClick={search}>
              Search
            </Button>
          </InputGroup>
        </Container>
    
        {/* Loading Spinner */}
        {isLoading && (
          <div className="loading-container">
            <div className="vinyl-spinner"></div>
          </div>
        )}
    
        {/* Albums Grid */}
        {!isLoading && albums.length > 0 && (
          <Container className="albums-container">
            <Row
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
                alignContent: "center",
              }}
            >
              {albums.map((album, index) => {
                return (
                  <Card
                    key={album.id}
                    className="album-card"
                    style={{ width: "240px" }}
                  >
                    <Card.Img
                      className="album-image"
                      src={album.images[0].url}
                      alt={album.name}
                    />
                    <Card.Body className="album-body">
                      <Card.Title className="album-title">
                        {album.name}
                      </Card.Title>
                      <Card.Text className="album-release">
                        Release Date: {album.release_date}
                      </Card.Text>
                      <Button
                        href={album.external_urls.spotify}
                        className="album-link-button"
                        target="_blank"
                      >
                        Open in Spotify
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </Row>
          </Container>
        )}
      </div>
    );
}

export default App;
