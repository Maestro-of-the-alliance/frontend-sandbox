// CHRONOS — live time endpoint for THE ALLIANCE
// Replaces the every-minute GitHub Action that committed time.txt.
// Returns the current Central time as plain text, accurate to the second.

export default {
  async fetch(request) {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(now);

    return new Response(formatted + "\n", {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "access-control-allow-origin": "*",
      },
    });
  },
};
