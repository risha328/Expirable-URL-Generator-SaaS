import { useEffect } from 'react';

export default function AnimatedFavicon() {
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let angle = 0;

        const linkTag = document.querySelector("link[rel*='icon']") || document.createElement('link');
        linkTag.type = 'image/x-icon';
        linkTag.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(linkTag);

        const drawFavicon = () => {
            ctx.clearRect(0, 0, 32, 32);

            // Draw glowing background circle
            const glow = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
            glow.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
            glow.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(16, 16, 15, 0, Math.PI * 2);
            ctx.fill();

            // Save canvas state for transformation
            ctx.save();
            ctx.translate(16, 16);

            // Subtle smooth pulse rotation
            const pulse = Math.sin(angle) * 0.15;
            const shift = Math.sin(angle * 1.5) * 1.5;
            ctx.scale(1 + pulse * 0.5, 1 + pulse * 0.5);

            // Setup purple gradient stroke
            const strokeGrad = ctx.createLinearGradient(-10, -10, 10, 10);
            strokeGrad.addColorStop(0, '#6366f1');
            strokeGrad.addColorStop(0.5, '#8b5cf6');
            strokeGrad.addColorStop(1, '#d946ef');

            ctx.strokeStyle = strokeGrad;
            ctx.lineWidth = 3.2;
            ctx.lineCap = 'round';

            // Draw Left Chain Ring
            ctx.beginPath();
            ctx.arc(-4 + shift * 0.3, 4 - shift * 0.3, 5.5, Math.PI * 0.2, Math.PI * 1.7);
            ctx.stroke();

            // Draw Right Chain Ring
            ctx.beginPath();
            ctx.arc(4 - shift * 0.3, -4 + shift * 0.3, 5.5, Math.PI * 1.2, Math.PI * 2.7);
            ctx.stroke();

            ctx.restore();

            // Update browser tab icon data URL
            linkTag.href = canvas.toDataURL('image/x-icon');

            angle += 0.06;
            animationFrameId = requestAnimationFrame(drawFavicon);
        };

        drawFavicon();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return null;
}
