import { cn } from "@/lib/cn";

export function ShelfArt() {
  return (
    <div className="relative mx-auto h-[320px] w-full max-w-[440px] md:h-[390px]">
      <div className="absolute bottom-[22px] left-[10%] right-[10%] h-6 rounded-full bg-ink/10 blur-lg" />

      <div className="absolute inset-x-0 bottom-[46px] flex items-end justify-center">
        <Book3D
          lines={["Sonar", "Tori"]}
          cover="#732833"
          spine="#4a1820"
          ink="#f6efe4"
          tilt={-13}
          height={208}
          width={122}
          className="-mr-3 origin-bottom"
        />
        <Book3D
          lines={["SmartLMS"]}
          cover="#1a3027"
          spine="#0f1e18"
          ink="#d7b56a"
          tilt={1.5}
          height={256}
          width={138}
          className="z-10 origin-bottom"
        />
        <Book3D
          lines={["Pather", "Panchali"]}
          cover="#c45c3e"
          spine="#8a3a26"
          ink="#fff8f1"
          tilt={12}
          height={196}
          width={122}
          className="-ml-3 origin-bottom"
        />
      </div>

      <div
        className="absolute bottom-[34px] left-[9%] right-[9%] h-[10px] rounded-[1px] shadow-[0_8px_16px_rgba(28,22,18,0.12)]"
        style={{ background: "linear-gradient(#d7c6a3, #c4b089)" }}
      />
      <div
        className="absolute bottom-[24px] left-[8%] right-[8%] h-[11px] rounded-b-sm"
        style={{ background: "linear-gradient(#b89d6f, #9a8158)" }}
      />
    </div>
  );
}

function Book3D({
  lines,
  cover,
  spine,
  ink,
  tilt,
  height,
  width,
  className,
}: {
  lines: string[];
  cover: string;
  spine: string;
  ink: string;
  tilt: number;
  height: number;
  width: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{
        width,
        height,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <div
        className="absolute top-[2%] right-0 h-[96%] w-[8px]"
        style={{
          background: "linear-gradient(90deg, #d8ccb3 0%, #fffaf2 45%, #cfc0a4 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 left-0 w-[15px]"
        style={{
          background: `linear-gradient(90deg, #00000033, ${spine} 28%, ${cover})`,
        }}
      />
      <div
        className="absolute inset-y-0 left-[15px] right-[8px] flex flex-col items-center px-3.5 pt-[20%] pb-5"
        style={{
          background: `linear-gradient(160deg, ${cover} 0%, ${spine} 160%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-[9px] border"
          style={{ borderColor: `${ink}40` }}
        />
        <div className="mb-3 h-px w-9" style={{ background: ink, opacity: 0.75 }} />
        <div className="flex flex-col items-center gap-0.5">
          {lines.map((line) => (
            <p
              key={line}
              className="font-display text-center text-[0.92rem] leading-[1.12] tracking-wide"
              style={{ color: ink }}
            >
              {line}
            </p>
          ))}
        </div>
        <div className="mt-auto h-px w-11" style={{ background: ink, opacity: 0.4 }} />
      </div>
    </div>
  );
}
