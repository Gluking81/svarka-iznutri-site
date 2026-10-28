/* Svarka Izнутри: analytics only after explicit visitor opt-in. */
(() => {
  "use strict";
  const tag = document.currentScript;
  const yid = Number(tag?.dataset?.metrika || 0);
  const ga = String(tag?.dataset?.ga4 || "");
  const storageKey = "svarka_analytics_consent_v1";
  const gaOk = /^G-[A-Z0-9]+$/.test(ga);
  const yOk = Number.isInteger(yid) && yid > 100000000;
  let activated = false;
  let decision = null;
  try { decision = localStorage.getItem(storageKey); } catch {}
  function remember(value) {
    decision = value;
    try { localStorage.setItem(storageKey, value); } catch {}
  }
  function loadMetrika() {
    if (!yOk) return;
    const w = window;
    w.ym = w.ym || function() { (w.ym.a = w.ym.a || []).push(arguments); };
    w.ym.l = Date.now();
    w.ym(yid, "init", { clickmap:false, trackLinks:false, accurateTrackBounce:false, webvisor:false });
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://mc.yandex.ru/metrika/tag.js";
    s.dataset.provider = "yandex-metrika";
    document.head.appendChild(s);
  }
  function loadGoogle() {
    if (!gaOk) return;
    const w = window;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function() { w.dataLayer.push(arguments); };
    w.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    w.gtag("consent", "update", { analytics_storage: "granted" });
    w.gtag("js", new Date());
    w.gtag("config", ga, { send_page_view:true });
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga);
    s.dataset.provider = "google-analytics-4";
    document.head.appendChild(s);
  }
  function activate() {
    if (activated || decision !== "yes") return;
    activated = true;
    loadMetrika();
    loadGoogle();
  }
  const track = (action, detail) => {
    if (!activated || !/^(telegram_click|article_open|tool_submit|product_click)$/.test(action)) return;
    const safeDetail = /^(process_selection|wire_consumption|torch_checklist|mma_selection|mma_defect|mma_consumption|mma_ozon|mma_vds)$/.test(String(detail)) ? detail : "";
    if (yOk && typeof window.ym === "function") {
      window.ym(yid, "reachGoal", action, safeDetail ? { tool_name:safeDetail } : {});
    }
    if (gaOk && typeof window.gtag === "function") {
      window.gtag("event", action, safeDetail ? { tool_name:safeDetail } : {});
    }
  };
  function init() {
    const banner = document.getElementById("site-analytics-consent");
    if (!banner) return;
    if (decision === "yes") activate();
    else if (decision !== "no") banner.hidden = false;
    const settings = document.querySelectorAll("[data-analytics-settings]");
    for (const b of settings) b.addEventListener("click", () => {
      banner.hidden = false;
      banner.querySelector("[data-analytics-allow]")?.focus();
    });
    banner.querySelector("[data-analytics-allow]")?.addEventListener("click", () => {
      remember("yes"); banner.hidden = true; activate();
    });
    banner.querySelector("[data-analytics-decline]")?.addEventListener("click", () => {
      const wasActive = activated;
      remember("no"); banner.hidden = true;
      if (wasActive) location.reload();
    });
    document.addEventListener("click", e => {
      const link = e.target?.closest?.("a[data-track]");
      if (!link) return;
      const action = link.dataset.track;
      if (action === "telegram_click" || action === "article_open") track(action);
      else if (action === "product_click") track(action, link.dataset.productSource === "ozon" ? "mma_ozon" : "mma_vds");
    }, { capture:true });
    for (const [formId, name] of [["tool-process","process_selection"],["tool-consumable","wire_consumption"],["torch-check-form","torch_checklist"],["mma-selection","mma_selection"],["mma-defect","mma_defect"],["mma-consumption","mma_consumption"]]) {
      document.getElementById(formId)?.addEventListener("submit", () => track("tool_submit",name));
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})();
