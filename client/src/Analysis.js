import React from 'react'

function Analysis() {
  const urlParams = new URLSearchParams(window.location.search);
  const track = urlParams.get('value') || null; 
  
  
  const obj = eval("(" + track + ')');

  

  
  return (
    <>
      <h1>pos = {obj["pos"]}</h1> 
    </>
  )
}

export default Analysis