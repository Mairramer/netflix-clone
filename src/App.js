import React, { useEffect, useState } from 'react';
import './App.css'
import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow/MovieRow'
import FeatureMovie from './components/Feature/FeatureMovie'
import Header from './components/Header/Header'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

  const [movieList, setMovieList] = useState([])
  const [featureData, setFeatureData] = useState()
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const LoadAll = async () => {
      let list = await Tmdb.getHomeList()
      console.log(list);
      setMovieList(list)


      //filme em destaque
      let originals = list.filter(i => i.slug === 'originals')
      let randomChoice = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChoice];

      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeatureData(chosenInfo)
    }
    LoadAll()
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  })
  return (
    <div className="page">
      <Header black={blackHeader} />

      {featureData && <FeatureMovie item={featureData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Informações usadas de www.themoviedb.org <br />
        Clone com base no clone de Bonieky Lacerda <br />
        Direitos ao Netflix
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://i.pinimg.com/originals/05/d6/66/05d6663b4ee9b402afbc2daf001b0632.gif" alt="Carregando" />
        </div>}
    </div>
  );
}