import React, { useEffect, useState } from "react";
import Router from "next/router";
import styles from "./styles.module.scss";

function AppBar({fetchMovies,setSearchKey,activeGenre,searchKey}) {
  const search = (event) => {
    setSearchKey(event.target.value)
  }

  useEffect(()=>{
    if(document.getElementById("search")){
      document.getElementById("search").value = ""
    }
  },[activeGenre])

  return (
    <>
      <div className={styles.appbar}>
        <div className={styles.title} onClick={() => Router.push("/")}>
          Whatmovie
        </div>
        <div className={styles.account} onClick={() => Router.push("/account")}>
          Account
        </div>
        <form className={styles.form} onSubmit={fetchMovies}>
          <input className={styles.search} type="text" id="search" placeholder="Search Movie" defaultValue={searchKey}
                onInput={(event) => search(event)}/>
          <button className={styles.submit_search} type="submit">Search</button>
        </form>
      </div>
    </>
  );
}

export default AppBar;
