import { useMutation, useQuery } from '@tanstack/react-query'
import ReactPlayer from 'react-player'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRef, useState } from 'react'
import { ModalTime } from './ModalTime/ModalTime'
import { OnProgressProps } from 'react-player/base'
import { GetMovieByIdResponse } from '~/src/shared/types/ipc-types'
import LoadingSpinner from '../../../components/Loading/Loading'

const SeparatorHorizontal = (): JSX.Element => {
  return <div className="w-full h-px bg-gray-500 my-3" />
}

export function MovieSelected(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isPrimary, setIsPrimary] = useState(true)
  //   const [isFinished, setIsFinished] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)

  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['movie-selected', id],
    queryFn: async (): Promise<GetMovieByIdResponse | void> => {
      if (id) {
        const response = await window.api.getMovieById({
          id,
        })
        if (isPrimary) {
          if (response.data.isTemp !== 0) setIsOpen(true)
          setIsPrimary(false)
        }
        return response
      }
    },
  })

  //   const { mutateAsync: updateTime } = useMutation({
  //     mutationFn: async (temp: number): Promise<void> => {
  //       await window.api.serieUpdateTime({
  //         id: id ?? '',
  //         season: Number(season),
  //         episodieId: data?.data.id ?? '',
  //         temp,
  //       })
  //     },
  //   })

  //   const { mutateAsync: updateWatched } = useMutation({
  //     mutationFn: async (): Promise<void> => {
  //       if (id && season && data?.data.id) {
  //         await window.api.serieUpdateEpisodieWatched({
  //           id,
  //           season: Number(season),
  //           episodieId: data?.data.id,
  //         })
  //       }
  //     },
  //   })

  return (
    <div className="flex flex-col items-center w-[50%] mx-auto mt-16">
      <h1 className="font-medium text-slate-400 text-xl my-4">
        {data?.data.name}
      </h1>
      <SeparatorHorizontal />
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
            // onProgress={(state: OnProgressProps) => {
            //   if (playerRef.current) {
            //     if (Math.round(state.playedSeconds) % 10 === 0) {
            //       updateTime(Math.round(state.playedSeconds))
            //     }

            //     if (
            //       Math.round(playerRef.current.getCurrentTime()) >=
            //       Math.round(playerRef.current.getDuration()) - 120
            //     ) {
            //       updateWatched()
            //       setIsFinished(true)
            //     } else {
            //       setIsFinished(false)
            //     }
            //   }
            // }}
            // onPause={() => {
            //   if (playerRef.current)
            //     updateTime(Math.round(playerRef.current.getCurrentTime()))
            // }}
            // onEnded={() => {
            //   if (playerRef.current) {
            //     if (
            //       Math.round(playerRef.current.getDuration()) ===
            //       Math.round(playerRef.current.getCurrentTime())
            //     ) {
            //       updateTime(Math.round(playerRef.current.getCurrentTime()))
            //       updateWatched()
            //       navigate(data.isNext)
            //     }
            //   }
            // }}
          />
        )}
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
    </div>
  )
}
