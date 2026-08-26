"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export type ScannedId = {
  name: string;
  studentId: string;
  department: string;
  email: string;
};

const MOCK: ScannedId = {
  name: "Safayat Hossen Alif",
  studentId: "2024100010063",
  department: "CSE",
  email: "2024100010063@seu.edu.bd",
};

export function ScanIdModal({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (data: ScannedId) => void;
}) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const completeRef = useRef(onComplete);
  const closeRef = useRef(onClose);
  const [phase, setPhase] = useState<"scan" | "done">("scan");
  const [hasStream, setHasStream] = useState(false);

  useEffect(() => {
    completeRef.current = onComplete;
    closeRef.current = onClose;
  }, [onComplete, onClose]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((next) => {
        if (cancelled) {
          next.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = next;
        setHasStream(true);
        if (videoRef.current) {
          videoRef.current.srcObject = next;
          void videoRef.current.play();
        }
      })
      .catch(() => {
        if (!cancelled) setHasStream(false);
      });

    const doneTimer = window.setTimeout(() => setPhase("done"), 2200);
    const finishTimer = window.setTimeout(() => {
      completeRef.current(MOCK);
      closeRef.current();
    }, 2900);

    return () => {
      cancelled = true;
      window.clearTimeout(doneTimer);
      window.clearTimeout(finishTimer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-4 md:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-paper shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-xs tracking-[0.18em] uppercase text-ink-soft">{t.cta.scan}</p>
          <button type="button" onClick={onClose} className="text-sm text-ink-soft hover:text-ink">
            ✕
          </button>
        </div>
        <div className="relative mx-5 aspect-[4/3] overflow-hidden rounded-2xl bg-forest">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover opacity-80" />
          {!hasStream && <FakeCard />}
          <div className="pointer-events-none absolute inset-6 rounded-xl border border-gold/80" />
          {phase === "scan" && (
            <div className="scan-line pointer-events-none absolute inset-x-8 h-0.5 bg-gold shadow-[0_0_16px_#c4a35a]" />
          )}
          <p className="absolute inset-x-0 bottom-3 text-center text-[11px] tracking-[0.16em] uppercase text-paper">
            {phase === "scan" ? t.auth.scanning : t.auth.scanned}
          </p>
        </div>
        <p className="px-5 py-4 text-sm leading-6 text-ink-soft">{t.auth.scanHint}</p>
      </div>
    </div>
  );
}

function FakeCard() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#3e5c4a,transparent_45%),linear-gradient(#1e3328,#1c1612)]">
      <div className="w-[78%] rounded-xl border border-gold/40 bg-paper/95 p-4 text-ink shadow-lg">
        <p className="text-[10px] tracking-[0.2em] uppercase text-wine">Southeast University</p>
        <p className="font-display mt-2 text-lg">Safayat Hossen Alif</p>
        <p className="mt-1 text-xs text-ink-soft">ID 2024100010063 · CSE</p>
        <div className="mt-3 h-8 w-8 rounded-full bg-wine/20" />
      </div>
    </div>
  );
}
