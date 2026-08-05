import React from "react";
import { motion } from "motion/react";

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

// Splits text into words and reveals them in sequence, like the phrase is
// arriving live rather than just appearing painted on the page.
export default function RevealText({ text, className = "", delay = 0, as = "span" }: RevealTextProps) {
  const words = text.split(" ");
  const Tag = motion[as] as any;

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.09,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
