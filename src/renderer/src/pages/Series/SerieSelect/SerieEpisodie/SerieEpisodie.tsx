import ReactPlayer from 'react-player'

const SeparatorVertical = (): JSX.Element => {
  return <div className="w-px h-[80%] bg-gray-500 mx-3" />
}

const SeparatorHorizontal = (): JSX.Element => {
  return <div className="w-full h-px bg-gray-500 my-3" />
}

export function SerieEpisodie(): JSX.Element {
  return (
    <div className="flex flex-col items-center w-[50%] mx-auto mt-16">
      <ReactPlayer
        url="http://localhost:3333/videos/movies/little/movie/11%20-%20Alterações%20no%20documento.mp4"
        controls
        width={'100%'}
      />
      <SeparatorHorizontal />
      <div className="flex w-full h-8 justify-center items-center space-x-4">
        <button className="bg-red-700 hover:bg-red-500 text-white font-light py-1 px-4 rounded">
          {'< Episodio Anterior'}
        </button>
        <SeparatorVertical />
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
        <SeparatorVertical />
        <button className="bg-red-700 hover:bg-red-500 text-white font-light py-1 px-4 rounded-lg">
          {'Proximo Episodio >'}
        </button>
      </div>
      <SeparatorHorizontal />
    </div>
  )
}
