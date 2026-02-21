import React, { useRef, useEffect } from 'react';

interface GenerativeArtProps {
    colors: string[];
    width?: number;
    height?: number;
    seed: number;
    style?: number;
}

export const GenerativeArt: React.FC<GenerativeArtProps> = ({ colors, width, height, seed, style }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width = width || 400;
        const h = canvas.height = height || 400;
        const s = seed || Math.random() * 1000;
        const rand = (n: number) => {
            let x = Math.sin(s + n) * 10000;
            return x - Math.floor(x);
        };

        ctx.fillStyle = colors[0] || "#000";
        ctx.fillRect(0, 0, w, h);
        const st = style ?? Math.floor(rand(0) * 5);

        if (st % 5 === 0) {
            // Abstract blobs
            for (let i = 0; i < 14; i++) {
                const grd = ctx.createRadialGradient(rand(i * 3) * w, rand(i * 3 + 1) * h, 0, rand(i * 3) * w, rand(i * 3 + 1) * h, rand(i * 3 + 2) * Math.max(w, h) * 0.9);
                grd.addColorStop(0, colors[i % colors.length] + "CC");
                grd.addColorStop(1, colors[i % colors.length] + "00");
                ctx.fillStyle = grd;
                ctx.fillRect(0, 0, w, h);
            }
            for (let i = 0; i < 80; i++) {
                ctx.beginPath();
                ctx.arc(rand(100 + i) * w, rand(200 + i) * h, rand(300 + i) * 4 + 1, 0, Math.PI * 2);
                ctx.fillStyle = colors[Math.floor(rand(400 + i) * colors.length)] + "30";
                ctx.fill();
            }
        } else if (st % 5 === 1) {
            // Geometric polygons
            for (let i = 0; i < 22; i++) {
                ctx.save();
                ctx.translate(rand(i * 5) * w, rand(i * 5 + 1) * h);
                ctx.rotate(rand(i * 5 + 2) * Math.PI * 2);
                const size = rand(i * 5 + 3) * 140 + 20;
                ctx.strokeStyle = colors[i % colors.length] + "70";
                ctx.lineWidth = rand(i * 5 + 4) * 3 + 0.5;
                ctx.beginPath();
                const sides = Math.floor(rand(i * 7) * 4) + 3;
                for (let j = 0; j <= sides; j++) {
                    const angle = (j / sides) * Math.PI * 2;
                    j === 0 ? ctx.moveTo(Math.cos(angle) * size, Math.sin(angle) * size) : ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
                }
                ctx.closePath();
                ctx.stroke();
                if (rand(i * 8) > 0.5) {
                    ctx.fillStyle = colors[i % colors.length] + "12";
                    ctx.fill();
                }
                ctx.restore();
            }
        } else if (st % 5 === 2) {
            // Wavy lines
            for (let i = 0; i < 45; i++) {
                ctx.beginPath();
                const yOff = (i / 45) * h;
                for (let x = 0; x <= w; x += 2) {
                    const y = yOff + Math.sin((x / w) * Math.PI * (2 + rand(i * 2)) + rand(i * 3) * 10) * (20 + rand(i * 4) * 30);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.strokeStyle = colors[i % colors.length] + (i < 10 ? "60" : "25");
                ctx.lineWidth = rand(i * 6) * 2 + 0.5;
                ctx.stroke();
            }
        } else if (st % 5 === 3) {
            // Pixelated noise
            const bs = 5;
            for (let x = 0; x < w; x += bs) {
                for (let y = 0; y < h; y += bs) {
                    const n = rand(x * 100 + y);
                    const alpha = Math.floor(rand(x * 200 + y * 3) * 180 + 40).toString(16).padStart(2, '0');
                    ctx.fillStyle = colors[Math.floor(n * colors.length)] + alpha;
                    ctx.fillRect(x, y, bs, bs);
                }
            }
            const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
            grd.addColorStop(0, colors[1] + "40");
            grd.addColorStop(1, colors[0] + "80");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, w, h);
        } else {
            // Soft circles and curves
            for (let i = 0; i < 200; i++) {
                ctx.beginPath();
                ctx.arc(rand(i * 2) * w, rand(i * 2 + 1) * h, rand(i * 3) * 60 + 5, 0, Math.PI * 2);
                ctx.fillStyle = colors[i % colors.length] + "15";
                ctx.fill();
            }
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.moveTo(rand(900 + i) * w, 0);
                ctx.quadraticCurveTo(rand(1000 + i) * w, rand(1100 + i) * h, rand(1200 + i) * w, h);
                ctx.strokeStyle = colors[(i + 1) % colors.length] + "40";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // Add film grain
        const imageData = ctx.getImageData(0, 0, w, h);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const grain = (Math.random() - 0.5) * 12;
            imageData.data[i] += grain;
            imageData.data[i + 1] += grain;
            imageData.data[i + 2] += grain;
        }
        ctx.putImageData(imageData, 0, 0);
    }, [colors, width, height, seed, style]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                background: '#000'
            }}
        />
    );
};
