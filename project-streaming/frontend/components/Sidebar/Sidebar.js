import React, { useEffect, useState } from "react";
import Router from "next/router";
import styles from "./styles.module.scss";

export default function Sidebar(props) {
  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.account_setting} onClick={() => Router.push("/account")}>
          Account Setting
        </div>
        <div className={styles.profile} onClick={() => Router.push("/profile")}>
          Profile
        </div>
        <div className={styles.bookmark} onClick={() => Router.push("/bookmark")}>
          Bookmark
        </div>
        <div className={styles.watch_history} onClick={() => Router.push("/watch_history")}>
          Watch History
        </div>
        <div className={styles.payment} onClick={() => Router.push("/payment")}>
          Payment
        </div>
        <div className={styles.logout} onClick={signOut}>
          Logout
        </div>
      </div>
    </>
  );

  function signOut(){
    localStorage.removeItem("user_data")
    Router.push('/login')
  }
}
