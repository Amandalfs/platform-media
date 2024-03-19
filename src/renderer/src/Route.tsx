import { Router, Route } from 'electron-router-dom'
import { Series } from './pages/Series/Series'
import { Movies } from './pages/Movies/Movies'
import { Home } from './pages/Home/Home'
import { Animes } from './pages/Animes/Animes'
import { Default } from './layouts/default'
import { SerieSelect } from './pages/Series/SerieSelect/SerieSelect'
import { SerieEpisodie } from './pages/Series/SerieSelect/SerieEpisodie/SerieEpisodie'
import { AnimeSelect } from './pages/Animes/AnimeSelect/AnimeSelect'
import { AnimeEpisodie } from './pages/Animes/AnimeSelect/AnimeEpisodie/AnimeEpisodie'
import { Register } from './pages/Register/Register'
import { MovieSelected } from './pages/Movies/MovieSelect/MovieSelect'

export function Routes(): JSX.Element {
  return (
    <Router
      main={
        <Route path={'/'} element={<Default />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />

          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieSelected />} />

          <Route path="/animes" element={<Animes />} />
          <Route path="/animes/:id" element={<AnimeSelect />} />
          <Route
            path="/animes/:id/seasons/:season/episodies/:episodie"
            element={<AnimeEpisodie />}
          />

          <Route path="/series" element={<Series />} />
          <Route path="/series/:id" element={<SerieSelect />} />
          <Route
            path="/series/:id/seasons/:season/episodies/:episodie"
            element={<SerieEpisodie />}
          />
        </Route>
      }
    />
  )
}
