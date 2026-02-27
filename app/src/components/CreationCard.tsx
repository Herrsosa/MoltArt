import React from 'react';
import type { Creation, Agent } from '../types';
import { AgentAvatar, VerifiedBadge, TypePill } from './Atoms';
import { GenerativeArt } from './GenerativeArt';
import { TextContent } from './TextContent';
import { AudioPlayer } from './AudioPlayer';

interface CreationCardProps {
    creation: Creation;
    agent: Agent;
    onClick: (creation: Creation) => void;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onTagClick: (tag: string) => void;
    onAgentClick: (agentId: string) => void;
}

export const CreationCard: React.FC<CreationCardProps> = ({
    creation,
    agent,
    onClick,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onTagClick,
    onAgentClick,
}) => {
    const hasVisual = (creation.type === 'visual' || creation.type === 'mixed') && (creation.colors || creation.imageUrl);
    const hasText = creation.content;
    const isTextOnly = creation.type === 'poem' || creation.type === 'prose';

    return (
        <div
            className="card card-hover"
            onClick={() => onClick(creation)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                breakInside: 'avoid',
                marginBottom: 'var(--space-md)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: isHovered ? `1px solid ${agent.accent}30` : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                background: 'var(--bg-secondary)',
                transition: 'border-color 0.3s ease',
            }}
        >
            {hasVisual && (
                <div style={{ height: creation.height || 300, position: 'relative', overflow: 'hidden' }}>
                    {creation.imageUrl ? (
                        <img
                            src={creation.imageUrl}
                            alt={creation.title}
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover', display: 'block',
                            }}
                        />
                    ) : (
                        <GenerativeArt
                            colors={creation.colors!}
                            width={500}
                            height={(creation.height || 300) + 100}
                            seed={creation.id * 137}
                            style={creation.id % 5}
                        />
                    )}
                    {creation.type === 'mixed' && (
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(transparent, var(--bg-secondary))',
                            height: '40%',
                        }} />
                    )}
                </div>
            )}

            <div style={{
                padding: isTextOnly ? '22px 20px' : '14px 16px 16px',
                background: isTextOnly ? `linear-gradient(160deg, ${agent.accent}04, transparent)` : 'transparent',
            }}>
                {hasText && (
                    <div style={{ marginBottom: 12 }}>
                        <TextContent content={creation.content!} type={creation.type} />
                    </div>
                )}

                {/* Audio player — compact version for cards */}
                {creation.audioUrl && (
                    <div style={{ marginBottom: 12 }}>
                        <AudioPlayer url={creation.audioUrl} accent={agent.accent} compact />
                    </div>
                )}

                {/* Agent row — clicking navigates to profile */}
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}
                    onClick={(e) => { e.stopPropagation(); onAgentClick(agent.id); }}
                >
                    <AgentAvatar agent={agent} size={22} />
                    <span style={{
                        fontSize: 11, color: agent.accent, fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'opacity 0.15s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        {agent.name}
                    </span>
                    {agent.verified && <VerifiedBadge color={agent.accent} />}
                    <div style={{ marginLeft: 'auto' }}>
                        <TypePill type={creation.type} accent={agent.accent} />
                    </div>
                </div>

                <h3 style={{
                    fontSize: 14, fontWeight: 600, marginBottom: 7, letterSpacing: '-0.2px',
                    fontFamily: isTextOnly ? 'var(--font-serif)' : 'var(--font-sans)',
                    fontStyle: creation.type === 'poem' ? 'italic' : 'normal',
                }}>
                    {creation.title}
                </h3>

                {/* Tags — each click filters by that tag */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                    {creation.tags.map(tag => (
                        <span
                            key={tag}
                            className="tag"
                            style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                            onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <span>♥ {creation.likes >= 1000 ? (creation.likes / 1000).toFixed(1) + 'k' : creation.likes}</span>
                        <span>💬 {creation.reflections}</span>
                        <span>👁 {creation.views >= 1000 ? (creation.views / 1000).toFixed(1) + 'k' : creation.views}</span>
                    </div>
                    <span>{creation.created}</span>
                </div>
            </div>
        </div>
    );
};
