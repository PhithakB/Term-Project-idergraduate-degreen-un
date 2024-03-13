import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";
import Layout from "../components/Layout/Layout";
import Filter from "../components/Filter/Filter";
import axios from "axios";
import Movie from "./components/Movie";
import Youtube from "react-youtube";
import AppBar from "../components/AppBar/AppBar";
import ReactLoading from "react-loading";
import Router from "next/router";
import Swal from 'sweetalert2'

import Image from 'next/image'
import styles from '../styles/styles.module.scss'

export default function Home() {
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const SEARCH_API = MOVIE_API + "search/movie";
  const DISCOVER_API = MOVIE_API + "discover/movie";
  const API_KEY = "35145270d828eb9ab1eeb626c088571c";
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";
  const url =
    "https://api.themoviedb.org/3/movie/popular?api_key=35145270d828eb9ab1eeb626c088571c";

  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [popular, setPopular] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeGenre, setActiveGenre] = useState(0);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(0);

  const [data, setData] = useState([])

  console.log("movie = ",movie)

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user_data"))

    async function getData(){
      try{
        setLoading(true)
        let resData = await axios.get(`http://localhost:3501/api/account/${user_data.id}`)
        setData(resData.data)
        setLevel(resData.data.level_id)
        setLoading(false)
      }catch(error){
        localStorage.removeItem("user_data")
        Router.push('/login')
      }
    }
    getData()
  },[])

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const { data } = await axios.get(
      `${searchKey ? SEARCH_API : DISCOVER_API}`,
      {
        params: {
          api_key: API_KEY,
          query: searchKey,
        },
      }
    );

    setMovies(data.results);
    setMovie(data.results[0]);
    setFiltered(data.results);

    if (data.results.length) {
      await fetchMovie(data.results[0].id);
    }
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }

    setMovie(data);
  };

  const selectMovie = (movie) => {
    fetchMovie(movie.id);
    setPlaying(false);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchPopular();
  }, [page, activeGenre]);

  const fetchPopular = async () => {
    if (activeGenre == 0) {
      const data = await fetch(`${url}&page=${page}`);
      const { results } = await data.json();
      if (page > 1) {
        setPopular((state) => [...state, ...results]);
        setFiltered((state) => [...state, ...results]);
      } else {
        setPopular(results);
        setFiltered(results);
      }
    } else {
      setLoading(true);
      let sumData = [];
      for (let i = 0; i < 50; i++) {
        const data = await fetch(`${url}&page=${i}`);
        const { results } = await data.json();
        if (results) {
          sumData = [
            ...sumData,
            ...results.filter((movie) => movie.genre_ids.includes(activeGenre)),
          ];
        }
        console.log(sumData);
        console.log(i);
      }
      setFiltered(sumData);
      setLoading(false);
    }
  };

  function levelCheck (){
    if(level === 1){
      setPlaying(true)
    }else if(level === 2){
      setPlaying(true)
    }else if(level === 3){
      setPlaying(true)
    }else if(level === 4){
      setPlaying(true)
    }else if(level === 5){
      setPlaying(true)
    }else{
      Swal.fire({
        title: 'Error!',
        text: `Sorry, you don't have permission`,
        icon: `error`,
        confirmButtonText: 'OK'
      })
    }
  }

  async function bookmark (){
    try{
      let resData = await axios.post('http://localhost:3501/api/bookmark',{
        bookmark_by: data.id,
        bookmark_use: 1,
        bookmark_id: movie.id,
        bookmark_name: movie.original_title
      })
      Swal.fire({
        title: 'Success!',
        text: `Bookmark Added`,
        icon: `success`,
        confirmButtonText: 'OK'
      })
    }catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    const onScroll = function () {
      if (searchKey != "") {
        return;
      }
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        if (activeGenre == 0) {
          setPage((state) => state + 1);
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeGenre, searchKey]);

  return (
    <>
      <Head>
        <title>Whatmovie</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <AppBar
          fetchMovies={fetchMovies}
          setSearchKey={setSearchKey}
          setActiveGenre={setActiveGenre}
          activeGenre={activeGenre}
          searchKey={searchKey}
        />
        <Filter
          popular={popular}
          setFiltered={setFiltered}
          activeGenre={activeGenre}
          setActiveGenre={setActiveGenre}
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          fetchPopular={fetchPopular}
        />
        <button
          className={"goToTop"}
          onClick={() => window.scrollTo(0, 0)}
          type="button"
        >
          ^
        </button>
          {loading ? (
            <div className="loading">
              <ReactLoading
                type={"bubbles"}
                color={"white"}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <Layout>
              {movies.length ? (
                <main>
                  {movie ? (
                    <div
                      className="poster"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
                      }}
                    >
                      {playing ? (
                        <>
                          <Youtube
                            videoId={trailer.key}
                            className={"youtube amru"}
                            containerClassName={"youtube-container amru"}
                            onStateChange={(event) =>
                              event.target.setPlaybackQuality("small")
                            }
                            opts={{
                              width: "1320px",
                              height: "600px",
                              playerVars: {
                                disablekb: 1,
                                autoplay: 1,
                                controls: 1,
                                cc_load_policy: 0,
                                fs: 0,
                                iv_load_policy: 0,
                                modestbranding: 0,
                                rel: 0,
                                showinfo: 0,
                              },
                            }}
                          />
                          <button
                            onClick={() => setPlaying(false)}
                            className={"button close-video"}
                          >
                            Close
                          </button>
                        </>
                      ) : (
                        <div className="center-max-size">
                          <div className="poster-content">
                            {trailer ? (
                              <>
                              <button
                                className={"button play-video"}
                                onClick={() => levelCheck()}
                                type="button"
                              >
                                Play Trailer
                              </button>
                              <button
                              className={"button play-video"}
                              onClick={() => bookmark()}
                              type="button"
                            >
                              Bookmark
                            </button>
                              </>
                            ) : (
                              <>
                              "Sorry, no trailer available"
                              <button
                              className={"button play-video"}
                              onClick={() => bookmark()}
                              type="button"
                            >
                              Bookmark
                            </button>
                              </>
                            )}
                            <h1>{movie.title}</h1>
                            <p>{movie.overview}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div className={"center-max-size container"}>
                    {filtered.map((movie) => (
                      <Movie
                        selectMovie={selectMovie}
                        key={uuidv4()}
                        movie={movie}
                      />
                    ))}
                  </div>
                </main>
              ) : (
                "Sorry, no movies found"
              )}
            </Layout>
          )}
      </>
    </>
  );
}
