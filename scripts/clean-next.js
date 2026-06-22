// Pre-dev guard — runs automatically before `npm run dev` (via the "predev" script).
//
// The Windows EPERM crash on `.next\trace` happens when a SECOND `next dev`
// starts while a first one is still running: both try to open the same trace
// file, and Windows refuses the second open (the file is exclusively locked).
//
// This guard makes that impossible:
//   1. If a dev server is already listening on the dev port, it aborts with a
//      clear message instead of letting Next crash. (No second server, no EPERM.)
//   2. If the port is free but a stale `.next` is left over, it clears it so the
//      fresh server starts clean.
//
// Net effect: `npm run dev` is always safe to run — it either starts the one
// server cleanly, or tells you the one you already have is still up.

const net = require("net");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const nextDir = path.join(__dirname, "..", ".next");

// Detect a running server by trying to CONNECT (not bind). On Windows, binding
// 127.0.0.1 does not conflict with Next's 0.0.0.0 listener, so a bind probe
// gives false negatives; an active connection is reliable across platforms.
function portInUse(port) {
  return new Promise((resolve) => {
    const sock = net.connect({ port, host: "127.0.0.1" });
    sock.setTimeout(1200);
    sock.once("connect", () => {
      sock.destroy();
      resolve(true);
    });
    sock.once("timeout", () => {
      sock.destroy();
      resolve(false);
    });
    sock.once("error", () => {
      sock.destroy();
      resolve(false);
    });
  });
}

(async () => {
  if (await portInUse(PORT)) {
    console.error(`\n[apex] A dev server is already running on http://localhost:${PORT}`);
    console.error("[apex] Open that tab instead of starting a second one (a second server is what causes the");
    console.error("[apex] .next\\trace EPERM crash). To restart cleanly: close the other terminal first, then");
    console.error("[apex] run `npm run dev` again.\n");
    process.exit(1);
  }

  // Port is free → no live server holds .next. Safe to clear any stale build dir.
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
  } catch {
    // Nothing to clean, or already gone — fine.
  }
})();
