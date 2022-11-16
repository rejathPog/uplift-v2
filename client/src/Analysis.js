import React from 'react'

function Analysis() {
  const urlParams = new URLSearchParams(window.location.search);
  const track = urlParams.get('value') || null; 
  const accessToken = window.localStorage.getItem('spotify_access_token');
  const obj = eval('(' + track + ')');

  
  return (
    <>
      <h3>The current song you're listening to has a positivity rating of:</h3>
      <h1>{obj["pos"]}</h1> 
      <button 
      className='App-link' 
      onClick={() => window.location = `http://localhost:8888/createplaylist?accessToken=${accessToken}&mood=${obj['pos']}`}
      >Create your custom playlist</button>
    </>
  )
}

export default Analysis