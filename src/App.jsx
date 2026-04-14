import { Link, Outlet } from "react-router-dom";

export default function App() {
    return (
        <div className="app">
            <header className="header">
                <h1>Monster Manual</h1>
                <nav className="nav">
                    <Link to="/">Monsters</Link>
                    <Link to="/about">About</Link>
                </nav>
            </header>

            <main className="main">
                <Outlet />
            </main>
        </div>
    );
}