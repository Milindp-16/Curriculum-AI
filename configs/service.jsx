import axios from "axios"
//popular npm library used to make http requests to API's

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3'

export const getVideos = async (query) => {
    const params = {
        part: 'snippet', //specifies a comma-separated list of one or more search resource properties that the API response will include
        q: query, //specifies the query term to search for
        maxResults: 1, //maximum number of items to be returned in the return set
        type: 'video', //type of video to be returned - channel,playlist,video
        key: process.env?.NEXT_PUBLIC_YOUTUBE_API_KEY //api key to authenticate the request
    }

    const res = await axios.get(YOUTUBE_BASE_URL + '/search', { params });

    return res.data.items;
}

