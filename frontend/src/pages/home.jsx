import MovieCard from "../components/MovieCard"
import { useEffect, useState } from "react"
import "../css/Home.css"
import { getPopularMovies, searchMovies } from "../services/api";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies)
            } catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            }
            finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    const HandleSearch = async (e) => {
        e.preventDefault()
        if(!searchQuery.trim()) return
        if(loading) return
        setLoading(true)
        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch (error) {
            console.log(error)
            setError("Failed to load movies...")
        }finally{
            setLoading(false)
        }
        setSearchQuery("-------")
    };

    return (
        <>
            <form onSubmit={HandleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="search for movies..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) =>
                        setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            {loading ? <div className="loading">Loading...</div> :

                <div className="home">
                    <div className="movies-grid">
                        {movies.map(movie => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </div>
                </div>
            }
        </>
    )
}
export default Home;