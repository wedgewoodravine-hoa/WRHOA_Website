"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type PointerEvent,
} from "react";

export type SignaturePadHandle = {
  isEmpty: () => boolean;
  toBlob: () => Promise<Blob | null>;
  clear: () => void;
};

type Props = {
  label: string;
  required?: boolean;
};

export const SignaturePad = forwardRef<SignaturePadHandle, Props>(
  function SignaturePad({ label, required }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawing = useRef(false);
    const empty = useRef(true);

    useImperativeHandle(ref, () => ({
      isEmpty: () => empty.current,
      clear: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        empty.current = true;
      },
      toBlob: () =>
        new Promise((resolve) => {
          const canvas = canvasRef.current;
          if (!canvas || empty.current) {
            resolve(null);
            return;
          }
          canvas.toBlob((blob) => resolve(blob), "image/png");
        }),
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resize = () => {
        const parent = canvas.parentElement;
        const width = Math.min(parent?.clientWidth || 560, 560);
        const height = 160;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#1a3324";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        empty.current = true;
      };

      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, []);

    function pointFromEvent(event: PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const point = pointFromEvent(event);
      if (!canvas || !ctx || !point) return;
      drawing.current = true;
      empty.current = false;
      canvas.setPointerCapture(event.pointerId);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }

    function onPointerMove(event: PointerEvent<HTMLCanvasElement>) {
      if (!drawing.current) return;
      const ctx = canvasRef.current?.getContext("2d");
      const point = pointFromEvent(event);
      if (!ctx || !point) return;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }

    function onPointerUp(event: PointerEvent<HTMLCanvasElement>) {
      drawing.current = false;
      canvasRef.current?.releasePointerCapture(event.pointerId);
    }

    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.16em] text-forest-mid">
            {label}
            {required ? " *" : ""}
          </p>
          <button
            type="button"
            className="text-xs uppercase tracking-[0.14em] text-brick transition hover:text-brick-deep"
            onClick={() => {
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext("2d");
              if (!canvas || !ctx) return;
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              empty.current = true;
            }}
          >
            Clear
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="mt-2 w-full touch-none border border-forest/20 bg-white"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
    );
  },
);
