import React, { useState, useContext } from "react";
import axios from "axios";  
import { SongContext } from "../Context/SongContext";
import playlist from "../assets/playlist.jpg";
import { CgPlayListAdd } from "react-icons/cg";
import { Link } from "react-router-dom";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";
import { motion } from "framer-motion";
import { FiMusic } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const PlaylistCard = ({ playlistName, playlistId, noSongs }) => {
    const { setFetchPlaylist } = useContext(FetchContext);
    const { songList, setSongList, __URL__ } = useContext(SongContext);
    const { list, dispatchList } = useContext(QueueContext);

    const [loading, setLoading] = useState(false);

    // Adding song to playlist
    const addSongToPlaylist = async () => {
        if (list.length === 0) {
            alert("Please select a song");
            return;
        }
        setLoading(true);
        const headers = {
            "Content-Type": "application/json",
            "X-Auth-Token": localStorage.getItem("access_token"),
        };
        try {
            const { data, status } = await axios.post(
                `${__URL__}/api/v1/playlist/add/${playlistId}`,
                list,
                { headers }
            );
            if (status === 200) {
                alert("Song added to playlist");
                setFetchPlaylist((prev) => !prev);
                dispatchList({ type: "REMOVE_SONG", payload: list[0]["title"] });
            }
        } catch (error) {
            console.error("Error adding song to playlist:", error);
            alert("Failed to add song to playlist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            <Link 
                to={`/playlist/${playlistId}`} 
                className="flex items-center space-x-4 flex-1"
            >
                <div className="relative">
                    <img 
                        src={playlist} 
                        alt="Playlist cover" 
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                        <FiMusic className="text-white text-xl" />
                    </div>
                </div>
                
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white truncate max-w-[180px]">
                        {playlistName}
                    </h3>
                    <p className="text-gray-300 text-sm flex items-center">
                        <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs mr-2">
                            {noSongs}
                        </span>
                        {noSongs === 1 ? "Song" : "Songs"}
                    </p>
                </div>
            </Link>

            <button
                onClick={addSongToPlaylist}
                disabled={loading}
                data-tooltip-id="add-tooltip"
                data-tooltip-content="Add selected songs to playlist"
                className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors duration-200 text-white"
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <CgPlayListAdd size={24} />
                )}
            </button>
            
            <Tooltip id="add-tooltip" place="top" effect="solid" />
        </motion.div>
    );
};

export default PlaylistCard;