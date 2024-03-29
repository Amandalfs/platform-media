import { ipcMain } from 'electron'
import { IPC } from '../shared/constant/IPC'
import {
  GetAnimeByIdRequest,
  GetAnimeByIdResponse,
  GetAnimeEpisodieByNumberResponse,
  GetAnimesRequest,
  GetAnimesResponse,
  GetMovieByIdRequest,
  GetMovieByIdResponse,
  GetMoviesRequest,
  GetMoviesResponse,
  GetSerieByIdRequest,
  GetSerieByIdResponse,
  GetSerieEpisodieByNumberRequest,
  GetSerieEpisodieByNumberResponse,
  GetSeriesRequest,
  GetSeriesResponse,
  HandleCreateVideosRequest,
  IsUpdatedAppReponse,
  UpdataEpisodieIsWatchedRequest,
  UpdataTimeAnimeSecondsRequest,
  UpdataTimeSerieSecondsRequest,
  UpdatedEpisodieIsWatchedRequest,
  UpdatedMovieIsWatchedRequest,
  UpdatedMovieTimeRequest,
} from '../shared/types/ipc-types'
import { appRoadmingPath, pathCategories, versionPackage } from '.'
import fs from 'fs'
import path from 'path'
import { seriesRepository } from './repositories/series-repository'
import { animesRepository } from './repositories/animes-repository'
import { moviesRepository } from './repositories/movies-repository'
import { GetAnimeEpisodieByNumberRequest } from './../shared/types/ipc-types'

ipcMain.handle(
  IPC.createVideos,
  async (
    _,
    { banner, categorie, name, episodies, seasons }: HandleCreateVideosRequest,
  ) => {
    const folderRoot = path.join(pathCategories[categorie], name)

    if (!fs.existsSync(folderRoot)) fs.mkdirSync(folderRoot)

    if (
      (categorie === 'animes' || categorie === 'series') &&
      seasons &&
      episodies
    ) {
      for (let seasonIndex = 1; seasonIndex <= seasons; seasonIndex++) {
        const seasonPath = path.join(folderRoot, `Season ${seasonIndex}`)
        if (!fs.existsSync(seasonPath)) fs.mkdirSync(seasonPath)
      }
    }
    const appBanners = path.join(appRoadmingPath, 'banners')
    const filePath = path.join(appBanners, `banner-${name}.png`)

    try {
      const fileContent = await fs.promises.readFile(banner)
      await fs.promises.writeFile(filePath, fileContent)

      if (categorie === 'series' && seasons && episodies)
        seriesRepository.createSerie({
          banner: `http://localhost:3333/banner-${name}.png`,
          episodies,
          name,
          seasons,
        })

      if (categorie === 'animes' && seasons && episodies)
        animesRepository.create({
          banner: `http://localhost:3333/banner-${name}.png`,
          episodies,
          name,
          seasons,
        })

      if (categorie === 'movies')
        moviesRepository.create({
          banner: `http://localhost:3333/banner-${name}.png`,
          name,
        })
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error)
    }

    if (categorie === 'movies') {
      const foulderMovie = path.join(folderRoot, 'movie')
      if (!fs.existsSync(foulderMovie)) fs.mkdirSync(foulderMovie)
    }
  },
)

ipcMain.handle(
  IPC.series.getByPage,
  async (
    _,
    { page, sizeList }: GetSeriesRequest,
  ): Promise<GetSeriesResponse> => {
    const data = seriesRepository.getSeriesPageOrganizator(sizeList, page)
    return data
  },
)

ipcMain.handle(
  IPC.animes.getByPage,
  async (
    _,
    { page, sizeList }: GetAnimesRequest,
  ): Promise<GetAnimesResponse> => {
    const data = animesRepository.getPageOrganizator(sizeList, page)
    return data
  },
)

ipcMain.handle(
  IPC.movies.getByPage,
  async (
    _,
    { page, sizeList }: GetMoviesRequest,
  ): Promise<GetMoviesResponse> => {
    const data = moviesRepository.getPageOrganizator(sizeList, page)
    return data
  },
)

ipcMain.handle(
  IPC.movies.getById,
  async (_, { id }: GetMovieByIdRequest): Promise<GetMovieByIdResponse> => {
    const data = moviesRepository.getMovieById({ id })
    return data
  },
)

ipcMain.handle(
  IPC.movies.updateTime,
  async (_, { id, temp }: UpdatedMovieTimeRequest): Promise<void> => {
    const data = moviesRepository.updateTime({ id, temp })
    return data
  },
)

ipcMain.handle(
  IPC.movies.isWatched,
  async (_, { id }: UpdatedMovieIsWatchedRequest): Promise<void> => {
    const data = moviesRepository.updateIsWatched({ id })
    return data
  },
)

ipcMain.handle(
  IPC.animes.getById,
  async (_, { id }: GetAnimeByIdRequest): Promise<GetAnimeByIdResponse> => {
    const anime = animesRepository.getById(id)
    return anime
  },
)

ipcMain.handle(
  IPC.series.getById,
  async (_, { id }: GetSerieByIdRequest): Promise<GetSerieByIdResponse> => {
    const serie = seriesRepository.getById(id)
    return serie
  },
)

ipcMain.handle(
  IPC.series.getEpisodie,
  async (
    _,
    { id, number, season }: GetSerieEpisodieByNumberRequest,
  ): Promise<GetSerieEpisodieByNumberResponse> => {
    const serie = seriesRepository.getByEpisodie({ id, number, season })
    return serie
  },
)

ipcMain.handle(
  IPC.series.updateTime,
  async (
    _,
    { id, season, episodieId, temp }: UpdataTimeSerieSecondsRequest,
  ): Promise<void> => {
    await seriesRepository.updataTimeSerieSeconds({
      id,
      season,
      episodieId,
      temp,
    })
  },
)

ipcMain.handle(
  IPC.series.watchedEpisodie,
  async (
    _,
    { id, season, episodieId }: UpdatedEpisodieIsWatchedRequest,
  ): Promise<void> => {
    await seriesRepository.updatedEpisodieIsWatchedRequest({
      id,
      season,
      episodieId,
    })
  },
)

ipcMain.handle(
  IPC.animes.getEpisodie,
  async (
    _,
    { id, number, season }: GetAnimeEpisodieByNumberRequest,
  ): Promise<GetAnimeEpisodieByNumberResponse> => {
    const anime = animesRepository.getByEpisodie({ id, number, season })
    return anime
  },
)

ipcMain.handle(
  IPC.animes.updateTime,
  async (
    _,
    { id, season, episodieId, temp }: UpdataTimeAnimeSecondsRequest,
  ): Promise<void> => {
    await animesRepository.updataTimeAnimeSeconds({
      id,
      season,
      episodieId,
      temp,
    })
  },
)

ipcMain.handle(
  IPC.animes.watchedEpisodie,
  async (
    _,
    { id, season, episodieId }: UpdataEpisodieIsWatchedRequest,
  ): Promise<void> => {
    await animesRepository.updataEpisodieIsWatchedRequest({
      id,
      season,
      episodieId,
    })
  },
)

ipcMain.handle(IPC.app.isUpdated, async (): Promise<IsUpdatedAppReponse> => {
  const owner = 'amandalfs'
  const repo = 'platform-media'
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`

  const response = await fetch(url)
  const data = await response.json()
  const latestVersion = data.tag_name

  if (latestVersion !== versionPackage) {
    return {
      isUpdate: true,
      link: 'https://github.com/Amandalfs/platform-media/releases',
      version: latestVersion,
    }
  }
  return {
    isUpdate: false,
  }
})
