import React, { useEffect } from "react";
import styles from './styles.module.scss'

const Filter = ({ popular, setFiltered, activeGenre, setActiveGenre, searchKey, setSearchKey, fetchPopular }) => {
  useEffect(() => {
    if (activeGenre === 0) {
      setFiltered(popular);
      return;
    }
    const filtered = popular.filter((movie) =>
      movie.genre_ids.includes(activeGenre),
    );
    setFiltered(filtered);
  }, [activeGenre]);

  const changePage = (number) => {
    if(number == 0){
      location.reload();
    }
    setSearchKey("")
    setActiveGenre(number)
  }

  useEffect(()=>{
    fetchPopular()
  },[searchKey])
  
return (
    <div className={styles.filter}>
      <button onClick={() => changePage(0)} className={activeGenre === 0 ? "active" : ""}>All</button>
      <button onClick={() => changePage(28)} className={activeGenre === 28 ? "active" : ""}>Action</button>
      <button onClick={() => changePage(12)} className={activeGenre === 12 ? "active" : ""}>Adventure</button>
      <button onClick={() => changePage(16)} className={activeGenre === 16 ? "active" : ""}>Animation</button>
      <button onClick={() => changePage(35)} className={activeGenre === 35 ? "active" : ""}>Comedy</button>
      <button onClick={() => changePage(80)} className={activeGenre === 80 ? "active" : ""}>Crime</button>
      <button onClick={() => changePage(99)} className={activeGenre === 99 ? "active" : ""}>Documentary</button>
      <button onClick={() => changePage(18)} className={activeGenre === 18 ? "active" : ""}>Drama</button>
      <button onClick={() => changePage(10751)} className={activeGenre === 10751 ? "active" : ""}>Family</button>
      <button onClick={() => changePage(14)} className={activeGenre === 14 ? "active" : ""}>Fantasy</button>
      <button onClick={() => changePage(36)} className={activeGenre === 36 ? "active" : ""}>History</button>
      <button onClick={() => changePage(27)} className={activeGenre === 27 ? "active" : ""}>Horror</button>
      <button onClick={() => changePage(10402)} className={activeGenre === 10402 ? "active" : ""}>Music</button>
      <button onClick={() => changePage(9648)} className={activeGenre === 9648 ? "active" : ""}>Mystery</button>
      <button onClick={() => changePage(10749)} className={activeGenre === 10749 ? "active" : ""}>Romance</button>
      <button onClick={() => changePage(878)} className={activeGenre === 878 ? "active" : ""}>Science Fiction</button>
      <button onClick={() => changePage(10770)} className={activeGenre === 10770 ? "active" : ""}>TV Movie</button>
      <button onClick={() => changePage(53)} className={activeGenre === 53 ? "active" : ""}>Thriller</button>
      <button onClick={() => changePage(10752)} className={activeGenre === 10752 ? "active" : ""}>War</button>
      <button onClick={() => changePage(37)} className={activeGenre === 37 ? "active" : ""}>Western</button>
    </div>
  );
};
export default Filter;