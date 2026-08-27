import { useState } from "react";

import ReactButton from "../ReactButton/ReactButton";
import "./contactForm.css";

export default function ReactContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(false);
    setHasError(false);
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const searchParams = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      searchParams.append(key, value as string); // Явне приведення типу
    }
    const body = searchParams.toString();

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Submission failed with status ${response.status}`);
        }
        setIsSubmitted(true);
        form.reset();
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
      });
  };

  return (
    // Netlify only detects this form because a static stub exists at
    // public/netlify-form-hack/__forms.html (this island renders after JS, so
    // Netlify's build-time HTML scan never sees it). The `netlify`/`netlify-honeypot`
    // attributes live on that stub, not here. Keep field names in sync there.
    <form name="contact" onSubmit={handleSubmit}>
      {/* Hidden field to prevent bots */}
      <div style={{ display: "none" }}>
        <input type="text" name="bot-field" />
      </div>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        placeholder="Best Client ever"
      />

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        placeholder="example@example.com"
      />

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        rows={4}
        required
        placeholder="Send me your CV, and let’s create something great!"
      ></textarea>

      {isSubmitted && (
        <div
          style={{ color: "green", margin: "10px 0 15px", lineHeight: "18px" }}
        >
          <b style={{ display: "block" }}>
            ✅ Your message has been sent successfully!
          </b>
          <span style={{ paddingLeft: "20px" }}>
            I'll get back to you shortly.
          </span>
        </div>
      )}

      {hasError && (
        <div
          style={{
            color: "crimson",
            margin: "10px 0 15px",
            lineHeight: "18px",
          }}
        >
          <b style={{ display: "block" }}>
            ⚠️ Something went wrong sending your message.
          </b>
          <span style={{ paddingLeft: "20px" }}>
            Please try again or email me directly.
          </span>
        </div>
      )}

      <ReactButton type="submit">Send Message</ReactButton>

      <input type="hidden" name="form-name" value="contact" />
    </form>
  );
}
