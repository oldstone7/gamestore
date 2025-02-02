import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Star, Users, Calendar, Gamepad, Layers } from "lucide-react"

const GameDetails = () => {
  const { id } = useParams()
  const [gameDetails, setGameDetails] = useState(null)
  const API_KEY = process.env.REACT_APP_RAWG_API_KEY

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
          params: { key: API_KEY },
        })
        setGameDetails(response.data)
      } catch (error) {
        console.error("Error fetching game details:", error)
      }
    }

    fetchGameDetails()
  }, [id, API_KEY])

  if (!gameDetails)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )

  return (
    <div className="game-details bg-gray-900 text-white min-h-screen">
      <div className="relative h-96 overflow-hidden">
        <img
          src={gameDetails.background_image || "/placeholder.svg"}
          alt={gameDetails.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <h1 className="absolute bottom-0 left-0 text-5xl font-bold p-8">{gameDetails.name}</h1>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-300">{gameDetails.description_raw}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">System Requirements</h2>
              {gameDetails.platforms.map((p) =>
                p.platform.name === "PC" && p.requirements ? (
                  <div key={p.platform.id} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Minimum:</h3>
                      <p className="text-gray-300">{p.requirements.minimum}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Recommended:</h3>
                      <p className="text-gray-300">{p.requirements.recommended}</p>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/3 px-4">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Game Info</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Star className="mr-2" />
                  <span className="font-semibold mr-2">Rating:</span>
                  <span>{gameDetails.rating}/5</span>
                </li>
                <li className="flex items-center">
                  <Users className="mr-2" />
                  <span className="font-semibold mr-2">Metacritic:</span>
                  <span>{gameDetails.metacritic}</span>
                </li>
                <li className="flex items-center">
                  <Calendar className="mr-2" />
                  <span className="font-semibold mr-2">Release Date:</span>
                  <span>{new Date(gameDetails.released).toLocaleDateString()}</span>
                </li>
                <li className="flex items-center">
                  <Gamepad className="mr-2" />
                  <span className="font-semibold mr-2">Platforms:</span>
                  <span>{gameDetails.platforms.map((p) => p.platform.name).join(", ")}</span>
                </li>
                <li className="flex items-center">
                  <Layers className="mr-2" />
                  <span className="font-semibold mr-2">Genres:</span>
                  <span>{gameDetails.genres.map((genre) => genre.name).join(", ")}</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {gameDetails.tags.slice(0, 10).map((tag) => (
                  <span key={tag.id} className="bg-gray-700 text-sm rounded-full px-3 py-1">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetails

