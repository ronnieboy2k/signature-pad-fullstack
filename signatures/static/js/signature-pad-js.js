/**
 * Lightweight vanilla JavaScript signature pad.
 *
 * @param {string|HTMLCanvasElement} canvas
 * @param {string|HTMLElement|null} clearBtn
 * @param {string|HTMLElement|null} saveBtn
 * @returns {Object}
 */
function signaturePad(canvas, clearBtn = null, saveBtn = null) {
  const canvasElement =
    typeof canvas === "string" ? document.getElementById(canvas) : canvas;

  if (!(canvasElement instanceof HTMLCanvasElement)) {
    throw new TypeError("signaturePad requires a valid HTMLCanvasElement.");
  }

  const context = canvasElement.getContext("2d");

  if (!context) {
    throw new Error("Failed to get canvas 2d context.");
  }

  let empty = true;
  let drawing = false;

  let lastPoint = null;

  /*
   * Configure canvas size and drawing settings.
   */
  function resizeCanvas() {
    const rect = canvasElement.getBoundingClientRect();

    let width = Math.round(rect.width);
    let height = Math.round(rect.height);

    if (width <= 0) {
      width = canvasElement.clientWidth;
    }

    if (height <= 0) {
      height = canvasElement.clientHeight;
    }

    if (width <= 0 || height <= 0) {
      throw new Error("Canvas must have a width and height.");
    }

    const ratio = window.devicePixelRatio || 1;

    const displayWidth = Math.round(width * ratio);
    const displayHeight = Math.round(height * ratio);

    if (
      canvasElement.width !== displayWidth ||
      canvasElement.height !== displayHeight
    ) {
      canvasElement.width = displayWidth;
      canvasElement.height = displayHeight;
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    context.strokeStyle = "#444";
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
  }

  /*
   * Get pointer coordinates relative to canvas.
   */
  function getCoordinates(event) {
    const rect = canvasElement.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  /*
   * Get midpoint between two points.
   */
  function getMidpoint(point1, point2) {
    return {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
    };
  }

  /*
   * Start drawing.
   */
  function startDrawing(event) {
    event.preventDefault();

    drawing = true;
    empty = false;

    const point = getCoordinates(event);

    lastPoint = point;

    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  /*
   * Continue drawing using a quadratic Bézier curve.
   *
   * The previous pointer position becomes the control point,
   * while the midpoint between the previous and current points
   * becomes the curve endpoint.
   */
  function draw(event) {
    if (!drawing || !lastPoint) {
      return;
    }

    event.preventDefault();

    const point = getCoordinates(event);
    const midpoint = getMidpoint(lastPoint, point);

    context.quadraticCurveTo(lastPoint.x, lastPoint.y, midpoint.x, midpoint.y);

    context.stroke();

    context.beginPath();
    context.moveTo(midpoint.x, midpoint.y);

    lastPoint = point;
  }

  /*
   * Stop drawing.
   */
  function stopDrawing(event) {
    if (!drawing) {
      return;
    }

    event.preventDefault();

    /*
     * Finish the final segment so the stroke reaches
     * the last pointer position.
     */
    if (lastPoint) {
      context.lineTo(lastPoint.x, lastPoint.y);
      context.stroke();
    }

    drawing = false;
    lastPoint = null;

    context.closePath();
  }

  /*
   * Clear the signature.
   */
  function clear() {
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);

    empty = true;
    drawing = false;
    lastPoint = null;
  }

  /*
   * Get signature as Base64 PNG.
   */
  function toDataURL() {
    if (empty) {
      return "";
    }

    return canvasElement.toDataURL("image/png");
  }

  /*
   * Resolve optional button element.
   */
  function resolveElement(element) {
    if (!element) {
      return null;
    }

    if (typeof element === "string") {
      return document.getElementById(element);
    }

    return element;
  }

  /*
   * Setup optional Clear button.
   */
  const clearButton = resolveElement(clearBtn);

  if (clearButton) {
    clearButton.addEventListener("click", clear);
  }

  /*
   * Setup optional Save button.
   */
  const saveButton = resolveElement(saveBtn);

  if (saveButton) {
    saveButton.addEventListener("click", function () {
      const data = toDataURL();

      console.log(data);
    });
  }

  /*
   * Pointer Events support:
   * mouse, touch, and pen/stylus.
   */
  canvasElement.addEventListener("pointerdown", startDrawing);

  canvasElement.addEventListener("pointermove", draw);

  canvasElement.addEventListener("pointerup", stopDrawing);

  canvasElement.addEventListener("pointercancel", stopDrawing);

  canvasElement.addEventListener("pointerleave", stopDrawing);

  /*
   * Prevent browser scrolling while drawing.
   */
  canvasElement.style.touchAction = "none";

  /*
   * Initialize canvas.
   */
  resizeCanvas();

  /*
   * Public API.
   */
  return {
    set_empty: function (value) {
      empty = Boolean(value);
    },

    is_empty: function () {
      return empty;
    },

    toDataURL: function () {
      return toDataURL();
    },

    save: function () {
      return toDataURL();
    },

    clear: function () {
      clear();
    },

    send: function () {
      return toDataURL();
    },

    resize: function () {
      resizeCanvas();
    },
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = signaturePad;
}
