// This component is used to display the song card in the home page and the playlist page. The song card is used to display the song name, artist name, and the options to play, add to queue, add to playlist, and delete the song. The song card is also used to play the song when the user clicks on the song card.

//Importing libries
import React from "react";
import { useContext, useState, useRef } from "react";
import axios from "axios";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

//Importing context
import { SongContext } from "../Context/SongContext";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";

//Importing icons
import { SlOptionsVertical } from "react-icons/sl";
import { MdDeleteOutline, MdOutlinePlaylistAdd, MdQueuePlayNext } from 'react-icons/md'
import musicbg from "../assets/musicbg.jpg";


const SongCard = ({ title, artistName, songSrc, userId, songId, file }) => {

  // Using context
  const { song, audio, __URL__ } = useContext(SongContext);
  const { setFetchSong } = useContext(FetchContext);
  const { dispatchQueue, dispatchList } = useContext(QueueContext)
  const navigate = useNavigate(); // Used to navigate to the playlist page

  const token = localStorage.getItem("access_token");
  let decoded;
  if (token) { decoded = decodeToken(token) };

  const [showOptions, setShowOptions] = useState(false);

  // Display the options
  const displayOptions = () => {
    setShowOptions((prev) => !prev);
  };

  // Play the song when the user clicks on the song card
  const handlePlay = () => {
    song.setSongName(title);
    song.setArtistName(artistName);
    song.setSongUrl(`${__URL__}/api/v1/stream/${songSrc}`);
    audio.src = `${__URL__}/api/v1/stream/${songSrc}`;
    audio.load();
    audio.play();
    song.setIsPlaying(true)
  };

  const headers = {
    "x-auth-token": localStorage.getItem("access_token"),
  };
  // Delete the song
  const deleteSong = async () => {
    const { data, status } = await axios.delete(
      `${__URL__}/api/v1/song/delete/${songId}?file=${file}`,
      {
        headers,
      }
    );
    if (status == 200) setFetchSong(prev => !prev)
  };
  const handleDelete = () => {
    confirm("Are you sure you want to delete this song?") &&
      deleteSong();
  };

  // Add the song to the playlist
  const handleAddToPlaylist = () => {
    dispatchList({ type: 'ADD_SONG', payload: { title, artistName, songSrc } })
    navigate("/playlists");
  };

  //Play the song next
  const handlePlayNext = () => {
    dispatchQueue({ type: 'ADD_TO_QUEUE', payload: { title, artistName, songSrc } })
  };

  return (
    <div className="flex relative bg-gray-800 text-white justify-between items-center p-2 lg:w-[80vw] mx-auto rounded-lg hover:bg-gray-700 transition-colors duration-200">
      <div onClick={handlePlay} className="flex space-x-9 cursor-pointer">
        <img src={musicbg} alt="" className="w-20" />
        <div className="text-sm lg:text-lg">
          <div>{title}</div>
          <div>{artistName}</div>
        </div>
      </div>

      {/* <---------------------------Desktop Options-------------------------> */}
      <div className="hidden lg:flex items-center space-x-2">
        {/* Add to Playlist Button */}
        <motion.button
          onClick={handleAddToPlaylist}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-gray-700 hover:bg-indigo-500 hover:text-white transition-colors duration-200"
          title="Add to playlist"
        >
          <MdOutlinePlaylistAdd size={22} className="text-indigo-400 hover:text-white" />
        </motion.button>

        {/* Play Next Button */}
        <motion.button
          onClick={handlePlayNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-gray-700 hover:bg-green-500 hover:text-white transition-colors duration-200"
          title="Play next"
        >
          <MdQueuePlayNext size={22} className="text-green-400 hover:text-white" />
        </motion.button>

        {/* Delete Button (conditionally rendered) */}
        {decoded?.id === userId && (
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-700 hover:bg-red-500 hover:text-white transition-colors duration-200"
            title="Delete song"
          >
            <MdDeleteOutline size={22} className="text-red-400 hover:text-white" />
          </motion.button>
        )}
      </div>
      {/* <---------------------------Mobile Options-------------------------> */}
      <div
        onClick={displayOptions}
        onMouseOut={() => setShowOptions(false)}
        className="relative block lg:hidden"
      >
        <SlOptionsVertical size={15} />
      </div>
      {showOptions && (
        <div className="absolute right-0 z-10 w-36 bg-gray-900 ">
          <ul className="flex justify-start flex-col items-start space-y-2 p-2">
            <button onClick={handleAddToPlaylist}>Add to playlist</button>
            <button onClick={handlePlayNext}>play next</button>
            {
              // if user is the owner of the song then show the delete option
              decoded == null ? <> </> : (decoded.id === userId) ? (
                <button onClick={handleDelete} className=" ">
                  Delete
                </button>
              ) : (<></>)
            }
          </ul>
        </div>
      )}
    </div>
  );
};

export default SongCard;
