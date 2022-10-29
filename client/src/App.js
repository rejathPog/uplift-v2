import { accessToken, logout, getCurrentUserProfie, getCurrentTrackInfo } from './spotify';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { catchErrors } from './utils';
import Analysis from './Analysis';
import './App.css';


function App() {
  const [token, setToken] = useState(null);
  const [track, setTrack] = useState(null);
  
  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {    
        const { data } = await getCurrentTrackInfo();
        setTrack(data);
        console.log(data);
    };
    catchErrors(fetchData());
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
        <a
          className="App-link"
          href="http://localhost:8888/login"         
        >
          Login to Spotify
        </a>
        ):(
        <>
          <BrowserRouter>
            <Routes>
              <Route 
                path="/"
                element={
                  <>
                  <button onClick={logout}>Log Out</button>
                  <h1>Logged in!</h1>          
                  {/*profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>{profile.followers.total} Followers</p>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Avatar" />
                      )}
                    </div>
                      )*/}
                    {track && (
                      <div>
                        <p>You're listening to</p>
                        <h1>{track.item.name}</h1>
                        <h3>by {track.item.album.artists[0].name}</h3>
                        {/*<a href='http://localhost:8888/analyze'>Analyze</a>*/}
                        <button onClick={
                          () => {window.location=`http://localhost:8888/analyze?trackName=${track.item.name}&artistName=${track.item.album.artists[0].name}`}
                        }>Analyze</button>
                      </div>
                    )}
                  </>
                }
              />
              <Route 
                path="analyze"
                element = {<Analysis/>}
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
