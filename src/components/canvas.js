import React, { useState, useRef, useEffect, Fragment } from "react";

import "./canvas.css";

const Canvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [shapes, setShapes] = useState([]);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setStartX(offsetX);
    setStartY(offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    addShape();
  };

  const addShape = () => {
    if (!selectedShape) return;

    const shape = {
      type: selectedShape,
      startX,
      startY,
      endX,
      endY,
    };
    setShapes((prevShapes) => [...prevShapes, shape]);
  };

  const drawShapes = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    shapes.forEach((shape) => {
      const { type, startX, startY, endX, endY } = shape;
      if (type === "circle") {
        const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        contextRef.current.beginPath();
        contextRef.current.arc(startX, startY, radius, 0, 2 * Math.PI);
        contextRef.current.stroke();
      } else if (type === "rectangle") {
        contextRef.current.beginPath();
        contextRef.current.rect(startX, startY, endX - startX, endY - startY);
        contextRef.current.stroke();
      } else if (type === "triangle") {
        contextRef.current.beginPath();
        contextRef.current.moveTo(startX, startY);
        contextRef.current.lineTo(startX, endY);
        contextRef.current.lineTo(endX, endY);
        contextRef.current.closePath();
        contextRef.current.stroke();
      }
    });

    // Draw the temporary shape being currently drawn
    if (selectedShape) {
      const tempShape = {
        type: selectedShape,
        startX,
        startY,
        endX,
        endY,
      };
      drawShape(tempShape);
    }
  };

  const drawShape = (shape) => {
    const { type, startX, startY, endX, endY } = shape;
    if (type === "circle") {
      const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      contextRef.current.beginPath();
      contextRef.current.arc(startX, startY, radius, 0, 2 * Math.PI);
      contextRef.current.stroke();
    } else if (type === "rectangle") {
      contextRef.current.beginPath();
      contextRef.current.rect(startX, startY, endX - startX, endY - startY);
      contextRef.current.stroke();
    } else if (type === "triangle") {
      contextRef.current.beginPath();
      contextRef.current.moveTo(startX, startY);
      contextRef.current.lineTo(startX, endY);
      contextRef.current.lineTo(endX, endY);
      contextRef.current.closePath();
      contextRef.current.stroke();
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    setEndX(offsetX);
    setEndY(offsetY);
    drawShapes();
  };

  const selectShape = (shape) => {
    setSelectedShape(shape);
    // setShapes([]);
  };

  useEffect(() => {
    drawShapes();
  }, [shapes]);

  return (
    <Fragment>
      <div className="menu-bar">
        <h2>Add Shapes</h2>
        <div className="shapes">
          <button onClick={() => selectShape("circle")}>Circle</button>
          <button onClick={() => selectShape("rectangle")}>Rectangle</button>
          <button onClick={() => selectShape("triangle")}>Triangle</button>
        </div>
        <h2>Images</h2>
      </div>
      <div className="draw-area">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
        />
      </div>
    </Fragment>
  );
};

export default Canvas;
