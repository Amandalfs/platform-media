import { Button, Flex } from '@radix-ui/themes'
import image from '../../assets/teenwolf.jpg'
import { CardMedium } from '../../components/cards/CardMedium'

export function Home(): JSX.Element {
  return (
    <Flex
      justify={'between'}
      align={'center'}
      style={{
        height: '100vh',
      }}
      direction={'column'}
      className="gap-20"
    >
      {/* Barra de pesquisa */}
      <div className="flex justify-center my-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-200"
            placeholder="Pesquise sua série"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.65 14.35A5.99 5.99 0 0 1 17 9a6 6 0 1 1-6 6c1.66 0 3.14-.68 4.22-1.77l5.66 5.65a1.5 1.5 0 0 0 2.12-2.12l-5.65-5.66zm-.2-3.78a4 4 0 1 0-2.83 1.17 4 4 0 0 0 2.83-1.17z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Lista de vídeos */}
      <div className="flex-col h-full w-11/12">
        <h2 className="font-medium pl-20 pb-8 text-xl">Em continuacao</h2>
        <div className="flex justify-between items-center">
          <Button>Prev</Button>
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <CardMedium
                key={index}
                image={image}
                status="Continuar"
                title="Teen Wolf"
              />
            ))}
          </div>
          <Button>Next</Button>
        </div>
      </div>

      <div className="flex-col h-full w-11/12">
        <h2 className="font-medium pl-20 pb-8 text-xl">Terminados</h2>
        <div className="flex justify-between items-center">
          <Button>Prev</Button>
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <CardMedium
                key={index}
                image={image}
                status="Continuar"
                title="Teen Wolf"
              />
            ))}
          </div>
          <Button>Next</Button>
        </div>
      </div>
      <div className="flex-col h-full w-11/12">
        <h2 className="font-medium pl-20 pb-8 text-xl">Assistir</h2>
        <div className="flex justify-between items-center">
          <Button>Prev</Button>
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <CardMedium
                key={index}
                image={image}
                status="Continuar"
                title="Teen Wolf"
              />
            ))}
          </div>
          <Button>Next</Button>
        </div>
      </div>
    </Flex>
  )
}
