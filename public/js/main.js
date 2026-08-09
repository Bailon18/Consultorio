(function () {
  "use strict";

  var config = window.CV_CONFIG || {};
  var dict = window.CV_I18N || {};
  var waNumber = String(config.whatsappNumber || "").replace(/\D/g, "");
  var currentLang = "es";
  var STORAGE_KEY = "cv_lang";

  /* ---------- Año ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Aviso de privacidad (acordeón) ---------- */
  function openPrivacyFold() {
    var fold = document.getElementById("aviso-privacidad");
    if (!fold) return;
    fold.open = true;
    fold.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (location.hash === "#aviso-privacidad" || location.hash === "#politica-datos") {
    openPrivacyFold();
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href="#aviso-privacidad"], a[href="#politica-datos"]');
    if (!link) return;
    setTimeout(openPrivacyFold, 0);
  });

  /* ---------- i18n ---------- */
  function t(key) {
    var pack = dict[currentLang] || dict.es || {};
    return pack[key] != null ? pack[key] : (dict.es && dict.es[key]) || key;
  }

  function applyI18n(lang) {
    if (!dict[lang]) lang = "es";
    currentLang = lang;
    document.documentElement.lang = lang;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var value = t(key);
      if (el.tagName === "TITLE") {
        el.textContent = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });

    var title = t("meta_title");
    document.title = title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("meta_description"));

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    wireWhatsApp();
    updateMenuAria();
  }

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyI18n(btn.getAttribute("data-lang") || "es");
    });
  });

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (_) {}
  var initial =
    saved ||
    (navigator.language && navigator.language.toLowerCase().startsWith("en") ? "en" : "es");
  applyI18n(initial);

  /* ---------- Header scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("nav-drawer");

  function updateMenuAria() {
    if (!toggle) return;
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-label", t(open ? "menu_close" : "menu_open"));
  }

  function setMenu(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.classList.toggle("is-open", open);
    if (open) drawer.removeAttribute("hidden");
    else drawer.setAttribute("hidden", "");
    updateMenuAria();
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Anclas del menú (Inicio siempre vuelve arriba) ---------- */
  document.querySelectorAll('a[href="#inicio"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.getElementById("inicio");
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.replaceState) {
        history.replaceState(null, "", "#inicio");
      } else {
        location.hash = "inicio";
      }
      if (toggle && drawer) setMenu(false);
    });
  });

  /* ---------- Tracking ---------- */
  window.dataLayer = window.dataLayer || [];
  function trackEvent(name, params) {
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
    if (typeof window.fbq === "function") window.fbq("trackCustom", name, params || {});
  }

  /* ---------- WhatsApp ---------- */
  function buildWaUrl(message) {
    return "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(message || t("wa_default"));
  }

  function wireWhatsApp() {
    document.querySelectorAll(".js-whatsapp").forEach(function (el) {
      var waKey = el.getAttribute("data-i18n-wa");
      var msg = waKey ? t(waKey) : t("wa_default");
      el.setAttribute("href", buildWaUrl(msg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
      if (!el._waBound) {
        el.addEventListener("click", function () {
          trackEvent("whatsapp_click", {
            event_category: "conversion",
            event_label: el.getAttribute("data-event") || "whatsapp",
            language: currentLang,
          });
          trackEvent("generate_lead", {
            method: "whatsapp",
            source: el.getAttribute("data-event") || "whatsapp",
            language: currentLang,
          });
        });
        el._waBound = true;
      }
    });
  }

  /* ---------- Botón volver arriba ---------- */
  (function toTop() {
    var btn = document.getElementById("to-top");
    if (!btn) return;

    function onScroll() {
      btn.classList.toggle("is-visible", window.pageYOffset > 500);
    }

    btn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Widget WhatsApp (panel al hacer clic) ---------- */
  (function waWidget() {
    var widget = document.getElementById("wa-widget");
    var toggle = document.getElementById("wa-toggle");
    var closeBtn = document.getElementById("wa-close");
    if (!widget || !toggle) return;

    function setOpen(open) {
      widget.classList.toggle("is-open", open);
      document.body.classList.toggle("wa-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      var panel = document.getElementById("wa-panel");
      if (panel) panel.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        trackEvent("whatsapp_open_panel", { event_category: "engagement", language: currentLang });
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!widget.classList.contains("is-open"));
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setOpen(false);
      });
    }

    document.addEventListener("click", function (e) {
      if (widget.classList.contains("is-open") && !widget.contains(e.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  })();

  /* ---------- Formulario ---------- */
  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");

  if (form) {
    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : "";
    var errorBox = document.getElementById("form-error");

    function showError() {
      if (errorBox) {
        errorBox.classList.add("is-visible");
      } else {
        alert(t("form_error"));
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var honeypot = form.querySelector('[name="empresa"]');
      if (honeypot && honeypot.value) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      trackEvent("form_submit", {
        event_category: "conversion",
        event_label: "contact_form",
        modality: form.modalidad.value,
        language: currentLang,
      });
      trackEvent("generate_lead", {
        method: "form",
        modality: form.modalidad.value,
        language: currentLang,
      });

      var endpoint = config.formEndpoint;
      if (!endpoint) {
        form.style.display = "none";
        if (success) success.classList.add("is-visible");
        return;
      }

      if (errorBox) errorBox.classList.remove("is-visible");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t("form_sending");
      }

      var payload = {
        nombre: form.nombre.value,
        telefono: form.telefono.value,
        email: form.email.value,
        modalidad: form.modalidad.value,
        horario: form.horario.value,
        _subject: "Nueva solicitud de cita — " + form.nombre.value,
        _template: "table",
        _captcha: "false",
      };

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("bad_status");
          return res.json();
        })
        .then(function () {
          form.style.display = "none";
          if (success) success.classList.add("is-visible");
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
          }
          showError();
        });
    });
  }

  /* ---------- Tabs (Servicios / Modalidades / Reservar / Contacto) ---------- */
  (function tabs() {
    var root = document.querySelector("[data-tabs]");
    if (!root) return;

    var buttons = root.querySelectorAll(".tabs__btn");
    var panels = root.querySelectorAll(".tab-panel");

    function activate(id, scroll) {
      if (!id) return;
      buttons.forEach(function (btn) {
        var on = btn.getAttribute("data-tab") === id;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var on = panel.getAttribute("data-panel") === id;
        panel.classList.toggle("is-active", on);
        if (on) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      });
      if (scroll) {
        var target = document.getElementById("explorar");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      try {
        history.replaceState(null, "", "#explorar");
      } catch (_) {}
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activate(btn.getAttribute("data-tab"), false);
      });
    });

    document.querySelectorAll("[data-tab]").forEach(function (el) {
      if (el.classList.contains("tabs__btn")) return;
      el.addEventListener("click", function (e) {
        var id = el.getAttribute("data-tab");
        if (!id) return;
        e.preventDefault();
        activate(id, true);
        if (toggle && drawer) setMenu(false);
      });
    });
  })();

  /* ---------- Reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Analytics stubs ---------- */
  function loadGa4(id) {
    if (!id) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id);
  }

  function loadMetaPixel(id) {
    if (!id || typeof window.fbq === "function") return;
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id);
    window.fbq("track", "PageView");
  }

  loadGa4(config.ga4Id);
  loadMetaPixel(config.metaPixelId);
})();
