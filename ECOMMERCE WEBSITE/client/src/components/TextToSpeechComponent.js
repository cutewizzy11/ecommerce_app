import React, { useEffect, useRef } from 'react';

const TextToSpeechComponent = ({ speakFn }) => {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const speak = () => {
      try {
        const text = speakFn();
        console.log('Text to Speak:', text);  // Add this line
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          // Optional: Do something after speech ends
        };
        if (isMounted.current) {
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        console.error('Error in speak function:', error);  // Add this line
      }
    };
  
    speak();
  }, [speakFn]);  

  return null;
};

export default TextToSpeechComponent;
