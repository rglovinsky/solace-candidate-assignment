import { ChangeEvent } from 'react'

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onReset: () => void
  query: string
}

export const SearchComponent = ({ onChange, onReset, query }: Props) => (
  <div className="mb-4 flex items-center space-x-2">
    <input
      onChange={onChange}
      value={query}
      placeholder="Type search term here..."
      className="px-4 h-10 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      onClick={onReset}
      className="px-4 h-10 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Reset Search
    </button>
  </div>
)
