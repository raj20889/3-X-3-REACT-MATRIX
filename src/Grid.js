import React, { useState, useRef } from 'react';

function MatrixColorChange() {
  const [boxes, setBoxes] = useState(Array(9).fill('lightgray'));
  const [clickedIndices, setClickedIndices] = useState([]);
  const timeoutRefs = useRef([]);
  const [clicked, setClicked] = useState(Array(9).fill(false));
  const lastClickedIndexRef = useRef(null); // Tracks the very last clicked index

  const resetGame = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setBoxes(Array(9).fill('lightgray'));
    setClickedIndices([]);
    setClicked(Array(9).fill(false));
    lastClickedIndexRef.current = null;
    console.log('Game reset.');
  };

  const changeToOrange = () => {
    console.log('Changing to orange:', clickedIndices);

    // Turn all clicked boxes orange in sequence
    clickedIndices.forEach((index, sequenceIndex) => {
      const timeoutId = setTimeout(() => {
        setBoxes((prevBoxes) => {
          const newBoxes = [...prevBoxes];
          newBoxes[index] = 'orange';
          return newBoxes;
        });
      }, (sequenceIndex + 1) * 500);
      timeoutRefs.current.push(timeoutId);
    });

    // After all boxes are processed, ensure the last clicked box is orange
    const lastIndex = lastClickedIndexRef.current;
    if (lastIndex !== null) {
      const finalTimeoutId = setTimeout(() => {
        setBoxes((prevBoxes) => {
          const newBoxes = [...prevBoxes];
          newBoxes[lastIndex] = 'orange'; // Force last clicked box to orange
          return newBoxes;
        });
      }, (clickedIndices.length + 1) * 500);
      timeoutRefs.current.push(finalTimeoutId);
    }
  };

  const handleClick = (index) => {
    if (!clicked[index] && boxes[index] !== 'orange') {
      setBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes];
        newBoxes[index] = 'green';
        return newBoxes;
      });

      setClickedIndices((prevIndices) => {
        const newIndices = [...prevIndices, index];
        if (newIndices.length === 9) {
          setTimeout(changeToOrange, 500);
        }
        return newIndices;
      });

      setClicked((prevClicked) => {
        const newClicked = [...prevClicked];
        newClicked[index] = true;
        return newClicked;
      });

      lastClickedIndexRef.current = index; // Update last clicked index
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gridGap: '5px', margin: '20px auto', width: '315px' }}>
        {boxes.map((color, index) => (
          <div
            key={index}
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: color,
              border: '1px solid gray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background-color 0.2s ease',
            }}
            onClick={() => handleClick(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Reset
      </button>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Clicked Indices: {JSON.stringify(clickedIndices)}</p>
        <p>Boxes State: {JSON.stringify(boxes)}</p>
        <p>Last Clicked Index: {lastClickedIndexRef.current !== null ? lastClickedIndexRef.current+1 : 'None'}</p>
      </div>
    </div>
  );
}

export default MatrixColorChange;