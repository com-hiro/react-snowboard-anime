import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
}

const SnowyCursorEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (x: number, y: number, isAuto: boolean) => {
      particles.current.push({
        x,
        y,
        size: Math.random() * (isAuto ? 10 : 5) + 2, // 雪煙を少し大きく
        vx: (Math.random() - 0.5) * (isAuto ? 12 : 4),
        vy: (Math.random() - 0.5) * 3 - (isAuto ? 4 : 0), // 上に跳ね上げる力を強く
        opacity: 1,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;
      const autoX1 =
        ((time * (canvas.width / 10 + 10)) % (canvas.width + 100)) - 50;
      // 雪煙を2粒ずつ出すことで密度を上げる
      createParticle(autoX1, canvas.height * 0.88, true);
      createParticle(autoX1, canvas.height * 0.88, true);

      particles.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.opacity -= 0.015;

        ctx.beginPath();
        // ★ 修正ポイント：少し青みを持たせて光らせる
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 150, 255, 0.5)";
        ctx.fillStyle = `rgba(220, 240, 255, ${p.opacity})`;

        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // 他の描画に影響させない

        if (p.opacity <= 0) particles.current.splice(index, 1);
      });
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 2; i++) createParticle(e.clientX, e.clientY, false);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 5, // 山(2)より上で、スノーボーダー(10)より下
      }}
    />
  );
};

export default SnowyCursorEffect;
