import { api } from './index'

declare global {
  export interface Window {
    api: typeof api
  }
}
