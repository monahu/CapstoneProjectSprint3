import { Search } from "lucide-react" // or wherever your Search icon comes from

export default function SearchForm({ className = "" }) {
  return (
    <form
      action="#"
      method="GET"
      className={`grid grid-cols-1 ${className}`}
    >
      <input
        name="search"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
      />
      <Search
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
      />
    </form>
  )
}
