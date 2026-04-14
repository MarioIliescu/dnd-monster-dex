import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "https://www.dnd5eapi.co";
const PAGE_SIZE = 20;

export default function MonstersPage() {
    const [monsters, setMonsters] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchMonsters() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${BASE_URL}/api/2014/monsters`);
                if (!response.ok) {
                    throw new Error("Failed to fetch monsters");
                }

                const data = await response.json();
                setMonsters(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMonsters();
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

    return (
        <section>
            <h2>All Monsters</h2>
            <p>Browse monsters from the D&D 5e API.</p>

            <div className="card-grid">
                {visibleMonsters.map((monster) => (
                    <Link
                        key={monster.index}
                        to={`/monster/${monster.index}`}
                        className="card"
                    >
                        <h3>{monster.name}</h3>
                        <p>View details</p>
                    </Link>
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