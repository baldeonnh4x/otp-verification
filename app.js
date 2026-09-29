(() => {
  "use strict";

  const CORRECT_CODE = "4719";
  const RADIUS       = 50;
  const SNAP_MS      = 450;
  const TURN_MS      = 500;
  const SINK_MS      = 500;
  const SINK_GAP     = 110;

  const card        = document.getElementById("card");
  const cardTitle   = document.getElementById("cardTitle");
  const cardSub     = document.getElementById("cardSub");
  const stage       = document.getElementById("stage");
  const slots       = Array.from(document.querySelectorAll(".slot"));
  const inputs      = Array.from(document.querySelectorAll(".slot input"));
  const orbitLayer  = document.getElementById("orbitLayer");
  const sms         = document.getElementById("sms");
  const fillBtn     = document.getElementById("fillBtn");
  const resendText  = document.getElementById("resendText");
  const success     = document.getElementById("success");
  const galaxy      = document.getElementById("galaxy");

  let verifying = false;
  let started   = false;

  /* ---------- Fila inicial ---------- */
  function layoutRow() {
    const gap    = 12;
    const size   = slots[0].offsetWidth || 52;
    const total  = size * 4 + gap * 3;
    const startX = -total / 2 + size / 2;
    slots.forEach((slot, i) => {
      slot.style.transition = "none";
      slot.style.left = `${startX + i * (size + gap)}px`;
      slot.style.top  = `0px`;
      slot.style.transform = "rotate(0deg)";
      slot.style.opacity = "1";
      void slot.offsetWidth;
      slot.style.transition = "";
    });
  }

  /* ---------- Posiciones circulares ---------- */
  const FINAL_ANGLES = [-90, 0, 90, 180];
  function angleToXY(a) {
    const rad = (a * Math.PI) / 180;
    return { x: Math.cos(rad) * RADIUS, y: Math.sin(rad) * RADIUS };
  }

  function lightUpSlot(input) {
    const slot = input.parentElement;
    slot.classList.remove("lit");
    void slot.offsetWidth;
    slot.classList.add("lit");
  }

  /* ---------- Inputs ---------- */
  inputs.forEach((input, i) => {
    input.addEventListener("input", (e) => {
      const v = e.target.value.replace(/\D/g, "");
      e.target.value = v.slice(-1);
      e.target.classList.remove("ok", "err");

      if (e.target.value) {
        lightUpSlot(e.target);
      } else {
        e.target.parentElement.classList.remove("lit");
      }

      if (e.target.value && i < inputs.length - 1) inputs[i + 1].focus();
      if (getCode().length === 4) setTimeout(triggerVerify, 100);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (getCode().length === 4) triggerVerify();
      }
      if (e.key === "Backspace" && !e.target.value && i > 0) {
        inputs[i - 1].focus();
        inputs[i - 1].value = "";
      }
      if (e.key === "ArrowLeft"  && i > 0) inputs[i - 1].focus();
      if (e.key === "ArrowRight" && i < inputs.length - 1) inputs[i + 1].focus();
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text");
      const digits = text.replace(/\D/g, "").slice(0, 4);
      if (!digits) return;
      digits.split("").forEach((d, idx) => {
        if (inputs[idx]) {
          inputs[idx].value = d;
          lightUpSlot(inputs[idx]);
        }
      });
      inputs[Math.min(digits.length, 3)].focus();
      if (getCode().length === 4) setTimeout(triggerVerify, 300);
    });
  });

  function getCode() { return inputs.map(i => i.value).join(""); }

  function clearInputs() {
    inputs.forEach(i => {
      i.value = "";
      i.classList.remove("ok", "err");
      i.parentElement.classList.remove("lit");
    });
    slots.forEach(s => s.style.transform = "rotate(0deg)");
    orbitLayer.style.transform = "rotate(0deg)";
    stage.classList.remove("orbiting", "hole");
    layoutRow();
    inputs[0].focus();
  }

  function setInputsDisabled(state) {
    inputs.forEach(i => (i.disabled = state));
  }

  function triggerVerify() {
    if (verifying || started) return;
    started = true;
    verify(getCode());
  }

  function verify(code) {
    verifying = true;
    setInputsDisabled(true);

    if (code === CORRECT_CODE) {
      inputs.forEach((inp, i) => {
        setTimeout(() => lightUpSlot(inp), i * 70);
      });
      setTimeout(snapToCircle, 320);
    } else {
      inputs.forEach(i => i.classList.add("err"));
      card.classList.add("shake");
      setTimeout(() => {
        card.classList.remove("shake");
        clearInputs();
        verifying = false;
        started = false;
        setInputsDisabled(false);
      }, 900);
    }
  }

  /* ---------- PASO 1: caminan al círculo ---------- */
  function snapToCircle() {
    stage.classList.add("orbiting");

    slots.forEach((slot, i) => {
      const { x, y } = angleToXY(FINAL_ANGLES[i]);
      slot.style.left = `${x}px`;
      slot.style.top  = `${y}px`;
    });

    setTimeout(startFastSpin, SNAP_MS + 120);
  }

  /* ---------- PASO 2: giro rápido ---------- */
  function startFastSpin() {
    orbitLayer.style.transformOrigin = "0 0";

    const spin = orbitLayer.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(360deg)" }
      ],
      {
        duration: TURN_MS,
        easing: "cubic-bezier(.55,.05,.45,.95)",
        fill: "forwards"
      }
    );

    setTimeout(() => {
      inputs.forEach((inp, i) => {
        setTimeout(() => {
          inp.parentElement.classList.remove("lit");
          inp.classList.add("ok");
        }, i * 60);
      });
    }, TURN_MS * 0.5);

    spin.onfinish = () => {
      setTimeout(startSinkChain, 120);
    };
  }

  /* ---------- PASO 3: se hunden al hub en cadena ---------- */
  function startSinkChain() {
    stage.classList.add("hole");

    const totalSinkTime = SINK_MS + SINK_GAP * (slots.length - 1) + 100;
    orbitLayer.animate(
      [
        { transform: "rotate(360deg)" },
        { transform: "rotate(540deg)" }
      ],
      {
        duration: totalSinkTime,
        easing: "cubic-bezier(.4,0,.6,1)",
        fill: "forwards"
      }
    );

    slots.forEach((slot, i) => {
      const startLeft = parseFloat(slot.style.left) || 0;
      const startTop  = parseFloat(slot.style.top)  || 0;
      const delay     = i * SINK_GAP;

      slot.animate(
        [
          {
            left: `${startLeft}px`,
            top:  `${startTop}px`,
            transform: "rotate(0deg) scale(1)",
            opacity: 1,
            offset: 0
          },
          {
            left: `${startLeft * 0.55}px`,
            top:  `${startTop * 0.55}px`,
            transform: "rotate(200deg) scale(.7)",
            opacity: 1,
            offset: 0.5
          },
          {
            left: "0px",
            top:  "0px",
            transform: "rotate(420deg) scale(.05)",
            opacity: 0,
            offset: 1
          }
        ],
        {
          duration: SINK_MS,
          delay,
          easing: "cubic-bezier(.45,.05,.6,.95)",
          fill: "forwards"
        }
      );
    });

    const orbit = document.getElementById("orbit");
    orbit.animate(
      [
        { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        { opacity: 0, transform: "translate(-50%, -50%) scale(.35)" }
      ],
      { duration: totalSinkTime, easing: "ease-in", fill: "forwards" }
    );

    setTimeout(finishWithSuccess, totalSinkTime + 80);
  }

  /* ---------- PASO 4: success ---------- */
  function finishWithSuccess() {
    stage.style.transition = "opacity .35s ease, transform .35s ease";
    stage.style.opacity = "0";
    stage.style.transform = "scale(.85)";

    setTimeout(() => {
      stage.style.display = "none";
      sms.style.display = "none";
      document.querySelector(".hint").style.display = "none";
      document.querySelector(".resend").style.display = "none";

      cardTitle.textContent = "Verified successfully";
      cardTitle.style.color = "var(--ok)";
      cardSub.textContent = "Your number has been verified.";

      success.classList.add("show");
      launchGalaxy();
    }, 200);
  }

  /* ---------- Galaxia ---------- */
  function launchGalaxy() {
    galaxy.innerHTML = "";
    const TOTAL = 26;

    for (let i = 0; i < TOTAL; i++) {
      const star = document.createElement("span");
      star.className = "star";

      const r = 40 + Math.random() * 35;
      const size = 2 + Math.random() * 3;
      star.style.width  = `${size}px`;
      star.style.height = `${size}px`;

      const hue = 150 + Math.random() * 20;
      const light = 55 + Math.random() * 20;
      star.style.background = `hsl(${hue} 90% ${light}%)`;

      galaxy.appendChild(star);

      const dur   = 4000 + Math.random() * 4000;
      const delay = Math.random() * 1500;
      const dir   = Math.random() < .5 ? 1 : -1;
      const startRot = Math.random() * 360;

      star.animate(
        [
          {
            transform: `rotate(${startRot}deg) translateX(${r}px) rotate(${-startRot}deg) scale(0)`,
            opacity: 0
          },
          {
            offset: 0.15,
            transform: `rotate(${startRot + dir * 60}deg) translateX(${r}px) rotate(${-(startRot + dir * 60)}deg) scale(1)`,
            opacity: 1
          },
          {
            offset: 0.85,
            transform: `rotate(${startRot + dir * 306}deg) translateX(${r}px) rotate(${-(startRot + dir * 306)}deg) scale(1)`,
            opacity: 1
          },
          {
            transform: `rotate(${startRot + dir * 360}deg) translateX(${r}px) rotate(${-(startRot + dir * 360)}deg) scale(.8)`,
            opacity: 0
          }
        ],
        {
          duration: dur,
          delay,
          easing: "linear",
          iterations: Infinity
        }
      );
    }
  }

  /* ---------- Fill ---------- */
  fillBtn.addEventListener("click", () => {
    if (verifying || started) return;
    fillBtn.disabled = true;
    const digits = CORRECT_CODE.split("");
    let i = 0;

    const typeNext = () => {
      if (i >= digits.length) {
        fillBtn.disabled = false;
        setTimeout(triggerVerify, 180);
        return;
      }
      inputs[i].value = digits[i];
      inputs[i].classList.remove("ok", "err");
      lightUpSlot(inputs[i]);
      inputs[i].focus();
      i++;
      setTimeout(typeNext, 110);
    };
    typeNext();
  });

  /* ---------- Resend ---------- */
  let seconds = 24;
  const tick = () => {
    seconds--;
    if (seconds > 0) {
      resendText.textContent = `Resend in ${seconds}s`;
      setTimeout(tick, 1000);
    } else {
      resendText.innerHTML = `<a href="#" style="color:var(--ice);text-decoration:none;font-weight:600;">Resend code</a>`;
    }
  };
  setTimeout(tick, 1000);

  /* ---------- Init ---------- */
  function init() {
    layoutRow();
    inputs[0].focus();
  }
  window.addEventListener("load", init);
  window.addEventListener("resize", () => {
    if (!verifying && !started) layoutRow();
  });
})();