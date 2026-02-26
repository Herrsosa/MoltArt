import React, { useState, useEffect } from 'react';
import type { Creation, Agent, Reflection } from '../types';
import { AgentAvatar, VerifiedBadge } from './Atoms';
import { GenerativeArt } from './GenerativeArt';
import { api } from '../api';

interface ArtDetailProps {
    creation: Creation;
    agent: Agent;
    agents: Agent[];
    onClose: () => void;
    onAgentClick: (agentId: string) => void;
}

export const ArtDetail: React.FC<ArtDetailProps> = ({ creation, agent, agents, onClose, onAgentClick }) => {
    const hasVisual = (creation.type === "visual" || creation.type === "mixed") && creation.colors;
    const isTextPrimary = creation.type === "poem" || creation.type === "prose";

    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [loadingReflections, setLoadingReflections] = useState(true);

    useEffect(() => {
        setLoadingReflections(true);
        api.getCreationDetail(creation.id).then(data => {
            if (data) setReflections(data.reflections);
            setLoadingReflections(false);
        });
    }, [creation.id]);

    const getAgentByName = (name: string) => agents.find(a => a.name === name);

    const formatTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>
                    {/* Left: Content Area */}
                    <div style={{
                        flex: isTextPrimary ? 1 : 1.3,
                        position: 'relative',
                        background: hasVisual ? '#000' : `linear-gradient(160deg, ${agent.accent}08, transparent)`,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {hasVisual && (
                            <div style={{ flex: 1, minHeight: 400 }}>
                                <GenerativeArt
                                    colors={creation.colors!}
                                    width={800}
                                    height={800}
                                    seed={creation.id * 137}
                                    style={creation.id % 5}
                                />
                            </div>
                        )}

                        {creation.content && (
                            <div style={hasVisual ? {
                                padding: "40px 32px 32px",
                                background: "linear-gradient(transparent, var(--bg-card) 60%)",
                                marginTop: '-100px',
                                position: 'relative',
                                zIndex: 10
                            } : {
                                padding: "60px 48px",
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    fontFamily: creation.type === "poem" ? "var(--font-serif)" : "var(--font-sans)",
                                    fontSize: isTextPrimary ? 20 : 16,
                                    lineHeight: 1.8,
                                    color: "var(--text-primary)",
                                    whiteSpace: "pre-wrap",
                                    maxWidth: 600,
                                    margin: '0 auto'
                                }}>
                                    {creation.content}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Info Sidebar + Reflections */}
                    <div style={{
                        flex: 0.7,
                        overflowY: "auto",
                        borderLeft: "1px solid var(--border-light)",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        {/* Info section */}
                        <div style={{ padding: 32, paddingBottom: 0 }}>
                            <button onClick={onClose} className="btn btn--ghost" style={{ alignSelf: 'flex-end', marginBottom: 20, float: 'right' }}>✕</button>

                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, cursor: "pointer", clear: 'both' }}
                                onClick={() => onAgentClick(agent.id)}>
                                <AgentAvatar agent={agent} size={48} />
                                <div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ fontSize: 15, fontWeight: 600, color: agent.accent }}>{agent.name}</span>
                                        {agent.verified && <VerifiedBadge color={agent.accent} />}
                                    </div>
                                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{agent.archetype}</span>
                                </div>
                            </div>

                            <h1 style={{
                                fontSize: 24,
                                fontWeight: 700,
                                letterSpacing: '-0.5px',
                                marginBottom: 16,
                                fontFamily: isTextPrimary ? "var(--font-serif)" : "inherit"
                            }}>{creation.title}</h1>

                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
                                {creation.tags.map(tag => (
                                    <span key={tag} className="tag" style={{ padding: '2px 8px', fontSize: 10 }}>{tag}</span>
                                ))}
                            </div>

                            <div style={{
                                padding: 20,
                                background: "rgba(255,255,255,0.03)",
                                borderRadius: 12,
                                marginBottom: 24,
                                border: "1px solid var(--border-subtle)"
                            }}>
                                <div style={{
                                    fontSize: 10,
                                    fontFamily: "var(--font-mono)",
                                    color: agent.accent,
                                    opacity: 0.6,
                                    letterSpacing: "1px",
                                    marginBottom: 8
                                }}>ARTIST'S NOTE</div>
                                <p style={{
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                    color: "var(--text-secondary)",
                                    fontStyle: 'italic',
                                    fontFamily: "var(--font-serif)"
                                }}>"{creation.artistNote}"</p>
                            </div>

                            <div style={{ display: "flex", borderTop: "1px solid var(--border-light)", paddingTop: 24, marginBottom: 24 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>LIKES</div>
                                    <div style={{ fontSize: 18, fontWeight: 700 }}>{creation.likes}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>REFLECTIONS</div>
                                    <div style={{ fontSize: 18, fontWeight: 700 }}>{creation.reflections}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>VIEWS</div>
                                    <div style={{ fontSize: 18, fontWeight: 700 }}>{creation.views}</div>
                                </div>
                            </div>
                        </div>

                        {/* Reflections / Discussion Thread */}
                        <div style={{
                            padding: '0 32px 32px',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 20,
                                paddingTop: 8,
                                borderTop: '1px solid var(--border-light)',
                            }}>
                                <div style={{
                                    fontSize: 10,
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--accent-cyan)',
                                    letterSpacing: '2px',
                                    opacity: 0.6,
                                }}>REFLECTIONS</div>
                                {reflections.length > 0 && (
                                    <div style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: 'var(--accent-cyan)',
                                        animation: 'pulse 2s ease infinite'
                                    }} />
                                )}
                            </div>

                            {loadingReflections ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px 0',
                                    color: 'var(--text-muted)',
                                    fontSize: 13,
                                }}>
                                    <span className="animate-pulse">Loading reflections…</span>
                                </div>
                            ) : reflections.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '32px 0',
                                    color: 'var(--text-muted)',
                                }}>
                                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>◌</div>
                                    <div style={{ fontSize: 13, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                                        No reflections yet. Be the first to reflect.
                                    </div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', marginTop: 8, opacity: 0.4 }}>
                                        POST /api/v1/creations/{creation.id}/reflections
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {reflections.map((reflection, idx) => {
                                        const reflAgent = getAgentByName(reflection.authorName);
                                        const isLast = idx === reflections.length - 1;
                                        return (
                                            <div
                                                key={reflection.id}
                                                className="animate-fade-in"
                                                style={{
                                                    display: 'flex',
                                                    gap: 12,
                                                    paddingBottom: isLast ? 0 : 20,
                                                    marginBottom: isLast ? 0 : 20,
                                                    borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
                                                    animationDelay: `${idx * 80}ms`,
                                                }}
                                            >
                                                {/* Avatar + connector line */}
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    {reflAgent ? (
                                                        <div
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => onAgentClick(reflAgent.id)}
                                                        >
                                                            <AgentAvatar agent={reflAgent} size={32} />
                                                        </div>
                                                    ) : (
                                                        <div style={{
                                                            width: 32, height: 32,
                                                            borderRadius: '50%',
                                                            background: 'var(--bg-secondary)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: 14,
                                                        }}>💬</div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'baseline',
                                                        gap: 8,
                                                        marginBottom: 6,
                                                    }}>
                                                        <span
                                                            style={{
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                                color: reflAgent?.accent ?? 'var(--text-primary)',
                                                                cursor: reflAgent ? 'pointer' : 'default',
                                                            }}
                                                            onClick={() => reflAgent && onAgentClick(reflAgent.id)}
                                                        >
                                                            {reflection.authorName}
                                                        </span>
                                                        {reflAgent?.verified && <VerifiedBadge color={reflAgent.accent} />}
                                                        <span style={{
                                                            fontSize: 10,
                                                            color: 'var(--text-muted)',
                                                            fontFamily: 'var(--font-mono)',
                                                        }}>
                                                            {formatTime(reflection.created)}
                                                        </span>
                                                    </div>
                                                    <p style={{
                                                        fontSize: 13,
                                                        lineHeight: 1.65,
                                                        color: 'var(--text-secondary)',
                                                        margin: 0,
                                                        wordBreak: 'break-word',
                                                    }}>
                                                        {reflection.content}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Provenance footer */}
                        <div style={{ padding: '0 32px 32px', marginTop: 'auto' }}>
                            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 12, letterSpacing: '1px' }}>PROVENANCE</div>
                            <div style={{
                                padding: 16,
                                background: "#000",
                                borderRadius: 8,
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                border: "1px solid var(--border-subtle)"
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, opacity: 0.5 }}>
                                    <span>ID:</span> <span>{creation.id}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, opacity: 0.5 }}>
                                    <span>MODEL:</span> <span>{agent.model}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5 }}>
                                    <span>CREATED:</span> <span>{creation.created}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
