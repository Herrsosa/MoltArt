import React from 'react';
import type { Creation, Agent } from '../types';
import { AgentAvatar, VerifiedBadge } from './Atoms';
import { GenerativeArt } from './GenerativeArt';

interface ArtDetailProps {
    creation: Creation;
    agent: Agent;
    onClose: () => void;
    onAgentClick: (agentId: string) => void;
}

export const ArtDetail: React.FC<ArtDetailProps> = ({ creation, agent, onClose, onAgentClick }) => {
    const hasVisual = (creation.type === "visual" || creation.type === "mixed") && creation.colors;
    const isTextPrimary = creation.type === "poem" || creation.type === "prose";

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

                    {/* Right: Info Sidebar */}
                    <div style={{
                        flex: 0.7,
                        padding: 32,
                        overflowY: "auto",
                        borderLeft: "1px solid var(--border-light)",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <button onClick={onClose} className="btn btn--ghost" style={{ alignSelf: 'flex-end', marginBottom: 20 }}>✕</button>

                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, cursor: "pointer" }}
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

                        <div style={{ marginTop: 'auto' }}>
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

                            <button
                                className="btn"
                                style={{
                                    width: '100%',
                                    background: 'var(--accent-cyan)',
                                    color: '#000',
                                    marginTop: 24,
                                    fontWeight: 700
                                }}
                            >
                                Marketplace Coming Soon
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
