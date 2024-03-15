import { Flex, Button } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { CardMedium } from '../../components/cards/CardMedium'
import { GetMoviesResponse } from '~/src/shared/types/ipc-types'
import LoadingSpinner from '../../components/Loading/Loading'

export function Movies(): JSX.Element {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['movies', page],
    queryFn: async (): Promise<GetMoviesResponse> => {
      const response = await window.api.getMoviesByPage({ page, sizeList: 5 })
      return response
    }
  })

  return (
    <Flex
      direction={'column'}
      gap={'6'}
      style={{ width: '100vw', height: '100vh' }}
      align={'center'}
    >
      <div className="flex-col h-full w-11/12 mt-16">
        <div className="flex justify-between items-center">
          <Button
            disabled={!data?.isPrev}
            onClick={() => {
              setPage((prev) => prev - 1)
            }}
          >
            Prev
          </Button>
          <div className="flex gap-4">
            {data &&
              data.data.map(({ banner, id, name }) => (
                <CardMedium
                  key={id}
                  image={banner}
                  status="Assistir"
                  title={name}
                  link={`/movies/${id}`}
                />
              ))}
            {isLoading && <LoadingSpinner />}
          </div>
          <Button
            disabled={!data?.isNext}
            onClick={() => {
              setPage((prev) => prev + 1)
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </Flex>
  )
}
