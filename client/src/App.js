import {
  accessToken,
  logout,
  getCurrentUserProfile,
  getCurrentTrackInfo,
} from "./spotify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { catchErrors } from "./utils";
import Analysis from "./Analysis";

import { Helmet } from "react-helmet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [track, setTrack] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentTrackInfo();
      setTrack(data);
      console.log(data);
    };
    catchErrors(fetchData());
    const fetchProfileData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      console.log(data);
    };
    catchErrors(fetchProfileData());
  }, []);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="canonical" href="http://example.com/example" />
      </Helmet>

      <header className="App-header">
        {!token ? (
          <div className="landing">
            <div>
              <h1>
                <FontAwesomeIcon icon={faSpotify} /> Uplift{" "}
              </h1>
              <p>A realtime music analyzer </p>

              <a className="App-link" href="http://localhost:8888/login">
                Login with Spotify
              </a>
            </div>
          </div>
        ) : (
          <>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      {profile && (
                        <div className="navbar">
                          <div>
                            <a className="brand" href="/">
                              <FontAwesomeIcon icon={faSpotify} /> Uplift{" "}
                            </a>
                          </div>

                          <div className="menu">
                            {profile.images.length && profile.images[0].url && (
                              <img
                                className="profile-img"
                                src={profile.images[0].url}
                                alt="Avatar"
                              />
                            )}
                            <p className="profile-name">
                              {profile.display_name}
                            </p>
                          </div>
                          <div>
                            <button className="logout-btn" onClick={logout}>
                              Log Out
                            </button>
                          </div>
                        </div>
                      )}

                      {(track && track.item.type === "track") ? (
                        <div>
                          <h3>You're listening to</h3>

                        <div className="track-details">
                          <img
                            height="200"
                            width="200"
                            className="track-img"
                            src={track.item.album.images[0].url}
                            alt="Avatar"
                          />
                          
                          <h5 className="trackName">{track.item.name}</h5>
                          <h6 className="trackArtist">
                            by {track.item.album.artists[0].name}
                          </h6>
                          
                          </div>

                          
                          {/*<a href='http://localhost:8888/analyze'>Analyze</a>*/}
                          <button
                            className="analyze-btn"
                            onClick={() => {
                              window.location = `http://localhost:8888/analyze?trackName=${track.item.name}&artistName=${track.item.album.artists[0].name}`;
                            }}
                          >
                            Analyze
                          </button>
                        </div>
                      ) : (
                        <>
                          <p>You're not listening to anything at the moment</p>
                          <iframe
                            src="https://giphy.com/embed/q9EUjcUOT1aYE"
                            width="480"
                            height="245"
                            frameBorder="0"
                          ></iframe>
                          <br></br>
                          <button
                            className="logout-btn"
                            onClick={() => {
                              window.location = `http://localhost:8888/login`;
                            }}
                          >
                            play & reload
                          </button>
                        </>
                      )}
                    </>
                  }
                />
                
                <Route
                  path="analyze"
                  element={
                    <>
                      {/*<h1>{track.item.name} has the following rating</h1>*/}
                      <Analysis />
                    </>
                  }
                />
              </Routes>
            </BrowserRouter>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
