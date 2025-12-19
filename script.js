// ===== NAVBAR SCROLL =====
let lastScroll = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (y > 80 && y > lastScroll) navbar.classList.add("show");
  else navbar.classList.remove("show");
  lastScroll = y;
});

// ===== ENABLE SUBMIT ONLY WHEN RULES CHECKBOX IS CHECKED =====
const agreeRules = document.getElementById("agreeRules");
const form = document.getElementById("registrationForm");
const submitButton = form.querySelector("button[type='submit']");

submitButton.disabled = true;

agreeRules.addEventListener("change", () => {
  submitButton.disabled = !agreeRules.checked;
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ===== HAMBURGER =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// ===== FAQ ACCORDION =====
document.querySelectorAll(".faq-q").forEach(q => {
  q.addEventListener("click", () => {
    q.parentElement.classList.toggle("active");
  });
});

// ===== DYNAMIC PARTICIPANTS =====
const categorySelect = document.getElementById("teamCategory");
const feeNote = document.getElementById("feeNote");

function updateFeeText(value) {
  if (value === "3-Single") {
    feeNote.textContent = "Single Team: 3 members – ₹800 per member";
    feeNote.style.color = "red";
  } else {
    feeNote.textContent = "Double Team: 6 members – ₹700 per member";
    feeNote.style.color = "red";
  }
}

updateFeeText(categorySelect.value);

categorySelect.addEventListener("change", e => {
  updateFeeText(e.target.value);
});

const participantsGrid = document.getElementById("participantsGrid");

function renderParticipants(count) {
  participantsGrid.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    participantsGrid.insertAdjacentHTML("beforeend", `
      <div class="participant">
        <input type="text"
               name="member${i}Name"
               placeholder="Member ${i} Name"
               required>
      </div>
    `);
  }
}

renderParticipants(3);

categorySelect.addEventListener("change", e => {
  renderParticipants(parseInt(e.target.value));
});

// ===== REGISTRATION COUNTDOWN TIMER =====
const countdownElement = document.getElementById("countdown");
const registerSection = document.getElementById("register");

// Deadline → 19 December 2025, 5:00 PM IST
const deadline = new Date("December 19, 2025 17:00:00").getTime();

const countdownInterval = setInterval(() => {
  const now = new Date().getTime();
  const diff = deadline - now;

  if (diff <= 0) {
    clearInterval(countdownInterval);
    countdownElement.innerHTML = "🚫 Registration Closed";

    // Disable form completely
    submitButton.disabled = true;
    submitButton.textContent = "Registration Closed";

    registerSection.classList.add("disabled");
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownElement.innerHTML =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;
}, 1000);

// ===== FORM SUBMIT =====
document.getElementById("registrationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = e.target.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const formData = new FormData(e.target);

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbzk0ph-CGfpC2Qqp8OXh0WxKKsT6O3ml0AgKwUgxpbzxMUNaCHKp5F2F2NHxKLjesk/exec";

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.status === "duplicate") {
      alert("⚠ Team name already exists! Please choose another name.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Registration";
      return;
    }

    if (result.status === "success") {
      window.location.href = "thankyou.html";
    } else {
      alert("Submission failed. Please try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Registration";
    }
  } catch (error) {
    alert("Network error. Please try again.");
    console.error(error);
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Registration";
  }
});




