/* "Stuck right now?" — a free helper on the homepage.
   You type what you're avoiding, Hupp shrinks it to one tiny first step,
   and you can start a 2-minute timer. Everything happens in the browser. Nothing is saved or sent. */
(function () {
  "use strict";
  var root = document.getElementById("stuck");
  if (!root) return;

  /* Each idea has three steps, from small to smallest. The first matching word wins. */
  var IDEAS = [
    [/e-?mail|inbox|\brepl(y|ies)|\brespond|\bmessages?\b|\btext\b|\bdms?\b|\bletter/i,
      ["Open it and write one sentence. Messy is fine.", "Just open the email. Don't reply yet.", "Just open your inbox."]],
    [/\bcall|\bphone|appointment|dentist|doctor|\bschedule|\bbook (a|an|my|the)\b/i,
      ["Write down the first thing you'll say.", "Just find the number.", "Pick up your phone and hold it."]],
    [/\bdish|kitchen|\bsink\b/i,
      ["Wash just the forks.", "Turn on the tap.", "Walk to the sink."]],
    [/laundry|clothes|\bwash/i,
      ["Put one load in the machine.", "Gather the clothes into one pile.", "Pick up one sock."]],
    [/clean|\btidy|room\b|\bmess\b|messy|declutter|organi[sz]e|vacuum/i,
      ["Pick up five things and put them away.", "Pick up one thing.", "Stand up and look at the room for ten seconds."]],
    [/\btax|\bbills?\b|\bpay\b|\bbank|money|budget|\brent\b|invoice|\bforms?\b/i,
      ["Open the account or the folder and just look. No fixing yet.", "Find the login page or the folder.", "Put the papers on the table."]],
    [/\bstudy|studying|homework|\bexams?\b|\btests?\b|\bread\b|\breading|\blearn|\bcourse|\bclass/i,
      ["Read one page.", "Open the book or file where you stopped.", "Put the book on your desk."]],
    [/\bwrite|writing|essay|report|project|\bdraft|\bwork\b|assignment|\bpost\b/i,
      ["Write one bad sentence. Bad is allowed.", "Open a blank page and type the title.", "Open the document."]],
    [/\bgym|workout|exercise|\brun\b|running|\bwalk|stretch|yoga/i,
      ["Do one stretch.", "Put on your shoes.", "Stand up."]],
    [/\bbed\b|get up|shower|teeth|\bbrush|get dressed/i,
      ["Sit up.", "Put your feet on the floor.", "Wiggle your toes."]],
    [/\bcook|\beat\b|\bfood|\bmeals?\b|lunch|dinner|breakfast/i,
      ["Get one thing out of the fridge.", "Open the fridge and look.", "Drink a glass of water first."]]
  ];
  var GENERIC = ["Do the very first action, like opening it or picking it up.", "Just put it in front of you.", "Say out loud what it is. That's a start."];
  var TWO_MIN = 120;

  var panes = {};
  root.querySelectorAll("[data-st]").forEach(function (p) { panes[p.getAttribute("data-st")] = p; });
  var form = root.querySelector("[data-stuck-form]");
  var input = form.querySelector("input");
  var smallerBtn = root.querySelector("[data-smaller]");
  var clock = root.querySelector("[data-clock]");
  var bricks = root.querySelectorAll("[data-timer-bricks] i");
  var steps = GENERIC, level = 0, timer = null, endsAt = 0;

  function show(name) {
    Object.keys(panes).forEach(function (k) { panes[k].hidden = k !== name; });
    var q = panes[name].querySelector(".q");
    if (q) q.focus({ preventScroll: true });
    if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ behavior: "smooth" });
  }

  function pick(task) {
    for (var i = 0; i < IDEAS.length; i++) if (IDEAS[i][0].test(task)) return IDEAS[i][1];
    return GENERIC;
  }

  function render() {
    root.querySelector("[data-tiny]").textContent = steps[level];
    smallerBtn.hidden = level >= steps.length - 1;
  }

  function begin(task) {
    task = task.trim().slice(0, 80);
    if (!task) { input.focus(); return; }
    root.querySelector("[data-task]").textContent = task;
    steps = pick(task);
    level = 0;
    render();
    show("step");
  }

  function tick() {
    var left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
    clock.textContent = Math.floor(left / 60) + ":" + ("0" + (left % 60)).slice(-2);
    var filled = Math.floor((TWO_MIN - left) / (TWO_MIN / bricks.length));
    bricks.forEach(function (b, i) { b.classList.toggle("on", i < filled); });
    if (left === 0) finish();
  }

  function startTimer() {
    stopTimer();
    root.querySelector("[data-tiny-copy]").textContent = steps[level];
    endsAt = Date.now() + TWO_MIN * 1000;
    tick();
    timer = setInterval(tick, 250);
    show("timer");
  }

  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  function finish() {
    stopTimer();
    show("done");
    window.wallHop && window.wallHop(panes.done.querySelector(".hopper"));
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); begin(input.value); });
  root.querySelectorAll("[data-chip]").forEach(function (c) {
    c.addEventListener("click", function () { input.value = c.textContent; begin(c.textContent); });
  });
  smallerBtn.addEventListener("click", function () { if (level < steps.length - 1) { level++; render(); } });
  root.querySelector("[data-start]").addEventListener("click", startTimer);
  root.querySelector("[data-more]").addEventListener("click", startTimer);
  root.querySelector("[data-did]").addEventListener("click", finish);
  root.querySelector("[data-stop]").addEventListener("click", function () { stopTimer(); show("rest"); });
  root.querySelectorAll("[data-again]").forEach(function (b) {
    b.addEventListener("click", function () { stopTimer(); input.value = ""; show("ask"); input.focus(); });
  });
})();
