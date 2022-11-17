import sys
import os
import lyricsgenius as lg
from nltk.sentiment.vader import SentimentIntensityAnalyzer

#replace access token when running
GENIUS_ACCESS_TOKEN = "ZQxg_yvxSbolXlz1IWOzvg5nJ76nx9Isc7WBQ7T_lyHnrzHD_5J0nx1Z8e9-zaGc"
genius = lg.Genius(GENIUS_ACCESS_TOKEN)
track_name = sys.argv[1]
artist_name = sys.argv[2]

old_stdout = sys.stdout 
sys.stdout = open(os.devnull, "w")
track = genius.search_song(title=track_name, artist=artist_name)
sys.stdout = old_stdout 

lyrics = track.lyrics
sia = SentimentIntensityAnalyzer()
print(sia.polarity_scores(lyrics))
