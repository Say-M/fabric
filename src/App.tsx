import { useRef, useEffect, useState } from "react";
import { Canvas } from "fabric";
import Toolbar from "./components/toolbar";
import SettingBar from "./components/setting-bar";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas>();

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        height: 500,
        width: 500,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);
  return (
    <div className="App">
      <div className="flex items-center justify-center h-screen w-screen relative bg-muted">
        <Toolbar canvas={canvas} />
        <div>
          <canvas id="canvas" ref={canvasRef} />
        </div>
        <SettingBar canvas={canvas} />
      </div>
    </div>
  );
}
