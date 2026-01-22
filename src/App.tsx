import React, { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";

const App: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 400, y: 0 });
  const requestRef = useRef<number>(0);

  const snowflakes = useMemo(
    () => [...Array(40)].map((_, i) => ({ id: i, left: i * 2.5 })),
    [],
  );

  const riders = [
    { id: "red", lane: -10, speed: 0.1, amp: 70, freq: 0.0015, delay: 0 },
    { id: "blue", lane: 0, speed: 0.07, amp: 100, freq: 0.0012, delay: 4000 },
    { id: "green", lane: 10, speed: 0.14, amp: 60, freq: 0.002, delay: 8000 },
  ];

  useEffect(() => {
    // マウスとタッチの両方の座標を取得する関数
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let x = 0;
      if ("clientX" in e) {
        x = e.clientX;
      } else if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
      }
      setMousePos({ x, y: 0 });
    };

    // 両方のイベントを登録
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: false });

    const update = (time: number) => {
      riders.forEach((r) => {
        const el = document.getElementById(r.id);
        if (!el) return;
        const move = ((time * r.speed) / 10 + r.delay * 0.1) % 170;
        const currentLeft = 130 - move;
        const sCurve = Math.sin((time + r.delay) * r.freq) * r.amp;
        el.style.left = `${currentLeft}%`;
        const descent = move * 0.12;
        el.style.top = `calc(52% + ${r.lane}% + ${descent}vw + ${sCurve}px)`;
      });
      requestRef.current = requestAnimationFrame(update);
    };
    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="snow-world">
      {/* プロフィールカード（ここにお名前とSNSリンクを！） */}
      <div className="profile-card">
        <h2>Akira Hirohashi (廣橋 昭)</h2>
        <p className="title">Software Engineer (AI & Cloud)</p>
        <p className="description">
          Welcome to the world of snowboarding, built with React! 🏂
          <br />
          Streamed with Cloudflare.
          <br />
          Clouds follow your mouse (or your finger on a smartphone).
        </p>

        <div className="sns-links">
          <a
            href="https://x.com/ak_hirohashi"
            target="_blank"
            rel="noopener noreferrer"
            className="sns-button x-link"
          >
            X
          </a>
          <a
            href="https://www.linkedin.com/in/akira-hirohashi/"
            target="_blank"
            rel="noopener noreferrer"
            className="sns-button li-link"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <h1 className="main-title">SNOWBOARD RESORT</h1>
      <div className="the-sun" />
      <div className="mt-range">
        <div className="mountain m1" />
        <div className="mountain m2" />
        <div className="mountain m3" />
        <div className="mountain m4" />
        <div className="mountain m5" />
      </div>
      <div className="ground-slope" />

      {riders.map((r) => (
        <div key={r.id} id={r.id} className="rider-container">
          <div className="rider-shake">
            <img src={`/rider-${r.id}.png`} alt={r.id} className="rider-img" />
          </div>
        </div>
      ))}

      <div
        className="cloud-group"
        style={{ left: `${mousePos.x}px`, transform: "translateX(-50%)" }}
      >
        <div className="cloud-puffs">
          <div className="puff puff-main" />
          <div className="puff puff-left" />
          <div className="puff puff-right" />
          <div className="puff puff-top" />
        </div>
        <div className="snow-layer">
          {snowflakes.map((s) => (
            <span
              key={s.id}
              style={{
                left: `${s.left}%`,
                animationDelay: `${s.id * 0.1}s`,
                animationDuration: `${1.5 + (s.id % 2)}s`,
              }}
            >
              *
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
