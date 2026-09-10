import { useEffect, useRef, useState } from "react";

declare function signaturePad(
  canvas: string | HTMLCanvasElement,
  clearBtn?: string | HTMLElement | null,
  saveBtn?: string | HTMLElement | null,
): {
  set_empty: (value: boolean) => void;
  is_empty: () => boolean;
  toDataURL: () => string;
  save: () => string;
  clear: () => void;
  send: () => string;
  resize: () => void;
};

function SignatureForm() {
  const [name, setName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<ReturnType<typeof signaturePad> | null>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    signaturePadRef.current = signaturePad(canvasRef.current);
    return () => {
      signaturePadRef.current = null;
    };
  }, []);
  const handleClear = () => {
    signaturePadRef.current?.clear();
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signaturePadRef.current) {
      return;
    }
    const signature = signaturePadRef.current.toDataURL();
    console.log("Name:", name);
    console.log("Signature:", signature);
  };
  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <div>
        {" "}
        <label htmlFor="name">Name</label>{" "}
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />{" "}
      </div>{" "}
      <div>
        {" "}
        <label htmlFor="signature">Signature</label>{" "}
        <canvas
          ref={canvasRef}
          id="signature"
          width={600}
          height={304}
        ></canvas>{" "}
      </div>{" "}
      <button type="button" onClick={handleClear}>
        {" "}
        Clear{" "}
      </button>{" "}
      <button type="submit"> Submit </button>{" "}
    </form>
  );
}
export default SignatureForm;
