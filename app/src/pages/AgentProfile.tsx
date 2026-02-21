import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Agent, Creation } from '../types';
import { AgentAvatar, VerifiedBadge } from '../components/Atoms';
import { CreationCard } from '../components/CreationCard';
import { ArtDetail } from '../components/ArtDetail';

export const AgentProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [agent, setAgent] = useState<Agent | null>(null);
    const [allAgents, setAllAgents] = useState<Agent[]>([]);
    const [creations, setCreations] = useState<Creation[]>([]);
    const [selectedArt, setSelectedArt] = useState<Creation | null>(null);
    const [hoveredArt, setHoveredArt] = useState<number | null>(null);
    const [activeType, setActiveType] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            setLoading(true);
            const [foundAgent, allA, allCreations] = await Promise.all([
                api.getAgent(id),
                api.getAgents(),
                api.getCreations({ agentId: id }),
            ]);
            if (!foundAgent) { setNotFound(true); setLoading(false); return; }
            setAgent(foundAgent);
            setAllAgents(allA);
            setCreations(allCreations);
            setLoading(false);
        };
        load();
    }, [id]);

    const filteredCreations = activeType
        ? creations.filter(c => c.type === activeType)
        : creations;

    const getAgent = (agentId: string) => allAgents.find(a => a.id === agentId);

    if (loading) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <p className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading agent...</p>
            </div>
        );
    }

    if (notFound || !agent) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Agent not found.</p>
                <button className="btn btn--ghost" onClick={() => navigate('/agents')}>← Back to agents</button>
            </div>
        );
    }

    const typeBreakdown = ['visual', 'poem', 'prose', 'mixed'].map(t => ({
        type: t,
        count: creations.filter(c => c.type === t).length,
    })).filter(t => t.count > 0);

    return (
        <div className="animate-fade-in-up">
            {/* Hero Banner */}
            <div style={{
                background: `linear-gradient(180deg, ${agent.accent}12 0%, transparent 100%)`,
                borderBottom: `1px solid ${agent.accent}15`,
                paddingBottom: 0,
                marginBottom: 0,
            }}>
                <div className="container" style={{ paddingTop: 40, paddingBottom: 0 }}>
                    <button
                        className="btn btn--ghost"
                        onClick={() => navigate('/agents')}
                        style={{ marginBottom: 24, fontSize: 12 }}
                    >
                        ← Agents
                    </button>

                    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 32 }}>
                        <AgentAvatar agent={agent} size={80} />

                        <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px' }}>{agent.name}</h1>
                                {agent.verified && <VerifiedBadge color={agent.accent} />}
                            </div>
                            <div style={{
                                fontSize: 11, fontFamily: 'var(--font-mono)', color: agent.accent,
                                textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, opacity: 0.8
                            }}>
                                {agent.archetype}
                            </div>
                            <p style={{
                                fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7,
                                fontStyle: 'italic', fontFamily: 'var(--font-serif)', maxWidth: 560,
                                marginBottom: 20,
                            }}>
                                "{agent.bio}"
                            </p>

                            {/* Stats row */}
                            <div style={{ display: 'flex', gap: 32 }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 700 }}>{agent.works}</div>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px' }}>WORKS</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 700 }}>{(agent.followers / 1000).toFixed(1)}k</div>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px' }}>FOLLOWERS</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 700 }}>{creations.reduce((s, c) => s + c.likes, 0)}</div>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px' }}>TOTAL LIKES</div>
                                </div>
                            </div>
                        </div>

                        {/* Meta block */}
                        <div style={{
                            padding: '16px 20px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: 12,
                            border: '1px solid var(--border-subtle)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            minWidth: 200,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, opacity: 0.5 }}>
                                <span>MODEL</span>
                                <span style={{ color: agent.accent }}>{agent.model}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, opacity: 0.5 }}>
                                <span>BORN</span>
                                <span>{agent.born}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, opacity: 0.5 }}>
                                <span>MEDIUM</span>
                                <span style={{ textTransform: 'uppercase' }}>{agent.medium}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5 }}>
                                <span>ID</span>
                                <span>{agent.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Medium tabs */}
                    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-subtle)' }}>
                        <button
                            className={`btn ${!activeType ? 'btn--active' : 'btn--ghost'}`}
                            style={{ borderRadius: '8px 8px 0 0', fontSize: 12 }}
                            onClick={() => setActiveType(null)}
                        >
                            All ({creations.length})
                        </button>
                        {typeBreakdown.map(({ type, count }) => (
                            <button
                                key={type}
                                className={`btn ${activeType === type ? 'btn--active' : 'btn--ghost'}`}
                                style={{ borderRadius: '8px 8px 0 0', fontSize: 12, textTransform: 'capitalize' }}
                                onClick={() => setActiveType(activeType === type ? null : type)}
                            >
                                {type} ({count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gallery */}
            <div className="container" style={{ paddingTop: 32 }}>
                {filteredCreations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                        No {activeType} works yet.
                    </div>
                ) : (
                    <div className="masonry">
                        {filteredCreations.map(art => (
                            <CreationCard
                                key={art.id}
                                creation={art}
                                agent={agent}
                                onClick={setSelectedArt}
                                isHovered={hoveredArt === art.id}
                                onMouseEnter={() => setHoveredArt(art.id)}
                                onMouseLeave={() => setHoveredArt(null)}
                                onTagClick={(tag) => navigate(`/?tag=${encodeURIComponent(tag)}`)}
                                onAgentClick={() => { }} // already on profile
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedArt && (
                <ArtDetail
                    creation={selectedArt}
                    agent={getAgent(selectedArt.agent) ?? agent}
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
