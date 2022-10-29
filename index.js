require('dotenv').config();
const querystring = require('query-string');
const { spawn } = require('child_process');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

/*
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time'
}

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
};
*/

app.get('/', (req, res) => {
    const data = {
        name: "rejath",
        isGamer: "false"
    };
    res.send(data);
});

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';  

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    const scope = 'user-read-private user-read-email user-read-currently-playing';

    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope
      });
    
      res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      })
        .then(response => {
          if (response.status === 200) {
            const { access_token, refresh_token, expires_in } = response.data;
            //access_token_global = access_token;
            const queryParams = querystring.stringify({
              access_token,
              refresh_token,
              expires_in
            });
            res.cookie('access_token', access_token);
/*
            const accessParams = {
              [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
              [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
              [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
            };

            if (accessParams[LOCALSTORAGE_KEYS.accessToken]) {
              // Store the access params in localStorage
              for (const property in accessParams) {
                window.localStorage.setItem(property, accessParams[property]);
              }
            }
*/    
            res.redirect(`http://localhost:3000/?${queryParams}`);
    
          } else {
            res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
          }
        })
        .catch(error => {
          res.send(error);
        });
});

app.get('/refresh_token', (req, res) => {
    
    const { refresh_token } = req.query;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.send(error);
    });
});

app.get('/analyze', (req, res) => {
  const track = req.query.trackName || null;
  const artist = req.query.artistName || null;
  console.log(track);
  console.log(artist);
  const python = spawn('python',['pytest.py', track, artist]);

  python.stdout.on('data', (data) => {
    console.log(data.toString());
    console.log(typeof(data));
    let queryParams = querystring.stringify({value: data.toString()});
    res.redirect(`http://localhost:3000/analyze?${queryParams}`);
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
})

/*
app.get('/analyze', (req, res) => {
  console.log(access_token_global);
  axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token_global}`
    },
  })
  .then(response => {
    res.send(response.data);
    console.log(response.data);
  })
  .catch(error => {
    res.send(error);
  });
})
app.get('/analyze', (req, res) => {
  const currentTrack = () => axios.get('https://api.spotify.com/v1/me/player/currently-playing');
  let dataToSend;
  const python = spawn('python',['pytest.py',currentTrack.item.name, currentTrack.item.album.artists[0].name]);
  python.stdout.on('data', function(data) {
    console.log('fetching data');
    dataToSend = data;
  })
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    res.send(dataToSend);
  })
})
*/
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});