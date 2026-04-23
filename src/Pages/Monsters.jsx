import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "./Stylesheets/Monsters.css";

const PAGE_SIZE = 9;
const API_BASE = "https://www.dnd5eapi.co/api/2014";

export default function MonstersPage() {
    const [monsters, setMonsters] = useState([]);//Initial empty list of monsters
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchMonsters() {

            setLoading(true);
            setError("");

            const response = await fetch(`${API_BASE}/monsters`);
            if (!response.ok) {
                throw new Error("Failed to fetch monsters");
            }
            const data = await response.json();
            return data.results
        }

        fetchMonsters()
            .then((result) => {
                setMonsters(result)
            }).catch((error) => {
            setError(error.message)
        }).finally(() => setLoading(false));
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
                    const response = await fetch(`https://www.dnd5eapi.co${monster.url}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch monster details");
                    }

                    const data = await response.json();

                    if (data.image) {
                        const imagePath = data.image.startsWith("/")
                            ? data.image
                            : `/${data.image}`;

                        setImageUrl(`https://www.dnd5eapi.co${imagePath}`);
                    }
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
                    <MonsterCard key={monster.index} monster={monster}/>
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