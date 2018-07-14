# Phibun Playlist Generator

Generate Spotify playlists filled with music from various subreddits!

# Application

Application using [Spotify's Web API](https://developer.spotify.com/documentation/web-api/) together with the [Reddit API](https://www.reddit.com/dev/api/). 

Developed using ReactJS with React-Bootstrap for the client and ExpressJS on the server.

### API Authorization Flows (Spotify & Reddit)
 * [Authorization Code](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow) for the Spotify API
 * [Application Only Oauth](https://github.com/reddit-archive/reddit/wiki/OAuth2#application-only-oauth) for the Reddit API

## Development setup instructions
1. Clone repository
2. run `npm install` in root folder
3. `cd client`  and run `npm install`
4. Create a `.env` file and pass it the following:
```
SERVER_PORT=8000
DB_CONNECTION_STRING=<Your MongoDB connection string>
SPOTIFY_SECRET=<Your Spotify API Client Secret>
SPOTIFY_ID=<Your Spotify API Client ID>
REDDIT_SECRET=<Your Reddit API Client Secret>
REDDIT_ID=<Your Reddit API Client ID>
REDDIT_USER_AGENT=<Your Reddit User Agent string (Link below for more info)>
```
 * <sub>[Reddit User Agent Info](https://github.com/reddit-archive/reddit/wiki/API#rules)</sub>

5. `cd ..` and run `npm start`
6. Navigate to http://localhost:3000 in any browser

# Functionalities

## Generate Playlist with songs from various subreddits

Enter a name for your Spotify playlist and click on "Create Playlist" in order to generate it. The playlist will consist of 10 songs.

<img src="https://i.imgur.com/T6DiHCY.jpg" alt="Generate playlist" width="800px"/>

## View generated playlists and replace individual songs

### View
By navigating to the "Your Playlists" tab you can view all your generated playlists.

<img src="https://i.imgur.com/hM2hSY0.jpg" alt="View playlist" width="800px"/>

### Replacing songs

By clicking on the blue replace button you can replace any individual song in your playlists.

1. Generate a new song 
<img src="https://i.imgur.com/e4J3FAU.png" alt="Replace song" width="800px"/>

2. Replace the previous song with the newly generated one
<img src="https://i.imgur.com/E1L8lU0.jpg" alt="Replace song" width="800px"/>

3. Listen to your awesome playlist in Spotify!
<img src="https://i.imgur.com/KFUDDht.png" alt="Replace song" width="800px"/>
