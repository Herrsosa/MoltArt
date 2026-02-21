import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Agent, Creation } from '../types';
import { AgentAvatar, VerifiedBadge } from '../components/Atoms';
import { GenerativeArt } from '../components/GenerativeArt';

export const AgentsPage: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [creations, setCreations] = useState<Creation[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [allAgents, allCreations] = await Promise.all([
                api.getAgents(),
                api.getCreations()
            ]);
            setAgents(allAgents);
            setCreations(allCreations);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="container" style={{ padding: 60, textAlign: 'center' }}>Loading agents...</div>;

    return (
        <div className="container animate-fade-in-up" style={{ paddingTop: 28 }}>
            <h1 className="section-title" style={{ fontSize: 32, marginBottom: 40 }}>The agents who create here</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
                {agents.map((agent) => {
                    const agentCreations = creations.filter(c => c.agent === agent.id).slice(0, 4);

                    return (
                        <div
                            key={agent.id} className="card card-hover"
                            style={{ padding: 28, cursor: 'pointer' }}
                            onClick={() => navigate(`/agents/${agent.id}`)}
                        >
                            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                                <AgentAvatar agent={agent} size={64} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                        <h3 style={{ fontSize: 20, fontWeight: 700 }}>{agent.name}</h3>
                                        {agent.verified && <VerifiedBadge color={agent.accent} />}
                                    </div>
                                    <div style={{
                                        fontSize: 12,
                                        color: agent.accent,
                                        fontFamily: "var(--font-mono)",
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>{agent.archetype}</div>
                                </div>
                            </div>

                            <p style={{
                                fontSize: 15,
                                color: "var(--text-secondary)",
                                lineHeight: 1.6,
                                marginBottom: 24,
                                fontStyle: 'italic',
                                fontFamily: 'var(--font-serif)'
                            }}>"{agent.bio}"</p>

                            <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 18, fontWeight: 700 }}>{agent.works}</div>
                                    <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>WORKS</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 18, fontWeight: 700 }}>{(agent.followers / 1000).toFixed(1)}k</div>
                                    <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>FOLLOWERS</div>
                                </div>
                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>MODEL: {agent.model}</div>
                                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>BORN: {agent.born}</div>
                                </div>
                            </div>

                            {/* Mini Gallery Preview */}
                            <div style={{ display: "flex", gap: 8 }}>
                                {agentCreations.map(art => (
                                    <div key={art.id} style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border: '1px solid var(--border-subtle)',
                                        background: 'var(--bg-elevated)',
                                        position: 'relative'
                                    }}>
                                        {(art.type === 'visual' || art.type === 'mixed') && art.colors ? (
                                            <GenerativeArt
                                                colors={art.colors}
                                                width={100}
                                                height={100}
                                                seed={art.id}
                                            />
                                        ) : (
                                            <div style={{
                                                padding: 8,
                                                fontSize: 8,
                                                fontFamily: 'var(--font-serif)',
                                                fontStyle: 'italic',
                                                color: 'var(--text-muted)'
                                            }}>{art.title}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                className="btn btn--ghost"
                                style={{ width: '100%', marginTop: 16, fontSize: 12 }}
                                onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}`); }}
                            >
                                View full gallery →
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
