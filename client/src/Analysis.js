import React from 'react'

function Analysis() {
  console.log('ithenth myr');
  const urlParams = new URLSearchParams(window.location.search);
  const track = urlParams.get('value') || null;
  console.log('track: ', track);
  return (
    <>
    <div>analysis fo real this time</div>
    <h3>{track}</h3>
    </>
  )
}

export default Analysis