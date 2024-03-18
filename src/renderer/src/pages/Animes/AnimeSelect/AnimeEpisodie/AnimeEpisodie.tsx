import { Button } from '@radix-ui/themes'
import { useMutation, useQuery } from '@tanstack/react-query'
import ReactPlayer from 'react-player'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GetAnimeEpisodieByNumberResponse } from '~/src/shared/types/ipc-types'
import LoadingSpinner from './../../../../components/Loading/Loading'
import { useRef, useState } from 'react'
import { ModalTime } from './ModalTime/ModalTime'
import { OnProgressProps } from 'react-player/base'

const SeparatorVertical = (): JSX.Element => {
  return <div className="w-px h-[80%] bg-gray-500 mx-3" />
}

const SeparatorHorizontal = (): JSX.Element => {
  return <div className="w-full h-px bg-gray-500 my-3" />
}
interface NextEpProps {
  isVisible: boolean
  link: string
}

const NextEp = ({ isVisible, link }: NextEpProps): JSX.Element => {
  return (
    <div
      className={`absolute bottom-16 right-0 p-2 bg-black bg-opacity-70 ${
        isVisible ? 'opacity-65' : 'opacity-0 hidden'
      }`}
    >
      <div className="bg-black-800  p-2 ">
        <Link to={link} className="text-white font-mono text-base">
          Próximo Episódio
        </Link>
      </div>
    </div>
  )
}

export function AnimeEpisodie(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isPrimary, setIsPrimary] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)
  const navigate = useNavigate()

  const { id, season, episodie } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['anime-episodie', id, season, episodie],
    queryFn: async (): Promise<GetAnimeEpisodieByNumberResponse | void> => {
      if (id && season && episodie) {
        const response = await window.api.getAnimeEpisodie({
          id,
          season,
          number: episodie,
        })
        if (isPrimary) {
          if (response.data.isTemp !== 0) setIsOpen(true)
          setIsPrimary(false)
        }
        return response
      }
    },
  })

  const { mutateAsync: updateTime } = useMutation({
    mutationFn: async (temp: number): Promise<void> => {
      await window.api.animeUpdateTime({
        id: id ?? '',
        season: Number(season),
        episodieId: data?.data.id ?? '',
        temp,
      })
    },
  })

  return (
    <div className="flex flex-col items-center w-[50%] mx-auto mt-16">
      <h1 className="font-medium text-slate-400 text-xl my-4">
        {season} Temporada - {data?.data.number} Episodio
      </h1>
      {isLoading && <LoadingSpinner />}
      <div className="relative">
        {data?.data && (
          <ReactPlayer
            url={data?.data.url}
            controls
            width={'100%'}
            height={'450px'}
            ref={playerRef}
            playing={!!data.data.url}
            onProgress={(state: OnProgressProps) => {
              if (playerRef.current) {
                if (Math.round(state.playedSeconds) % 10 === 0) {
                  updateTime(Math.round(state.playedSeconds))
                }

                if (
                  Math.round(playerRef.current.getCurrentTime()) >=
                  Math.round(playerRef.current.getDuration()) - 120
                ) {
                  setIsFinished(true)
                } else {
                  setIsFinished(false)
                }
              }
            }}
            onPause={() => {
              if (playerRef.current)
                updateTime(Math.round(playerRef.current.getCurrentTime()))
            }}
            onEnded={() => {
              if (playerRef.current) {
                if (
                  Math.round(playerRef.current.getDuration()) ===
                  Math.round(playerRef.current.getCurrentTime())
                ) {
                  updateTime(Math.round(playerRef.current.getCurrentTime()))
                  navigate(data.isNext)
                }
              }
            }}
          />
        )}
        <NextEp isVisible={isFinished} link={data?.isNext ?? ''} />
      </div>
      <SeparatorHorizontal />
      <ModalTime
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isTemp={data?.data.isTemp ?? 0}
        action={() => {
          if (
            playerRef.current &&
            data?.data.isTemp &&
            typeof data?.data.isTemp === 'number'
          ) {
            playerRef.current.seekTo(data?.data.isTemp)
          }
        }}
      />
      <div className="flex w-full h-8 justify-center items-center space-x-4">
        <Link to={data?.isPrev ?? ''}>
          <Button
            disabled={!data?.isPrev}
            className={`${!data?.isPrev ? 'cursor-not-allowed' : ''}`}
          >
            {'< Episodio Anterior'}
          </Button>
        </Link>
        <SeparatorVertical />
        <Link to={`/animes/${id}`}>
          <button className="bg-red-700 hover:bg-red-500 text-white font-light py-1 px-2 rounded-lg">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </Link>
        <SeparatorVertical />
        <Link to={data?.isNext ?? ''}>
          <Button
            disabled={!data?.isNext}
            color="crimson"
            className={`${!data?.isNext ? 'cursor-not-allowed' : ''}`}
          >
            {'Proximo Episodio >'}
          </Button>
        </Link>
      </div>
      <SeparatorHorizontal />
    </div>
  )
}
