import sys
import lyricsgenius as lg
#print('Hello from python')
#print(sys.argv[1])
#print(sys.argv[2])
#print(0.5653)

#replace access token when running
GENIUS_ACCESS_TOKEN = "ef3CPujLLUJsjTEud9i1CzNnVSl92gPTtGKwiHxLPDdZC6dbOzz8aGK77CYQKHSI"
genius = lg.Genius(GENIUS_ACCESS_TOKEN)
track_name = sys.argv[1]
artist_name = sys.argv[2]
track = genius.search_song(title=track_name, artist=artist_name)
lyrics = track.lyrics
print(lyrics)