import MOVIES_DATA from "./movies_data";
import "./style.css";
import { IoCloseOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import StarRatingComponent from "react-star-rating-component";
import ReactLoading from "react-loading";
import { LazyLoadImage } from "react-lazy-load-image-component";
import React, { useState } from "react";
import Sv1 from "./Sv1";
import Sv2 from "./Sv2";
import { Link } from "react-router-dom";
import MovieTypes from "./MovieTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faStar,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faImdb } from "@fortawesome/free-brands-svg-icons";
const fetch = require("sync-fetch");
function Watch(params) {
  const [serverUse, ChangeServer] = useState(2);
  let json_data = localStorage.getItem("movieData");
  const [isChoose, setIsChoose] = useState(false);
  let isAdvance = false;

  let movieObject = {};
  if (json_data !== null && json_data !== undefined) {
    let storageData = JSON.parse(json_data);
    if (storageData.AdSearch === 1) {
      isAdvance = true;
      movieObject.title = storageData.title;
      movieObject.english_title = "";
      movieObject.hash = storageData.hash;
      movieObject.imdb_id = null;
      movieObject.backdrop_path = "";
    } else {
      movieObject = MOVIES_DATA.filter(function (obj) {
        return obj.id === JSON.parse(json_data).idMovie;
      }).map(function (obj) {
        return obj;
      });
      movieObject = movieObject[0];
    }
  }
  let movieInfo = fetch(
    "https://api.themoviedb.org/3/movie/" +
      movieObject.tmdb_id +
      "?api_key=80d38ce4b783b1c72330ca00da8dd2d3&append_to_response=videos%2Ccredits&language=en-GB",
    {
      method: "GET",
      headers: {},
    }
  ).json();

  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const openModal = () => {
    setModal(!modal);
  };

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };

  return (
    <div className="wrapcontainer">
    <div className="h-screen bg-black">
      
      {isChoose ? (
        <div className="h-screen">
          <Link to="/">
            <FontAwesomeIcon
              className="text-white hover:text-gray-300 text-2xl absolute top-5 right-8 shadow-lg"
              icon={faTimes}
            />
          </Link>
          <h3 className="text-center text-white text-lg font-bold pt-2 pb-2">
            {movieObject.english_title}
            <p className="text-sm font-thin"> </p>
          </h3>
          {serverUse === 1 ? (
            <Sv1 movieObject={movieObject} />
          ) : (
            <Sv2 movieObject={movieObject} />
          )}

          {/* <TorrentPlayer hash={movieObject.hash} /> */}
          {/* <button
            onClick={() => ChangeServer(2)}
            className="mr-3 mt-3 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          >
            Server 1
          </button> */}
          {/* <button
            onClick={() => ChangeServer(1)}
            className="bg-blue-500 mt-3 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          >
            Server 2
          </button> */}
          <h4 className="text-white">
            
          </h4>
          <h4 className="text-white text-sm p-5">
            <b>Note: </b> 
            Due to using torrent protocol to transmit data,
            The download speed will be very fast and lag-free, but it will take some time to
            initialize wait for the system to connect with many other peers to keep the movie watching process stable.
            </h4>
        </div>
      ) : (
        <div className="h-screen bg-black">




          <LazyLoadImage
            className="bg-cover brightness-50 blur-lg h-screen bg-black"
            placeholder={
             <ReactLoading type={"spin"} color="#d30000" height={'20%'} width={'20%'} />
            }
            src={
              "https://www.themoviedb.org/t/p/original" +
              movieObject.backdrop_path
            }
          />

          <Link to="/">
            <FontAwesomeIcon
              className="text-white hover:text-gray-300 text-2xl absolute top-5 right-8 shadow-lg"
              icon={faTimes}
            />
          </Link>
          <div className="md:flex absolute sm:top-[5%] top-[5%]  left-[5%]">
            <div className="md:hidden flex justify-center">
              <LazyLoadImage
                className="w-[30%] md:w-[60%] rounded-md shadow-lg"
                placeholder={
                  <ReactLoading
                    type={"spinningBubbles"}
                    height={"5em"}
                    width={"5em"}
                  />
                }
                src={
                  "https://www.themoviedb.org/t/p/original" +
                  movieInfo.poster_path
                }
              />
            </div>
            <div className="md:hidden flex justify-center">
              <button
                onClick={() => setIsChoose(true)}
                className="md:hidden block mr-3 mt-3 shadow-md text-sm bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4  rounded"
              >
                Watch now{" "}
                <FontAwesomeIcon
                  className="ml-1 shadow-lg text-lg"
                  icon={faPlayCircle}
                />
              </button>
              
            </div>
            <div className="md:hidden flex justify-center">
            <button onClick={openModal} className="mr-3 mt-3 shadow-md text-sm bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4  rounded"> Trailer <FontAwesomeIcon
                    className="ml-1 shadow-lg text-lg"
                    icon={faPlayCircle}
                  />
                  {modal ? (
                      <section className="modal__bg">
                        <div className="modal__align">
                          <div className="modal__content" modal={modal}>
                            <IoCloseOutline
                              className="modal__close"
                              arial-label="Close modal"
                              onClick={setModal}
                            />
                            <div className="modal__video-align">
                              {videoLoading ? (
                                <div className="modal__spinner">
                                  <BiLoaderAlt
                                    className="modal__spinner-style"
                                    fadeIn="none"
                                  />
                                </div>
                              ) : null}
                              <iframe
                                className="modal__video-style"
                                onLoad={spinner}
                                loading="lazy"
                                width="800"
                                height="500"
                                src={"https://autoembed.to/trailer/movie/" + movieObject.tmdb_id}
                                title="Trailer video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                              ></iframe>
                            </div>
                          </div>
                        </div>
                      </section>
                    ) : null}  
             </button>

            </div>

            <img
              className="hidden md:block w-[35%] md:w-[30%] rounded-md shadow-lg"
              src={
                "https://www.themoviedb.org/t/p/original" +
                movieInfo.poster_path
              }
            ></img>
            {/* text div */}
            <div className="top-[5%] ml-5 mt-2 text-white">
              <h1 className="font-semibold md:text-4xl text-lg">
                {movieObject.english_title}
              </h1>
            
              <h1 className="mt-3 font-semibold md:text-base text-xs">
                {new Date(movieObject.release_date).getFullYear()} •{" "}
                {movieObject.runtime} minute •{" "}
                {movieObject.genre_ids.slice(0, 3).map((e) => (
                  <><div className="genreBubble">{MovieTypes.find((x) => x.key === e).name}</div></>
                ))}
         <div>      
</div> 
              </h1>
              <StarRatingComponent
                name="IMBDrate"
                editing={false}
                renderStarIcon={() => (
                  <FontAwesomeIcon
                    className="mr-1 shadow-lg text-xs"
                    icon={faStar}
                  />
                )}
                starCount={5}
                value={(movieObject.imdb * 5) / 10}
              />
              <p className="font-semibold md:text-base text-sm">
                IMDb: {movieObject.imdb}/10
              </p>
              
              <p className=" mt-3 mr-10 break-words font-semibold md:text-base text-sm">
                Overview:</p><div className="overviewText">{movieInfo.overview}</div>
              
              <h1 className="mt-3 mr-10 break-words font-semibold md:text-base text-sm">
              <p className="font-semibold md:text-base text-sm -mb-5">
              Cast:</p>
                {movieInfo.credits.cast.slice(0, 10).map((e, i) => (
                  <>
                  <div className="castcontainer">
                  <div className="actorbubble"> <img src={"https://www.themoviedb.org/t/p/w600_and_h900_bestv2/" + e.profile_path} alt="cast"></img>
                  <div className="actorname">{e.name}</div>
                  </div> 
                  
                  </div>
                  </>
                ))}
               
              </h1>
              
              {/* <div class="flex flex-col items-center justify-center gap-3">
                      <img
                        class="w-18 h-18 rounded-full ml-10"
                        src={
                          "https://www.themoviedb.org/t/p/w92" + e.profile_path
                        }
                      />
                      <h1 class="text-slate-900 text-xs w-full ml-10 font-medium dark:text-slate-200">
                        {e.name}
                      </h1>
                    </div> */}
                    

              <div className="md:block hidden absolute bottom-2 md:left-[5%] md:top-[100%] left-0">
                
                <button
                  onClick={() => setIsChoose(true)}
                  className="mr-3 mt-3 shadow-md text-sm bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4  rounded"
                >
                  Watch Now{" "}
                  <FontAwesomeIcon
                    className="ml-1 shadow-lg text-lg"
                    icon={faPlayCircle}
                  />
                </button>
                <button onClick={openModal} className="mr-3 mt-3 shadow-md text-sm bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4  rounded"> Trailer <FontAwesomeIcon
                    className="ml-1 shadow-lg text-lg"
                    icon={faPlayCircle}
                  />
                  {modal ? (
                      <section className="modal__bg">
                        <div className="modal__align">
                          <div className="modal__content" modal={modal}>
                            <IoCloseOutline
                              className="modal__close"
                              arial-label="Close modal"
                              onClick={setModal}
                            />
                            <div className="modal__video-align">
                              {videoLoading ? (
                                <div className="modal__spinner">
                                  <BiLoaderAlt
                                    className="modal__spinner-style"
                                    fadeIn="none"
                                  />
                                </div>
                              ) : null}
                              <iframe
                                className="modal__video-style"
                                onLoad={spinner}
                                loading="lazy"
                                width="100%"
                                height="500"
                                src={"https://autoembed.to/trailer/movie/" + movieObject.tmdb_id}
                                title="Trailer video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                              ></iframe>
                            </div>
                          </div>
                        </div>
                      </section>
                    ) : null}  
             </button>
         
              </div>

          

              
            </div>
            
          </div>
          <div className="App">
      
    </div>
        </div>
      )}
    </div>
    </div>
  );
}
export default Watch;
