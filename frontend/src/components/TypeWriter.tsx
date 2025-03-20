import React, { useState, useEffect, useRef } from 'react';

interface TypeWriterProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  className?: string;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  text = 'This is a typing animation.',
  speed = 100,
  delay = 500,
  loop = false,
  cursor = true,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(speed);
  const textArray = Array.isArray(text) ? text : [text];
  const currentTextIndex = useRef(0);

  useEffect(() => {
    let timer;

    const type = () => {
      const currentText = textArray[currentTextIndex.current];

      if (!isDeleting) {
        setDisplayText((current) =>
          currentText.substring(0, current.length + 1)
        );

        // If we've typed the full text
        if (displayText === currentText) {
          // If loop enabled, prepare to delete after delay
          if (loop) {
            setIsDeleting(true);
            setTypingSpeed(delay);
          }
        }
      } else {
        // Deleting
        setDisplayText((current) =>
          currentText.substring(0, current.length - 1)
        );

        // If we've deleted everything
        if (displayText === '') {
          setIsDeleting(false);
          setTypingSpeed(speed);

          // Move to next text in array
          currentTextIndex.current =
            (currentTextIndex.current + 1) % textArray.length;

          // Increment loop count if we've gone through all texts
          if (currentTextIndex.current === 0) {
            setLoopCount((count) => count + 1);
          }
        }
      }
    };

    timer = setTimeout(type, typingSpeed);

    return () => clearTimeout(timer);
  }, [
    displayText,
    isDeleting,
    loop,
    loopCount,
    speed,
    delay,
    textArray,
    typingSpeed,
  ]);

  return (
    <span className={className}>
      {displayText}
      {cursor && <span className="typing-cursor">|</span>}
    </span>
  );
};

export default TypeWriter;
