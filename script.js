
const form = document.querySelector("#listingForm");
const nameInput = document.querySelector("#productName");
const categoryInput = document.querySelector("#category");
const featuresInput = document.querySelector("#features");
const emptyState = document.querySelector("#emptyState");
const results = document.querySelector("#results");
const statusBadge = document.querySelector("#status");
const generateButton = document.querySelector(".generate-btn");

let lastInput = null;

const styleCopy = {
  Friendly: {
    openers: [
      "Meet your new favourite:",
      "A little something to love:",
      "Say hello to"
    ],
    body: (name, category, features) =>
      `${name} is made for the little moments that make a day feel special. With ${features}, this ${category.toLowerCase()} find brings thoughtful details into your everyday. Treat yourself, gift it to someone lovely, or simply enjoy something made with care.`,
    caption: (name, features, tags) =>
      `A little joy, wrapped up in one lovely find ✨ ${name} brings together ${features}. Save this for later or share it with someone who'd love it. ${tags}`
  },

  Playful: {
    openers: [
      "Your next obsession:",
      "Well, hello there,",
      "Cute things alert:"
    ],
    body: (name, category, features) =>
      `Meet ${name} — the little upgrade your day didn't know it needed. Think ${features}, with plenty of personality. This ${category.toLowerCase()} pick is ready to make an entrance, brighten a routine, or become someone's new favourite. Go on, give it a spot in your world.`,
    caption: (name, features, tags) =>
      `POV: you just found your new favourite thing 💫 ${name} is bringing the good vibes with ${features}. Send this to your shopping-bestie. ${tags}`
  },

  Professional: {
    openers: [
      "Introducing",
      "Discover",
      "Thoughtfully designed:"
    ],
    body: (name, category, features) =>
      `Discover ${name}, a ${category.toLowerCase()} product defined by ${features}. Designed to offer a thoughtful combination of useful features and considered presentation, it is an excellent option for customers looking for quality and detail. Review the product information to find the right fit for your needs.`,
    caption: (name, features, tags) =>
      `Introducing ${name}. Explore the details — ${features} — and discover what makes it a considered choice. Thank you for supporting independent businesses. ${tags}`
  },

  Luxury: {
    openers: [
      "A considered little luxury:",
      "Meet the art of",
      "An elevated take on"
    ],
    body: (name, category, features) =>
      `Discover ${name}, where thoughtful details meet understated appeal. Featuring ${features}, this ${category.toLowerCase()} piece brings a refined touch to everyday rituals. Created for those who appreciate considered choices, lasting impressions, and the beauty in the details.`,
    caption: (name, features, tags) =>
      `The beauty is in the details. ✧ Discover ${name}, thoughtfully presented with ${features}. A small detail can change the feel of a moment. ${tags}`
  }
};

function clean(value) {
  return value.trim().replace(/\s+/g, " ");
}

function makeHashtags(name, category) {
  const productTag = name.replace(/[^a-zA-Z0-9]/g, "");
  const categoryTag = category
    .split(/[ &]/)[0]
    .replace(/[^a-zA-Z0-9]/g, "");

  return `#${productTag} #ShopSmall #SmallBusiness #${categoryTag}`;
}

function buildListing(input) {
  const templates = styleCopy[input.tone] || styleCopy.Friendly;

  const featureList = input.features
    .split(/,|\n/)
    .map(clean)
    .filter(Boolean);

  const features = featureList.length > 1
    ? `${featureList.slice(0, -1).join(", ")} and ${featureList.at(-1)}`
    : (featureList[0] || "thoughtful details");

  const opener =
    templates.openers[
      Math.floor(Math.random() * templates.openers.length)
    ];

  const title = `${input.name} | ${input.category}`;

  return {
    title,
    description:
      `${opener} ${input.name}. ` +
      templates.body(input.name, input.category, features),

    caption: templates.caption(
      input.name,
      features,
      makeHashtags(input.name, input.category)
    )
  };
}

function renderListing(input) {
  const listing = buildListing(input);

  document.querySelector("#outputTitle").textContent =
    listing.title;

  document.querySelector("#outputDescription").textContent =
    listing.description;

  document.querySelector("#outputCaption").textContent =
    listing.caption;

  emptyState.classList.add("hidden");
  results.classList.remove("hidden");

  statusBadge.classList.add("ready");
  statusBadge.innerHTML =
    '<span class="status-dot"></span> Draft created';
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  lastInput = {
    name: clean(nameInput.value),
    category: categoryInput.value,
    features: clean(featuresInput.value),
    tone: document.querySelector(
      'input[name="tone"]:checked'
    ).value
  };

  generateButton.disabled = true;

  generateButton.innerHTML =
    '<span>✦</span> Making something lovely...';

  window.setTimeout(() => {
    renderListing(lastInput);

    generateButton.disabled = false;

    generateButton.innerHTML =
      '<span>✦</span> Generate my listing <b>↗</b>';
  }, 280);
});

document.querySelector("#regenerateBtn")
  .addEventListener("click", () => {
    if (lastInput) {
      renderListing(lastInput);
    }
  });

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = document.querySelector(
      `#${button.dataset.copy}`
    ).textContent;

    const original = button.textContent;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "✓ Copied";
    } catch {
      const temp = document.createElement("textarea");

      temp.value = text;
      temp.style.position = "fixed";
      temp.style.opacity = "0";

      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();

      button.textContent = "✓ Copied";
    }

    window.setTimeout(() => {
      button.textContent = original;
    }, 1400);
  });
});
