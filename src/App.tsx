import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { prominent } from 'color.js';
import './App.css';

function App() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [dominantColor, setDominantColor] = useState<string | null>(null);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;
      setImgSrc(imageSrc);
      
      try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const imageURL = URL.createObjectURL(blob);
        const color = await prominent(imageURL, { amount: 1 }) as number[];
        setDominantColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch (error) {
        console.error("Erro ao extrair cor predominante:", error);
      }
    }
  }, [webcamRef]);

  return (
    <div className="app-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="webcam-view"
      />
      <button onClick={capture} className="capture-button">Capturar Imagem</button>
      {imgSrc && <img src={imgSrc} alt="Captura" className="captured-image" />}
      {dominantColor && (
        <div className="color-display" style={{ backgroundColor: dominantColor }}>
          Cor predominante: {dominantColor}
        </div>
      )}
    </div>
  );
}

export default App;
