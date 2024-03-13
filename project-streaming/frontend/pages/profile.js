import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import axios from "axios";
import imageEncode from "inw-base64-image-encoder";
import ReactLoading from "react-loading";
import styles from "../styles/styles.module.scss";
import AppBar2 from "../components/AppBar2/AppBar2";
import Layout2 from "../components/Layout2/Layout2";
import FormBox from "../components/FormBox/FormBox";
import InputField from "../components/InputField/InputField";
import Button from "../components/Button/Button";
import Sidebar from "../components/Sidebar/Sidebar";
import Layout4 from "../components/Layout4/Layout4";

export default function Profile() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user_data"));

    async function getData() {
      try {
        let resData = await axios.get(`http://localhost:3501/api/profile/`);
        if (resData.status === 200) {
          setData(user_data);
          setLoading(false);
        }
      } catch (error) {
        localStorage.removeItem("user_data");
        Router.push("/login");
      }
    }
    getData();
  }, []);

  let dataList = [];
  for (let i = 0; i < data.length; i++) {
    dataList.push(
      <div key={i} className={styles.boxname}>
        <h3>{data[i].email}</h3>
        <hr />
        <p>
          {data[i].first_name} {data[i].last_name}
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Whatmovie | Account</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
        <>
          <AppBar2 />
          <Layout2>
            <Sidebar />
            <Layout4>
              <FormBox title="Edit Profile Image">
              <label className={styles.imgLabel}>
                {!data.profile ? (
                  ""
                ) : (
                  <Image
                    src={data.profile}
                    alt="Profile Setting"
                    layout="fill"
                  />
                )}
                <input type="file" id="profile" />
              </label>
                <Button onHandle={updateData}>ยืนยันการแก้ไข</Button>
              </FormBox>
            </Layout4>
          </Layout2>
        </>
      )}
    </>
  );

  function onSave(event) {
    setData((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  }

  async function updateData() {
    try {
      setLoading(true);
      await axios.put(`http://localhost:3501/api/account/${data.id}`, data);
      await axios.put(
        `http://localhost:4000/api/account/${data.id}/profile`,
        data
      );
      localStorage.setItem("user_data", JSON.stringify(data));
      Router.reload(window.location);
    } catch (error) {}
  }
}
