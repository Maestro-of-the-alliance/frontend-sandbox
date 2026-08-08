// Shared CHRONOS endpoint -- one canonical time source for MENTOR, SAM,
// and every other Stone, instead of each independently reasoning about
// UTC offsets (which breaks twice a year around DST transitions if
// hardcoded). Uses only native Intl.DateTimeFormat against the
// America/Chicago IANA zone, which resolves the correct offset
// (CST/CDT) automatically for any given date -- no manual DST logic,
// no external date library.
export async function onRequestGet(context) {
  const now = new Date();
  const timeZone = "America/Chicago";

  try {
    const displayDtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const dp = displayDtf.formatToParts(now);
    const get = (type) => dp.find((p) => p.type === type)?.value;
    const display = `${get("hour")}:${get("minute")} ${get("dayPeriod")} on ${get("weekday")}, ${get("month")} ${get("day")}, ${get("year")}`;

    // Resolve the correct current offset for this exact date (handles the
    // CST/CDT transition automatically -- this is the whole point).
    const offsetDtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    });
    const offsetPart = offsetDtf.formatToParts(now).find((p) => p.type === "timeZoneName")?.value || "GMT-6";
    const offsetMatch = offsetPart.match(/GMT([+-]\d+)/);
    const offsetHours = offsetMatch ? parseInt(offsetMatch[1], 10) : -6;
    const offsetStr = `${offsetHours < 0 ? "-" : "+"}${String(Math.abs(offsetHours)).padStart(2, "0")}:00`;

    const isoDtf = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const ip = isoDtf.formatToParts(now);
    const igi = (type) => ip.find((p) => p.type === type)?.value;
    const iso = `${igi("year")}-${igi("month")}-${igi("day")}T${igi("hour")}:${igi("minute")}:${igi("second")}${offsetStr}`;

    const body = { display, iso, timezone: timeZone, source: "CHRONOS" };

    return new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "CHRONOS_COMPUTE_FAILED", message: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}
