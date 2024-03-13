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
      </div>
    </>
  );
}

export default AppBar;
