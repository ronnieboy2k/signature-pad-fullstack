import { useEffect, useRef, useState } from "react";
import { createSignature } from "../api/signatures";

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
  const [message, setMessage] = useState("");
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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!signaturePadRef.current) {
      return;
    }

    const signature = signaturePadRef.current.toDataURL();

    if (!signature) {
      setMessage("Please provide a signature.");
      return;
    }

    try {
      setMessage("Submitting...");

      await createSignature(name, signature);

      setMessage("Signature submitted successfully.");

      setName("");
      signaturePadRef.current.clear();
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit signature.");
    }
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
      <button type="submit"> Submit </button> {message && <p>{message}</p>}
    </form>
  );
}
export default SignatureForm;
