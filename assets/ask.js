/* Ask Hupp — the homepage flow.
   1. Hupp asks your energy.  2. You play with a mini board.  3. Hupp recommends a template. */
(function () {
  "use strict";
  var root = document.getElementById("ask");
  if (!root) return;

  var BOARDS = {
    low: {
      label: "Low tide",
      tasks: [
        ["Refill water bottle", "Just carry it to the tap."],
        ["Open the laptop", "Only open it. That's the whole task."],
        ["Take out recycling", "Grab one bag. One is enough."]
      ]
    },
    mid: {
      label: "Mid tide",
      tasks: [
        ["Reply to that email", "Open it and write one line."],
        ["Book the dentist", "Find the phone number."],
        ["Water the plants", "Fill one glass of water."]
      ]
    },
    high: {
      label: "High tide",
      tasks: [
        ["Draft the project outline", "Write three headings. Nothing else."],
        ["Clear the desk", "Start with one corner."],
        ["Plan the week", "List three things that matter."]
      ]
    }
  };
  var CHEERS = ["Nice. That counts.", "Tiny step. Real step.", "Look at you go.", "That's more than okay."];
  var NEW_STEP = "Set a two-minute timer and start.";

  var steps = [root.querySelector("[data-step='1']"), root.querySelector("[data-step='2']"), root.querySelector("[data-step='3']")];
  var list = root.querySelector("[data-tasks]");
  var toast = root.querySelector(".toast");
  var toastText = toast.querySelector("[data-cheer]");
  var energy = "mid";
  var cheer = 0;
  var toastTimer;

  function show(n) {
    steps.forEach(function (s, i) { s.hidden = i !== n - 1; });
    var top = root.getBoundingClientRect().top;
    if (top < 0) root.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    var q = Array.prototype.find.call(steps[n - 1].querySelectorAll(".q"), function (x) { return x.offsetParent !== null; });
    if (q) q.focus({ preventScroll: true });
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function addTask(name, tiny, opts) {
    opts = opts || {};
    var row = el("div", "task");
    var box = el("button", "box");
    box.type = "button";
    box.setAttribute("aria-pressed", "false");
    box.setAttribute("aria-label", "Done: " + name);
    var t = el("span", "t");
    var label = el("button", "name", name);
    label.type = "button";
    var step = el("span", "step", "First tiny step: " + tiny);
    step.id = "tiny-" + Math.random().toString(36).slice(2, 8);
    label.setAttribute("aria-controls", step.id);
    label.setAttribute("aria-expanded", opts.open ? "true" : "false");
    step.hidden = !opts.open;
    t.appendChild(label);
    if (opts.isNew) t.appendChild(el("span", "new", "Just added"));
    t.appendChild(step);
    row.appendChild(box);
    row.appendChild(t);
    list.appendChild(row);

    label.addEventListener("click", function () {
      var open = step.hidden;
      step.hidden = !open;
      label.setAttribute("aria-expanded", open ? "true" : "false");
    });
    box.addEventListener("click", function () {
      var done = !row.classList.contains("done");
      row.classList.toggle("done", done);
      box.setAttribute("aria-pressed", done ? "true" : "false");
      box.textContent = done ? "✓" : "";
      if (done) celebrate();
    });
  }

  function celebrate() {
    var all = list.querySelectorAll(".task");
    var done = list.querySelectorAll(".task.done");
    toastText.textContent = all.length === done.length ? "All done. Hupp is impressed." : CHEERS[cheer++ % CHEERS.length];
    toast.hidden = false;
    window.wallHop && window.wallHop(toast);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2600);
  }

  function buildBoard() {
    var b = BOARDS[energy];
    list.innerHTML = "";
    root.querySelectorAll("[data-energy-label]").forEach(function (n) { n.textContent = b.label; });
    root.querySelector("[data-bar]").textContent = (energy === "high" ? "Full Tide" : "Low Tide") + " · Today";
    root.querySelector("[data-board-q]").textContent = "Here's your " + b.label.toLowerCase() + " board. Try it.";
    b.tasks.forEach(function (task, i) { addTask(task[0], task[1], { open: i === 0 }); });
    updateCount();
    toast.hidden = true;
  }

  function updateCount() {
    var n = list.querySelectorAll(".task").length;
    root.querySelector("[data-count]").textContent = n + (n === 1 ? " thing" : " things");
  }

  /* Step 1: energy buttons */
  steps[0].querySelectorAll("[data-energy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      steps[0].querySelectorAll("[data-energy]").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      energy = btn.getAttribute("data-energy");
      buildBoard();
      setTimeout(function () { show(2); }, 220);
    });
  });

  /* Step 2: brain dump */
  var dump = root.querySelector("[data-dump]");
  dump.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = dump.querySelector("input");
    var text = input.value.trim().slice(0, 60);
    if (!text) { input.focus(); return; }
    addTask(text, NEW_STEP, { isNew: true });
    input.value = "";
    updateCount();
  });

  /* Step 2 -> 3 */
  root.querySelector("[data-next]").addEventListener("click", function () {
    var pick = energy === "high" ? "fulltide" : "lowtide";
    steps[2].querySelectorAll("[data-rec]").forEach(function (r) { r.hidden = r.getAttribute("data-rec") !== pick; });
    show(3);
  });

  /* Back to the start */
  root.querySelectorAll("[data-restart]").forEach(function (b) {
    b.addEventListener("click", function () {
      steps[0].querySelectorAll("[data-energy]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      show(1);
    });
  });
})();
