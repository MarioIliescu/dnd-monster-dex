import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Stylesheets/Monsters.css";
const PAGE_SIZE = 9;

export default function MonstersPage() {
    const [monsters, setMonsters] = useState([]);//Initial empty list of monsters
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchMonsters() {

                setLoading(true);
                setError("");

                const response = await fetch(`/api/2014/monsters`);
                if (!response.ok) {
                    throw new Error("Failed to fetch monsters");
                }
                const data = await response.json();
                return data.results
        }

         fetchMonsters()
             .then((result) =>
        {setMonsters(result)
        }).catch((error) => {setError(error.message)}).finally(() => setLoading(false));
    }, []);

    const totalPages = Math.ceil(monsters.length / PAGE_SIZE);
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const visibleMonsters = monsters.slice(start, end);

    function handleNext() {
        if (page < totalPages - 1) {
            setPage((prev) => prev + 1);
        }
    }

    function handlePrevious() {
        if (page > 0) {
            setPage((prev) => prev - 1);
        }
    }

    if (loading) return <p>Loading monsters...</p>;
    if (error) return <p>Error: {error}</p>;
    function MonsterCard({ monster }) {
        const [imageUrl, setImageUrl] = useState("");
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            async function loadImage() {
                try {
                    const response = await fetch(monster.url);
                    const data = await response.json();
                    const originalUrl = data.image;
                    if (originalUrl) {
                        const optimizedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=80&h=80&fit=cover&q=30&output=webp`;
                        setImageUrl(optimizedUrl);
                    }
                    setImageUrl(data.image);
                } catch (err) {
                    console.error("Failed to load image:", err);
                } finally {
                    setLoading(false);
                }
            }
            loadImage();
        }, [monster.url]);

        return (
            <Link to={`/monster/${monster.index}`} className="card">
                <div className="monster-image-container">
                    {!loading && imageUrl && (
                        <img className="monsterimage" src={imageUrl} alt={monster.name} />
                    )}
                </div>
                <h3>{monster.name}</h3>
            </Link>
        );
    }
    return (
        <section>
            <h2>All Monsters</h2>
            <p>Browse monsters from the D&D 5e API.</p>

            <div className="card-grid">
                {visibleMonsters.map((monster) => (
                   <MonsterCard key={monster.id} monster={monster} />
                ))}
            </div>

            <div className="pagination">
                <button onClick={handlePrevious} disabled={page === 0}>
                    Previous
                </button>

                <span>
          Page {page + 1} of {totalPages || 1}
        </span>

                <button
                    onClick={handleNext}
                    disabled={page >= totalPages - 1}
                >
                    Next
                </button>
            </div>
        </section>
    );
}