import React from "react";
import "./App.css";

function Analysis() {
  const urlParams = new URLSearchParams(window.location.search);
  const track = urlParams.get("value") || null;
  const accessToken = window.localStorage.getItem("spotify_access_token");
  const obj = eval("(" + track + ")");
  const [showResults, setShowResults] = React.useState(false);

  const onClickMe = () => {
    setShowResults(true);
    window.location = `http://localhost:8888/createplaylist?accessToken=${accessToken}&mood=${obj["pos"]}`;
  };

  return (
    <>
      <div
        className="Analysis"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>
          <h3>
            The current song you're listening to has a positivity rating of:
          </h3>

          <h1>{obj["pos"]}</h1>

          <button className="create-playlist" onClick={onClickMe}>
            Create your uplifting playlist
          </button>
          {showResults ? (
            <>
              <div className="loading-playlist">
                <iframe
                  src="https://giphy.com/embed/zZC2AqB84z7zFnlkbF"
                  width="180"
                  height="180"
                  frameBorder="0"
                  class="giphy-embed"
                  allowFullScreen
                ></iframe>
                <p className="loading-text">
                  Your Playlist is being created . . .{" "}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Analysis;
