import React from 'react'

function Analysis() {
  const urlParams = new URLSearchParams(window.location.search);
  const track = urlParams.get('value') || null;
  console.log('track: ', track);
  return (
    <>
    <h3>{track}</h3>
    </>
  )
}

export default Analysis