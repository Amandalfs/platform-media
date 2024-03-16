import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
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
} from '~/src/shared/types/ipc-types'

// Custom APIs for renderer
export const api = {
  createVideos(req: HandleCreateVideosRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.createVideos, req)
  },
  getSeriesByPage(req: GetSeriesRequest): Promise<GetSeriesResponse> {
    return ipcRenderer.invoke(IPC.series.getByPage, req)
  },
  getAnimesByPage(req: GetAnimesRequest): Promise<GetAnimesResponse> {
    return ipcRenderer.invoke(IPC.animes.getByPage, req)
  },
  getMoviesByPage(req: GetMoviesRequest): Promise<GetMoviesResponse> {
    return ipcRenderer.invoke(IPC.movies.getByPage, req)
  },
  getAnimeById(req: GetAnimeByIdRequest): Promise<GetAnimeByIdResponse> {
    return ipcRenderer.invoke(IPC.animes.getById, req)
  },
  getSerieById(req: GetSerieByIdRequest): Promise<GetSerieByIdResponse> {
    return ipcRenderer.invoke(IPC.series.getById, req)
  },
  getAnimeEpisodie(
    req: GetAnimeEpisodieByNumberRequest,
  ): Promise<GetAnimeEpisodieByNumberResponse> {
    return ipcRenderer.invoke(IPC.animes.getEpisodie, req)
  },
  animeUpdateTime(req: UpdataTimeAnimeSecondsRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.animes.updateTime, req)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
