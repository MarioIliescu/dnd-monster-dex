import { useEffect, useState } from "react"

function SearchForm({ searchName, setSearchName, onSearch }) {
    return (
        <form onSubmit={onSearch} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Type monster name, like owlbear"
                style={{ padding: "8px", marginRight: "8px", width: "250px" }}
            />
            <button type="submit">Search</button>
        </form>
    )
}

function BasicInfo({ monster }) {
    return (
        <>
            <h2>Basic Info</h2>
            <p><strong>Size:</strong> {monster.size}</p>
            <p><strong>Type:</strong> {monster.type}</p>
            <p><strong>Alignment:</strong> {monster.alignment}</p>
            <p><strong>Hit Points:</strong> {monster.hit_points}</p>
            <p><strong>Hit Dice:</strong> {monster.hit_dice}</p>
            <p>
                <strong>Armor Class:</strong> {monster.armor_class?.[0]?.value} ({monster.armor_class?.[0]?.type})
            </p>
            <p><strong>Challenge Rating:</strong> {monster.challenge_rating}</p>
            <p><strong>XP:</strong> {monster.xp}</p>
            <p><strong>Languages:</strong> {monster.languages}</p>
        </>
    )
}

function SpeedInfo({ speed }) {
    return (
        <>
            <h2>Speed</h2>
            <ul>
                {Object.entries(speed || {}).map(([type, value]) => (
                    <li key={type}>
                        <strong>{type}:</strong> {value}
                    </li>
                ))}
            </ul>
        </>
    )
}

function StatsInfo({ monster }) {
    return (
        <>
            <h2>Stats</h2>
            <ul>
                <li><strong>STR:</strong> {monster.strength}</li>
                <li><strong>DEX:</strong> {monster.dexterity}</li>
                <li><strong>CON:</strong> {monster.constitution}</li>
                <li><strong>INT:</strong> {monster.intelligence}</li>
                <li><strong>WIS:</strong> {monster.wisdom}</li>
                <li><strong>CHA:</strong> {monster.charisma}</li>
            </ul>
        </>
    )
}

function SensesInfo({ senses }) {
    return (
        <>
            <h2>Senses</h2>
            <ul>
                {Object.entries(senses || {}).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
        </>
    )
}

function DamageImmunities({ immunities }) {
    return (
        <>
            <h2>Damage Immunities</h2>
            {immunities?.length > 0 ? (
                <ul>
                    {immunities.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p>None</p>
            )}
        </>
    )
}

function ProficienciesInfo({ proficiencies }) {
    return (
        <>
            <h2>Proficiencies</h2>
            <ul>
                {proficiencies?.map((prof) => (
                    <li key={prof.proficiency.index}>
                        {prof.proficiency.name}: +{prof.value}
                    </li>
                ))}
            </ul>
        </>
    )
}

function NamedDescriptionList({ title, items }) {
    return (
        <>
            <h2>{title}</h2>
            {items?.length > 0 ? (
                <ul>
                    {items.map((item) => (
                        <li key={item.name}>
                            <strong>{item.name}:</strong> {item.desc}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>None</p>
            )}
        </>
    )
}

function MonsterDetails({ monster }) {
    return (
        <div>
            <h1>{monster.name}</h1>

            <img
                src={monster.image}
                alt={monster.name}
                style={{ width: "400px", maxWidth: "100%", borderRadius: "12px" }}
            />

            <BasicInfo monster={monster} />
            <SpeedInfo speed={monster.speed} />
            <StatsInfo monster={monster} />
            <SensesInfo senses={monster.senses} />
            <DamageImmunities immunities={monster.damage_immunities} />
            <ProficienciesInfo proficiencies={monster.proficiencies} />
            <NamedDescriptionList title="Special Abilities" items={monster.special_abilities} />
            <NamedDescriptionList title="Actions" items={monster.actions} />
            <NamedDescriptionList title="Legendary Actions" items={monster.legendary_actions} />
        </div>
    )
}

function fetchMonster(monsterName) {
    return fetch(`/api/monsters/${monsterName}`).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch monster")
        }
        return response.json()
    })
}

export default function AboutMonsters() {
    const [searchName, setSearchName] = useState("adult-red-dragon")
    const [monsterName, setMonsterName] = useState("adult-red-dragon")
    const [monster, setMonster] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setLoading(true)
        setError("")
        setMonster(null)

        fetchMonster(monsterName)
            .then((data) => {
                setMonster(data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [monsterName])

    function handleSearch(e) {
        e.preventDefault()
        setMonsterName(searchName.trim().toLowerCase())
    }

    return (
        <div style={{ padding: "20px" }}>
            <SearchForm
                searchName={searchName}
                setSearchName={setSearchName}
                onSearch={handleSearch}
            />

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && monster && <MonsterDetails monster={monster} />}
        </div>
    )
}