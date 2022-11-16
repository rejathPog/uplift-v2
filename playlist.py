import sys
import random
import spotipy

token = sys.argv[1]
mood = float(sys.argv[2])
mood = 1-mood
spotify_object = spotipy.Spotify(auth=token, requests_timeout=10, retries=10)

def aggregate_top_artists(sp):
	top_artists_name = []
	top_artists_uri = []

	ranges = ['short_term', 'medium_term', 'long_term']
	for r in ranges:
		top_artists_all_data = sp.current_user_top_artists(time_range= r)
		top_artists_data = top_artists_all_data['items']
		for artist_data in top_artists_data:
			if artist_data["name"] not in top_artists_name:		
				top_artists_name.append(artist_data['name'])
				top_artists_uri.append(artist_data['uri'])
	return top_artists_uri


def aggregate_top_tracks(sp, top_artists_uri):
		top_tracks_uri = []
		for artist in top_artists_uri:
			top_tracks_all_data = sp.artist_top_tracks(artist)
			top_tracks_data = top_tracks_all_data['tracks']
			for track_data in top_tracks_data:
				top_tracks_uri.append(track_data['uri'])
		return top_tracks_uri


def select_tracks(sp, top_tracks_uri, mood):	
	selected_tracks_uri = []

	def group(seq, size):
		return (seq[pos:pos + size] for pos in range(0, len(seq), size))

	random.shuffle(top_tracks_uri)
	for tracks in list(group(top_tracks_uri, 50)):
		tracks_all_data = sp.audio_features(tracks)
		for track_data in tracks_all_data:
			try:
				if mood < 0.10:
					if (0 <= track_data["valence"] <= (mood + 0.15)
					and track_data["danceability"] <= (mood*8)
					and track_data["energy"] <= (mood*10)):
						selected_tracks_uri.append(track_data["uri"])					
				elif 0.10 <= mood < 0.25:						
					if ((mood - 0.075) <= track_data["valence"] <= (mood + 0.075)
					and track_data["danceability"] <= (mood*4)
					and track_data["energy"] <= (mood*5)):
						selected_tracks_uri.append(track_data["uri"])
				elif 0.25 <= mood < 0.50:											
					if ((mood - 0.085) <= track_data["valence"] <= (mood + 0.085)
					and track_data["danceability"] <= (mood*3)
					and track_data["energy"] <= (mood*3.5)):
						selected_tracks_uri.append(track_data["uri"])
				elif 0.50 <= mood < 0.75:						
					if ((mood - 0.075) <= track_data["valence"] <= (mood + 0.075)
					and track_data["danceability"] >= (mood/2.5)
					and track_data["energy"] >= (mood/2)):
						selected_tracks_uri.append(track_data["uri"])
				elif 0.75 <= mood < 0.90:						
					if ((mood - 0.075) <= track_data["valence"] <= (mood + 0.075)
					and track_data["danceability"] >= (mood/2)
					and track_data["energy"] >= (mood/1.75)):
						selected_tracks_uri.append(track_data["uri"])
				elif mood >= 0.90:
					if ((mood - 0.15) <= track_data["valence"] <= 1
					and track_data["danceability"] >= (mood/1.75)
					and track_data["energy"] >= (mood/1.5)):
						selected_tracks_uri.append(track_data["uri"])
			except TypeError as te:
				continue
	return selected_tracks_uri


def create_playlist(sp, top_tracks, mood):
    user_all_data = sp.current_user()
    user_id = user_all_data["id"]
    selected_tracks = select_tracks(sp, top_tracks, mood)
    playlist_all_data = sp.user_playlist_create(user_id, "Uplift")
    playlist_id = playlist_all_data["id"]
    playlist_uri = playlist_all_data["uri"]
    random.shuffle(selected_tracks)
    sp.user_playlist_add_tracks(user_id, playlist_id, selected_tracks[0:30])
    print(playlist_uri[17:])

top_artists = aggregate_top_artists(spotify_object)
top_tracks = aggregate_top_tracks(spotify_object, top_artists)
create_playlist(spotify_object, top_tracks, mood)