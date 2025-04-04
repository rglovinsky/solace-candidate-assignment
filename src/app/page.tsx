'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { Advocate } from './types'
import { AdvocateCard } from './components/advocateCard'
import { SearchComponent } from './components/searchComponent'

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([])
  const [query, setQuery] = useState('')
  const [lastId, setLastId] = useState(-1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAdvocates = useCallback(
    async ({ appendResults = false, lastId = -1, query = '' } = {}) => {
      setIsLoading(true)
      const response = await fetch(
        `/api/advocates?lastId=${lastId}&query=${query}`
      )
      const json = await response.json()
      setAdvocates(prev =>
        appendResults ? [...prev, ...json.data] : json.data
      )
      setAdvocates(prev => Array.from(new Set([...prev, ...json.data])))
      setLastId(json.data.slice(-1)[0]?.id ?? -1)
      setHasMore(!json.done)
      setIsLoading(false)
    },
    []
  )

  useEffect(() => {
    fetchAdvocates()
  }, [fetchAdvocates])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAdvocates({ lastId: -1, query })
    }, 200)

    return () => {
      clearTimeout(handler)
    }
  }, [query, fetchAdvocates])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const onReset = () => {
    setQuery('')
  }

  let noResultsReason
  if (isLoading) {
    noResultsReason = 'Loading...'
  } else if (advocates.length === 0) {
    noResultsReason = 'No results found'
  }

  return (
    <main className="flex flex-col items-center m-[24px]">
      <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>

      <SearchComponent onChange={onChange} onReset={onReset} query={query} />

      {!!noResultsReason && (
        <div className="flex justify-center items-center w-full h-64">
          <p className="text-gray-500">{noResultsReason}</p>
        </div>
      )}

      {!noResultsReason && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {advocates.map(advocate => (
              <AdvocateCard key={advocate.id} advocate={advocate} />
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() =>
                fetchAdvocates({ appendResults: true, lastId, query })
              }
              className="mt-4 px-4 h-10 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Load More
            </button>
          )}
        </>
      )}
    </main>
  )
}
