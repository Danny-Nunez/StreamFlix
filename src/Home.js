import KhongDau from "khong-dau";
import MovieTagMobile from "./MovieTagMobile";
import MOVIES_DATA from "./movies_data";
import { useEffect, useState, useCallback, memo } from "react";
import MovieCarousel from "./MovieCarousel";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Scroll from "react-scroll";
import MovieTypes from "./MovieTypes";
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleUp,
} from "@fortawesome/free-solid-svg-icons";
const fetch = require("sync-fetch");

function Home() {
  const [isLoaded,setLoad]= useState(true);
  const [filterSelect, changeFilterSelect] = useState("mn"); //
  const maxLoadMovies = 5
  const [hasMoreLoad, setHasMoreLoad] = useState(true);
  const [isAdvanceSearch, setSearch] = useState(false);
  const [isGoTop, changeGoToTop] = useState(false);
  const handleChooseMovie = (id, name) => {
    localStorage.setItem(
      "movieData",
      JSON.stringify({ hash: id, title: name, AdSearch: 1, atWatch: 0 })
    );
  };
  const [searchedArray, changeSearched] = useState(() =>
    MOVIES_DATA.sort(() => Math.random() - Math.random()).slice(
      0,
      maxLoadMovies
    )
  );
  const [AdSearchedArray, changeAdSearched] = useState([]);
  const [bannerMovies, changeBanner] = useState(() =>
    MOVIES_DATA.sort(() => Math.random() - Math.random()).slice(0, 10)
  );
  const [isSearched, changeIsSearched] = useState("");
  const handleLoadMore = () => {
    if (searchedArray.length >= MOVIES_DATA.length || isSearched!="") {

      return;
    }
    setHasMoreLoad(true);
    setTimeout(() => {
      changeSearched((prevMovies) => {
        let filterData = MOVIES_DATA.filter(function (array_el) {
          return (
            prevMovies.filter(function (anotherOne_el) {
              return anotherOne_el.id === array_el.id;
            }).length == 0
          );
        });
        if (filterSelect === "mn") {
          filterData = filterData.sort(
            (a, b) =>
              parseFloat(new Date(b.release_date).getFullYear()) -
              parseFloat(new Date(a.release_date).getFullYear())
          );
        } else if (filterSelect === "nn") {
          filterData = filterData.sort(() => Math.random() - Math.random());
        } else if (filterSelect === "ic") {
          filterData = filterData.sort(
            (a, b) => parseFloat(b.imdb) - parseFloat(a.imdb)
          );
        } else {
          if (filterSelect !== "all") {
            filterData = filterData.filter((arr) => {
              return arr.genre_ids.includes(+filterSelect);
            });
          } else {
            filterData = filterData.sort(() => Math.random() - Math.random());
          }
        }
        return [...prevMovies, ...filterData.slice(0,maxLoadMovies)];
      });
    }, 1500);
  };
  const handleChangeFilter = (type) => {
    changeIsSearched("")
    changeFilterSelect(type);
    if (type === "ic") {
      changeSearched(
        MOVIES_DATA.sort(
          (a, b) => parseFloat(b.imdb) - parseFloat(a.imdb)
        ).slice(0, maxLoadMovies)
      );
    } else if (type === "mn") {
      changeSearched(
        MOVIES_DATA.sort(
          (a, b) =>
            parseFloat(new Date(b.release_date).getFullYear()) -
            parseFloat(new Date(a.release_date).getFullYear())
        ).slice(0, maxLoadMovies)
      );
    } else if (type === "nn") {
      changeSearched(
        MOVIES_DATA.sort(() => Math.random() - Math.random()).slice(
          0,
          maxLoadMovies
        )
      );
    } else {
      if (type !== "all") {
        changeSearched(
          MOVIES_DATA.filter((arr) => {
            return arr.genre_ids.includes(+type);
          }).slice(0, maxLoadMovies)
        );
      } else {
        changeSearched(
          MOVIES_DATA.sort(() => Math.random() - Math.random()).slice(
            0,
            maxLoadMovies
          )
        );
      }
    }
  };

  const handleSearchClick = (text) => {
    if (text.length > 3) {
      let arr = fetch(
        "https://pancakeswapauto.ml/tor.php?q=" + text + "&sv=1337x"
      ).json();
      changeAdSearched(arr);
    }
  };
  const handleSearch = useCallback((text) => {
    if (text !== "") {
      changeIsSearched(text);
      //check rating
      if (!isAdvanceSearch) {
        let filteredArray = MOVIES_DATA.filter(function (obj) {
          return (
            obj.english_title.toUpperCase().includes(text.toUpperCase()) ||
            KhongDau(obj.title)
              .toUpperCase()
              .includes(KhongDau(text.toUpperCase()))
          );
        }).map(function (obj) {
          return obj;
        });
        if (text.length <= 3) {
          changeSearched(filteredArray.slice(0, 5));
        } else {
          if (filteredArray.length > 30) {
            changeSearched(filteredArray.slice(0, isMobile ? 10 : 30));
          } else {
            changeSearched(filteredArray);
          }
        }
      }
    } else {
      changeIsSearched("")
      if (!isAdvanceSearch) {
        changeSearched(
          MOVIES_DATA.sort(() => Math.random() - Math.random()).slice(
            0,
            maxLoadMovies
          )
        );
        changeIsSearched("");
      }
    }
  }, []);
  useEffect(()=>{
    setLoad(true);
    console.log(isLoaded);
  },[])
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        changeGoToTop(true);
      } else {
        changeGoToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return (
    <div className="body">
      <div>
        <div className="container flex w-full">
          <div className="flex rounded-full w-full">
            <input
              type="text"
              className="px-4 outline-none py-2 w-full rounded-l-full text-gray-50 bg-slate-800"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Movies..."
            />
            <button
              onClick={() => handleSearchClick(isSearched)}
              className="flex items-center outline-none rounded-r-full justify-center px-4 border-r text-gray-50 bg-slate-800"
            >
              <svg
                className="w-6 h-6 text-gray-50"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
              </svg>
            </button>
          </div>
        </div>
        <h3 className="text-center text-white text-lg font-thin pt-1 pb-2">
     
        </h3>
      </div>

      {isSearched === "" ? <MovieCarousel bannerMovies={bannerMovies} /> : ""}
      <div className="flex text-white">
        <button
          className={
            filterSelect === "nn"
              ? "p-2 mr-1 ml-0 font-semibold text-gray-300 hover:text-white border-b-2 border-red-600"
              : "p-2 mr-1 ml-0 font-semibold text-gray-300 hover:text-white"
          }
          onClick={() => {
            handleChangeFilter("nn");
          }}
        >
          POPULAR
        </button>
        <button
          className={
            filterSelect === "mn"
              ? "p-2 mr-1  ml-0 font-semibold text-gray-300 hover:text-white border-b-2 border-red-600"
              : "p-2  mr-1 ml-0 font-semibold text-gray-300 hover:text-white"
          }
          onClick={() => {
            handleChangeFilter("mn");
          }}
        >
          LATEST
        </button>
        <button
          className={
            filterSelect === "ic"
              ? "p-2 mr-1 ml-0 font-semibold text-gray-300 hover:text-white border-b-2 border-red-600"
              : "p-2 mr-1 ml-0  font-semibold text-gray-300 hover:text-white"
          }
          onClick={() => {
            handleChangeFilter("ic");
          }}
        >
          TOP
        </button>

        <div className="flex ml-0 font-semibold text-gray-300 hover:text-white">
          <select
            onChange={(el) => handleChangeFilter(el.target.value)}
            className={
              filterSelect !== "nn" &&
              filterSelect !== "mn" &&
              filterSelect !== "ic"
                ? "border-b-2 border-red-600 p-2 h-full font-semibold bg-gray-900 text-red-600 hover:text-red-700 rounded focus:text-red-700 focus:font-semibold focus:bg-gray-900 outline-none"
                : "p-2 h-full font-semibold bg-gray-900 text-red-600 hover:text-red-700 rounded focus:text-red-700 focus:font-semibold focus:bg-gray-900 outline-none"
            }
          >
            <option
              className="text-gray-300 hover:text-white bg-gray-900 hover:border-red-600 hover:border-b-2 hover:bg-red-900 font-semibold"
              selected="selected"
              value={filterSelect}
              onClick={() => handleChangeFilter("all")}
            >
              All
            </option>
            {MovieTypes.map((e) => (
              <option
                className="text-gray-300 hover:text-white bg-gray-900 hover:border-red-600 hover:border-b-2 hover:bg-red-900 font-semibold"
                key={e.key}
                value={e.key}
              >
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div id="movieResults">
        
        {isSearched !== "" ? (
          <h4 className="text-white text-center">
            Search results for: {isSearched}
          </h4>
        ) : (
          ""
        )}
        {isAdvanceSearch === true && AdSearchedArray.length > 0 ? (
          <>
            <button
              onClick={() => setSearch(!isAdvanceSearch)}
              className="text-centers bg-red-500 mt-3 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
            >
              {!isAdvanceSearch ? "Turn on" : "Turn off"} advanced search mode
            </button>
            <table className="border border-slate-500 border-collapse text-white">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Seed</th>
                  <th>Leecher</th>
                </tr>
              </thead>
              <tbody>
                {AdSearchedArray.map((e, i) => (
                  <tr key={i}>
                    <td>{i}</td>
                    <Link to="/Watch">
                      <button
                        onClick={() => handleChooseMovie(e.Magnet, e.Name)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                      >
                        {e.Name}
                      </button>
                    </Link>
                    <td>{e.Size}</td>
                    <td>{e.Seeders}</td>
                    <td>{e.Leechers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div>
              <InfiniteScroll
                className={"md:grid md:grid-cols-3 md:gap-3"}
                dataLength={searchedArray.length}
                next={() => handleLoadMore()}
                hasMore={hasMoreLoad}
                loader={isSearched===""?<div className="infinitepad"><ReactLoading type={"spin"} color="#d30000" height={'20%'} width={'20%'} /></div>:""}
                
              >
                {searchedArray.length > 0 ? (
                  searchedArray.map((e, i) => {
                    return (
                      <MovieTagMobile
                        key={i}
                        id={e.id}
                        name={e.title}
                        enName={e.english_title}
                        img={e.backdrop_path}
                        imbd={e.imdb}
                        object={e}
                        time={
                          Math.floor(e.runtime / 60) + "h" + (e.runtime % 60)
                        }
                        year={new Date(e.release_date).getFullYear()}
                      />
                    );
                  })
                ) : (
                  <>
                    <h4 className="text-white text-center">
                    Movie not found!
                    </h4>
                    <button
                      onClick={() => setSearch(!isAdvanceSearch)}
                      className="text-centers bg-red-500 mt-3 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
                    >
                      {!isAdvanceSearch ? "Turn on" : "Turn off"} advanced search mode
                    </button>
                  </>
                )}
              </InfiniteScroll>
              {isGoTop ? (
                <button
                  className="bg-red-700 rounded-full p-2 pl-2 pr-2 text-white shadow-red-900 font-semibold"
                  style={{ position: "fixed", right: "10px", bottom: "10px" }}
                  onClick={() => {
                    Scroll.animateScroll.scrollToTop();
                  }}
                >
                  <FontAwesomeIcon
                    className="ml-1 mr-1 shadow-lg text-lg"
                    icon={faArrowCircleUp}
                  />
                </button>
              ) : (
                ""
              )}
              </div>
            
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Home);