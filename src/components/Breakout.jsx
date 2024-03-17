import { useEffect, useState } from 'react';

const Breakout = () => {
  const blockWidth = 100;
  const blockHeight = 20;
  const boardWidth = 560;
  const boardHeight = 300;

  const ballDiameter = 20;

  const [xDirection, setXDirection] = useState(-2);
  const [yDirection, setYDirection] = useState(2);
  const [ballSpeed, setBallSpeed] = useState(1);

  const useStart = [230, 10];
  const [currentPosition, setCurrentPosition] = useState([...useStart]);

  const ballStart = [270, 40];
  const [ballCurrentPosition, setBallCurrentPosition] = useState([
    ...ballStart,
  ]);

  const [score, setScore] = useState(0);

  // my block

  const block = (xAxis, yAxis) => {
    return {
      bottomLeft: [xAxis, yAxis],
      bottomRight: [xAxis + blockWidth, yAxis],
      topLeft: [xAxis, yAxis + blockHeight],
      topRight: [xAxis + blockWidth, yAxis + blockHeight],
    };
  };

  const numRows = 3;
  const numBlocksInRow = 5;

  const blocks = Array(numRows)
    .fill()
    .map((_, rowIndex) => {
      return Array(numBlocksInRow)
        .fill()
        .map((_, blockInRowIndex) => {
          const xAxis = 10 + blockInRowIndex * (blockWidth + 10);
          const yAxis = 270 - rowIndex * (blockHeight + 10);
          return block(xAxis, yAxis);
        });
    })
    .flat();

  const [updatedBlocks, setUpdatedBlocks] = useState(blocks);

  // move user

  const moveUser = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (currentPosition[0] > 0) {
          setCurrentPosition([currentPosition[0] - 10, currentPosition[1]]);
        }
        break;
      case 'ArrowRight':
        if (currentPosition[0] < boardWidth - blockWidth) {
          setCurrentPosition([currentPosition[0] + 10, currentPosition[1]]);
        }
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', moveUser);

    return () => {
      document.removeEventListener('keydown', moveUser);
    };
  }, [currentPosition]);

  // check for block collision
  const checkForBlockCollision = () => {
    const newBlocks = updatedBlocks.filter((block, index) => {
      if (
        ballCurrentPosition[0] >= block.bottomLeft[0] &&
        ballCurrentPosition[0] <= block.bottomRight[0] &&
        ballCurrentPosition[1] + ballDiameter >= block.bottomLeft[1] &&
        ballCurrentPosition[1] <= block.topLeft[1]
      ) {
        changeDirection();
        setScore((prevScore) => prevScore + 1);
        return false;
      }
      return true;
    });
    setUpdatedBlocks(newBlocks);
  };

  // move ball and check for user and wall collision

  useEffect(() => {
    const interval = setInterval(() => {
      setBallCurrentPosition((prevPosition) => [
        prevPosition[0] + xDirection,
        prevPosition[1] + yDirection,
      ]);

      checkForBlockCollision(interval);
    }, 50 / ballSpeed);

    // check for wall collision
    if (
      ballCurrentPosition[0] > boardWidth - ballDiameter ||
      ballCurrentPosition[0] < 0 ||
      ballCurrentPosition[1] > boardHeight - ballDiameter
    ) {
      if (ballCurrentPosition[0] > boardWidth - ballDiameter) {
        setXDirection(-2);
      }
      if (ballCurrentPosition[0] < 0) {
        setXDirection(2);
      }
      if (ballCurrentPosition[1] > boardHeight - ballDiameter) {
        setYDirection(-2);
      }
    }

    // check for user collision
    if (
      ballCurrentPosition[0] > currentPosition[0] &&
      ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
      ballCurrentPosition[1] > currentPosition[1] &&
      ballCurrentPosition[1] < currentPosition[1] + blockHeight
    ) {
      setYDirection(2);
    }

    // win

    if (updatedBlocks.length === 0) {
      setScore('You win!');
      clearInterval(interval);
      document.removeEventListener('keydown', moveUser);
    }

    // game over
    if (ballCurrentPosition[1] <= 0) {
      clearInterval(interval);
      setScore('You lose!');
      document.removeEventListener('keydown', moveUser);
    }

    return () => {
      clearInterval(interval);
    };
  }, [ballCurrentPosition]);

  const changeDirection = () => {
    if (xDirection == 2 && yDirection === 2) {
      setYDirection(-2);
    }

    if (xDirection === 2 && yDirection === -2) {
      setXDirection(-2);
    }

    if (xDirection === -2 && yDirection === -2) {
      setYDirection(2);
    }

    if (xDirection === -2 && yDirection === 2) {
      setXDirection(2);
    }
  };

  return (
    // Game container
    <div className="p-4">
      {/* score */}
      <h1 className="font-semibold text-3xl">
        {score === 'You win!' || score === 'You lose!'
          ? score
          : 'Score: ' + score}
      </h1>
      <div className="flex items-center space-x-4">
        <h2 className="text-xl">
          Ball Speed :{' '}
          <button
            className="px-2 py-0 mr-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={() => setBallSpeed(Math.max(1, ballSpeed - 1))}
          >
            -
          </button>
          {ballSpeed}{' '}
          <button
            className="px-2 py-0 ml-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={() => setBallSpeed(Math.min(10, ballSpeed + 1))}
          >
            +
          </button>
        </h2>
      </div>

      {/* grid */}
      <div
        style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}
        className="absolute border border border-black mt-[60px]"
      >
        {/* user */}
        <div
          style={{
            left: `${currentPosition[0]}px`,
            bottom: `${currentPosition[1]}px`,
          }}
          className={`absolute w-[100px] h-[20px] bg-violet-500`}
        ></div>
        {/* ball */}
        <div
          style={{
            left: `${ballCurrentPosition[0]}px`,
            bottom: `${ballCurrentPosition[1]}px`,
            width: `${ballDiameter}px`,
            height: `${ballDiameter}px`,
          }}
          className={`absolute bg-red-500 rounded-full`}
        ></div>
        {/* blocks */}
        {updatedBlocks.map((block, index) => (
          <div
            key={index}
            style={{
              left: `${block.bottomLeft[0]}px`,
              bottom: `${block.bottomLeft[1]}px`,
            }}
            className={`absolute w-[100px] h-[20px] bg-blue-500`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Breakout;
