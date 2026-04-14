import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BASE_URL = "https://www.dnd5eapi.co";

export default function AboutMonsters() {
    const { index } = useParams();
    const [monster, setMonster] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchMonster() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${BASE_URL}/api/2014/monsters/${index}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch monster details");
                }

                const data = await response.json();
                setMonster(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMonster();
    }, [index]);

    if (loading) return <p>Loading monster details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!monster) return <p>No monster found.</p>;

    return (
        <section className="detail-card">
            <Link to="/" className="back-link">
                ← Back to monsters
            </Link>

            <h2>{monster.name}</h2>

            <div className="detail-grid">
                <p><strong>Size:</strong> {monster.size}</p>
                <p><strong>Type:</strong> {monster.type}</p>
                <p><strong>Alignment:</strong> {monster.alignment}</p>
                <p><strong>Armor Class:</strong> {monster.armor_class?.[0]?.value ?? "N/A"}</p>
                <p><strong>Hit Points:</strong> {monster.hit_points}</p>
                <p><strong>Challenge Rating:</strong> {monster.challenge_rating}</p>
                <p><strong>Strength:</strong> {monster.strength}</p>
                <p><strong>Dexterity:</strong> {monster.dexterity}</p>
                <p><strong>Constitution:</strong> {monster.constitution}</p>
                <p><strong>Intelligence:</strong> {monster.intelligence}</p>
                <p><strong>Wisdom:</strong> {monster.wisdom}</p>
                <p><strong>Charisma:</strong> {monster.charisma}</p>
            </div>

            {monster.special_abilities && monster.special_abilities.length > 0 && (
                <div className="section-box">
                    <h3>Special Abilities</h3>
                    {monster.special_abilities.map((ability) => (
                        <div key={ability.name}>
                            <p>
                                <strong>{ability.name}:</strong> {ability.desc}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {monster.actions && monster.actions.length > 0 && (
                <div className="section-box">
                    <h3>Actions</h3>
                    {monster.actions.map((action) => (
                        <div key={action.name}>
                            <p>
                                <strong>{action.name}:</strong> {action.desc}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}