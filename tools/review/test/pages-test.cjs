// Headless phone (390x844) test of the review page, v2 stage layout.
//   URL=http://127.0.0.1:8941/review-test/ node test/pages-test.cjs        (static build, full test incl. voting + copy)
//   URL=http://127.0.0.1:8931/ READONLY=1 node test/pages-test.cjs          (local server: no votes, so verdicts.json is untouched)
// SHOT=<prefix> saves <prefix>-home.png, <prefix>-set.png, <prefix>-lightbox.png
const { chromium } = require("/workspace/ivbench-ct/repo/node_modules/playwright-core");
const fs = require("fs"), os = require("os");
const URL = process.env.URL || "http://127.0.0.1:8941/review-test/";
const SHOT = process.env.SHOT || "/workspace/classnest-shots/pages-phone";
const RO = !!process.env.READONLY;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) process.exitCode = 1; };
const scrollAll = (p) => p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } scrollTo(0, 0); });
const chromeExe = () => {
  const root = os.homedir() + "/.cache/ms-playwright";
  const dir = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().pop();
  if (!dir) throw new Error("no chromium in " + root);
  return root + "/" + dir + "/chrome-linux64/chrome";
};
(async () => {
  const exe = chromeExe();
  const b = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new globalThis.URL(URL).origin });
  const p = await ctx.newPage();
  const bad = [];
  p.on("response", (r) => { if (r.status() >= 400) bad.push(r.status() + " " + r.url()); });
  p.on("requestfailed", (r) => { if (!/net::ERR_ABORTED/.test(r.failure()?.errorText || "")) bad.push("failed " + r.url() + " " + r.failure()?.errorText); });
  p.on("pageerror", (e) => bad.push("pageerror " + e.message));
  if (RO) p.on("request", (r) => { if (r.method() !== "GET") bad.push("non-GET in READONLY " + r.url()); });

  // ---------- Home
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.waitForSelector(".setcard");
  ok((await p.textContent("#h-waiting")).trim() === "Waiting for your vote", "home: 'Waiting for your vote' section");
  const waiting = await p.$$eval("#waiting .setcard .t", (els) => els.map((e) => e.textContent.trim()));
  console.log("  waiting:", waiting);
  ok(waiting.some((x) => x.startsWith("Quartzarch #48")), "home: waiting lists Quartzarch #48");
  ok(["Softwing #25","Rimeveil #53"].every((n) => waiting.some((x) => x.startsWith(n))), "home: waiting lists Softwing #25 and Rimeveil #53 (audit picks)");
  ok(!waiting.some((x) => /Emberpuff|Kindlekin|Riftstallion|Ironmaw|Mossback|Palevow|Ultra/.test(x)), "home: shipped sets (incl. Emberpuff) and Ultras are not in Waiting");
  const done = await p.$$eval("#done .setcard .t", (els) => els.map((e) => e.textContent.trim()));
  ok(["Kindlekin","Riftstallion","Ironmaw","Mossback","Palevow","Emberpuff"].every((n) => done.some((x) => x.includes(n))), "home: shipped sets under Done: " + done.join(", "));
  ok(done.some((x) => x.includes("Emberpuff") && /SHIPPED v0\.149/.test(x)), "home: Emberpuff #03 under Done as SHIPPED v0.149");
  ok(!done.some((x) => x.includes("Quartzarch")) && waiting.some((x) => x.includes("Quartzarch") && x.includes("SHIPPED v0.148 (Legend)")), "home: Quartzarch stays in Waiting with a 'Legend shipped' badge");
  ok(/^Browse all Ultras \(current art, nothing to vote\)/.test((await p.textContent("#h-ultras")).trim()), "home: Ultras labelled 'Browse all Ultras (current art, nothing to vote)'");
  ok((await p.$$(".tiles .tile")).length === 75, "home: 75 Ultra tiles");
  if (!RO) ok((await p.textContent("#h-note")).includes("online copy"), "static mode detected");
  ok(!(await p.$("a[href^='/']")) || RO, "no root-absolute links (static)");
  await p.screenshot({ path: SHOT + "-home.png" });

  // ---------- Quartzarch set: stage layout
  await p.goto(URL + "#/set/quartzarch-48", { waitUntil: "networkidle" });
  await p.waitForSelector(".stg");
  // Baseline verdicts.json must not leave adol-F decided (active comment hides it from To review).
  // Wipe any synced/local entry so the open-draft checks and later vote flows see a clean card.
  await p.evaluate(() => {
    let s = {};
    try { s = JSON.parse(localStorage.getItem("classnest-review-v1") || "{}"); } catch {}
    if (!s.items) s.items = {};
    delete s.items["quartzarch-48/adol-F"];
    localStorage.setItem("classnest-review-v1", JSON.stringify(s));
  });
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForSelector(".stg");
  // If sync re-imported an active baseline comment, drop it again and re-render without a full reload.
  await p.evaluate(() => {
    let s = {};
    try { s = JSON.parse(localStorage.getItem("classnest-review-v1") || "{}"); } catch {}
    if (!s.items) s.items = {};
    delete s.items["quartzarch-48/adol-F"];
    localStorage.setItem("classnest-review-v1", JSON.stringify(s));
    if (typeof store !== "undefined" && store.items) delete store.items["quartzarch-48/adol-F"];
    if (typeof render === "function") render();
  });
  await p.waitForTimeout(200);

  // ---------- Quartzarch set (v0.148): Legend E shipped (NOW), Adolescent A–D rejected, one new draft Adolescent F waiting
  // (already on quartzarch-48 after wipe)
  ok((await p.textContent(".headline")).trim() === "Quartzarch #48: Ash asked for a remake of both. Vote on Adolescent F and Legend F.", "set: headline says Legend shipped, waiting on one new Adolescent");
  const heads = await p.$$eval(".stagehead", (e) => e.map((x) => x.textContent.trim()));
  ok(JSON.stringify(heads) === JSON.stringify(["Stage 1 · Hatchling", "Stage 2 · Adolescent", "Stage 3 · Legend"]), "set: stage headers in order: " + heads.join(" | "));
  const secs = await p.$$eval(".stg", (ss) => ss.map((s) => ({
    sub: s.querySelector(":scope > .note")?.textContent.trim(),
    first: s.querySelector(".grid > .card")?.className, firstBadge: s.querySelector(".grid > .card .sbadge")?.textContent.trim(), firstText: s.querySelector(".grid > .card")?.textContent.replace(/\s+/g, " "),
    nowVotes: s.querySelectorAll(".card.now [data-vote]").length, nowBtns: [...s.querySelectorAll(".card.now [data-vote]")].map((x) => x.textContent.trim() + "|" + x.dataset.id),
    drafts: [...s.querySelectorAll(".card.draft")].map((c) => ({ badge: c.querySelector(".sbadge").textContent.trim(), letter: c.querySelector(".letter").textContent, ttl: c.querySelector(".ttl").textContent.trim(), votes: c.querySelectorAll("[data-vote]").length, btns: [...c.querySelectorAll("[data-vote]")].map((x) => x.textContent.trim()).join("|") })) })));
  ok(secs[0].firstBadge === "NOW · style reference, not changing" && secs[0].drafts.length === 0, "Stage 1: only the current Hatchling, 'NOW · style reference, not changing'");
  ok(/\bnow\b/.test(secs[1].first) && secs[1].firstBadge === "NOW IN APP", "Stage 2: current Adolescent first, NOW IN APP");
  const d0 = secs[1].drafts[0];
  ok(secs[1].drafts.length === 1 && d0 && d0.letter === "E" && d0.badge === "DRAFT · would replace Adolescent" && d0.btns === "✓ CONFIRM|✕ REMAKE…|⊘ REJECT", "Stage 2: exactly one open draft, Adolescent F, 'DRAFT · would replace Adolescent' with CONFIRM/REMAKE/REJECT: " + (d0 ? d0.btns : `drafts=${secs[1].drafts.length}`));
  ok(secs[1].sub === "1 draft. Pick one to replace the current Adolescent, REMAKE, or REJECT the ones you don't want.", "Stage 2 subheading: " + secs[1].sub);
  ok(/\bnow\b/.test(secs[2].first) && secs[2].firstBadge === "NOW IN APP" && secs[2].firstText.includes("Now in app: Legend E") && secs[2].drafts.length === 0, "Stage 3: Legend E is NOW IN APP, no open drafts");
  ok(/^Shipped v0\.148: the new Legend is in the app now/.test(secs[2].sub), "Stage 3 subheading says shipped: " + secs[2].sub);
  ok(secs[0].nowVotes === 0 && secs[2].nowVotes === 0, "Hatchling style-reference card and shipped Legend NOW card have no vote buttons");
  ok(secs[1].nowBtns.join() === "✓ CONFIRM: Keep current|keep-s2", "Stage 2 NOW card has one 'Keep current' CONFIRM button: " + secs[1].nowBtns.join());
  ok(!(await p.textContent("main")).includes("adol-F"), "internal ids not shown on cards");
  await p.click("[data-filter=all]"); await p.waitForTimeout(300);
  const all2 = await p.$$eval(".stg[data-stage='2'] .card.draft", (cs) => cs.map((c) => c.textContent.replace(/\s+/g, " ")));
  ok(all2.length === 5 && all2.filter((t) => /too girly/.test(t)).length === 4, `All filter: Adolescent A–D shown as rejected 'too girly' (${all2.length} drafts)`);
  const rj = await p.$$eval(".stg[data-stage='2'] .card.draft", (cs) => cs.map((c) => (c.querySelector(".letter").textContent) + ":" + (c.classList.contains("reject") ? "R" : "-") + (c.querySelector(".rtag")?.textContent || "") + ":" + getComputedStyle(c.querySelector(".media")).opacity));
  ok(rj.filter((t) => /^[A-D]:RREJECTED:0\.4/.test(t)).length === 4 && rj.some((t) => /^E:-:1$/.test(t)), "baseline-rejected A–D look rejected (dimmed + red REJECTED tag), E does not: " + rj.join(" "));
  await p.click("[data-filter=todo]"); await p.waitForTimeout(300);
  await scrollAll(p); await p.waitForLoadState("networkidle"); await p.waitForTimeout(500);
  const imgs = await p.$$eval("img", (i) => [i.length, i.filter((x) => !x.complete || x.naturalWidth === 0).map((x) => x.src)]);
  ok(imgs[1].length === 0, `all ${imgs[0]} images loaded (${imgs[1].length} broken)`);
  await p.screenshot({ path: SHOT + "-set.png" });

  // Lightbox caption badges
  await p.click(".stg[data-stage='2'] .card.now img.media");
  await p.waitForSelector("#lb.open");
  ok((await p.textContent("#lb-cap .lbbadge")) === "NOW IN APP · Stage 2 Adolescent", "lightbox: NOW IN APP · Stage 2 Adolescent");
  ok((await p.$$("#lb-vote [data-lbvote]")).length === 0, "lightbox: no vote buttons on current art");
  await p.click("#lb-next");
  ok((await p.textContent("#lb-cap .lbbadge")) === "DRAFT · would replace Adolescent · Option E", "lightbox: next is 'DRAFT · would replace Adolescent · Option E'");
  const lbImg = await p.$eval("#lb-media img", (i) => new Promise((r) => i.complete ? r(i.naturalWidth) : (i.onload = () => r(i.naturalWidth), i.onerror = () => r(0))));
  ok(lbImg > 0, `lightbox image loads (${lbImg}px)`);
  await p.screenshot({ path: SHOT + "-lightbox.png" });
  const href = await p.evaluate(() => location.href);
  await p.click("#lb-x");
  ok(!(await p.isVisible("#lb")) && (await p.evaluate(() => location.href)) === href, "lightbox closes with ✕, URL unchanged");

  if (!RO) {
    await p.evaluate(() => scrollTo(0, 0));
    const n0 = (await p.$$(".card.draft")).length;
    await p.click(".stg[data-stage='2'] .card.draft >> nth=0 >> [data-vote=yes]");
    ok(await p.isVisible("#toast-undo"), "Undo toast after CONFIRM");
    await p.click("#toast-undo");
    ok((await p.$$(".card.draft")).length === n0, "Undo restored the draft");
    await p.click(".stg[data-stage='2'] .card.draft >> nth=0 >> [data-vote=no]");
    await p.click(".stg[data-stage='2'] .card.draft >> nth=0 >> [data-reason='not enough change']");
    ok((await p.$$(".card.draft")).length === n0 - 1, "REMAKE chip removed Adolescent F from To review");
    ok((await p.$$(".card.now")).length === 3, "NOW cards stay visible after voting");
    ok((await p.$$(".stg[data-stage='2'] .card.now [data-vote]")).length === 1, "Keep current button still there after voting on the draft");
    const ls = await p.evaluate(() => JSON.parse(localStorage.getItem("classnest-review-v1")));
    const v = Object.entries(ls.items).filter(([k, e]) => k.startsWith("quartzarch-48/") && e.vote && !e.shipped);
    ok(v.length === 1 && v.every(([, e]) => /^[0-9a-f]{12}$/.test(e.stamp)), "vote saved with stamp: " + v.map(([k, e]) => `${k}=${e.vote}@${e.stamp}`).join(", "));
    await p.click("#copy"); await p.waitForTimeout(400);
    const clip = await p.evaluate(() => navigator.clipboard.readText());
    console.log("--- clipboard ---\n" + clip + "\n---");
    ok(clip === "ClassNest v0.149\nREMAKE\nQuartzarch #48: Adolescent F (adol-F) — not enough change", "copy text uses human labels + ids");
    ok((await p.textContent("#count")) === "Nothing to send" && await p.isDisabled("#copy"), "copied items cleared, Copy disabled");
    await p.reload({ waitUntil: "networkidle" }); await p.waitForSelector(".stg");
    ok((await p.$$(".card.draft")).length === n0 - 1, "after reload the sent draft stays out of To review");
    await p.click("[data-filter=sent]");
    ok((await p.$$(".card.draft")).length === 1, "Sent filter shows the copied draft");
    await p.click("[data-filter=todo]");
  }

  // Shipped remakes: the confirmed art is NOW IN APP, subheadings say shipped (no leftover "Pick one to replace")
  for (const [id, nows_] of [["ironmaw-38", ["Adolescent C", "Legend C"]], ["mossback-24", ["Adolescent D", "Legend C"]], ["palevow-46", ["Adolescent C", "Legend D"]]]) {
    await p.goto(URL + "#/set/" + id, { waitUntil: "networkidle" }); await p.waitForTimeout(300);
    const subs = await p.$$eval(".stg > .note", (e) => e.map((x) => x.textContent.trim()));
    ok((await p.$$(".card.now [data-vote]")).length === 0, `${id}: shipped set has no Keep current buttons`);
    ok(!subs.some((t) => /Pick one to replace/.test(t)) && subs.filter((t) => /^Shipped v0\.14[78]/.test(t)).length === 2, `${id}: subheadings say shipped: ${subs.join(" | ")}`);
    await p.click("[data-filter=all]").catch(() => {}); await p.waitForTimeout(300);
    const nows = await p.$$eval(".card.now", (cs) => cs.map((c) => c.textContent.replace(/\s+/g, " ")));
    ok(nows_.every((n) => nows.some((t) => t.includes("Now in app: " + n))), `${id}: ${nows_.join(" + ")} shown as NOW`);
    await p.click("[data-filter=todo]").catch(() => {}); await p.waitForTimeout(200);
  }
  await p.goto(URL + "#/set/emberpuff-drafts", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
  const eh = await p.$$eval(".stagehead", (e) => e.map((x) => x.textContent.trim()));
  ok(eh.join("|") === "Stage 1 · Hatchling|Stage 2 · Adolescent" && (await p.$$(".stg[data-stage='2'] .card.now")).length === 1, "Emberpuff: Hatchling + Adolescent sections, current Adolescent first");
  ok(/SHIPPED v0\.149/.test((await p.textContent(".headline")).trim()) && /Adolescent F is now in the app/.test((await p.textContent(".headline")).trim()), "Emberpuff headline says SHIPPED v0.149 / Adolescent F in app: " + (await p.textContent(".headline")).trim());
  ok((await p.$$(".stg[data-stage='2'] .card.draft")).length === 0, "Emberpuff: no open Adolescent drafts after ship");

  // Kindlekin (shipped, legacy layout) keeps hiding shipped picks
  await p.goto(URL + "#/set/kindlekin-34", { waitUntil: "networkidle" }); await p.waitForTimeout(300);
  ok(!(await p.$$eval(".card .title", (e) => e.map((x) => x.textContent))).some((t) => /R3 Legend B|Adolescent B/i.test(t)), "Kindlekin shipped picks hidden");

  // Ultra set: reference only
  await p.goto(URL + "#/set/ultra-01", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
  ok((await p.$$("main [data-vote]")).length === 0 && (await p.$$("[data-filter]")).length === 0, "Ultra set: no vote buttons, no filters");
  ok((await p.$$eval(".card.now .sbadge", (e) => e.map((x) => x.textContent))).join("|") === "NOW IN APP|NOW IN APP|NOW IN APP", "Ultra set: 3 NOW IN APP stages");
  await p.click(".card:has-text('Home film') img.media");
  const vid = await p.$eval("#lb-media video", (v) => new Promise((r) => { if (v.readyState >= 1) r(v.videoWidth); v.onloadedmetadata = () => r(v.videoWidth); v.onerror = () => r(0); setTimeout(() => r(-1), 8000); }));
  ok(vid > 0, `Home film plays (${vid}px)`);
  await p.keyboard.press("Escape");
  ok(!(await p.isVisible("#lb")), "lightbox closes with Esc");
  ok(bad.length === 0, "no failed requests / page errors" + (bad.length ? ": " + bad.slice(0, 10).join(" | ") : ""));
  await ctx.close();

  // ---------- Comment / remake-reason boxes: phone taps + keyboard, and desktop clicks (fresh browser each)
  if (!RO) for (const mobile of [true, false]) await commentTest(b, mobile);
  if (!RO) await homeCopyTest(b);
  if (!RO) for (const mobile of [true, false]) await keepTest(b, mobile);
  if (!RO) for (const mobile of [true, false]) await rejectTest(b, mobile);
  await b.close();
})();

async function commentTest(b, mobile) {
  // Only one open draft is left on the site (Quartzarch Adolescent F), so each check runs in a fresh browser context.
  const tag = mobile ? "[phone]" : "[desktop]";
  const CURL = process.env.COMMENT_URL || URL, SERVER = !!process.env.COMMENT_URL;   // COMMENT_URL = a throwaway local server copy
  const KEY = "quartzarch-48/adol-F";
  const fresh = async () => {
    const ctx = await b.newContext(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1366, height: 768 } });
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new globalThis.URL(CURL).origin });
    const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(CURL + "#/set/quartzarch-48", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
    // Wipe a prior SENT/local verdict on adol-F so the draft is open for this test (sync may have loaded one).
    await p.evaluate((key) => {
      let s = {};
      try { s = JSON.parse(localStorage.getItem("classnest-review-v1") || "{}"); } catch {}
      if (!s.items) s.items = {};
      delete s.items[key];
      localStorage.setItem("classnest-review-v1", JSON.stringify(s));
    }, KEY);
    await p.reload({ waitUntil: "networkidle" }); await p.waitForSelector(".stg");
    if ((await p.locator(".stg[data-stage='2'] .card.draft").count()) === 0 && await p.$("[data-filter=all]")) {
      await p.click("[data-filter=all]"); await p.waitForTimeout(150);
    }
    return { ctx, p, errs };
  };
  const press = (loc) => mobile ? loc.tap() : loc.click();
  const ls = (p) => p.evaluate(() => JSON.parse(localStorage.getItem("classnest-review-v1") || "{}").items || {});
  const copy = async (p) => { await p.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); }); await p.waitForTimeout(400); await press(p.locator("#copy")); await p.waitForTimeout(500); return p.evaluate(() => navigator.clipboard.readText()); };
  const serverHas = async (p, want) => { if (!SERVER) return; const v = await p.evaluate(async () => (await (await fetch("/api/verdicts")).json()).items); ok(want(v[KEY] || {}), `${tag} server verdicts.json has it`); };
  const st2 = ".stg[data-stage='2'] .card.draft";

  // 1) plain comment box on a draft card
  { const { ctx, p, errs } = await fresh();
    const c0 = p.locator(st2).nth(0), id0 = await c0.locator("textarea").getAttribute("data-comment");
    ok(id0 === "adol-F", `${tag} the open draft is adol-F`);
    await c0.locator("textarea").scrollIntoViewIfNeeded(); await press(c0.locator("textarea"));
    ok(await p.evaluate(() => document.activeElement.tagName === "TEXTAREA"), `${tag} tap focuses the comment box`);
    await p.keyboard.type("too pink", { delay: 30 });
    if (mobile) ok(!(await p.isVisible("#copybar")), `${tag} bottom Copy bar hidden while typing (not covering the box)`);
    await press(p.locator(".stagehead").nth(0)); await p.waitForTimeout(600);       // blur, like closing the keyboard
    const box0 = p.locator(`textarea[data-comment='${id0}']`);
    ok((await box0.count()) === 1 && (await box0.inputValue()) === "too pink", `${tag} after blur the card and its text stay (value "${await box0.inputValue().catch(() => "GONE")}")`);
    await press(box0); await p.keyboard.type(", softer", { delay: 30 });           // keep typing after coming back
    ok((await box0.inputValue()) === "too pink, softer", `${tag} can keep typing after refocus`);
    ok((await ls(p))[KEY]?.comment === "too pink, softer", `${tag} comment saved in localStorage`);
    await serverHas(p, (e) => e.comment === "too pink, softer");
    const clip = await copy(p);
    ok(clip === "ClassNest v0.149\nCOMMENT\nQuartzarch #48: Adolescent F (adol-F) — too pink, softer", `${tag} copy text has the comment:\n${clip}`);
    ok(errs.length === 0, `${tag} no page errors (comment) ${errs.join(" | ")}`); await ctx.close(); }

  // 2) Ash's exact bug: type in crow → click REMAKE → click the box → type again (must keep working).
  //    Crow stays put above chips; autofocus after REMAKE; box on-screen; then submit with my reason.
  { const { ctx, p, errs } = await fresh();
    const c1 = p.locator(st2).nth(0);
    const crow = c1.locator("label.crow textarea");
    await crow.scrollIntoViewIfNeeded(); await press(crow);
    await p.keyboard.type("before", { delay: 25 });
    ok((await crow.inputValue()) === "before", `${tag} comment box works BEFORE remake`);
    // Click REMAKE — same box must stay editable (Ash: "before i click remake comment box ok but if click remake doesn't work")
    await press(c1.locator("[data-vote=no]"));
    await p.waitForTimeout(80);
    ok((await c1.locator(".menu").count()) === 1, `${tag} REMAKE opens the reason menu`);
    ok((await c1.locator("label.crow textarea").count()) === 1, `${tag} crow textarea stays after REMAKE (not swapped away)`);
    ok((await c1.locator(".menu textarea").count()) === 0, `${tag} menu has no second textarea (crow is the box)`);
    const focused = await p.evaluate(() => document.activeElement && document.activeElement.matches("textarea[data-comment]"));
    ok(focused, `${tag} REMAKE autofocuses the reason box`);
    const lay = await p.evaluate(() => {
      const card = document.querySelector(".stg[data-stage='2'] .card.draft");
      const t = card && card.querySelector("label.crow textarea");
      const firstChip = card && card.querySelector(".menu .chips button");
      const r = t.getBoundingClientRect(), c = firstChip && firstChip.getBoundingClientRect();
      const cs = getComputedStyle(t);
      const parse = (s) => { const m = (s || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0]; };
      const lum = (rgb) => { const a = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
      const L1 = lum(parse(cs.color)), L2 = lum(parse(cs.backgroundColor));
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      return { taTop: Math.round(r.top), taBottom: Math.round(r.bottom), vh: window.innerHeight,
        chipTop: c && Math.round(c.top), taBeforeChips: !c || r.bottom <= c.top + 1,
        disabled: !!t.disabled, readOnly: !!t.readOnly,
        pe: cs.pointerEvents, color: cs.color, bg: cs.backgroundColor, fill: cs.webkitTextFillColor,
        opacity: cs.opacity, visibility: cs.visibility, h: t.offsetHeight,
        contrast: Math.round(ratio * 100) / 100, contrastOk: ratio >= 3 };
    });
    ok(lay.taBeforeChips, `${tag} reason box is above the chip list (not buried): ${JSON.stringify(lay)}`);
    ok(lay.taTop >= 0 && lay.taBottom <= lay.vh, `${tag} reason box is on screen after REMAKE (${lay.taTop}..${lay.taBottom} of ${lay.vh})`);
    ok(!lay.disabled && !lay.readOnly && lay.pe !== "none", `${tag} box stays editable after REMAKE (${JSON.stringify(lay)})`);
    // Ash clue: keystrokes were captured but text looked invisible — assert contrast + on-screen + visible glyphs.
    ok(lay.contrastOk, `${tag} typed text contrast after REMAKE (color vs bg): ${JSON.stringify(lay)}`);
    ok(lay.opacity === "1" && lay.visibility === "visible" && lay.h >= 40, `${tag} box not collapsed/hidden after REMAKE: ${JSON.stringify(lay)}`);
    // Exact Ash sequence: after REMAKE, click the box and type
    const box = c1.locator("label.crow textarea");
    await press(box);
    await p.keyboard.type(" remake", { delay: 25 });
    await p.waitForTimeout(200);
    ok((await box.inputValue()) === "before remake", `${tag} Ash seq: type → REMAKE → click box → type works`);
    {
      const bb = await box.boundingBox();
      ok(!!bb && bb.height >= 40 && bb.y >= 0 && (bb.y + bb.height) <= (mobile ? 844 : 768) + 2, `${tag} reason box on-screen for glyph check: ${JSON.stringify(bb)}`);
      const shot = `/tmp/remake-glyphs-${mobile ? "phone" : "desk"}.png`;
      await p.screenshot({ path: shot, clip: { x: Math.max(0, bb.x), y: Math.max(0, bb.y), width: Math.min(bb.width, 500), height: Math.min(bb.height, 80) } });
      const { execFileSync } = require("child_process");
      const n = Number(execFileSync("python3", ["-c",
        "from PIL import Image; im=Image.open('" + shot + "').convert('RGB'); n=sum(1 for r,g,b in im.getdata() if r>200 and g>200 and b>200); print(n)"
      ], { encoding: "utf-8" }).trim());
      ok(n >= 30, `${tag} typed text is VISIBLE after REMAKE (light glyph pixels=${n} in ${shot})`);
    }
    // Also: keep typing with autofocus alone (no re-click) after closing + reopening
    await press(c1.locator("[data-menuclose]")); await p.waitForTimeout(80);
    await press(c1.locator("[data-vote=no]"));
    await p.keyboard.type(" ok", { delay: 25 });
    ok((await c1.locator("label.crow textarea").inputValue()) === "before remake ok", `${tag} typed into the box after REMAKE without a second tap`);
    // Blur — text and card must stay
    await press(p.locator(".stagehead").nth(0)); await p.waitForTimeout(500);
    ok((await c1.locator("label.crow textarea").inputValue()) === "before remake ok", `${tag} after blur the reason text stays`);
    // Vote Keep-current on this set (re-render) — typed reason must survive
    await press(p.locator(".stg[data-stage='2'] .card.now [data-vote=yes]"));
    await p.waitForTimeout(200);
    await press(p.locator("#toast-undo")); await p.waitForTimeout(150); // undo so adol-F stays in todo
    const crow2 = p.locator(`${st2} textarea[data-comment='adol-F']`);
    ok((await crow2.count()) === 1 && (await crow2.inputValue()) === "before remake ok", `${tag} reason survives a re-render from voting another card`);
    ok((await ls(p))[KEY]?.comment === "before remake ok", `${tag} reason still in localStorage after re-render`);
    // Re-open REMAKE and submit with my reason
    await press(p.locator(`${st2} [data-vote=no]`));
    ok((await p.locator(`${st2} label.crow textarea`).inputValue()) === "before remake ok", `${tag} re-opened REMAKE keeps the typed reason`);
    // Desktop + phone screenshots of the remake-open typing state
    await p.evaluate(() => { const ta = document.querySelector(".stg[data-stage='2'] .card.draft label.crow textarea"); if (ta) { const r = ta.getBoundingClientRect(); scrollBy(0, r.top - 160); } });
    await p.waitForTimeout(200);
    if (mobile) {
      await p.screenshot({ path: "/workspace/classnest-shots/pages-remake-typing.png" });
      console.log("  screenshot: /workspace/classnest-shots/pages-remake-typing.png");
    } else {
      await p.screenshot({ path: "/workspace/classnest-shots/pages-remake-typing-desktop.png" });
      console.log("  screenshot: /workspace/classnest-shots/pages-remake-typing-desktop.png");
    }
    await press(p.locator(`${st2} [data-reason='__typed']`));
    const e1 = (await ls(p))[KEY];
    ok(e1?.vote === "no" && e1.comment === "before remake ok", `${tag} REMAKE with my reason saved vote=no + reason`);
    ok(!(await p.$(`.card textarea[data-comment='adol-F']`)), `${tag} that card then moves on`);
    await serverHas(p, (e) => e.vote === "no" && e.comment === "before remake ok");
    const clip = await copy(p);
    ok(/REMAKE\nQuartzarch #48: Adolescent F \(adol-F\) — before remake ok/.test(clip) && clip.startsWith("ClassNest v0.149\n"), `${tag} copy text has the typed reason:\n${clip}`);
    ok(errs.length === 0, `${tag} no page errors (card REMAKE) ${errs.join(" | ")}`); await ctx.close(); }

  // 2b) After CONFIRM / REJECT / Undo the comment box stays editable
  // A typed comment counts as "decided" so the card leaves To review — use All/Commented to find it.
  { const { ctx, p, errs } = await fresh();
    const showCard = async () => {
      if (await p.locator(st2).count()) return;
      await press(p.locator("[data-filter=all]")); await p.waitForTimeout(150);
    };
    const card = () => p.locator(".stg[data-stage='2'] .card.draft").filter({ has: p.locator("textarea[data-comment='adol-F']") });
    const box = () => card().locator("label.crow textarea");
    await box().scrollIntoViewIfNeeded(); await press(box());
    await p.keyboard.type("keep me", { delay: 20 });
    // CONFIRM then Undo → box editable again
    await press(card().locator("[data-vote=yes]"));
    await p.waitForSelector("#toast.open");
    await press(p.locator("#toast-undo")); await p.waitForTimeout(150);
    await showCard();
    ok((await box().count()) === 1, `${tag} after CONFIRM+Undo the crow is back`);
    await press(box()); await p.keyboard.type("!", { delay: 20 });
    ok((await box().inputValue()) === "keep me!", `${tag} box editable after CONFIRM+Undo`);
    // REJECT then Undo → box editable again
    await press(card().locator("[data-vote=reject]"));
    await p.waitForSelector("#toast.open");
    await press(p.locator("#toast-undo")); await p.waitForTimeout(150);
    await showCard();
    await press(box()); await p.keyboard.type("?", { delay: 20 });
    ok((await box().inputValue()) === "keep me!?", `${tag} box editable after REJECT+Undo`);
    // Open REMAKE, Cancel → box still editable
    await press(card().locator("[data-vote=no]"));
    await press(card().locator("[data-menuclose]")); await p.waitForTimeout(80);
    await press(box()); await p.keyboard.type("x", { delay: 20 });
    ok((await box().inputValue()) === "keep me!?x", `${tag} box editable after REMAKE Cancel`);
    ok(errs.length === 0, `${tag} no page errors (confirm/reject/undo) ${errs.join(" | ")}`); await ctx.close(); }

  // 3) Lightbox REMAKE… -> autofocus reason box (arrow keys must not change the picture)
  { const { ctx, p, errs } = await fresh();
    await p.locator(st2 + " img.media").nth(0).scrollIntoViewIfNeeded();
    await press(p.locator(st2 + " img.media").nth(0)); await p.waitForSelector("#lb.open");
    const cap = await p.textContent("#lb-cap b");
    await press(p.locator("#lb-vote [data-lbvote=no]"));
    const lbox = p.locator("#lb-menu textarea");
    ok((await lbox.count()) === 1, `${tag} lightbox REMAKE menu has a reason box`);
    ok(await p.evaluate(() => document.activeElement && document.activeElement.matches("#lb-menu textarea")), `${tag} lightbox REMAKE autofocuses the reason box`);
    await p.keyboard.type("figure too small", { delay: 30 });   // no second tap
    await p.keyboard.press("ArrowLeft"); await p.keyboard.press("ArrowRight");
    ok((await lbox.inputValue()) === "figure too small" && (await p.textContent("#lb-cap b")) === cap, `${tag} lightbox reason box types without a second tap; arrows don't change picture (${cap})`);
    await press(p.locator("#lb-menu [data-lbreason='__typed']"));
    const e2 = (await ls(p))[KEY];
    ok(e2?.vote === "no" && e2.comment === "figure too small", `${tag} lightbox REMAKE with my reason saved`);
    if (await p.isVisible("#lb")) await press(p.locator("#lb-x"));
    await serverHas(p, (e) => e.vote === "no" && e.comment === "figure too small");
    const clip = await copy(p);
    ok(clip === "ClassNest v0.149\nREMAKE\nQuartzarch #48: Adolescent F (adol-F) — figure too small", `${tag} copy text has the lightbox reason:\n${clip}`);
    ok(errs.length === 0, `${tag} no page errors (lightbox REMAKE) ${errs.join(" | ")}`); await ctx.close(); }
}

// ---------- Home page tap-to-copy summary (phone)
async function homeCopyTest(b) {
  const HSHOT = process.env.HOME_SHOT || "/tmp/pages-home-summary.png";
  for (const mode of ["clipboard", "fallback"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new globalThis.URL(URL).origin });
    if (mode === "fallback") await ctx.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")), readText: () => Promise.resolve("") } }); document.execCommand = () => false; });
    const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    const tag = `[home ${mode}]`;
    await p.goto(URL, { waitUntil: "networkidle" }); await p.waitForSelector(".setcard");
    ok((await p.textContent("#homesum")).trim() === "Nothing to send yet", `${tag} empty: 'Nothing to send yet'`);
    const top = await p.$eval("#main", (m) => m.firstElementChild.id);
    ok(top === "homesum", `${tag} summary block is first on Home (above Waiting)`);
    // vote CONFIRM + typed comment in Quartzarch
    await p.goto(URL + "#/set/quartzarch-48", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
    const ta = p.locator(".stg[data-stage='2'] .card.draft").nth(0).locator("textarea");
    await ta.scrollIntoViewIfNeeded(); await ta.tap(); await p.keyboard.type("rock look is good", { delay: 20 });
    ok((await ta.inputValue()) === "rock look is good", `${tag} comment typing still works`);
    await p.locator(".stg[data-stage='2'] .card.draft").nth(0).locator("[data-vote=yes]").tap();
    await p.locator("#tab-home").tap(); await p.waitForSelector("#homesum pre");
    const want = "ClassNest v0.149\nCONFIRM\nQuartzarch #48: Adolescent F (adol-F) — rock look is good";
    ok((await p.textContent("#homesum pre")) === want, `${tag} Home shows the pending text`);
    if (mode === "clipboard") { await p.screenshot({ path: HSHOT }); console.log("  screenshot:", HSHOT); }
    await p.locator("#tab-summary").tap();
    ok((await p.textContent("#sumtext")) === want, `${tag} Summary tab still shows the same text`);
    await p.locator("#tab-home").tap(); await p.waitForSelector("#homesum pre");
    await p.locator(mode === "clipboard" ? "#homesum pre" : "#homesum #sumcopy").tap(); await p.waitForTimeout(400);
    if (mode === "clipboard") {
      ok((await p.evaluate(() => navigator.clipboard.readText())) === want, `${tag} tapping the text copies it`);
    } else {
      ok(await p.isVisible("#homesum #fallback.open"), `${tag} copy failed -> fallback box opens right on Home`);
      ok((await p.evaluate(() => location.hash)) !== "#/summary", `${tag} stays on Home`);
      await p.locator("#manualsent").tap(); await p.waitForTimeout(300);
    }
    ok((await p.textContent("#homesum")).trim() === "Nothing to send yet" && (await p.textContent("#count")) === "Nothing to send", `${tag} cleared after copy: 'Nothing to send yet'`);
    // second round via the big Copy button / bottom bar still works
    if (mode === "clipboard") {
      await p.goto(URL + "#/set/quartzarch-48", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
      await p.locator(".stg[data-stage='2'] .card.now [data-vote=yes]").tap();
      await p.locator("#tab-home").tap(); await p.waitForSelector("#homesum #sumcopy");
      await p.locator("#homesum #sumcopy").tap(); await p.waitForTimeout(400);
      const big = await p.evaluate(() => navigator.clipboard.readText()); ok(big === "ClassNest v0.149\nCONFIRM\nQuartzarch #48: Keep current Adolescent (keep-s2)", `${tag} big Copy button copies: ${JSON.stringify(big)}`);
      ok((await p.textContent("#homesum")).trim() === "Nothing to send yet", `${tag} cleared again`);
    }
    ok(errs.length === 0, `${tag} no page errors ${errs.join(" | ")}`);
    await ctx.close();
  }
}

// ---------- "Keep current" on the NOW card: mutually exclusive with the stage's drafts, copies as keep-sN
async function keepTest(b, mobile) {
  const tag = mobile ? "[keep phone]" : "[keep desktop]";
  const ctx = await b.newContext(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 900 } });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new globalThis.URL(URL).origin });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  const press = (loc) => mobile ? loc.tap() : loc.click();
  const ls = () => p.evaluate(() => JSON.parse(localStorage.getItem("classnest-review-v1") || "{}").items || {});
  const vote = async (k) => { const e = (await ls())["quartzarch-48/" + k]; return e && !e.cleared ? e.vote : null; };
  await p.goto(URL + "#/set/quartzarch-48", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
  const keep = p.locator(".stg[data-stage='2'] .card.now [data-vote=yes]");
  ok((await keep.count()) === 1 && (await p.locator(".stg[data-stage='1'] .card.now [data-vote]").count()) === 0, `${tag} Keep current only on the Adolescent NOW card (Hatchling stays non-voting)`);
  if (mobile) { const bb = await keep.boundingBox(); ok(bb && bb.height >= 44 && bb.x >= 0 && bb.x + bb.width <= 390, `${tag} Keep button is thumb-size and on screen (${bb && Math.round(bb.width)}x${bb && Math.round(bb.height)})`); }
  await keep.scrollIntoViewIfNeeded(); await press(keep);
  ok((await vote("keep-s2")) === "yes", `${tag} Keep current saved as CONFIRM keep-s2`);
  ok((await p.locator(".stg[data-stage='2'] .card.now [data-vote=yes]").getAttribute("aria-pressed")) === "true", `${tag} Keep button shows as picked`);
  ok((await p.$$(".stg[data-stage='2'] .card.draft")).length === 0, `${tag} stage decided: Adolescent F leaves To review`);
  await press(p.locator("#toast-undo"));
  ok((await vote("keep-s2")) === null && (await p.$$(".stg[data-stage='2'] .card.draft")).length === 1, `${tag} Undo un-keeps and brings the draft back`);
  // Keep -> then CONFIRM the draft -> Keep switches off
  await press(p.locator(".stg[data-stage='2'] .card.now [data-vote=yes]"));
  await press(p.locator("[data-filter=all]")); await p.waitForTimeout(300);
  const dE = p.locator(".stg[data-stage='2'] .card.draft", { hasText: "Adolescent F" }).locator("[data-vote=yes]");
  await dE.scrollIntoViewIfNeeded(); await press(dE);
  ok((await vote("adol-F")) === "yes" && (await vote("keep-s2")) === null, `${tag} CONFIRM Adolescent F switches Keep current off`);
  await press(p.locator("#toast-undo"));
  ok((await vote("adol-F")) === null && (await vote("keep-s2")) === "yes", `${tag} Undo restores Keep current`);
  await press(dE);
  // ...and Keep again -> the draft's CONFIRM switches off
  const k2 = p.locator(".stg[data-stage='2'] .card.now [data-vote=yes]"); await k2.scrollIntoViewIfNeeded(); await press(k2);
  ok((await vote("keep-s2")) === "yes" && (await vote("adol-F")) === null, `${tag} Keep current switches the draft's CONFIRM off`);
  await press(p.locator("[data-filter=todo]")); await p.waitForTimeout(200);
  await p.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); }); await p.waitForTimeout(300);
  await press(p.locator("#copy")); await p.waitForTimeout(500);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  ok(clip === "ClassNest v0.149\nCONFIRM\nQuartzarch #48: Keep current Adolescent (keep-s2)", `${tag} copies as 'Keep current Adolescent (keep-s2)': ${JSON.stringify(clip)}`);
  if (mobile) await p.screenshot({ path: (process.env.SHOT || "/workspace/classnest-shots/pages-phone") + "-keep.png" });
  ok(errs.length === 0, `${tag} no page errors ${errs.join(" | ")}`);
  await ctx.close();
}

// ---------- REJECT on draft cards: any number per stage, either-or with that draft's CONFIRM, undo, copy text, phone layout
async function rejectTest(b, mobile) {
  const tag = mobile ? "[reject phone]" : "[reject desktop]";
  const W = mobile ? 390 : 1280;
  const ctx = await b.newContext(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 900 } });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new globalThis.URL(URL).origin });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  const press = async (loc) => { await loc.scrollIntoViewIfNeeded(); await (mobile ? loc.tap() : loc.click()); await p.waitForTimeout(120); };
  const ls = () => p.evaluate(() => JSON.parse(localStorage.getItem("classnest-review-v1") || "{}").items || {});
  const V = async (sid, id) => { const e = (await ls())[sid + "/" + id]; return e && !e.cleared ? e.vote : null; };
  const btn = (id, v) => p.locator(`.card [data-vote=${v}][data-id="${id}"]`);
  const undo = () => press(p.locator("#toast-undo"));
  const todoN = async () => +((await p.textContent("[data-filter=todo]")).match(/\((\d+)\)/) || [])[1];

  // Emberpuff Adolescent drafts shipped in v0.149 — reject flows now use Quartzarch's one open draft (adol-F)
  await p.goto(URL + "#/set/emberpuff-drafts", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
  ok((await p.$$(".stg[data-stage='2'] .card.draft [data-vote=reject]")).length === 0, `${tag} Emberpuff has 0 open Adolescent drafts after SHIPPED v0.149`);

  await p.goto(URL + "#/set/quartzarch-48", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
  const id = "adol-F";
  ok((await p.$$(".stg[data-stage='2'] .card.draft [data-vote=reject]")).length === 1, `${tag} Quartzarch has 1 open Adolescent draft with REJECT`);
  ok((await p.$$(".card.now [data-vote=reject]")).length === 0, `${tag} no REJECT on NOW / Hatchling cards`);
  // phone layout: three buttons, each >= 44px, all inside the card at 390px, labels not clipped
  const lay = await p.$$eval(".stg[data-stage='2'] .card.draft .vote", (rows) => rows.map((r) => { const c = r.closest(".card").getBoundingClientRect(); return [...r.querySelectorAll("button")].map((x) => { const bb = x.getBoundingClientRect(); return { t: x.textContent.trim(), h: bb.height, l: bb.left, r: bb.right, cl: c.left, cr: c.right, clip: x.scrollWidth > x.clientWidth + 1 }; }); }));
  const flat = lay.flat();
  ok(lay.every((r) => r.length === 3) && flat.every((x) => x.h >= 44 && x.l >= x.cl && x.r <= x.cr && x.r <= W && !x.clip), `${tag} vote row CONFIRM/REMAKE/REJECT fits (${flat.slice(0, 3).map((x) => `${x.t} ${Math.round(x.r - x.l)}x${Math.round(x.h)}`).join(", ")})`);
  const n0 = await todoN();
  await press(p.locator("[data-filter=all]")); await p.waitForTimeout(250);
  // reject the open draft
  await press(btn(id, "reject"));
  ok((await V("quartzarch-48", id)) === "reject", `${tag} Adolescent F rejected`);
  const look = await p.$$eval('.stg[data-stage="2"] .card.draft.reject:has([data-id="adol-F"])', (cs) => cs.map((c) => !!c.querySelector(".rtag") && c.querySelector(".rtag").textContent === "REJECTED" && +getComputedStyle(c.querySelector(".media")).opacity < 0.6 && c.querySelector("[data-vote=reject]").getAttribute("aria-pressed") === "true"));
  ok(look.length === 1 && look.every(Boolean), `${tag} rejected card is dimmed with a red REJECTED tag`);
  await press(p.locator("[data-filter=todo]")); await p.waitForTimeout(250);
  ok((await todoN()) === n0 - 1 && (await p.$$(".stg[data-stage='2'] .card.draft.reject")).length === 0, `${tag} rejected draft leaves To review (${n0} -> ${await todoN()})`);
  await press(p.locator("[data-filter=reject]")); await p.waitForTimeout(250);
  ok((await p.$$(".stg[data-stage='2'] .card.draft")).length === 1, `${tag} 'Reject' filter lists the rejected draft`);
  await press(p.locator("[data-filter=all]")); await p.waitForTimeout(250);
  // undo the reject
  await undo();
  ok((await V("quartzarch-48", id)) === null, `${tag} Undo un-rejects`);
  // tap REJECT again = reject; tap again = un-reject (with undo)
  await press(btn(id, "reject"));
  ok((await V("quartzarch-48", id)) === "reject", `${tag} REJECT again`);
  await press(btn(id, "reject"));
  ok((await V("quartzarch-48", id)) === null, `${tag} tapping REJECT again un-rejects`);
  await undo(); ok((await V("quartzarch-48", id)) === "reject", `${tag} Undo brings that reject back`);
  // CONFIRM -> REJECT clears the confirm; undo restores it
  await press(btn(id, "yes"));
  ok((await V("quartzarch-48", id)) === "yes", `${tag} CONFIRM ${id}`);
  await press(btn(id, "reject"));
  ok((await V("quartzarch-48", id)) === "reject", `${tag} REJECT on the confirmed draft clears its CONFIRM`);
  await undo(); ok((await V("quartzarch-48", id)) === "yes", `${tag} Undo restores the CONFIRM`);
  // REJECT -> CONFIRM clears the reject
  await press(btn(id, "reject"));
  ok((await V("quartzarch-48", id)) === "reject", `${tag} REJECT again after CONFIRM`);
  await press(btn(id, "yes"));
  ok((await V("quartzarch-48", id)) === "yes", `${tag} CONFIRM on a rejected draft clears its reject`);
  // Keep current + reject coexist (Keep switches CONFIRM off; reject stays if set separately)
  await press(btn(id, "reject"));
  ok((await V("quartzarch-48", id)) === "reject", `${tag} REJECT stays`);
  await press(p.locator(".stg[data-stage='2'] .card.now [data-vote=yes]"));
  ok((await V("quartzarch-48", "keep-s2")) === "yes" && (await V("quartzarch-48", id)) === "reject", `${tag} Keep current + reject coexist`);
  // lightbox has REJECT for drafts
  await press(p.locator(`.card:has([data-id="${id}"]) img.media`));
  ok((await p.$$("#lb-vote [data-lbvote=reject]")).length === 1, `${tag} lightbox shows REJECT on a draft`);
  await press(p.locator("#lb-x"));
  if (mobile) {
    await press(p.locator("[data-filter=all]")); await p.waitForTimeout(300);
    const c = p.locator(".stg[data-stage='2'] .card.draft", { hasText: "Adolescent F" }); await c.scrollIntoViewIfNeeded();
    await p.evaluate(() => { const r = [...document.querySelectorAll(".stg[data-stage='2'] .card.draft")].find((x) => /Adolescent F/.test(x.textContent)).getBoundingClientRect(); scrollBy(0, r.top - 110); }); await p.waitForTimeout(500);
    await p.screenshot({ path: (process.env.SHOT || "/workspace/classnest-shots/pages-phone") + "-reject.png" });
  }
  // copy text: REJECT section grouped with CONFIRM
  await press(p.locator("#tab-home")); await p.waitForSelector("#homesum pre");
  const home = await p.textContent("#homesum pre");
  const want = "ClassNest v0.149\nCONFIRM\nQuartzarch #48: Keep current Adolescent (keep-s2)\nREJECT\nQuartzarch #48: Adolescent F (adol-F)";
  ok(home === want, `${tag} Home tap-to-copy groups REJECT with CONFIRM: ${JSON.stringify(home)}`);
  ok((await p.textContent("#count")) === "1 confirm · 0 remake · 1 reject to send", `${tag} bottom bar counts rejects: ${await p.textContent("#count")}`);
  await press(p.locator("#tab-summary"));
  ok((await p.$$eval(".sum-sec b", (e) => e.map((x) => x.textContent))).join("|") === "CONFIRM (1)|REJECT (1)", `${tag} Summary has a REJECT section`);
  await press(p.locator("#tab-home")); await p.waitForSelector("#homesum pre");
  await press(p.locator("#homesum #sumcopy")); await p.waitForTimeout(400);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  ok(clip === home, `${tag} copied text = Home box text`);
  ok((await p.textContent("#homesum")).trim() === "Nothing to send yet", `${tag} cleared after copy`);
  await p.goto(URL + "#/set/quartzarch-48", { waitUntil: "networkidle" }); await p.waitForSelector(".stg");
  await press(p.locator("[data-filter=sent]")); await p.waitForTimeout(250);
  ok((await p.$$eval(".pin", (e) => e.map((x) => x.textContent))).filter((t) => /^Sent REJECT/.test(t)).length === 1, `${tag} sent reject shows 'Sent REJECT'`);
  await press(p.locator("[data-filter=todo]"));
  ok(errs.length === 0, `${tag} no page errors ${errs.join(" | ")}`);
  await ctx.close();
}
