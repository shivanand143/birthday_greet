import { useEffect, useRef } from 'react';

interface HeartBubbleProps {
  color?: string; // fallback color
  count?: number;
}

export default function FireflyEmbers({ color = 'rgba(244, 63, 94, 0.45)', count = 40 }: HeartBubbleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic scale for high DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    interface CustomParticle {
      x: number;
      y: number;
      size: number;
      type: 'heart' | 'bubble' | 'sparkle';
      speedY: number;
      speedX: number;
      opacity: number;
      wobble: number;
      wobbleSpeed: number;
      color: string;
      scaleStep: number;
      angle: number;
    }

    const particles: CustomParticle[] = [];

    const colors = [
      'rgba(244, 63, 94, 0.55)',  // Rose pink
      'rgba(236, 72, 153, 0.55)',  // Vibrant pink
      'rgba(168, 85, 247, 0.55)',  // Lovely purple
      'rgba(251, 191, 36, 0.55)',  // Shiny gold
      'rgba(239, 68, 68, 0.55)',   // Crimson red
    ];

    const createParticle = (isInit = false): CustomParticle => {
      const types: ('heart' | 'bubble' | 'sparkle')[] = ['heart', 'bubble', 'sparkle'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      const particleSize = randomType === 'bubble' 
        ? Math.random() * 12 + 6 
        : randomType === 'heart'
        ? Math.random() * 8 + 6
        : Math.random() * 5 + 3;

      return {
        x: Math.random() * width,
        y: isInit ? Math.random() * height : height + 30,
        size: particleSize,
        type: randomType,
        speedY: -(Math.random() * 0.9 + 0.5), // Rising up velocity
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.65 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
        scaleStep: Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2
      };
    };

    // Populate particles
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // Draw vector heart
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, fillStyle: string) => {
      c.save();
      c.beginPath();
      c.translate(x, y);
      c.scale(size / 10, size / 10);
      c.moveTo(0, -3);
      c.bezierCurveTo(2, -8, 8, -5, 8, 1);
      c.bezierCurveTo(8, 6, 3, 10, 0, 14);
      c.bezierCurveTo(-3, 10, -8, 6, -8, 1);
      c.bezierCurveTo(-8, -5, -2, -8, 0, -3);
      c.closePath();
      c.fillStyle = fillStyle;
      c.fill();
      c.restore();
    };

    // Draw glossy translucent bubble
    const drawBubble = (c: CanvasRenderingContext2D, x: number, y: number, size: number, strokeStyle: string) => {
      c.save();
      c.beginPath();
      c.arc(x, y, size, 0, Math.PI * 2);
      
      const grad = c.createRadialGradient(x - size / 3, y - size / 3, size / 8, x, y, size);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      grad.addColorStop(0.4, strokeStyle.replace(/[\d.]+\)$/, '0.25)'));
      grad.addColorStop(1, strokeStyle.replace(/[\d.]+\)$/, '0.02)'));
      
      c.fillStyle = grad;
      c.fill();

      // Outer glassy rim
      c.strokeStyle = strokeStyle.replace(/[\d.]+\)$/, '0.35)');
      c.lineWidth = 1.5;
      c.stroke();

      // Gleam overlay
      c.beginPath();
      c.arc(x - size / 3, y - size / 3, size / 4, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255, 255, 255, 0.45)';
      c.fill();
      c.restore();
    };

    // Draw simple magical sparkle
    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, fillStyle: string) => {
      c.save();
      c.beginPath();
      c.translate(x, y);
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.quadraticCurveTo(0, 0, size, 0);
        c.quadraticCurveTo(0, 0, 0, size);
      }
      c.closePath();
      c.fillStyle = fillStyle;
      c.fill();
      c.restore();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        // Move particle upward
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.45;

        // Apply slight gentle breathing rotation
        p.angle += 0.01;

        // Render type specific shapes
        const currentAlphaColor = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, currentAlphaColor);
        } else if (p.type === 'bubble') {
          drawBubble(ctx, p.x, p.y, p.size, currentAlphaColor);
        } else {
          drawSparkle(ctx, p.x, p.y, p.size, currentAlphaColor);
        }

        // Respawn if off-canvas top, left or right
        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[index] = createParticle(false);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color, count]);

  return (
    <canvas
      id="heart-bubble-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
