import { contextBridge, ipcRenderer } from 'electron'
import { HandleCreateVideosRequest } from './../shared/types/ipc-types'
import { IPC } from '../shared/constant/IPC'
import {
  GetSeriesResponse,
  GetSeriesRequest,
  GetAnimesRequest,
  GetAnimesResponse,
  GetAnimeByIdRequest,
  GetAnimeByIdResponse,
  GetSerieByIdRequest,
  GetSerieByIdResponse,
  GetMoviesRequest,
  GetMoviesResponse,
  GetAnimeEpisodieByNumberResponse,
  GetAnimeEpisodieByNumberRequest,
  UpdataTimeAnimeSecondsRequest,
  UpdataEpisodieIsWatchedRequest,
  GetSerieEpisodieByNumberRequest,
  GetSerieEpisodieByNumberResponse,
  UpdatedEpisodieIsWatchedRequest,
  UpdataTimeSerieSecondsRequest,
  GetMovieByIdRequest,
  GetMovieByIdResponse,
} from '~/src/shared/types/ipc-types'

// Custom APIs for renderer
export const api = {
  createVideos(req: HandleCreateVideosRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.createVideos, req)
  },

  getSeriesByPage(req: GetSeriesRequest): Promise<GetSeriesResponse> {
    return ipcRenderer.invoke(IPC.series.getByPage, req)
  },
  getSerieById(req: GetSerieByIdRequest): Promise<GetSerieByIdResponse> {
    return ipcRenderer.invoke(IPC.series.getById, req)
  },
  getSerieEpisodie(
    req: GetSerieEpisodieByNumberRequest,
  ): Promise<GetSerieEpisodieByNumberResponse> {
    return ipcRenderer.invoke(IPC.series.getEpisodie, req)
  },
  serieUpdateTime(req: UpdataTimeSerieSecondsRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.series.updateTime, req)
  },
  serieUpdateEpisodieWatched(
    req: UpdatedEpisodieIsWatchedRequest,
  ): Promise<void> {
    return ipcRenderer.invoke(IPC.series.watchedEpisodie, req)
  },

  getMoviesByPage(req: GetMoviesRequest): Promise<GetMoviesResponse> {
    return ipcRenderer.invoke(IPC.movies.getByPage, req)
  },
  getMovieById(req: GetMovieByIdRequest): Promise<GetMovieByIdResponse> {
    return ipcRenderer.invoke(IPC.movies.getById, req)
  },

  getAnimesByPage(req: GetAnimesRequest): Promise<GetAnimesResponse> {
    return ipcRenderer.invoke(IPC.animes.getByPage, req)
  },
  getAnimeById(req: GetAnimeByIdRequest): Promise<GetAnimeByIdResponse> {
    return ipcRenderer.invoke(IPC.animes.getById, req)
  },
  getAnimeEpisodie(
    req: GetAnimeEpisodieByNumberRequest,
  ): Promise<GetAnimeEpisodieByNumberResponse> {
    return ipcRenderer.invoke(IPC.animes.getEpisodie, req)
  },
  animeUpdateTime(req: UpdataTimeAnimeSecondsRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.animes.updateTime, req)
  },
  animeUpdateEpisodieWatched(
    req: UpdataEpisodieIsWatchedRequest,
  ): Promise<void> {
    return ipcRenderer.invoke(IPC.animes.watchedEpisodie, req)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (define in dts)
  window.api = api
}
