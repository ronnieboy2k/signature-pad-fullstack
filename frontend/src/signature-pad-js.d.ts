export interface SignaturePad {
  set_empty(value: boolean): void;
  is_empty(): boolean;
  toDataURL(): string;
  save(): string;
  clear(): void;
  send(): string;
  resize(): void;
}

declare const signaturePad: (
  canvas: string | HTMLCanvasElement,
  clearBtn?: string | HTMLElement | null,
  saveBtn?: string | HTMLElement | null,
) => SignaturePad;

export default signaturePad;