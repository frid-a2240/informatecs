"use client";
import React from "react";
import { motion } from "framer-motion";

const SplitText = ({
  text = "",
  className = "",
  delay = 50,
  animationFrom = { opacity: 0, y: 20 },
  animationTo = { opacity: 1, y: 0 },
  // 1. Corregimos el easing a un formato que Framer Motion siempre acepte
  easing = "easeOut", 
}) => {
  const words = text.split(" ").filter(Boolean); // Limpiamos espacios extra

  return (
    <span className={className} style={{ display: "inline-block" }}>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            // 2. Quitamos el margen a la última palabra para no arruinar el centrado
            marginRight: wordIndex === words.length - 1 ? "0" : "0.25em",
          }}
        >
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={animationFrom}
              whileInView={animationTo}
              viewport={{ once: true }}
              transition={{
                delay: (wordIndex * 5 + charIndex) * (delay / 1000),
                duration: 0.5,
                ease: easing,
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default SplitText;