import React, { useEffect, useRef } from "react";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

const SPECIAL_CHARS = "~`!@#$%^&*()-+=/*[]{}:<>?";

const NUMBERS = "0123456789";

const TYPES = {
  ALPHABETS: "alphabets",
  NUMBERS: "numbers",
  SPECIAL_CHARS: "specialchars",
  ALPHA_NUMERIC: "alphanumeric",
};

let interval = null;

export const TextGlitchEffect = ({
  text,
  speed = 30,
  letterCase = "uppercase",
  className,
  type = "alphabets",
}) => {
  const textElementRef = useRef(null);

  const startGlitchEffect = (event) => {
    let iteration = 0;

    clearInterval(interval);

    interval = setInterval(() => {
      event.target.innerText = event.target.innerText
        .split("")
        .map((alphabet, index) => {
          if (index < iteration) {
            return event.target.dataset.value[index];
          }

          let letters = LETTERS;

          // Assigning the letters string based on the type
          switch (type) {
            case TYPES.ALPHABETS:
              letters = LETTERS;
              break;
            case TYPES.NUMBERS:
              letters = NUMBERS;
              break;
            case TYPES.SPECIAL_CHARS:
              letters = SPECIAL_CHARS;
              break;
            case TYPES.ALPHA_NUMERIC:
              letters = LETTERS + NUMBERS;
              break;
          }

          const individualLetter =
            letters[Math.floor(Math.random() * letters.length)];

          return letterCase === "uppercase"
            ? individualLetter.toUpperCase()
            : individualLetter.toLowerCase();

          //Build will fail because of the unused variable
          return alphabet;
        })
        .join("");

      if (iteration >= event.target.dataset.value.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, speed);
  };

  useEffect(() => {
    if (textElementRef.current) {
      startGlitchEffect({ target: textElementRef.current });
    }
  }, [text]);
  useEffect(() => {
    if (textElementRef.current) {
      startGlitchEffect({ target: textElementRef.current });
    }
  }, []);

  return (
    <div
      ref={textElementRef}
      data-value={text}
      className={className}
      style={{
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {text}
    </div>
  );
};
