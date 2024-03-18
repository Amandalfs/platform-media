import {
  Episodie,
  GetSerieByIdResponse,
  GetSeriesResponse,
  Season,
  Serie,
  SerieSeasonsStore,
  SerieStore,
} from '~/src/shared/types/ipc-types'
import { store } from '../store'
import { randomUUID } from 'crypto'

interface CreateSerieInput {
  name: string
  banner: string
  seasons: number
  episodies: number
}

class SeriesRepository {
  async getSeriesPageOrganizator(
    size: number,
    page: number,
  ): Promise<GetSeriesResponse> {
    const objects = store.get<string, SerieStore>('series')
    const animes = Object.values(objects)

    const startIndex = Math.max(0, (page - 1) * size)
    const endIndex = Math.min(animes.length, page * size)

    return {
      data: animes.slice(startIndex, endIndex),
      isNext: endIndex < animes.length,
      isPrev: startIndex > 0,
    }
  }

  async createSerie({
    banner,
    episodies,
    name,
    seasons,
  }: CreateSerieInput): Promise<Serie> {
    const serieId = randomUUID()

    const serieSeasons: Array<Season> = []
    const seriesByKey: Record<string, SerieSeasonsStore> = {}

    for (let i = 1; i <= seasons; i++) {
      const seasonId = randomUUID()
      seriesByKey[seasonId] = {
        number: i,
        id: seasonId,
        episodies: {},
      }
      const episodiesList: Array<Episodie> = []
      for (let ep = 1; ep <= episodies; ep++) {
        const episodieId = randomUUID()
        const episodie: Episodie = {
          number: ep,
          id: episodieId,
          created_at: new Date(),
          isTemp: 0,
          isWatched: false,
          reload_at: new Date(),
          url: `http://localhost:3333/videos/series/${name}/season ${i}/ep${ep}.mp4`,
        }

        episodiesList.push(episodie)
        seriesByKey[seasonId].episodies[episodieId] = {
          number: ep,
          id: episodieId,
          created_at: new Date(),
          isTemp: 0,
          isWatched: false,
          reload_at: new Date(),
          url: `http://localhost:3333/videos/animes/${name}/season ${i}/ep${ep}.mp4`,
        }
      }
      const season: Season = {
        number: i,
        id: seasonId,
        episodies: episodiesList,
      }

      serieSeasons.push(season)
    }

    const serie = {
      id: serieId,
      name,
      banner,
      seasons: serieSeasons,
    }
    const ObjetctSerieSave = {
      id: serieId,
      name,
      banner,
      seasons: seriesByKey,
    }
    store.set(`series.${serieId}`, ObjetctSerieSave)
    return serie
  }

  async getById(id: string): Promise<GetSerieByIdResponse> {
    const serie = store.get<string, SerieStore>(`series.${id}`)
    return {
      data: serie,
    }
  }
}

export const seriesRepository = new SeriesRepository()
