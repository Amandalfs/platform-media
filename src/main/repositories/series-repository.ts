import {
  Episodie,
  GetSerieByIdResponse,
  GetSeriesResponse,
  Season,
  Serie,
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
    const objects = store.get<string, Serie>('series')
    const series = Object.values(objects) as Array<Serie>

    const startIndex = Math.max(0, (page - 1) * size)
    const endIndex = Math.min(series.length, page * size)

    return {
      data: series.slice(startIndex, endIndex),
      isNext: endIndex < series.length,
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

    for (let i = 1; i <= seasons; i++) {
      const seasonId = randomUUID()

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
          url: `http://localhost:3333/videos/serie/${name}/season ${i}/ep${ep}.mp4`,
        }

        episodiesList.push(episodie)
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
    store.set(`series.${serieId}`, serie)
    return serie
  }

  async getById(id: string): Promise<GetSerieByIdResponse> {
    const serie = store.get<string, Serie>(`series.${id}`)
    return {
      data: serie,
    }
  }
}

export const seriesRepository = new SeriesRepository()
