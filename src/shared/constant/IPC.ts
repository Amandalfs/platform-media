export const IPC = {
  createVideos: 'create-videos',
  series: {
    getByPage: 'series-get-page',
    getById: 'serie-get-page',
    getByNumberEpisodie: 'serie-get-number-episodie',
    getEpisodie: 'serie-get-episodie',
    updateTime: 'serie-update-time-episodie',
    watchedEpisodie: 'serie-watched-episodie',
  },
  animes: {
    getByPage: 'animes-get-page',
    getById: 'anime-get-by-id',
    getByNumberEpisodie: 'anime-get-number-episodie',
    getEpisodie: 'anime-get-episodie',
    updateTime: 'anime-update-time-episodie',
    watchedEpisodie: 'anime-watched-episodie',
  },
  movies: {
    getByPage: 'movies-get-page',
    getById: 'movie-get-by-id',
    getByNumberEpisodie: 'movie-get-number-episodie',
    updateTime: 'movie-update-time',
    isWatched: 'movie-is-watched',
  },
}
