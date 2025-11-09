const steps = document.querySelectorAll(".step");
const nextButtons = document.querySelectorAll(".btn-next");
const backButtons = document.querySelectorAll(".btn-back");
const stepItems = document.querySelectorAll(".step-item");
const toggle = document.getElementById("billing-toggle");
const options = document.querySelectorAll(".billing-option");
const planCards = document.querySelectorAll(".plan-card");
const addOnItems = document.querySelectorAll(".add-on-item");
const addOnCheckboxes = document.querySelectorAll(".add-on-checkbox");
const summaryPlanName = document.querySelector(".selected-plan-name");
const summaryPlanPrice = document.querySelector(".plan-price-main");
const addonsSummaryContainer = document.querySelector(".addons-summary");
const totalPriceElement = document.querySelector(".total-price");
const personalInfoForm = document.getElementById("personal-info-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const changePlanLink = document.querySelector(".change-plan-link");

const planPrices = {
  arcade: { monthly: 9, yearly: 90 },
  advanced: { monthly: 12, yearly: 120 },
  pro: { monthly: 15, yearly: 150 },
};
const addOnPrice = {
  "online service": { monthly: 1, yearly: 10 },
  "larger storage": { monthly: 2, yearly: 20 },
  "customizable profile": { monthly: 2, yearly: 20 },
};
let selectedBilling = "monthly";

function validateStep(stepId) {
  const step = document.getElementById(stepId);
  let isValid = true;

  // regexها
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneRe = /^\+?[\d\s\-()]{7,20}$/;

  // گرفتن همه input های required داخل این step
  const inputs = step.querySelectorAll("input[required]");

  inputs.forEach((input) => {
    // پیدا کردن المان پیام خطا مرتبط (مطابق ساختار HTML شما)
    const formGroup = input.closest(".form-group");
    const errorMsgEl = formGroup
      ? formGroup.querySelector(".error-message")
      : null;

    // مقدار ورودی
    const value = input.value.trim();

    // مقدار پیش‌فرض پیام
    let message = "This field is required";

    // چک‌های اختصاصی بر اساس id یا type
    if (value === "") {
      message = "This field is required";
      isValid = false;
    } else if (input.type === "email" || input.id === "email") {
      if (!emailRe.test(value)) {
        message = "Please enter a valid email address";
        isValid = false;
      } else {
        // ok
        message = "";
      }
    } else if (input.type === "tel" || input.id === "phone") {
      if (!phoneRe.test(value)) {
        message = "Please enter a valid phone number (e.g. +1 555 123 4567)";
        isValid = false;
      } else {
        message = "";
      }
    } else {
      // سایر inputها فقط چک خالی بودن
      message = "";
    }

    // نمایش یا مخفی کردن پیام خطا
    if (errorMsgEl) {
      if (message) {
        errorMsgEl.textContent = message;
        errorMsgEl.classList.remove("d-none");
      } else {
        errorMsgEl.classList.add("d-none");
      }
    }
  });

  return isValid;
}

function updateStepIndicator(currentStepId) {
  stepItems.forEach((step) => {
    step.classList.remove("active");
    if (step.dataset.step === currentStepId) {
      step.classList.add("active");
    }
  });
}

function updateAddOnsPricesAndSelection() {
  addOnItems.forEach((item) => {
    const checkbox = item.querySelector(".add-on-checkbox");
    const addOnName = item
      .querySelector(".add-on-title")
      .textContent.toLowerCase();
    const price = addOnPrice[addOnName][selectedBilling];

    item.querySelector(".price-text").textContent = `+$${price}/${
      selectedBilling === "monthly" ? "mo" : "yr"
    }`;

    if (checkbox.checked) {
      const existing = selectedAddOns.find((add) => add.name === addOnName);
      if (existing) {
        existing.price = price;
      } else {
        selectedAddOns.push({ name: addOnName, price: price });
      }
    }
  });
}

function showTemporaryMessage(msg) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = msg;
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "20px";
  messageDiv.style.right = "20px";
  messageDiv.style.padding = "15px 25px";
  messageDiv.style.backgroundColor = "#ff4d4f";
  messageDiv.style.color = "#fff";
  messageDiv.style.borderRadius = "8px";
  messageDiv.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  messageDiv.style.fontWeight = "bold";
  messageDiv.style.zIndex = 1000;
  messageDiv.style.opacity = "0";
  messageDiv.style.transition = "opacity 0.3s";

  document.body.appendChild(messageDiv);

  // Fade in
  setTimeout(() => {
    messageDiv.style.opacity = "1";
  }, 10);

  // Fade out after 3 seconds and remove
  setTimeout(() => {
    messageDiv.style.opacity = "0";
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }, 3000);
}

steps.forEach((step) => {
  if (step.id === "step1") {
    step.classList.remove("d-none");
  } else {
    step.classList.add("d-none");
  }
});

nextButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const currentStep = btn.closest(".step");
    const currentStepId = currentStep.id;
    const isStepValid = validateStep(currentStepId);

    if (!isStepValid) return;
    const nextStepId = "step" + (parseInt(currentStepId.slice(4)) + 1);
    const nextStep = document.getElementById(nextStepId);
    if (currentStepId === "step2" && !selectedPlan.name) {
      showTemporaryMessage("Please select a plan before proceeding.");
      return;
    }

    currentStep.classList.add("d-none");

    if (nextStep) {
      nextStep.classList.remove("d-none");
      if (nextStep.id === "step4") {
        updateSummary();
      }
    } else {
      const confirming = document.getElementById("confirming");
      confirming.classList.remove("d-none");
    }
    updateStepIndicator(nextStepId);
  });
});
backButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const currentStep = btn.closest(".step");
    const currentStepId = currentStep.id;

    const prevStepId = "step" + (parseInt(currentStepId.slice(4)) - 1);
    const prevStep = document.getElementById(prevStepId);

    currentStep.classList.add("d-none");

    if (prevStep) {
      prevStep.classList.remove("d-none");
    }
    updateStepIndicator(prevStepId);
  });
});

//step 2 start
let selectedPlan = {
  name: null,
  billing: "monthly",
  price: 0,
};

// toggle و options
toggle.addEventListener("change", () => {
  selectedBilling = toggle.checked ? "yearly" : "monthly";

  options.forEach((option) => {
    option.classList.toggle(
      "active",
      option.dataset.billing === selectedBilling
    );
  });
  updateAddOnsPricesAndSelection();
  planCards.forEach((card) => {
    const planName = card
      .querySelector(".plan-info-value")
      .textContent.toLowerCase();
    const newPrice = planPrices[planName][selectedBilling];
    card.querySelector(".plan-info-desc").textContent = "$" + newPrice + "/mo";

    if (card.classList.contains("selected")) {
      selectedPlan.price = newPrice;
      selectedPlan.billing = selectedBilling;
    }
  });
});

planCards.forEach((card) => {
  card.addEventListener("click", () => {
    planCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");

    const planName = card
      .querySelector(".plan-info-value")
      .textContent.toLowerCase();
    const newPrice = planPrices[planName][selectedBilling];

    selectedPlan.name = planName;
    selectedPlan.billing = selectedBilling;
    selectedPlan.price = newPrice;
  });
});

// finish step 2

// step 3 //
let selectedAddOns = [];

addOnCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const item = checkbox.closest(".add-on-item");
    const name = item.querySelector(".add-on-title").textContent.toLowerCase();
    const price = addOnPrice[name][selectedBilling];

    if (checkbox.checked) {
      const exists = selectedAddOns.find((add) => add.name === name);
      if (!exists) {
        selectedAddOns.push({ name, price });
      } else {
        exists.price = price;
      }
    } else {
      selectedAddOns = selectedAddOns.filter((add) => add.name !== name);
    }
  });
});

function updateSummary() {
  const billingText = selectedPlan.billing === "monthly" ? "Monthly" : "Yearly";
  summaryPlanName.textContent = `${capitalize(
    selectedPlan.name
  )} (${billingText})`;
  summaryPlanPrice.textContent = `$${selectedPlan.price}/${
    selectedPlan.billing === "monthly" ? "mo" : "yr"
  }`;

  addonsSummaryContainer.innerHTML = "";

  selectedAddOns.forEach((addOn) => {
    const div = document.createElement("div");
    div.classList.add("addon-item");
    div.innerHTML = `
      <span class="addon-name">${capitalize(addOn.name)}</span>
      <span class="addon-price">+$${addOn.price}/${
      selectedPlan.billing === "monthly" ? "mo" : "yr"
    }</span>
    `;
    addonsSummaryContainer.appendChild(div);
  });

  const total =
    selectedPlan.price +
    selectedAddOns.reduce((sum, add) => sum + add.price, 0);
  totalPriceElement.textContent = `+$${total}/${
    selectedPlan.billing === "monthly" ? "mo" : "yr"
  }`;
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// step4 //

changePlanLink.addEventListener("click", (e) => {
  e.preventDefault();

  const currentStep = document.getElementById("step4");
  currentStep.classList.add("d-none");

  const step2 = document.getElementById("step2");
  step2.classList.remove("d-none");

  updateStepIndicator("step2");

  planCards.forEach((card) => {
    const planName = card
      .querySelector(".plan-info-value")
      .textContent.toLowerCase();

    if (selectedPlan.name === planName) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }

    const newPrice = planPrices[planName][selectedBilling];
    card.querySelector(".plan-info-desc").textContent = "$" + newPrice + "/mo";
  });

  toggle.checked = selectedPlan.billing === "yearly";
  options.forEach((option) => {
    option.classList.toggle(
      "active",
      option.dataset.billing === selectedBilling
    );
  });
});
