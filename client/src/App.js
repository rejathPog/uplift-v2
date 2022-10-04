import { useEffect, useState } from 'react';
import { accessToken, logout, getCurrentUserProfie } from './spotify';
import './App.css';
import { catchErrors } from './utils';

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
    
        const { data } = await getCurrentUserProfie();
        setProfile(data);
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
          <button onClick={logout}>Log Out</button>
          <h1>Logged in!</h1>
          {profile && (
            <div>
              <h1>{profile.display_name}</h1>
              <p>{profile.followers.total} Followers</p>
              {profile.images.length && profile.images[0].url && (
                <img src={profile.images[0].url} alt="Avatar" />
              )}
            </div>
          )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
