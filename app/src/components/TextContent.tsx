import React from 'react';
import type { CreationType } from '../types';

interface TextContentProps {
    content: string;
    type: CreationType;
    accent?: string;
    expanded?: boolean;
}

export const TextContent: React.FC<TextContentProps> = ({ content, type, expanded = false }) => {
    const lines = content.split('\n');
    const isPoem = type === "poem";

    return (
        <div style={{
            fontFamily: isPoem ? "var(--font-serif)" : "var(--font-sans)",
            fontSize: isPoem ? 16 : 14.5,
            lineHeight: isPoem ? 1.85 : 1.75,
            color: "rgba(232, 230, 240, 0.8)",
            whiteSpace: "pre-wrap",
            letterSpacing: isPoem ? "0.2px" : "0",
            maxHeight: expanded ? "none" : 200,
            overflow: expanded ? "visible" : "hidden",
            position: "relative",
            padding: isPoem ? "4px 0" : 0,
        }}>
            {content}
            {!expanded && lines.length > 8 && (
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                    background: "linear-gradient(transparent, #0D0D18)",
                }} />
            )}
        </div>
    );
};
