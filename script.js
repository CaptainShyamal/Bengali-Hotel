// =======================
// Utility: set current year in footer
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  initNavBehavior();
  initReservationForm();
});

// =======================
// Sticky navbar active link + mobile toggle
// =======================

function initNavBehavior() {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
  }

  // Close nav on link click (mobile)
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
    });
  });

  // Highlight active section in nav on scroll
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id) return;

        const relatedLink = document.querySelector(
          `.nav-link[href="#${id}"]`
        );

        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          if (relatedLink) {
            relatedLink.classList.add("active");
          }
        }
      });
    },
    {
      root: null,
      threshold: 0.4,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// =======================
// Reservation form validation
// =======================

function initReservationForm() {
  const form = document.getElementById("reservation-form");
  if (!form) return;

  const messageEl = document.getElementById("reservation-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameField = form.elements["name"];
    const phoneField = form.elements["phone"];
    const dateField = form.elements["date"];
    const timeField = form.elements["time"];

    let isValid = true;

    // Helper functions
    const setError = (input, message) => {
      const wrapper = input.closest(".form-field");
      if (!wrapper) return;
      wrapper.classList.add("error");
      wrapper.classList.remove("success");
      const msgEl = wrapper.querySelector(".error-msg");
      if (msgEl) msgEl.textContent = message || "";
      isValid = false;
    };

    const clearError = (input) => {
      const wrapper = input.closest(".form-field");
      if (!wrapper) return;
      wrapper.classList.remove("error");
      wrapper.classList.add("success");
      const msgEl = wrapper.querySelector(".error-msg");
      if (msgEl) msgEl.textContent = "";
    };

    // Basic name validation
    if (!nameField.value.trim()) {
      setError(nameField, "Please enter your name.");
    } else if (nameField.value.trim().length < 2) {
      setError(nameField, "Name should be at least 2 characters.");
    } else {
      clearError(nameField);
    }

    // Basic phone validation (10+ digits)
    const phoneDigits = phoneField.value.replace(/\D/g, "");
    if (!phoneField.value.trim()) {
      setError(phoneField, "Please enter your phone number.");
    } else if (phoneDigits.length < 10) {
      setError(phoneField, "Please enter a valid phone number.");
    } else {
      clearError(phoneField);
    }

    // Date validation
    if (!dateField.value) {
      setError(dateField, "Please select a date.");
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(dateField.value);
      if (selectedDate < today) {
        setError(dateField, "Please choose a future date.");
      } else {
        clearError(dateField);
      }
    }

    // Time validation
    if (!timeField.value) {
      setError(timeField, "Please select a time.");
    } else {
      clearError(timeField);
    }

    if (!isValid) {
      if (messageEl) {
        messageEl.textContent = "";
        messageEl.style.color = "";
      }
      return;
    }

    // If valid, show success message (no backend)
    const summary = `Thank you, ${nameField.value.trim()}! Your table for ${
      dateField.value
    } at ${timeField.value} has been requested.`;
    if (messageEl) {
      messageEl.textContent = summary;
      messageEl.style.color = "#2f7a39";
    }

    // Optionally clear form after brief delay
    setTimeout(() => {
      form.reset();
      const fields = form.querySelectorAll(".form-field");
      fields.forEach((f) => f.classList.remove("error", "success"));
    }, 800);
  });
}

