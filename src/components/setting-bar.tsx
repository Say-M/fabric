import { Canvas, FabricObject } from "fabric";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

const types = {
  rect: "Rectangle",
  circle: "Circle",
  textbox: "Text",
};

export default function SettingBar({ canvas }: { canvas?: Canvas }) {
  const [dimensions, setDimensions] = useState({ height: 500, width: 500 });
  const [selectedObject, setSelectedObject] = useState<FabricObject>();
  const [text, setText] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [diameter, setDiameter] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (canvas) {
      canvas.setDimensions(dimensions);
      canvas.renderAll();
    }
  }, [dimensions, canvas]);

  const handleCanvasDimensionsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    setDimensions((prev) => ({ ...prev, [e.target.name]: value }));
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e) => {
        handleObjectSelection(e.selected?.[0]);
      });

      canvas.on("selection:updated", (e) => {
        handleObjectSelection(e.selected?.[0]);
      });

      canvas.on("selection:cleared", () => {
        setSelectedObject(undefined);
        clearSettings();
      });

      canvas.on("object:modified", (e) => {
        handleObjectSelection(e.target);
      });

      canvas.on("object:scaling", (e) => {
        handleObjectSelection(e.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (object?: FabricObject) => {
    if (!object) return;

    setSelectedObject(object);

    if (object.type === "rect") {
      setHeight(Math.round(object.height * object.scaleY)?.toString());
      setWidth(Math.round(object.width * object.scaleX)?.toString());
      setColor(object.fill as string);
    } else if (object.type === "circle") {
      // @ts-ignore
      setDiameter(Math.round(object.radius * 2 * object.scaleX)?.toString());
      setColor(object.fill as string);
      setHeight("");
      setWidth("");
    } else if (object.type === "textbox") {
      setText((object as any).text || "");
      setColor(object.fill as string);
      setHeight("");
      setWidth("");
      setDiameter("");
    }
  };

  const clearSettings = () => {
    setText("");
    setHeight("");
    setWidth("");
    setDiameter("");
    setColor("");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    if (selectedObject && selectedObject.type === "textbox") {
      (selectedObject as any).set("text", value);
      canvas?.renderAll();
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setWidth(value?.toString());
    if (selectedObject && selectedObject.type === "rect" && value >= 0) {
      selectedObject.set({
        width: value / selectedObject.scaleX,
      });
      canvas?.renderAll();
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setHeight(value?.toString());
    if (selectedObject && selectedObject.type === "rect" && value >= 0) {
      selectedObject.set({
        height: value / selectedObject.scaleY,
      });
      canvas?.renderAll();
    }
  };

  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDiameter(value?.toString());
    if (selectedObject && selectedObject.type === "circle" && value >= 0) {
      selectedObject.set({
        radius: value / 2 / selectedObject.scaleX,
      });
      canvas?.renderAll();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value);
    if (selectedObject) {
      selectedObject.set({
        fill: value,
      });
      canvas?.renderAll();
    }
  };

  return (
    <Card className="max-w-xs w-full fixed top-1/3 right-4 p-0">
      <CardContent className="p-4">
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            {!selectedObject ? (
              <>
                <h5 className="text-lg font-semibold mb-2">Canvas</h5>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span>H</span>
                    <Input
                      type="number"
                      name="height"
                      value={dimensions.height}
                      onChange={handleCanvasDimensionsChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>W</span>
                    <Input
                      type="number"
                      name="width"
                      value={dimensions.width}
                      onChange={handleCanvasDimensionsChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h5 className="text-lg font-semibold mb-2">
                  {types[selectedObject?.type as keyof typeof types]}
                </h5>
                {selectedObject?.type === "rect" && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span>H</span>
                      <Input
                        type="number"
                        value={height}
                        onChange={handleHeightChange}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span>W</span>
                      <Input
                        type="number"
                        value={width}
                        onChange={handleWidthChange}
                      />
                    </div>
                  </div>
                )}
                {selectedObject?.type === "circle" && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span>D</span>
                      <Input
                        type="number"
                        value={diameter}
                        onChange={handleDiameterChange}
                      />
                    </div>
                  </div>
                )}
                {selectedObject?.type === "textbox" && (
                  <div className="mb-4">
                    <span className="block text-sm font-medium mb-1">Text</span>
                    <Input
                      type="text"
                      value={text}
                      onChange={handleTextChange}
                    />
                  </div>
                )}

                <Input
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="p-0 border-0 h-10"
                />
              </>
            )}
          </TabsContent>
          <TabsContent value="styles">Change your styles here.</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
