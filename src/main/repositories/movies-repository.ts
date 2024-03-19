import {
  GetMovieByIdRequest,
  GetMovieByIdResponse,
  GetMoviesResponse,
  Movie,
  UpdatedMovieIsWatchedRequest,
  UpdatedMovieTimeRequest,
} from '~/src/shared/types/ipc-types'
import { store } from '../store'
import { randomUUID } from 'crypto'

interface CreateMovieInput {
  name: string
  banner: string
}

class MoviesRepository {
  async getPageOrganizator(
    size: number,
    page: number,
  ): Promise<GetMoviesResponse> {
    const objects = store.get<string, Movie>('movies')
    const movies = Object.values(objects) as Array<Movie>

    const startIndex = Math.max(0, (page - 1) * size)
    const endIndex = Math.min(movies.length, page * size)

    return {
      data: movies.slice(startIndex, endIndex),
      isNext: endIndex < movies.length,
      isPrev: startIndex > 0,
    }
  }

  async create({ banner, name }: CreateMovieInput): Promise<Movie> {
    const movieId = randomUUID()

    const movie: Movie = {
      id: movieId,
      name,
      banner,
      created_at: new Date(),
      isTemp: 0,
      isWatched: false,
      reload_at: new Date(),
      url: `http://localhost:3333/videos/movies/${name}/movie/movie.mp4`,
    }
    store.set(`movies.${movieId}`, movie)
    return movie
  }

  async getMovieById({
    id,
  }: GetMovieByIdRequest): Promise<GetMovieByIdResponse> {
    const movie = store.get<string, Movie>(`movies.${id}`)
    return {
      data: movie,
    }
  }

  async updateTime({ id, temp }: UpdatedMovieTimeRequest): Promise<void> {
    const movie = store.get<string, Movie>(`movies.${id}`)
    store.set(`movies.${id}`, {
      ...movie,
      isTemp: temp,
    })
  }

  async updateIsWatched({ id }: UpdatedMovieIsWatchedRequest): Promise<void> {
    const movie = store.get<string, Movie>(`movies.${id}`)
    store.set(`movies.${id}`, {
      ...movie,
      isWatched: true,
    })
  }
}

export const moviesRepository = new MoviesRepository()
