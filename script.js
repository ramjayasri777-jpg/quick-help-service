const providers = [
  {
    name: "Ramesh Kumar",
    service: "Plumber",
    phone: "9876543210",
    location: "Chennai",
    experience: "8 Years",
    rating: "4.8",
    status: "Available",
    icon: "🔧"
  },
  {
    name: "Suresh Kumar",
    service: "Plumber",
    phone: "9123456780",
    location: "Chennai",
    experience: "6 Years",
    rating: "4.7",
    status: "Available",
    icon: "🔧"
  },
  {
    name: "Arun Electricals",
    service: "Electrician",
    phone: "9988776655",
    location: "Chennai",
    experience: "10 Years",
    rating: "4.9",
    status: "Available",
    icon: "⚡"
  },
  {
    name: "Vijay Electric Works",
    service: "Electrician",
    phone: "9876123450",
    location: "Chennai",
    experience: "7 Years",
    rating: "4.6",
    status: "Available",
    icon: "⚡"
  },
  {
    name: "Mohan Carpenter",
    service: "Carpenter",
    phone: "9345678901",
    location: "Chennai",
    experience: "9 Years",
    rating: "4.8",
    status: "Available",
    icon: "🪚"
  },
  {
    name: "Karthik Wood Works",
    service: "Carpenter",
    phone: "9789012345",
    location: "Chennai",
    experience: "5 Years",
    rating: "4.5",
    status: "Available",
    icon: "🪚"
  },
  {
    name: "Mani Painters",
    service: "Painter",
    phone: "9567890123",
    location: "Chennai",
    experience: "12 Years",
    rating: "4.9",
    status: "Available",
    icon: "🎨"
  },
  {
    name: "Prakash Painting Works",
    service: "Painter",
    phone: "9012345678",
    location: "Chennai",
    experience: "6 Years",
    rating: "4.6",
    status: "Available",
    icon: "🎨"
  }
];


function showProviders(service) {

  const providerContainer = document.getElementById("providers");
  const serviceTitle = document.getElementById("serviceTitle");
  const providerCount = document.getElementById("providerCount");

  const filteredProviders = providers.filter(
    provider => provider.service === service
  );

  serviceTitle.textContent = service + "s";
  providerCount.textContent =
    filteredProviders.length + " professionals";

  providerContainer.innerHTML = "";

  filteredProviders.forEach(provider => {

    const card = document.createElement("div");

    card.className = "provider-card";

    const statusClass =
      provider.status === "Available"
        ? "available"
        : "busy";

    card.innerHTML = `
      <div class="provider-top">

        <div class="provider-avatar">
          ${provider.icon}
        </div>

        <div class="provider-info">
          <h3>${provider.name}</h3>

          <div class="service-name">
            ${provider.service}
          </div>

          <div class="rating">
            ⭐ ${provider.rating}
          </div>
        </div>

      </div>

      <div class="details">

        <div class="detail">
          📍 <strong>Location:</strong>
          ${provider.location}
        </div>

        <div class="detail">
          💼 <strong>Experience:</strong>
          ${provider.experience}
        </div>

        <div class="detail ${statusClass}">
          ● ${provider.status}
        </div>

      </div>

      <a
        class="call-btn"
        href="tel:${provider.phone}"
      >
        📞 Call Now
      </a>
    `;

    providerContainer.appendChild(card);

  });
}
