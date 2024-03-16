import Store from 'electron-store'
import { Anime, Movie, Serie } from '../shared/types/ipc-types'

interface StoreType {
  series: Record<string, Serie>
  animes: Record<string, Anime>
  movies: Record<string, Movie>
}

export const store = new Store<StoreType>({
  defaults: {
    series: {},
    animes: {},
    movies: {},
  },
})
