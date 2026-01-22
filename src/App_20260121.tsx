import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const RIDERS = [
  { id: "red", lane: 25, speed: 0.1, swayWidth: 50, freq: 0.003 },
  { id: "blue", lane: 50, speed: 0.08, swayWidth: 70, freq: 0.002 },
  { id: "green", lane: 75, speed: 0.13, swayWidth: 40, freq: 0.004 },
];

const SNOWFLAKES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 2,
}));

const App: React.FC = () => {
  const [cloudPos, setCloudPos] = useState({ x: 150, y: 120 });
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setCloudPos({ x: e.clientX, y: Math.max(50, Math.min(e.clientY, 200)) });
    window.addEventListener("mousemove", handleMouseMove);

    const update = (time: number) => {
      RIDERS.forEach((r) => {
        const el = document.getElementById(r.id);
        if (!el) return;

        // 横位置（進捗）
        const xPosPercent = (((time * r.speed) / 10) % 150) - 25;

        // S字の揺れ（px単位で大きく揺らす）
        const sSway = Math.sin(time * r.freq) * r.swayWidth;

        // 反映：斜面の角度（xPos * 0.25）にS字の揺れを加算
        el.style.left = `${xPosPercent}%`;
        el.style.top = `calc(${r.lane}% + ${xPosPercent * 0.25}vw + ${sSway}px)`;
      });
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="ski-resort">
      <div className="sun-new"></div>

      {/* 1. 山脈：土台(岩)と頂上(雪)の2層構造 */}
      <div className="mountain-layer">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`mt-block mt-v${i}`}>
            <div className="rock-part"></div>
            <div className="snow-part"></div>
          </div>
        ))}
      </div>

      <div className="slope-new"></div>

      <div className="cloud-new" style={{ left: cloudPos.x, top: cloudPos.y }}>
        <div className="cloud-body-new"></div>
        <div className="snow-wrap-new">
          {SNOWFLAKES.map((s) => (
            <div
              key={s.id}
              className="flake-new"
              style={{
                left: `${s.x}%`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            >
              *
            </div>
          ))}
        </div>
      </div>

      {/* 4. ライダー：背景色を強制透過 */}
      {RIDERS.map((r) => (
        <img
          key={r.id}
          id={r.id}
          src={`/rider-${r.id}.png`}
          alt=""
          className="rider-img-fixed"
        />
      ))}
    </div>
  );
};

export default App;
