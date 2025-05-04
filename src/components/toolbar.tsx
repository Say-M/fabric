import { Canvas, FabricText, Rect, Circle as FabricCircle } from "fabric";
import { Button } from "./ui/button";
import { Barcode, Circle, QrCode, Square, Type } from "lucide-react";

export default function Toolbar({ canvas }: { canvas?: Canvas }) {
  const addRectangle = () => {
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: "#d9d9d9",
    });
    canvas?.add(rect);
  };
  const addCircle = () => {
    const circle = new FabricCircle({
      left: 100,
      top: 100,
      radius: 50,
      fill: "#d9d9d9",
    });
    canvas?.add(circle);
  };
  const addText = () => {
    const text = new FabricText("Text", {
      left: 100,
      top: 100,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#000000",
    });
    canvas?.add(text);
  };
  return (
    <div className="flex gap-2 absolute top-4 left-4 border px-4 py-1 rounded-md z-40 bg-background">
      <Button variant="ghost" size="icon" onClick={addRectangle}>
        <Square />
      </Button>
      <Button variant="ghost" size="icon" onClick={addCircle}>
        <Circle />
      </Button>
      <Button variant="ghost" size="icon" onClick={addText}>
        <Type />
      </Button>
      <Button variant="ghost" size="icon">
        <QrCode />
      </Button>
      <Button variant="ghost" size="icon">
        <Barcode />
      </Button>
    </div>
  );
}
