import {
  Episodie,
  GetSerieByIdResponse,
  GetSerieEpisodieByNumberRequest,
  GetSerieEpisodieByNumberResponse,
  GetSeriesResponse,
  Season,
  Serie,
  SerieSeasonsStore,
  SerieStore,
  UpdataTimeSerieSecondsRequest,
  UpdatedEpisodieIsWatchedRequest,
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

  async getByEpisodie({
    id,
    number,
    season,
  }: GetSerieEpisodieByNumberRequest): Promise<GetSerieEpisodieByNumberResponse> {
    const anime = store.get<string, SerieStore>(`series.${id}`)
    const seasons = Object.values(anime.seasons)
    const [{ episodies: episodiesObject }] = seasons.filter(
      (seasonObject) => seasonObject.number === Number(season),
    )
    const episodies = Object.values(episodiesObject)
    const [episodie] = episodies.filter(
      (episodie) => episodie.number === Number(number),
    )

    let isPrev = ''
    let isNext = ''

    if (Number(season) > 1 && Number(number) === 1) {
      isPrev = `/series/${id}/seasons/${Number(season) - 1}/episodies/${episodies.length}`
    } else if (Number(number) > 1) {
      isPrev = `/series/${id}/seasons/${Number(season)}/episodies/${Number(number) - 1}`
    }

    if (
      Number(season) < season.length &&
      episodie.number === episodies.length
    ) {
      isNext = `/series/${id}/seasons/${season}/episodies/${number}`
    } else if (Number(number) < episodies.length) {
      isNext = `/series/${id}/seasons/${Number(season)}/episodies/${Number(number) + 1}`
    }

    return {
      data: episodie,
      isNext,
      isPrev,
    }
  }

  async updataTimeSerieSeconds({
    episodieId,
    id,
    season,
    temp,
  }: UpdataTimeSerieSecondsRequest): Promise<void> {
    const anime = store.get<string, SerieStore>(`animes.${id}`)
    const seasons = Object.values(anime.seasons)
    const [seasonFilted] = seasons.filter(
      (seasonObject) => seasonObject.number === season,
    )
    store.set(
      `series.${id}.seasons.${seasonFilted.id}.episodies.${episodieId}`,
      {
        ...seasonFilted.episodies[episodieId],
        isTemp: temp,
      },
    )
  }

  async updatedEpisodieIsWatchedRequest({
    episodieId,
    id,
    season,
  }: UpdatedEpisodieIsWatchedRequest): Promise<void> {
    const serie = store.get<string, SerieStore>(`series.${id}`)
    const seasons = Object.values(serie.seasons)
    const [seasonFilted] = seasons.filter(
      (seasonObject) => seasonObject.number === season,
    )
    store.set(
      `series.${id}.seasons.${seasonFilted.id}.episodies.${episodieId}`,
      {
        ...seasonFilted.episodies[episodieId],
        isWatched: true,
      },
    )
  }
}

export const seriesRepository = new SeriesRepository()
