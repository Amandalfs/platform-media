import { ReactNode, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as Collapsible from '@radix-ui/react-collapsible'
import image from '../../../assets/teenwolf.jpg'
import { useQuery } from '@tanstack/react-query'
import { GetAnimeByIdResponse } from '~/src/shared/types/ipc-types'
import LoadingSpinner from '../../../components/Loading/Loading'

type EpisodeProps = {
  number: number
  watched: boolean
  watchedMinutes?: string
  animeId: string
  season: number
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  let formattedTime = ''

  if (hours > 0) {
    formattedTime += `${hours} hora${hours !== 1 ? 's' : ''} `
  }

  if (minutes > 0 || hours > 0) {
    formattedTime += `${minutes} minuto${minutes !== 1 ? 's' : ''} `
  }

  formattedTime += `${remainingSeconds} segundo${remainingSeconds !== 1 ? 's' : ''}`

  return formattedTime
}

const Episode = ({
  number,
  watched,
  watchedMinutes,
  animeId,
  season,
}: EpisodeProps): JSX.Element => (
  <Link to={`/animes/${animeId}/seasons/${season}/episodies/${number}`}>
    <SeparatorHorizontal />
    <div className="flex justify-start gap-4 h-8">
      <div className="flex w-32">
        <img src={image} alt="" className="h-auto w-auto" />
        <h2 className="ml-2">{number} Episódio</h2>
      </div>
      <SeparatorVertical />
      <div className="flex w-52">
        {watchedMinutes ? (
          <div className="ml-2">{formatTime(Number(watchedMinutes))}</div>
        ) : (
          <div className="ml-2">00:00</div>
        )}
      </div>
      <SeparatorVertical />
      <button
        className={`ml-2 w-6 h-6 flex items-center justify-center ${
          watched ? 'bg-green-500' : 'bg-gray-200'
        }`}
      >
        {watched && <span className="text-white">✓</span>}
      </button>
    </div>
  </Link>
)

type SeasonProps = {
  number: number
  children: ReactNode
}

const SeparatorVertical = (): JSX.Element => {
  return <div className="w-px h-[80%] bg-gray-500 mx-3" />
}

const SeparatorHorizontal = (): JSX.Element => {
  return <div className="w-full h-px bg-gray-500 my-3" />
}

const Season = ({ number, children }: SeasonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="mb-4">
      <div className="flex bg-black-600">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-10 h-10 flex items-center justify-center bg-red-text text-white font-medium border border-gray-400"
          >
            {number}
          </button>
          <h2 className="text-xl font-bold">Temporada {number}</h2>
        </div>
      </div>
      <Collapsible.Root
        open={isOpen}
        onOpenChange={() => setIsOpen((prev) => !prev)}
      >
        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

export function AnimeSelect(): JSX.Element {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['anime', id],
    queryFn: async (): Promise<GetAnimeByIdResponse> => {
      const response = await window.api.getAnimeById({ id: id ?? '' })
      return response
    },
  })

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-3xl font-bold mb-2">
          {data &&
            `${data.data.name} - ${Object.values(data.data.seasons).length} temporada`}
        </h1>
        <img src={data?.data.banner} alt="" className="w-auto h-52 mb-4" />
      </div>
      <div className="w-[80%] mx-auto">
        {data &&
          Object.values(data.data.seasons).map((season) => (
            <Season key={season.id} number={season.number}>
              {Object.values(season.episodies).map((episodie) => (
                <Episode
                  animeId={id ?? ''}
                  number={episodie.number}
                  watched={episodie.isWatched}
                  watchedMinutes={String(episodie.isTemp)}
                  key={episodie.id}
                  season={season.number}
                />
              ))}
            </Season>
          ))}
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  )
}
