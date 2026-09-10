import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignatureForm from "./SignatureForm";
import { createSignature } from "../api/signatures";
import signaturePad from "../signature-pad-js";
vi.mock("../api/signatures", () => ({ createSignature: vi.fn() }));
vi.mock("../signature-pad-js", () => ({ default: vi.fn() }));
describe("SignatureForm", () => {
  const mockClear = vi.fn();
  const mockToDataURL = vi.fn();
  const mockSignaturePad = vi.mocked(signaturePad);
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
  it("submits the entered name and signature to the API", async () => {
    const user = userEvent.setup();
    const signatureData = "data:image/png;base64,test-signature";
    mockToDataURL.mockReturnValue(signatureData);
    vi.mocked(createSignature).mockResolvedValue({ id: 1 });
    render(<SignatureForm />);
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);
    expect(createSignature).toHaveBeenCalledTimes(1);
    expect(createSignature).toHaveBeenCalledWith("John Doe", signatureData);
  });
  it("shows a success message after successful API submission", async () => {
    const user = userEvent.setup();
    const signatureData = "data:image/png;base64,test-signature";
    mockToDataURL.mockReturnValue(signatureData);
    vi.mocked(createSignature).mockResolvedValue({ id: 1 });
    render(<SignatureForm />);
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);
    expect(
      await screen.findByText("Signature submitted successfully."),
    ).toBeInTheDocument();
  });
  it("clears the name and signature after successful API submission", async () => {
    const user = userEvent.setup();
    const signatureData = "data:image/png;base64,test-signature";
    mockToDataURL.mockReturnValue(signatureData);
    vi.mocked(createSignature).mockResolvedValue({ id: 1 });
    render(<SignatureForm />);
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);
    await screen.findByText("Signature submitted successfully.");
    expect(nameInput).toHaveValue("");
    expect(mockClear).toHaveBeenCalledTimes(1);
  });
  it("shows an error message when API submission fails", async () => {
    const user = userEvent.setup();
    const signatureData = "data:image/png;base64,test-signature";
    mockToDataURL.mockReturnValue(signatureData);
    vi.mocked(createSignature).mockRejectedValue(
      new Error("Failed to create signature"),
    );
    render(<SignatureForm />);
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);
    expect(
      await screen.findByText("Failed to submit signature."),
    ).toBeInTheDocument();
  });
  it("does not call the API when there is no signature", async () => {
    const user = userEvent.setup();
    mockToDataURL.mockReturnValue("");
    render(<SignatureForm />);
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);
    expect(
      await screen.findByText("Please provide a signature."),
    ).toBeInTheDocument();
    expect(createSignature).not.toHaveBeenCalled();
  });
});
