const toggle = document.getElementById("billing-toggle");
const options = document.querySelectorAll(".billing-option");
const planCards = document.querySelectorAll(".plan-card");

//step 2 start
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    options.forEach((option) => {
      option.classList.toggle("active", option.dataset.billing === "yearly");
    });
  } else {
    options.forEach((option) => {
      option.classList.toggle("active", option.dataset.billing === "monthly");
    });
  }
});

planCards.forEach((card) => {
  card.addEventListener("click", () => {
    planCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
  });
});
// finish step 2
