import Confetti from "react-confetti";
import { motion } from "framer-motion";
import {useState, useEffect} from 'react'

export const CountdownTimer = () => {
  const targetDate = '2026-01-30T23:59:59';
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
        const days= Math.floor(difference / (1000 * 60 * 60 * 24))
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24) + days * 24,
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      if (Object.keys(newTime).length === 0) {
        setShowConfetti(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTimer = () => {
    const {  hours = 0, minutes = 0, seconds = 0 } = timeLeft;
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }
      `}</style>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      <motion.div
        style={{
          position: 'fixed',
          bottom: isMobile ? '15px' : '40px',
//           left: '0',
          transform: 'translateX(-50%)',
//           width: isMobile ? 'calc(100% - 10px)' : 'fit-content',
          maxWidth: isMobile ? 'calc(100vw - 30px)' : 'none',
          height: 'auto',
          backgroundColor: '#FFE082',
          border: '3px solid #7B1113',
          borderRadius: '20px',
          padding: isMobile ? '10px 10px' : '18px 30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50

        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >

        {Object.keys(timeLeft).length ? (
          <span style={{
            fontSize: isMobile ? 'clamp(18px, 5vw, 24px)' : '36px',
            fontWeight: 'bold',
            color: '#B22222',
            fontFamily: 'monospace',
            letterSpacing: isMobile ? '0.5px' : '1.5px',
            animation: 'blink 1s infinite',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
            padding: 0
          }}>
            {formatTimer()}
          </span>
        ) : (
          <span style={{
            fontSize: isMobile ? 'clamp(12px, 4vw, 14px)' : '18px',
            fontWeight: 'bold',
            color: '#B22222',
            textAlign: 'center',
            animation: 'blink 1s infinite',
            lineHeight: '1.2',
            margin: 0,
            padding: 0
          }}>
            🎉 Campaign Successfully Completed !!
            <br />
            Haribol! 🎉
          </span>
        )}
      </motion.div>
    </>
  );
};
