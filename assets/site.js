/* Wall of Okay — shared behaviour: Buy buttons, free Starter form, footer links, the "hup!" hop. */
(function () {
  "use strict";
  var cfg = window.WALL_OF_OKAY || {};
  var gumroad = cfg.gumroad || {};

  /* Make Hupp hop. Any element with a Hupp inside can hop. */
  function hop(el) {
    if (!el) return;
    el.classList.remove("hop");
    void el.offsetWidth; // restart the animation
    el.classList.add("hop");
  }
  window.wallHop = hop;

  /* Small message at the bottom of the screen. */
  var noticeTimer;
  function notice(text) {
    var n = document.querySelector(".notice");
    if (!n) {
      n = document.createElement("div");
      n.className = "notice";
      n.setAttribute("role", "status");
      document.body.appendChild(n);
    }
    n.textContent = text;
    n.hidden = false;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(function () { n.hidden = true; }, 3500);
  }

  /* Buy buttons: <a data-buy="lowtide">. Uses Gumroad's on-page checkout. */
  var anyBuy = false;
  document.querySelectorAll("[data-buy]").forEach(function (a) {
    var url = gumroad[a.getAttribute("data-buy")];
    if (url) {
      a.href = url;
      a.setAttribute("data-gumroad-overlay-checkout", "true");
      anyBuy = true;
    } else {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        notice("Checkout isn't connected yet. Add the Gumroad link in assets/config.js.");
      });
    }
  });
  if (anyBuy) {
    var s = document.createElement("script");
    s.src = "https://gumroad.com/js/gumroad.js";
    s.async = true;
    document.body.appendChild(s);
  }

  /* Footer links to Etsy and Instagram. Hidden until a link is set. */
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var url = cfg[a.getAttribute("data-link")];
    if (url) { a.href = url; a.hidden = false; } else { a.hidden = true; }
  });

  /* Free Starter form, sent to Kit. */
  document.querySelectorAll("form[data-starter]").forEach(function (form) {
    var msg = form.parentNode.querySelector(".form-msg");
    var thanks = form.parentNode.querySelector(".thanks");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.email_address.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "That email doesn't look quite right. Try again?";
        form.email_address.focus();
        return;
      }
      if (!cfg.kitFormId) {
        msg.textContent = "Sign-up isn't connected yet. Add the Kit form number in assets/config.js.";
        return;
      }
      var action = "https://app.kit.com/forms/" + encodeURIComponent(cfg.kitFormId) + "/subscriptions";
      var button = form.querySelector("button");
      button.disabled = true;
      msg.textContent = "";
      fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("Kit said " + r.status);
          form.hidden = true;
          var note = form.parentNode.querySelector(".note");
          if (note) note.hidden = true;
          if (thanks) { thanks.hidden = false; hop(thanks); }
        })
        .catch(function () {
          /* If the quick way fails, send the form the normal way. Kit shows its own thank-you page. */
          form.action = action;
          form.method = "post";
          HTMLFormElement.prototype.submit.call(form);
        });
    });
  });

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
