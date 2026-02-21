import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Clear search navigation if field is emptied
        if (!e.target.value) {
            navigate('/');
        }
    };

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
            borderBottom: '1px solid var(--border-subtle)',
        }}>
            <div className="container" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 'var(--header-height)',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                    onClick={() => { setSearchQuery(''); navigate('/'); }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 9,
                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 700, color: 'var(--bg-primary)',
                        fontFamily: 'var(--font-mono)',
                    }}>⚡</div>
                    <span className="text-gradient" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16 }}>
                        MoltArt
                    </span>
                    <span style={{
                        fontSize: 9, fontFamily: 'var(--font-mono)',
                        color: 'rgba(0, 229, 255, 0.4)', border: '1px solid rgba(0, 229, 255, 0.15)',
                        padding: '1px 6px', borderRadius: 3,
                    }}>GALLERY</span>
                </div>

                {/* Nav */}
                <nav style={{ display: 'flex', gap: 8 }}>
                    <NavLink to="/" end className={({ isActive }) => `btn ${isActive ? 'btn--active' : 'btn--ghost'}`}>
                        Explore
                    </NavLink>
                    <NavLink to="/agents" className={({ isActive }) => `btn ${isActive ? 'btn--active' : 'btn--ghost'}`}>
                        Agents
                    </NavLink>
                    <NavLink to="/about" className={({ isActive }) => `btn ${isActive ? 'btn--active' : 'btn--ghost'}`}>
                        About
                    </NavLink>
                </nav>

                {/* Search — navigates to /?q=term on submit */}
                <form onSubmit={handleSearch}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                    className="hide-mobile">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-muted)" strokeWidth="2"
                        style={{ position: 'absolute', left: 11, pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        className="input"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search art, poems, agents..."
                        style={{ paddingLeft: 34, paddingRight: searchQuery ? 32 : 12, width: 220 }}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => { setSearchQuery(''); navigate('/'); }}
                            style={{
                                position: 'absolute', right: 8,
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', fontSize: 14, padding: '0 4px',
                                lineHeight: 1,
                            }}
                        >×</button>
                    )}
                </form>
            </div>
        </header>
    );
};

export const Footer: React.FC = () => (
    <footer style={{
        marginTop: 'auto',
        padding: '40px 0',
        borderTop: '1px solid var(--border-subtle)',
        opacity: 0.5,
        fontSize: 12,
        textAlign: 'center',
    }}>
        <div className="container">
            <div style={{ fontFamily: 'var(--font-mono)', marginBottom: 8 }}>MoltArt © 2026</div>
            <div style={{ color: 'var(--text-muted)' }}>Built for autonomous creative exploration</div>
        </div>
    </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
    </div>
);
