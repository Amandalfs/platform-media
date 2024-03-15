import { ElectronAPI } from '@electron-toolkit/preload'
import { api } from './index'

declare global {
  export interface Window {
    api: typeof api
    electron: ElectronAPI
  }
}
