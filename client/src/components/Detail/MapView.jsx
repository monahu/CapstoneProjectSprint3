import { MapPin } from "lucide-react"

const MapView = ({ placeName, location, apiKey }) => {
  return (
    <div className="mb-6 px-2 lg:px-20">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
      <div className="flex items-center gap-2 text-blue-600 mb-4">
        <MapPin className="w-5 h-5" />
        <span className="font-medium">{placeName}</span>
      </div>

      {/* Dynamic Map */}
      <div className="relative overflow-hidden rounded-lg shadow-md">
        {!apiKey ? (
          // Fallback when no API key
          <div className="w-full h-40 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-500 mb-2" />
            <div className="text-center">
              <p className="font-medium text-gray-700">{placeName}</p>
              <p className="text-sm text-gray-500">{location}</p>
              <p className="text-xs text-gray-400 mt-1">
                Map API key not configured
              </p>
            </div>
          </div>
        ) : (
          <iframe
            width="100%"
            height="200"
            className="rounded-lg shadow-md"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location + " " + placeName)}&zoom=15`}
            allowFullScreen
          />
        )}

        {/* Map overlay controls */}
        <div className=" top-2 left-2 bg-white rounded shadow-md overflow-hidden text-xs">
          <button className="px-3 py-1 bg-white text-gray-700 border-r border-gray-200 hover:bg-gray-50">
            Map
          </button>
          <button className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-50">
            Satellite
          </button>
        </div>

        {/* Google attribution */}
        <div className="absolute bottom-1 right-1 bg-white/80 px-1 text-xs text-gray-600 rounded">
          Google
        </div>
      </div>
    </div>
  )
}

export default MapView
