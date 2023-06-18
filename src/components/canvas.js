import React, { useState, useRef, useEffect, Fragment } from "react";

import "./canvas.css";

const Canvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [layers, setLayers] = useState([]);
  const [images, setImages] = useState([]);

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

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        "https://api.slingacademy.com/v1/sample-data/photos"
      );
      const data = await response.json();
      setImages(data.photos);
    } catch (error) {
      console.log("Error fetching images:", error);
    }
  };

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
    setLayers((prevLayers) => [...prevLayers, shape]);
  };

  const drawLayers = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    layers.forEach((layer) => {
      if (layer.type === "image") {
        const { image, x, y, width, height } = layer;
        contextRef.current.drawImage(image, x, y, width, height);
      } else {
        drawShape(layer);
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
    drawLayers();
  };

  const selectShape = (shape) => {
    setSelectedShape(shape);
    // setLayers([]);
  };

  const loadSidebarImage = (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const layer = {
        type: "image",
        image: img,
        x: 0,
        y: 0,
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      };
      setLayers((prevLayers) => [...prevLayers, layer]);
    };
  };

  useEffect(() => {
    drawLayers();
  }, [layers]);

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
        <div className="images">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.title}
              onClick={() => loadSidebarImage(image.url)}
            />
          ))}
        </div>
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
