import { useEffect, useState } from "react";

export default function LabelPrinter() {
  const [isConnected, setIsConnected] = useState(false);

  const connectQZ = async () => {
    try {
      if (!window.qz) throw new Error("QZ Tray not loaded");
      await window.qz.websocket.connect();
      setIsConnected(true);
    } catch (err) {
      console.error("QZ Connection Error:", err);
    }
  };

  const printLabel = async () => {
    try {
      const printer = await window.qz.printers.find(); // Default printer
      const config = window.qz.configs.create(printer);
      const data = [
        "\x1B\x40", // Reset
        "Label: Hello World\n",
        "\x1D\x56\x41", // Full cut
      ];
      await window.qz.print(config, data);
    } catch (err) {
      console.error("Print Error:", err);
    }
  };

  useEffect(() => {
    connectQZ();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">XPrinter Label Printer</h2>
      <button
        onClick={printLabel}
        className="bg-blue-600 text-white py-2 px-4 rounded"
        disabled={!isConnected}
      >
        Print Label
      </button>
      {!isConnected && (
        <p className="text-red-600 mt-2">Connect QZ Tray to enable printing</p>
      )}
    </div>
  );
}
