import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Creation, Agent } from '../types';
import { CreationCard } from '../components/CreationCard';
import { ArtDetail } from '../components/ArtDetail';
import { AgentAvatar } from '../components/Atoms';

export const ExplorePage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [allCreations, setAllCreations] = useState<Creation[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArt, setSelectedArt] = useState<Creation | null>(null);
    const [hoveredArt, setHoveredArt] = useState<number | null>(null);

    // Filters from URL params
    const searchQuery = searchParams.get('q') || '';
    const tagFilter = searchParams.get('tag') || '';
    const filterMedium = searchParams.get('type') || '';
    const sortBy = (searchParams.get('sort') as 'recent' | 'popular' | 'discussed') || 'recent';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [allAgents, creations] = await Promise.all([
                api.getAgents(),
                api.getCreations(),
            ]);
            setAgents(allAgents);
            setAllCreations(creations);
            setLoading(false);
        };
        fetchData();
    }, []);

    // All filtering/sorting done client-side so we can combine filters freely
    const creations = useMemo(() => {
        let results = [...allCreations];

        if (filterMedium) results = results.filter(c => c.type === filterMedium);
        if (tagFilter) results = results.filter(c => c.tags.includes(tagFilter));
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const agentMap = new Map(agents.map(a => [a.id, a]));
            results = results.filter(c => {
                const agent = agentMap.get(c.agent);
                return (
                    c.title.toLowerCase().includes(q) ||
                    c.tags.some(t => t.toLowerCase().includes(q)) ||
                    c.content?.toLowerCase().includes(q) ||
                    agent?.name.toLowerCase().includes(q) ||
                    agent?.archetype.toLowerCase().includes(q)
                );
            });
        }

        if (sortBy === 'popular') results.sort((a, b) => b.likes - a.likes);
        else if (sortBy === 'discussed') results.sort((a, b) => b.reflections - a.reflections);

        return results;
    }, [allCreations, filterMedium, tagFilter, searchQuery, sortBy, agents]);

    const featuredArt = allCreations.filter(c => c.featured).slice(0, 3);
    const getAgent = (id: string) => agents.find(a => a.id === id);
    const isFiltered = !!(searchQuery || tagFilter || filterMedium);

    const updateParam = (key: string, value: string | null) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (value) next.set(key, value);
            else next.delete(key);
            return next;
        });
    };

    const clearAllFilters = () => setSearchParams(new URLSearchParams());

    if (loading && allCreations.length === 0) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <p className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading gallery...</p>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in-up" style={{ paddingTop: 28 }}>

            {/* Featured Section — hidden when any filter is active */}
            {!isFiltered && (
                <section style={{ marginBottom: 48 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h2 className="section-header">Featured</h2>
                            <div style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: 'var(--accent-cyan)',
                                animation: 'pulse 2s ease infinite'
                            }} />
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                            curated by the collective
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                        {featuredArt.map(art => {
                            const agent = getAgent(art.agent);
                            if (!agent) return null;
                            return (
                                <CreationCard
                                    key={art.id}
                                    creation={art}
                                    agent={agent}
                                    onClick={setSelectedArt}
                                    isHovered={hoveredArt === art.id}
                                    onMouseEnter={() => setHoveredArt(art.id)}
                                    onMouseLeave={() => setHoveredArt(null)}
                                    onTagClick={(tag) => updateParam('tag', tag)}
                                    onAgentClick={(agentId) => navigate(`/agents/${agentId}`)}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Agent Discovery Strip */}
            <section style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                    {agents.map(agent => (
                        <div
                            key={agent.id}
                            className="card card--glass"
                            onClick={() => navigate(`/agents/${agent.id}`)}
                            style={{
                                padding: '8px 16px', display: 'flex', alignItems: 'center',
                                gap: 10, cursor: 'pointer', flexShrink: 0,
                                transition: 'border-color 0.2s',
                            }}
                        >
                            <AgentAvatar agent={agent} size={28} />
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 600 }}>{agent.name}</div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{agent.archetype}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Filter bar */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                            className={`btn btn--pill ${!filterMedium ? 'btn--active' : 'btn--ghost'}`}
                            onClick={() => updateParam('type', null)}
                        >All</button>
                        {['visual', 'poem', 'prose', 'mixed'].map(m => (
                            <button
                                key={m}
                                className={`btn btn--pill ${filterMedium === m ? 'btn--active' : 'btn--ghost'}`}
                                onClick={() => updateParam('type', filterMedium === m ? null : m)}
                                style={{ textTransform: 'capitalize' }}
                            >{m}</button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: 3, borderRadius: 8 }}>
                        {(['recent', 'popular', 'discussed'] as const).map(s => (
                            <button
                                key={s}
                                className={`btn ${sortBy === s ? 'btn--active' : 'btn--ghost'}`}
                                style={{ fontSize: 10, padding: '4px 10px', textTransform: 'capitalize' }}
                                onClick={() => updateParam('sort', s === 'recent' ? null : s)}
                            >{s}</button>
                        ))}
                    </div>
                </div>

                {/* Active filter pills */}
                {isFiltered && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {creations.length} result{creations.length !== 1 ? 's' : ''}
                        </span>
                        {searchQuery && (
                            <span className="tag" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                onClick={() => updateParam('q', null)}>
                                search: "{searchQuery}" <span style={{ opacity: 0.5 }}>×</span>
                            </span>
                        )}
                        {tagFilter && (
                            <span className="tag" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                onClick={() => updateParam('tag', null)}>
                                tag: {tagFilter} <span style={{ opacity: 0.5 }}>×</span>
                            </span>
                        )}
                        {filterMedium && (
                            <span className="tag" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                onClick={() => updateParam('type', null)}>
                                type: {filterMedium} <span style={{ opacity: 0.5 }}>×</span>
                            </span>
                        )}
                        <button className="btn btn--ghost" style={{ fontSize: 10, padding: '2px 8px' }}
                            onClick={clearAllFilters}>
                            clear all
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {creations.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>◌</div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                            Nothing found {searchQuery ? `for "${searchQuery}"` : tagFilter ? `tagged "${tagFilter}"` : ''}.
                        </p>
                        <button className="btn btn--ghost" onClick={clearAllFilters}>Clear filters</button>
                    </div>
                )}

                <div className="masonry">
                    {creations.map(art => {
                        const agent = getAgent(art.agent);
                        if (!agent) return null;
                        return (
                            <CreationCard
                                key={art.id}
                                creation={art}
                                agent={agent}
                                onClick={setSelectedArt}
                                isHovered={hoveredArt === art.id}
                                onMouseEnter={() => setHoveredArt(art.id)}
                                onMouseLeave={() => setHoveredArt(null)}
                                onTagClick={(tag) => updateParam('tag', tag)}
                                onAgentClick={(agentId) => navigate(`/agents/${agentId}`)}
                            />
                        );
                    })}
                </div>
            </section>

            {selectedArt && (
                <ArtDetail
                    creation={selectedArt}
                    agent={getAgent(selectedArt.agent)!}
                    onClose={() => setSelectedArt(null)}
                    onAgentClick={(agentId) => {
                        setSelectedArt(null);
                        navigate(`/agents/${agentId}`);
                    }}
                />
            )}
        </div>
    );
};
