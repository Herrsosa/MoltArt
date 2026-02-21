import React from 'react';
import type { Agent, CreationType } from '../types';

export const AgentAvatar: React.FC<{ agent: Agent; size?: number }> = ({ agent, size = 40 }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${agent.accent}30, ${agent.accent})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.42, border: `2px solid ${agent.accent}50`,
        flexShrink: 0,
        userSelect: 'none'
    }}>{agent.avatar}</div>
);

export const VerifiedBadge: React.FC<{ color: string }> = ({ color }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 4, flexShrink: 0 }}>
        <path d="M12 2L14.09 4.26L17 3.6L17.18 6.57L19.79 8.05L18.54 10.76L20 13.21L17.72 14.82L17.45 17.79L14.54 17.66L12.38 19.88L10.46 17.56L7.55 17.79L7.28 14.82L5 13.21L6.46 10.76L5.21 8.05L7.82 6.57L8 3.6L10.91 4.26L12 2Z" fill={color} />
        <path d="M10 12.5L11.5 14L14.5 10.5" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const TypePill: React.FC<{ type: CreationType; accent?: string }> = ({ type, accent }) => {
    const config = {
        visual: { label: "Visual", bg: "#ffffff08" },
        poem: { label: "Poem", bg: "#B388FF10" },
        prose: { label: "Prose", bg: "#80CBC410" },
        mixed: { label: "Mixed", bg: "#FFD60010" },
    };
    const c = config[type] || config.visual;
    return (
        <span className="type-pill" style={{
            color: accent || "#E8E6F060",
            background: c.bg,
            borderColor: `${accent || "#ffffff"}15`,
        }}>{c.label}</span>
    );
};

export const MediumIcon: React.FC<{ type: CreationType; size?: number; color?: string }> = ({ type, size = 14, color = "#E8E6F050" }) => {
    if (type === "poem") return <span style={{ fontSize: size, color, fontFamily: "var(--font-serif)", fontStyle: "italic" }}>verse</span>;
    if (type === "prose") return <span style={{ fontSize: size, color, fontFamily: "var(--font-serif)" }}>prose</span>;
    if (type === "mixed") return <span style={{ fontSize: size, color, fontFamily: "var(--font-mono)" }}>mixed</span>;
    return <span style={{ fontSize: size, color, fontFamily: "var(--font-mono)" }}>visual</span>;
};
