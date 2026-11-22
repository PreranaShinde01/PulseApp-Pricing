/**
 * PulseApp — Pricing toggle
 *
 * Switches all .price values between monthly and yearly,
 * updates the billing period label, and manages aria-pressed
 * on the two toggle buttons.
 *
 * Data lives in HTML attributes (data-monthly / data-yearly)
 * so this script contains no repeated price numbers.
 */

(function () {
  "use strict";

  /* ── DOM refs ─────────────────────────────────────────── */
  var btnMonthly = document.getElementById("btn-monthly");
  var btnYearly  = document.getElementById("btn-yearly");
  var prices     = document.querySelectorAll(".price");
  var units      = document.querySelectorAll(".unit");
  var billedNotes = document.querySelectorAll(".billed-note");

  /* ── Yearly billed-annually labels (computed from data) ─ */
  /**
   * Returns a human-readable "billed as $X/yr" note for each
   * card using its own data-yearly attribute, so we never
   * hard-code numbers in this script.
   */
  function getYearlyNote(priceEl) {
    return "billed as $" + priceEl.dataset.yearly + "\u2009/\u2009yr";
  }

  /* ── Core toggle function ─────────────────────────────── */
  function setPeriod(period) {
    var isYearly = period === "yearly";

    /* 1. Update every price element */
    prices.forEach(function (p) {
      /* Brief flash animation */
      p.classList.remove("animating");
      /* Trigger reflow so removing + re-adding the class works */
      void p.offsetWidth;
      p.classList.add("animating");

      p.textContent = isYearly ? p.dataset.yearly : p.dataset.monthly;
    });

    /* 2. Update "per month / per year" labels */
    units.forEach(function (u) {
      u.textContent = isYearly ? "per month*" : "per month";
    });

    /* 3. Show/hide "billed as $X/yr" note */
    billedNotes.forEach(function (note, i) {
      if (isYearly) {
        note.textContent = prices[i] ? getYearlyNote(prices[i]) : "";
      } else {
        note.textContent = "";
      }
    });

    /* 4. Update button states */
    [btnMonthly, btnYearly].forEach(function (btn) {
      var active = (btn.id === "btn-" + period);
      btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle("active", active);
    });
  }

  /* ── Event listeners ──────────────────────────────────── */
  btnMonthly.addEventListener("click", function () { setPeriod("monthly"); });
  btnYearly.addEventListener("click",  function () { setPeriod("yearly");  });

  /* Keyboard: allow Space/Enter on the buttons (native for <button>) */

  /* ── Initialise on page load ──────────────────────────── */
  setPeriod("monthly");

})();
