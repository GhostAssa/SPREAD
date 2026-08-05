"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { Icon } from "@/components/icon";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES =
  "image/png,image/jpeg,image/gif,image/webp,application/pdf,audio/mpeg,audio/wav,audio/mp4,audio/ogg";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TipForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function acceptFile(candidate: File | undefined) {
    if (!candidate) return;
    if (candidate.size > MAX_FILE_BYTES) {
      setErrorMessage("That file is over 10MB — please attach something smaller.");
      setStatus("error");
      return;
    }
    setErrorMessage("");
    setStatus("idle");
    setFile(candidate);
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    acceptFile(e.target.files?.[0]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    acceptFile(e.dataTransfer.files?.[0]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!data.get("anon")) {
      setErrorMessage("Please confirm the checkbox above.");
      setStatus("error");
      return;
    }

    if (file) {
      data.set("evidence", file);
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/tips", { method: "POST", body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "failed");
      }
      setStatus("sent");
      form.reset();
      setFile(null);
    } catch (err) {
      setErrorMessage(err instanceof Error && err.message !== "failed" ? err.message : "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-10">
        <Icon name="check_circle" className="text-moss text-[48px] mb-4" />
        <h3 className="font-note text-note text-ink-band mb-2">Tip received.</h3>
        <p className="font-body-md text-body-md text-body-ink">
          Our reporters will take it from here. We don&apos;t track who sent this.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="tip-type">
            What is this regarding?
          </label>
          <select
            className="w-full bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
            id="tip-type"
            name="tip-type"
          >
            <option>General News</option>
            <option>Administration</option>
            <option>Student Life</option>
            <option>Academics</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="urgency">
            Urgency Level
          </label>
          <select
            className="w-full bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
            id="urgency"
            name="urgency"
          >
            <option>Standard</option>
            <option>High (Time Sensitive)</option>
            <option>Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="message">
          The Details
        </label>
        <textarea
          className="w-full bg-sand border-2 border-ink-band rounded-lg p-4 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm placeholder:text-ink-band/50"
          id="message"
          name="message"
          placeholder="Tell us what you know. Be as specific as possible..."
          rows={5}
          required
        />
      </div>

      <div>
        <input
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />
        <div
          className={`border-2 border-dashed rounded-lg p-6 bg-surface text-center hover:bg-sand transition-colors cursor-pointer ${
            dragActive ? "border-clay bg-sand" : "border-ink-band/40"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          {file ? (
            <>
              <Icon name="description" className="text-[32px] text-moss mb-2" />
              <p className="font-eyebrow text-eyebrow text-ink-band uppercase">{file.name}</p>
              <p className="font-label-sm text-label-sm text-body-ink mt-1">
                {formatBytes(file.size)} &middot;{" "}
                <button
                  className="underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  type="button"
                >
                  Remove
                </button>
              </p>
            </>
          ) : (
            <>
              <Icon name="upload_file" className="text-[32px] text-ink-band mb-2" />
              <p className="font-eyebrow text-eyebrow text-ink-band uppercase">Attach Evidence (Optional)</p>
              <p className="font-label-sm text-label-sm text-body-ink mt-1">
                Drag a file here or click to browse. Images, PDFs, or Audio files. Max 10MB.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 bg-error-container/50 p-4 border border-ink-band rounded-lg">
        <input
          className="mt-1 w-4 h-4 text-ink-band border-ink-band rounded focus:ring-amber focus:ring-offset-0 bg-cream"
          id="anon"
          name="anon"
          type="checkbox"
          required
        />
        <label className="font-label-sm text-label-sm text-ink-band" htmlFor="anon">
          I understand that submitting this tip does not guarantee publication. Spread reserves
          the right to investigate and verify all claims before broadcasting.
        </label>
      </div>

      {status === "error" && (
        <p className="font-label-sm text-label-sm text-error uppercase">{errorMessage}</p>
      )}

      <button
        className="w-full btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-5 rounded-xl text-ink-band text-lg disabled:opacity-60"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Submit Securely"}
      </button>
    </form>
  );
}
