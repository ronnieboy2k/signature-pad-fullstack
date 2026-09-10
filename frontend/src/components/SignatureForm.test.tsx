import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignatureForm from "./SignatureForm";
describe("SignatureForm", () => {
  const mockClear = vi.fn();
  const mockToDataURL = vi.fn();
  const mockSignaturePad = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockSignaturePad.mockReturnValue({
      set_empty: vi.fn(),
      is_empty: vi.fn(),
      toDataURL: mockToDataURL,
      save: vi.fn(),
      clear: mockClear,
      send: vi.fn(),
      resize: vi.fn(),
    });
    vi.stubGlobal("signaturePad", mockSignaturePad);
  });
  it("initializes signature pad with the React canvas", () => {
    render(<SignatureForm />);
    const canvas = document.getElementById("signature");
    expect(canvas).not.toBeNull();
    expect(mockSignaturePad).toHaveBeenCalledTimes(1);
    expect(mockSignaturePad).toHaveBeenCalledWith(canvas);
  });
  it("clears the signature using the signature pad library", async () => {
    const user = userEvent.setup();
    render(<SignatureForm />);
    const clearButton = screen.getByRole("button", { name: "Clear" });
    await user.click(clearButton);
    expect(mockClear).toHaveBeenCalledTimes(1);
  });
  it("gets the signature data when submitting the form", async () => {
    const user = userEvent.setup();
    const signatureData = "data:image/png;base64,test-signature";
    mockToDataURL.mockReturnValue(signatureData);
    render(<SignatureForm />);
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);
    expect(mockToDataURL).toHaveBeenCalledTimes(1);
  });
  it("submits the form with the entered name", async () => {
    const user = userEvent.setup();
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const signatureData = "data:image/png;base64,test-signature";
    mockToDataURL.mockReturnValue(signatureData);
    render(<SignatureForm />);
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);
    expect(consoleLogSpy).toHaveBeenCalledWith("Name:", "John Doe");
    expect(consoleLogSpy).toHaveBeenCalledWith("Signature:", signatureData);
    consoleLogSpy.mockRestore();
  });
});
