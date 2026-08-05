"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-10">
        <Icon name="check_circle" className="text-moss text-[48px] mb-4" />
        <h3 className="font-note text-note text-ink-band mb-2">Message sent.</h3>
        <p className="font-body-md text-body-md text-body-ink">
          We&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="w-full bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
            id="name"
            name="name"
            required
            type="text"
          />
        </div>
        <div>
          <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
      </div>
      <div>
        <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="message">
          Message
        </label>
        <textarea
          className="w-full bg-sand border-2 border-ink-band rounded-lg p-4 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm placeholder:text-ink-band/50"
          id="message"
          name="message"
          placeholder="What's on your mind?"
          required
          rows={5}
        />
      </div>

      {status === "error" && (
        <p className="font-label-sm text-label-sm text-error uppercase">
          Something went wrong — please try again.
        </p>
      )}

      <button
        className="w-full btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-5 rounded-xl text-ink-band text-lg disabled:opacity-60"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
