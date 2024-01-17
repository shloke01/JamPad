import os, requests, base64
from dotenv import load_dotenv
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

app = Flask(__name__)
CORS(app)
load_dotenv()

# SPOTIFY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
# SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')
# SPOTIFY_REDIRECT_URI = "https://www.127.0.0.1:5000/callback"

client_credentials_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

@app.route('/')
def index():
    return "Spotify Auth Server"

@app.route('/spotify-search', methods=["GET", "POST"])
def spotify_search():
    query = request.get_json()
    track_name = query["track"]

    results = sp.search(
        q=track_name,
        type='track',
        market='US',
        limit=10,
        offset=0
    )
    
    return jsonify({"results": results['tracks']['items']}), 200


if __name__ == '__main__':
    app.run(host="10.0.0.195", port=3000, debug=True)
    # app.run(host="192.168.0.116", port=3000, debug=True)