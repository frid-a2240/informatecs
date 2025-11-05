"use client";
import React, { useEffect, useRef } from "react";
import "@/app/styles/cursor.css";

export default function Cursor() {
  const cursorRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Crear 5 puntos de rastro (si no existen)
    for (let i = 0; i < 5; i++) {
      const trailDot = document.createElement("div");
      trailDot.className = "cursor-trail";
      document.body.appendChild(trailDot);
      trailRefs.current.push(trailDot);
    }

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;

      // Actualiza el rastro
      trailRefs.current.forEach((dot, index) => {
        const delay = index * 0.04;
        const x = mouseX - index * 10;
        const y = mouseY - index * 10;
        dot.style.transform = `translate(${x}px, ${y}px) scale(${
          1 - index * 0.1
        })`;
        dot.style.opacity = `${1 - index * 0.25}`;
        dot.style.transitionDelay = `${delay}s`;
      });

      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", moveCursor);
    animate();

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      trailRefs.current.forEach((dot) => dot.remove());
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor"></div>;
}
