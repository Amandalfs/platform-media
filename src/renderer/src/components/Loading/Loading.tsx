const LoadingSpinner = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center">
      <svg className="animate-spin h-10 w-10 text-red-text" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014.708 7.5h2.585a1.5 1.5 0 001.415 1.001L8.5 9.707a4 4 0 10-2.707 6.584l1.225-1.225a1.5 1.5 0 001.067.439h2.585A8.008 8.008 0 016 17.291zM19.291 6A8.004 8.004 0 0117.5 4.708v2.585a1.5 1.5 0 00-1.001 1.415L14.293 8.5a4 4 0 106.584 2.707l-1.225-1.225a1.5 1.5 0 00.439-1.067v-2.585A8.008 8.008 0 0119.291 6z"
        ></path>
      </svg>
      <span className="ml-2 text-red-500">Carregando...</span>
    </div>
  )
}

export default LoadingSpinner
