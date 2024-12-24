import { useState, useEffect } from 'react';

export default function Chrono() {
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false); // To track if chrono is running
  const [isWorkTime, setIsWorkTime] = useState(true); // Track whether it's work or break time
  const [isPomodoroActive, setIsPomodoroActive] = useState(false); // Track Pomodoro session
  const [workTime, setWorkTime] = useState(1); // Default work time (in minutes)
  const [breakTime, setBreakTime] = useState(1); // Default break time (in minutes)
  const [workSound, setWorkSound] = useState(null);
  const [breakSound, setBreakSound] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  // Load audio files in the client (browser-side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWorkSound(new Audio('/work-sound.mp3'));
      setBreakSound(new Audio('/break-sound.mp3'));
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = () => setIsRunning((prev) => !prev);
  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    setIsPomodoroActive(false);
    setIsWorkTime(true);
  };
  const handleReset = () => setTime(0);

  const formatTime = (time) => {
    const minutes = Math.floor((time / 1000) / 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  const startPomodoro = async () => {
    // Send request to start Pomodoro session
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'work', duration: workTime }), // Use dynamic work time
    });
    const session = await response.json();
    console.log('Pomodoro started:', session);
    setIsPomodoroActive(true);
    setIsWorkTime(true); // Start with work time
    setTime(0); // Reset timer
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isPomodoroActive || !workSound || !breakSound) return;

    // Check if work session has ended (dynamic work time)
    if (isWorkTime && time >= workTime * 60 * 1000) {
      workSound.play(); // Play work sound
      setIsWorkTime(false); // Switch to break time
      setTime(0); // Reset timer for break session
      // Start break for dynamic break time
    }
    
    // Check if break session has ended (dynamic break time)
    if (!isWorkTime && time >= breakTime * 60 * 1000) {
      breakSound.play(); // Play break sound
      setIsWorkTime(true); // Switch to work time
      setTime(0); // Reset timer for work session
    }
  }, [time, isWorkTime, isPomodoroActive, workSound, breakSound, workTime, breakTime]);

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Add a class to the body for global dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } 
  }, [isDarkMode]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Pomodoro Timer </h1>
      <div style={{ fontSize: '48px', margin: '20px 0' }}>{formatTime(time)}</div>
      <div>
        {!isPomodoroActive ? (
          <button onClick={startPomodoro} style={{ margin: '0 5px', padding: '10px 20px' }}>
            Start Pomodoro
          </button>
        ) : (
          <button onClick={handleStartPause} style={{ margin: '0 5px', padding: '10px 20px' }}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
        )}
        <button onClick={handleStop} style={{ margin: '0 5px', padding: '10px 20px' }}>Stop</button>
        <button onClick={handleReset} style={{ margin: '0 5px', padding: '10px 20px' }}>Reset</button>
      </div>

      {/* Sliders for adjusting work time and break time */}
      <div style={{ marginTop: '30px' }}>
        <div>
          <label>Work Time: {workTime} min</label>
          <input
            type="range"
            min="1"
            max="60"
            value={workTime}
            onChange={(e) => setWorkTime(Number(e.target.value))}
            style={{ margin: '10px 0' }}
          />
        </div>

        <div>
          <label>Break Time: {breakTime} min</label>
          <input
            type="range"
            min="1"
            max="15"
            value={breakTime}
            onChange={(e) => setBreakTime(Number(e.target.value))}
            style={{ margin: '10px 0' }}
          />
        </div>
      </div>

      {/* Dark mode toggle */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={toggleDarkMode} style={{ padding: '10px 20px' }}>
          {isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
        </button>
      </div>
    </div>
  );
}










// import { useState, useEffect } from 'react';

// export default function Chrono() {
//   const [time, setTime] = useState(0); // Time in milliseconds
//   const [isRunning, setIsRunning] = useState(false); // To track if chrono is running
//   const [isWorkTime, setIsWorkTime] = useState(true); // Track whether it's work or break time
//   const [isPomodoroActive, setIsPomodoroActive] = useState(false); // Track Pomodoro session
//   const [workTime, setWorkTime] = useState(1); // Default work time (in minutes)
//   const [breakTime, setBreakTime] = useState(1); // Default break time (in minutes)
//   const [workSound, setWorkSound] = useState(null);
//   const [breakSound, setBreakSound] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

//   // Load audio files in the client (browser-side)
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setWorkSound(new Audio('/work-sound.mp3'));
//       setBreakSound(new Audio('/break-sound.mp3'));
//     }
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (isRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 10);
//       }, 10);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning]);

//   const handleStartPause = () => setIsRunning((prev) => !prev);
//   const handleStop = () => {
//     setIsRunning(false);
//     setTime(0);
//     setIsPomodoroActive(false);
//     setIsWorkTime(true);
//   };
//   const handleReset = () => setTime(0);

//   const formatTime = (time) => {
//     const minutes = Math.floor((time / 1000) / 60);
//     const seconds = Math.floor((time / 1000) % 60);
//     const milliseconds = Math.floor((time % 1000) / 10);
//     return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
//   };

//   const startPomodoro = async () => {
//     // Send request to start Pomodoro session
//     const response = await fetch('/api/sessions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ type: 'work', duration: workTime }), // Use dynamic work time
//     });
//     const session = await response.json();
//     console.log('Pomodoro started:', session);
//     setIsPomodoroActive(true);
//     setIsWorkTime(true); // Start with work time
//     setTime(0); // Reset timer
//     setIsRunning(true);
//   };

//   useEffect(() => {
//     if (!isPomodoroActive || !workSound || !breakSound) return;

//     // Check if work session has ended (dynamic work time)
//     if (isWorkTime && time >= workTime * 60 * 1000) {
//       workSound.play(); // Play work sound
//       setIsWorkTime(false); // Switch to break time
//       setTime(0); // Reset timer for break session
//       // Start break for dynamic break time
//     }
    
//     // Check if break session has ended (dynamic break time)
//     if (!isWorkTime && time >= breakTime * 60 * 1000) {
//       breakSound.play(); // Play break sound
//       setIsWorkTime(true); // Switch to work time
//       setTime(0); // Reset timer for work session
//     }
//   }, [time, isWorkTime, isPomodoroActive, workSound, breakSound, workTime, breakTime]);

//   // Toggle dark mode
//   const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

//   return (
//     <div className={isDarkMode ? 'dark-mode' : 'light-mode'} style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Chronometer</h1>
//       <div style={{ fontSize: '48px', margin: '20px 0' }}>{formatTime(time)}</div>
//       <div>
//         {!isPomodoroActive ? (
//           <button onClick={startPomodoro} style={{ margin: '0 5px', padding: '10px 20px' }}>
//             Start Pomodoro
//           </button>
//         ) : (
//           <button onClick={handleStartPause} style={{ margin: '0 5px', padding: '10px 20px' }}>
//             {isRunning ? 'Pause' : 'Start'}
//           </button>
//         )}
//         <button onClick={handleStop} style={{ margin: '0 5px', padding: '10px 20px' }}>Stop</button>
//         <button onClick={handleReset} style={{ margin: '0 5px', padding: '10px 20px' }}>Reset</button>
//       </div>

//       {/* Sliders for adjusting work time and break time */}
//       <div style={{ marginTop: '30px' }}>
//         <div>
//           <label>Work Time: {workTime} min</label>
//           <input
//             type="range"
//             min="1"
//             max="60"
//             value={workTime}
//             onChange={(e) => setWorkTime(Number(e.target.value))}
//             style={{ margin: '10px 0' }}
//           />
//         </div>

//         <div>
//           <label>Break Time: {breakTime} min</label>
//           <input
//             type="range"
//             min="1"
//             max="15"
//             value={breakTime}
//             onChange={(e) => setBreakTime(Number(e.target.value))}
//             style={{ margin: '10px 0' }}
//           />
//         </div>
//       </div>

//       {/* Dark mode toggle */}
//       <div style={{ marginTop: '20px' }}>
//         <button onClick={toggleDarkMode} style={{ padding: '10px 20px' }}>
//           Toggle Dark Mode
//         </button>
//       </div>
//     </div>
//   );
// }



// import { useState, useEffect } from 'react';

// export default function Chrono() {
//   const [time, setTime] = useState(0); // Time in milliseconds
//   const [isRunning, setIsRunning] = useState(false); // To track if chrono is running
//   const [isWorkTime, setIsWorkTime] = useState(true); // Track whether it's work or break time
//   const [isPomodoroActive, setIsPomodoroActive] = useState(false); // Track Pomodoro session
//   const [workTime, setWorkTime] = useState(1); // Default work time (in minutes)
//   const [breakTime, setBreakTime] = useState(1); // Default break time (in minutes)
//   const [workSound, setWorkSound] = useState(null);
//   const [breakSound, setBreakSound] = useState(null);

//   // Load audio files in the client (browser-side)
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setWorkSound(new Audio('/work-sound.mp3'));
//       setBreakSound(new Audio('/break-sound.mp3'));
//     }
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (isRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 10);
//       }, 10);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning]);

//   const handleStartPause = () => setIsRunning((prev) => !prev);
//   const handleStop = () => {
//     setIsRunning(false);
//     setTime(0);
//     setIsPomodoroActive(false);
//     setIsWorkTime(true);
//   };
//   const handleReset = () => setTime(0);

//   const formatTime = (time) => {
//     const minutes = Math.floor((time / 1000) / 60);
//     const seconds = Math.floor((time / 1000) % 60);
//     const milliseconds = Math.floor((time % 1000) / 10);
//     return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
//   };

//   const startPomodoro = async () => {
//     // Send request to start Pomodoro session
//     const response = await fetch('/api/sessions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ type: 'work', duration: workTime }), // Use dynamic work time
//     });
//     const session = await response.json();
//     console.log('Pomodoro started:', session);
//     setIsPomodoroActive(true);
//     setIsWorkTime(true); // Start with work time
//     setTime(0); // Reset timer
//     setIsRunning(true);
//   };

//   useEffect(() => {
//     if (!isPomodoroActive || !workSound || !breakSound) return;

//     // Check if work session has ended (dynamic work time)
//     if (isWorkTime && time >= workTime * 60 * 1000) {
//       workSound.play(); // Play work sound
//       setIsWorkTime(false); // Switch to break time
//       setTime(0); // Reset timer for break session
//       // Start break for dynamic break time
//     }
    
//     // Check if break session has ended (dynamic break time)
//     if (!isWorkTime && time >= breakTime * 60 * 1000) {
//       breakSound.play(); // Play break sound
//       setIsWorkTime(true); // Switch to work time
//       setTime(0); // Reset timer for work session
//     }
//   }, [time, isWorkTime, isPomodoroActive, workSound, breakSound, workTime, breakTime]);

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Chronometer</h1>
//       <div style={{ fontSize: '48px', margin: '20px 0' }}>{formatTime(time)}</div>
//       <div>
//         {!isPomodoroActive ? (
//           <button onClick={startPomodoro} style={{ margin: '0 5px', padding: '10px 20px' }}>
//             Start Pomodoro
//           </button>
//         ) : (
//           <button onClick={handleStartPause} style={{ margin: '0 5px', padding: '10px 20px' }}>
//             {isRunning ? 'Pause' : 'Start'}
//           </button>
//         )}
//         <button onClick={handleStop} style={{ margin: '0 5px', padding: '10px 20px' }}>Stop</button>
//         <button onClick={handleReset} style={{ margin: '0 5px', padding: '10px 20px' }}>Reset</button>
//       </div>

//       {/* Sliders for adjusting work time and break time */}
//       <div style={{ marginTop: '30px' }}>
//         <div>
//           <label>Work Time: {workTime} min</label>
//           <input
//             type="range"
//             min="1"
//             max="60"
//             value={workTime}
//             onChange={(e) => setWorkTime(Number(e.target.value))}
//             style={{ margin: '10px 0' }}
//           />
//         </div>

//         <div>
//           <label>Break Time: {breakTime} min</label>
//           <input
//             type="range"
//             min="1"
//             max="15"
//             value={breakTime}
//             onChange={(e) => setBreakTime(Number(e.target.value))}
//             style={{ margin: '10px 0' }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }










// import { useState, useEffect } from 'react';

// export default function Chrono() {
//   const [time, setTime] = useState(0); // Time in milliseconds
//   const [isRunning, setIsRunning] = useState(false); // To track if chrono is running
//   const [isWorkTime, setIsWorkTime] = useState(true); // Track whether it's work or break time
//   const [isPomodoroActive, setIsPomodoroActive] = useState(false); // Track Pomodoro session
//   const [workSound, setWorkSound] = useState(null);
//   const [breakSound, setBreakSound] = useState(null);

//   // Load audio files in the client (browser-side)
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setWorkSound(new Audio('/work-sound.mp3'));
//       setBreakSound(new Audio('/break-sound.mp3'));
//     }
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (isRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 10);
//       }, 10);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning]);

//   const handleStartPause = () => setIsRunning((prev) => !prev);
//   const handleStop = () => {
//     setIsRunning(false);
//     setTime(0);
//     setIsPomodoroActive(false);
//     setIsWorkTime(true);
//   };
//   const handleReset = () => setTime(0);

//   const formatTime = (time) => {
//     const minutes = Math.floor((time / 1000) / 60);
//     const seconds = Math.floor((time / 1000) % 60);
//     const milliseconds = Math.floor((time % 1000) / 10);
//     return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
//   };

//   const startPomodoro = async () => {
//     // Send request to start Pomodoro session
//     const response = await fetch('/api/sessions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ type: 'work', duration: 25 }), // 25 minutes work session
//     });
//     const session = await response.json();
//     console.log('Pomodoro started:', session);
//     setIsPomodoroActive(true);
//     setIsWorkTime(true); // Start with work time
//     setTime(0); // Reset timer
//     setIsRunning(true);
//   };

//   useEffect(() => {
//     if (!isPomodoroActive || !workSound || !breakSound) return;

//     // Check if work session has ended (25 minutes)
//     if (isWorkTime && time >= 1 * 60 * 1000) {
//       workSound.play(); // Play work sound
//       setIsWorkTime(false); // Switch to break time
//       setTime(0); // Reset timer for break session
//       // Start 5-minute break
//     }
    
//     // Check if break session has ended (5 minutes)
//     if (!isWorkTime && time >= 1 * 60 * 1000) {
//       breakSound.play(); // Play break sound
//       setIsWorkTime(true); // Switch to work time
//       setTime(0); // Reset timer for work session
//     }
//   }, [time, isWorkTime, isPomodoroActive, workSound, breakSound]);

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Chronometer</h1>
//       <div style={{ fontSize: '48px', margin: '20px 0' }}>{formatTime(time)}</div>
//       <div>
//         {!isPomodoroActive ? (
//           <button onClick={startPomodoro} style={{ margin: '0 5px', padding: '10px 20px' }}>
//             Start Pomodoro
//           </button>
//         ) : (
//           <button onClick={handleStartPause} style={{ margin: '0 5px', padding: '10px 20px' }}>
//             {isRunning ? 'Pause' : 'Start'}
//           </button>
//         )}
//         <button onClick={handleStop} style={{ margin: '0 5px', padding: '10px 20px' }}>Stop</button>
//         <button onClick={handleReset} style={{ margin: '0 5px', padding: '10px 20px' }}>Reset</button>
//       </div>
//     </div>
//   );
// }










// import { useState, useEffect } from 'react';

// export default function Chrono() {
//   const [time, setTime] = useState(0); // Time in milliseconds
//   const [isRunning, setIsRunning] = useState(false); // To track if chrono is running
//   const [isWorkTime, setIsWorkTime] = useState(true); // Track whether it's work or break time
//   const [isPomodoroActive, setIsPomodoroActive] = useState(false); // Track Pomodoro session

//   // Sound notifications
//   const workSound = new Audio('/work-sound.mp3');
//   const breakSound = new Audio('/break-sound.mp3');

//   useEffect(() => {
//     let interval;
//     if (isRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 10);
//       }, 10);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning]);

//   const handleStartPause = () => setIsRunning((prev) => !prev);
//   const handleStop = () => {
//     setIsRunning(false);
//     setTime(0);
//     setIsPomodoroActive(false);
//     setIsWorkTime(true);
//   };
//   const handleReset = () => setTime(0);

//   const formatTime = (time) => {
//     const minutes = Math.floor((time / 1000) / 60);
//     const seconds = Math.floor((time / 1000) % 60);
//     const milliseconds = Math.floor((time % 1000) / 10);
//     return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
//   };

//   const startPomodoro = async () => {
//     // Send request to start Pomodoro session
//     const response = await fetch('/api/sessions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ type: 'work', duration: 25 }), // 25 minutes work session
//     });
//     const session = await response.json();
//     console.log('Pomodoro started:', session);
//     setIsPomodoroActive(true);
//     setIsWorkTime(true); // Start with work time
//     setTime(0); // Reset timer
//     setIsRunning(true);
//   };

//   useEffect(() => {
//     if (!isPomodoroActive) return;

//     // Check if work session has ended (25 minutes)
//     if (isWorkTime && time >= 25 * 60 * 1000) {
//       workSound.play(); // Play work sound
//       setIsWorkTime(false); // Switch to break time
//       setTime(0); // Reset timer for break session
//       // Start 5-minute break
//     }
    
//     // Check if break session has ended (5 minutes)
//     if (!isWorkTime && time >= 5 * 60 * 1000) {
//       breakSound.play(); // Play break sound
//       setIsWorkTime(true); // Switch to work time
//       setTime(0); // Reset timer for work session
//     }
//   }, [time, isWorkTime, isPomodoroActive]);

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Chronometer</h1>
//       <div style={{ fontSize: '48px', margin: '20px 0' }}>{formatTime(time)}</div>
//       <div>
//         {!isPomodoroActive ? (
//           <button onClick={startPomodoro} style={{ margin: '0 5px', padding: '10px 20px' }}>
//             Start Pomodoro
//           </button>
//         ) : (
//           <button onClick={handleStartPause} style={{ margin: '0 5px', padding: '10px 20px' }}>
//             {isRunning ? 'Pause' : 'Start'}
//           </button>
//         )}
//         <button onClick={handleStop} style={{ margin: '0 5px', padding: '10px 20px' }}>Stop</button>
//         <button onClick={handleReset} style={{ margin: '0 5px', padding: '10px 20px' }}>Reset</button>
//       </div>
//     </div>
//   );
// }










// import { useState, useEffect } from 'react';

// export default function Chrono() {
//   const [time, setTime] = useState(0); // Time in milliseconds
//   const [isRunning, setIsRunning] = useState(false); // To track if chrono is running

//   useEffect(() => {
//     let interval;
//     if (isRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 10);
//       }, 10);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning]);

//   const handleStartPause = () => setIsRunning((prev) => !prev);
//   const handleStop = () => {
//     setIsRunning(false);
//     setTime(0);
//   };
//   const handleReset = () => setTime(0);

//   const formatTime = (time) => {
//     const hours = Math.floor(time / 3600000);
//     const minutes = Math.floor((time % 3600000) / 60000);
//     const seconds = Math.floor((time % 60000) / 1000);
//     const milliseconds = Math.floor((time % 1000) / 10);
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
//   };


//   const startPomodoro = async () => {
//     const response = await fetch('/api/sessions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ type: 'work', duration: 25 }),
//     });
//     const session = await response.json();
//     console.log('Pomodoro started:', session);
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Chronometer</h1>
//       <div style={{ fontSize: '48px', margin: '20px 0' }}>{formatTime(time)}</div>
//       <div>
//         <button onClick={handleStartPause} style={{ margin: '0 5px', padding: '10px 20px' }}>
//           {isRunning ? 'Pause' : 'Start'}
//         </button>
//         <button onClick={handleStop} style={{ margin: '0 5px', padding: '10px 20px' }}>Stop</button>
//         <button onClick={handleReset} style={{ margin: '0 5px', padding: '10px 20px' }}>Reset</button>
//       </div>
//     </div>
//   );
// }
