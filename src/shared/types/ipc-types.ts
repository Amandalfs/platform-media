// objects

export interface Episodie {
  number: number
  id: string
  isWatched: boolean
  isTemp: number
  created_at: Date
  reload_at: Date
  url: string
}
export interface Season {
  number: number
  id: string
  episodies: Array<Episodie>
}

export interface Anime {
  id: string
  name: string
  banner: string
  seasons: Array<Season>
}

export interface Serie {
  id: string
  name: string
  banner: string
  seasons: Array<Season>
}

export interface Movie {
  id: string
  name: string
  banner: string
  url: string
  isWatched: boolean
  isTemp: number
  created_at: Date
  reload_at: Date
}

export interface AnimeSeasonsStore extends Omit<Season, 'episodies'> {
  episodies: Record<string, Episodie>
}

export interface AnimeStore extends Omit<Anime, 'seasons'> {
  seasons: Record<string, AnimeSeasonsStore>
}
export interface SerieSeasonsStore extends Omit<Season, 'episodies'> {
  episodies: Record<string, Episodie>
}

export interface SerieStore extends Omit<Serie, 'seasons'> {
  seasons: Record<string, AnimeSeasonsStore>
}

// Request
export interface HandleCreateVideosRequest {
  name: string
  banner: string
  categorie: 'series' | 'animes' | 'movies'
  episodies?: number | undefined
  seasons?: number | undefined
}

export interface GetAnimesRequest {
  sizeList: number
  page: number
}

export interface GetSeriesRequest {
  sizeList: number
  page: number
}

export interface GetMoviesRequest {
  sizeList: number
  page: number
}

export interface GetMovieByIdRequest {
  id: string
}

export interface GetAnimeByIdRequest {
  id: string
}

export interface GetSerieByIdRequest {
  id: string
}

export interface GetAnimeEpisodieByNumberRequest {
  number: string
  id: string
  season: string
}

export interface GetSerieEpisodieByNumberRequest {
  number: string
  id: string
  season: string
}

export interface UpdataTimeAnimeSecondsRequest {
  id: string
  episodieId: string
  season: number
  temp: number
}

export interface UpdataEpisodieIsWatchedRequest {
  id: string
  episodieId: string
  season: number
}

export interface UpdataTimeSerieSecondsRequest {
  id: string
  episodieId: string
  season: number
  temp: number
}

export interface UpdatedEpisodieIsWatchedRequest {
  id: string
  episodieId: string
  season: number
}

export interface UpdatedMovieIsWatchedRequest {
  id: string
}

export interface UpdatedMovieTimeRequest {
  id: string
  temp: number
}
// Response

export interface GetAnimesResponse {
  data: Array<AnimeStore>
  isNext: boolean
  isPrev: boolean
}

export interface GetSeriesResponse {
  data: Array<SerieStore>
  isNext: boolean
  isPrev: boolean
}

export interface GetMoviesResponse {
  data: Array<Movie>
  isNext: boolean
  isPrev: boolean
}

export interface GetAnimeByIdResponse {
  data: AnimeStore
}

export interface GetSerieByIdResponse {
  data: SerieStore
}

export interface GetAnimeEpisodieByNumberResponse {
  data: Episodie
  isNext: string
  isPrev: string
}

export interface GetSerieEpisodieByNumberResponse {
  data: Episodie
  isNext: string
  isPrev: string
}

export interface GetMovieByIdResponse {
  data: Movie
}

export interface IsUpdatedAppReponse {
  isUpdate: boolean
  link?: string
  version?: string
}
