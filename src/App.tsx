import React, { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";

const App: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 400, y: 0 });
  const requestRef = useRef<number>(0);

  const snowflakes = useMemo(
    () => [...Array(40)].map((_, i) => ({ id: i, left: i * 2.5 })),
    [],
  );

  // 1. ridersのデータは、ここ（外側）に置いておけば、エラーは消えます。
  const riders = [
    { id: "red", lane: -10, speed: 0.1, amp: 70, freq: 0.0015, delay: 0 },
    { id: "blue", lane: 0, speed: 0.07, amp: 100, freq: 0.0012, delay: 4000 },
    { id: "green", lane: 10, speed: 0.14, amp: 60, freq: 0.002, delay: 8000 },
  ];

  // 1. useEffectの中に以下のマウスイベント処理を追加します
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // マウスのX座標を state に保存します
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // 画面全体でマウスの動きを監視します
    window.addEventListener("mousemove", handleMouseMove);

    // アニメーションの処理（既存のコード）
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

    // クリーンアップ処理：監視を解除します
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="snow-world">
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
      {/* 3. これで 'riders' が見つからないエラーは解消されます */}
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
