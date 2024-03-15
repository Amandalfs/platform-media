import {
  Anime,
  Episodie,
  GetAnimeByIdResponse,
  GetAnimeEpisodieByNumberRequest,
  GetAnimeEpisodieByNumberResponse,
  GetAnimesResponse,
  Season
} from '~/src/shared/types/ipc-types'
import { store } from '../store'
import { randomUUID } from 'node:crypto'

interface CreateAnimesInput {
  name: string
  banner: string
  seasons: number
  episodies: number
}

interface AnimeSeasonsStore extends Omit<Season, 'episodies'> {
  episodies: Record<string, Episodie>
}

interface AnimeStore extends Omit<Anime, 'seasons'> {
  seasons: Record<string, AnimeSeasonsStore>
}

class AnimesRepository {
  async getPageOrganizator(size: number, page: number): Promise<GetAnimesResponse> {
    const objects = store.get<string, AnimeStore>('animes')
    const animes = Object.values(objects).map((anime) => ({
      ...anime,
      seasons: Object.values(anime.seasons).map((season) => ({
        ...season,
        episodies: Object.values(season.episodies)
      }))
    }))

    const startIndex = Math.max(0, (page - 1) * size)
    const endIndex = Math.min(animes.length, page * size)

    return {
      data: animes.slice(startIndex, endIndex),
      isNext: endIndex < animes.length,
      isPrev: startIndex > 0
    }
  }

  async getById(id: string): Promise<GetAnimeByIdResponse> {
    const anime = store.get<string, Anime>(`animes.${id}`)
    return {
      data: anime
    }
  }

  async create({ banner, episodies, name, seasons }: CreateAnimesInput): Promise<Anime> {
    const animeId = randomUUID()

    const animeSeasons: Array<Season> = []
    const animesByKey: Record<string, AnimeSeasonsStore> = {}

    for (let i = 1; i <= seasons; i++) {
      const seasonId = randomUUID()
      animesByKey[seasonId] = {
        number: i,
        id: seasonId,
        episodies: {}
      }

      const episodiesList: Array<Episodie> = []
      for (let ep = 1; ep <= episodies; ep++) {
        const episodieId = randomUUID()
        const episodie: Episodie = {
          number: i,
          id: episodieId,
          created_at: new Date(),
          isTemp: 0,
          isWatched: false,
          reload_at: new Date(),
          url: `http://localhost:3333/videos/animes/${name}/season ${i}/ep${ep}.mp4`
        }

        episodiesList.push(episodie)
        animesByKey[seasonId].episodies[episodieId] = {
          number: i,
          id: episodieId,
          created_at: new Date(),
          isTemp: 0,
          isWatched: false,
          reload_at: new Date(),
          url: `http://localhost:3333/videos/animes/${name}/season ${i}/ep${ep}.mp4`
        }
      }
      const season: Season = {
        number: i,
        id: seasonId,
        episodies: episodiesList
      }

      animeSeasons.push(season)
    }

    const anime = {
      id: animeId,
      name,
      banner,
      seasons: animeSeasons
    }
    const ObjetctAnimeSave = {
      id: animeId,
      name,
      banner,
      seasons: {}
    }
    store.set(`animes.${animeId}`, ObjetctAnimeSave)
    return anime
  }

  async getByEpisodie({
    id,
    number,
    season
  }: GetAnimeEpisodieByNumberRequest): Promise<GetAnimeEpisodieByNumberResponse> {
    const { seasons } = store.get<string, Anime>(`animes.${id}`)
    const [{ episodies }] = seasons.filter((seasonObject) => seasonObject.number === Number(season))
    const [episodie] = episodies.filter((episodie) => episodie.number === Number(number))

    let isPrev = ''
    let isNext = ''

    if (Number(season) > 1 && Number(number) === 1) {
      isPrev = `/animes/${id}/seasons/${Number(season) - 1}/episodies/${episodies.length}`
    } else if (Number(number) > 1) {
      isPrev = `/animes/${id}/seasons/${Number(season)}/episodies/${Number(number) - 1}`
    }

    if (Number(season) < season.length && episodie.number === episodies.length) {
      isNext = `/animes/${id}/seasons/${season}/episodies/${number}`
    } else if (Number(number) < episodies.length) {
      isNext = `/animes/${id}/seasons/${Number(season)}/episodies/${Number(number) + 1}`
    }

    return {
      data: episodie,
      isNext: isNext,
      isPrev: isPrev
    }
  }
}

export const animesRepository = new AnimesRepository()
