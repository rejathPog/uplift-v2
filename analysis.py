import os
import sys
import dotenv
import lyricsgenius as lg
from nltk.sentiment.vader import SentimentIntensityAnalyzer

dotenv.load_dotenv()

GENIUS_ACCESS_TOKEN = os.getenv('GENIUS_ACCESS_TOKEN')
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
