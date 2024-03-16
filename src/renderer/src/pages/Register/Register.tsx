import { useMutation } from '@tanstack/react-query'
import { ChangeEvent, useState } from 'react'
import { HandleCreateVideosRequest } from '~/src/shared/types/ipc-types'

export const Register = (): JSX.Element => {
  const [nome, setNome] = useState('')
  const [categorie, setCategorie] = useState('')
  const [seasons, setSeasons] = useState('')
  const [episodies, setEpisodies] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const { mutateAsync: createVideos, isPending: isCreatingVideos } =
    useMutation({
      mutationFn: async ({
        name,
        categorie,
        seasons,
        episodies,
        banner,
      }: HandleCreateVideosRequest) => {
        await window.api.createVideos({
          name,
          categorie,
          seasons,
          episodies,
          banner,
        })
      },
    })

  type Categorie = 'movies' | 'animes' | 'series'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    createVideos({
      name: nome,
      categorie: categorie as Categorie,
      seasons: Number(seasons),
      episodies: Number(episodies),
      banner: image?.path ?? '',
    })
  }

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block">
            Nome:
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="categoria" className="block">
            Categoria:
          </label>
          <select
            id="categoria"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          >
            <option value="">Selecione...</option>
            <option value="series">Séries</option>
            <option value="movies">Filmes</option>
            <option value="animes">Animes</option>
          </select>
        </div>
        {(categorie === 'series' || categorie === 'animes') && (
          <div>
            <label htmlFor="temporadas" className="block">
              Temporadas disponíveis:
            </label>
            <input
              type="number"
              id="temporadas"
              value={seasons}
              onChange={(e) => setSeasons(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
        )}
        {(categorie === 'series' || categorie === 'animes') && (
          <div>
            <label htmlFor="episodios" className="block">
              Episódios disponíveis:
            </label>
            <input
              type="number"
              id="episodios"
              value={episodies}
              onChange={(e) => setEpisodies(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
        )}
        <div>
          <label htmlFor="imagem" className="block">
            Imagem de banner:
          </label>
          <input
            type="file"
            id="imagem"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                setImage(e.target.files[0])
              }
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={isCreatingVideos}
        >
          {isCreatingVideos ? 'Criando...' : `Criar ${categorie}`}
        </button>
      </form>
    </div>
  )
}
