// Quick Help - Service Finder
// Clean full script.js
// Keep your existing Supabase publishable key in the constant below.

const SUPABASE_URL = "https://mkfmwmbiylvyixjlmcba.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_c7E2D-jjrLFzLwIB_sfahg_WROFByrn";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// =========================
// STATIC PROVIDERS
// =========================

const staticProviders = [
  { name: "Arun Kumar", service: "Electrician", phone: "9876543210", location: "Chennai", experience: "8 Years", skill: "Wiring, Fan, Switch, Repair", availability: "9 AM - 7 PM" },
  { name: "Suresh", service: "Plumber", phone: "9876543211", location: "Chennai", experience: "6 Years", skill: "Pipe, Tap, Bathroom, Leakage", availability: "8 AM - 8 PM" },
  { name: "Karthik", service: "Carpenter", phone: "9876543212", location: "Chennai", experience: "10 Years", skill: "Furniture, Door, Wood Work", availability: "9 AM - 6 PM" },
  { name: "Ravi", service: "Painter", phone: "9876543213", location: "Chennai", experience: "7 Years", skill: "Interior, Exterior, Wall Painting", availability: "8 AM - 6 PM" },
  { name: "Manoj", service: "AC Technician", phone: "9876543214", location: "Chennai", experience: "5 Years", skill: "AC Service, Gas, Installation", availability: "9 AM - 8 PM" },
  { name: "Vijay", service: "Appliance Repair", phone: "9876543215", location: "Chennai", experience: "6 Years", skill: "Fridge, Washing Machine, Mixer", availability: "9 AM - 7 PM" },
  { name: "Dinesh", service: "Mechanic", phone: "9876543216", location: "Chennai", experience: "9 Years", skill: "Bike, Car, General Repair", availability: "8 AM - 9 PM" },
  { name: "Prakash", service: "Cleaning", phone: "9876543217", location: "Chennai", experience: "4 Years", skill: "Home, Bathroom, Deep Cleaning", availability: "7 AM - 7 PM" }
];

const serviceIcons = {
  Electrician: "⚡",
  Plumber: "🔧",
  Carpenter: "🪚",
  Painter: "🎨",
  "AC Technician": "❄️",
  "Appliance Repair": "🔌",
  Mechanic: "🛠️",
  Cleaning: "🧹"
};

// =========================
// HELPERS
// =========================

function getServiceIcon(service) {
  return serviceIcons[service] || "🛠️";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("quickHelpUser") || "null");
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("quickHelpUser", JSON.stringify(user));
  localStorage.setItem("quickHelpLoggedIn", "true");
}

function clearUser() {
  localStorage.removeItem("quickHelpUser");
  localStorage.removeItem("quickHelpLoggedIn");
}

function isLoggedIn() {
  return localStorage.getItem("quickHelpLoggedIn") === "true" && !!getSavedUser();
}

function isProviderUser(user = getSavedUser()) {
  if (!user) return false;
  return user.role === "provider" || !!user.workType;
}

function getLoggedUserId() {
  const user = getSavedUser();
  return user?.id || user?.Id || null;
}

function formatDate(date) {
  if (!date) return "-";

  const d = new Date(`${date}T00:00:00`);

  if (Number.isNaN(d.getTime())) return date;

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function setMinBookingDate() {
  const input = document.getElementById("bookingDate");

  if (!input) return;

  const now = new Date();

  now.setMinutes(
    now.getMinutes() - now.getTimezoneOffset()
  );

  input.min = now.toISOString().split("T")[0];
}

function showMessage(message) {
  alert(message);
}

// =========================
// PROVIDER LIST
// =========================

function renderProviders(
  providers = staticProviders,
  title = "Available Professionals"
) {
  const container = document.getElementById("providerContainer");

  if (!container) return;

  container.innerHTML = "";

  const heading = document.createElement("h2");

  heading.className = "provider-section-title";
  heading.textContent = title;

  container.appendChild(heading);

  if (!providers.length) {
    const empty = document.createElement("p");

    empty.className = "empty-message";
    empty.textContent = "No professionals found.";

    container.appendChild(empty);

    return;
  }

  providers.forEach(provider => {
    const card = document.createElement("div");

    card.className = "provider-card";

    card.innerHTML = `
      <div class="provider-icon">
        ${getServiceIcon(provider.service)}
      </div>

      <div class="provider-info">
        <h3>${escapeHtml(provider.name)}</h3>

        <p>
          <strong>${escapeHtml(provider.service)}</strong>
        </p>

        <p>
          📍 ${escapeHtml(provider.location || "Not specified")}
        </p>

        <p>
          ⭐ ${escapeHtml(provider.experience || "Experience not specified")}
        </p>

        <p>
          ${escapeHtml(provider.skill || "Professional service")}
        </p>

        <p>
          🕒 ${escapeHtml(provider.availability || "Available")}
        </p>
      </div>

      <div class="provider-actions"></div>
    `;

    const actions = card.querySelector(".provider-actions");

    const profileBtn = document.createElement("button");

    profileBtn.className = "profile-btn";
    profileBtn.textContent = "View Profile";

    profileBtn.addEventListener("click", () => {
      openProviderProfile(provider);
    });

    const bookBtn = document.createElement("button");

    bookBtn.className = "book-btn";
    bookBtn.textContent = "Book Now";

    bookBtn.addEventListener("click", () => {
      openBooking(provider);
    });

    const callLink = document.createElement("a");

    callLink.className = "call-btn";
    callLink.href = `tel:${provider.phone || ""}`;
    callLink.textContent = "Call Now";

    actions.appendChild(profileBtn);
    actions.appendChild(bookBtn);
    actions.appendChild(callLink);

    container.appendChild(card);
  });
}

async function showProviders(service = null) {
  let providers = [];

  try {
    let query = supabaseClient
      .from("users")
      .select("Id, Name, Mobile, Location, Email");

    const {
      data: users,
      error: usersError
    } = await query;

    if (usersError) throw usersError;

    const userList = users || [];

    for (const user of userList) {
      const {
        data: workRows
      } = await supabaseClient
        .from("work_details")
        .select(
          'User_id, Work_type, Experience, Skill, Work_location, "Available time"'
        )
        .eq("User_id", user.Id)
        .limit(1);

      const work = workRows?.[0];

      if (!work) continue;

      if (service && work.Work_type !== service) continue;

      providers.push({
        userId: user.Id,
        name: user.Name,
        service: work.Work_type,
        phone: user.Mobile,
        location: work.Work_location || user.Location,
        experience: work.Experience,
        skill: work.Skill,
        availability: work["Available time"]
      });
    }
  } catch (error) {
    console.error("Provider loading error:", error);
  }

  if (!providers.length) {
    providers = service
      ? staticProviders.filter(
          p => p.service === service
        )
      : [...staticProviders];
  }

  const serviceTitle = service
    ? `${service} Professionals`
    : "Available Professionals";

  renderProviders(
    providers,
    serviceTitle
  );
}

// =========================
// AUTH MODALS
// =========================

function openLogin() {
  closeRegister();

  const modal = document.getElementById("loginModal");

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeLogin() {
  const modal = document.getElementById("loginModal");

  if (modal) {
    modal.style.display = "none";
  }
}

function openRegister() {
  closeLogin();

  const modal = document.getElementById("registerModal");

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeRegister() {
  const modal = document.getElementById("registerModal");

  if (modal) {
    modal.style.display = "none";
  }
}

async function handleRegister(event) {
  if (event) {
    event.preventDefault();
  }

  const name =
    document.getElementById("registerName")?.value.trim();

  const mobile =
    document.getElementById("registerMobile")?.value.trim();

  const email =
    document.getElementById("registerEmail")?.value.trim();

  const password =
    document.getElementById("registerPassword")?.value;

  const location =
    document.getElementById("registerLocation")?.value.trim();

  const workType =
    document.getElementById("workType")?.value.trim();

  const experience =
    document.getElementById("experience")?.value.trim();

  const skill =
    document.getElementById("skill")?.value.trim();

  const workLocation =
    document.getElementById("workLocation")?.value.trim();

  const availableTime =
    document.getElementById("availableTime")?.value.trim();

  if (
    !name ||
    !mobile ||
    !email ||
    !password ||
    !location ||
    !workType ||
    !experience ||
    !skill ||
    !workLocation ||
    !availableTime
  ) {
    showMessage("Please fill all required fields.");
    return;
  }

  try {
    const {
      data: existing
    } = await supabaseClient
      .from("users")
      .select("Id")
      .eq("Mobile", mobile)
      .limit(1);

    if (existing?.length) {
      showMessage("Mobile number already registered.");
      return;
    }

    const {
      data: userRows,
      error: userError
    } = await supabaseClient
      .from("users")
      .insert([
        {
          Name: name,
          Mobile: mobile,
          Email: email,
          Password: password,
          Location: location
        }
      ])
      .select(
        "Id, Name, Mobile, Email, Location"
      )
      .limit(1);

    if (userError) {
      throw userError;
    }

    const newUser = userRows?.[0];

    if (!newUser) {
      throw new Error(
        "User registration failed."
      );
    }

    const {
      error: workError
    } = await supabaseClient
      .from("work_details")
      .insert([
        {
          User_id: newUser.Id,
          Work_type: workType,
          Experience: experience,
          Skill: skill,
          Work_location: workLocation,
          "Available time": availableTime
        }
      ]);

    if (workError) {
      throw workError;
    }

    const loggedUser = {
      id: newUser.Id,
      name: newUser.Name,
      mobile: newUser.Mobile,
      email: newUser.Email,
      location: newUser.Location,
      workType,
      experience,
      skill,
      workLocation,
      availableTime,
      role: "provider"
    };

    saveUser(loggedUser);

    closeRegister();

    updateLoginButton();
    updateProviderDashboardButton();

    showMessage("Registration successful!");

    goHome();

  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    showMessage(
      `Registration failed: ${
        error.message || "Please try again."
      }`
    );
  }
    }
async function handleLogin(event) {
  if (event) {
    event.preventDefault();
  }

  const mobile =
    document.getElementById("loginMobile")?.value.trim();

  const password =
    document.getElementById("loginPassword")?.value;

  if (!mobile || !password) {
    showMessage(
      "Enter mobile number and password."
    );
    return;
  }

  try {
    const {
      data: userRows,
      error: userError
    } = await supabaseClient
      .from("users")
      .select(
        "Id, Name, Mobile, Email, Password, Location"
      )
      .eq("Mobile", mobile)
      .limit(1);

    if (userError) {
      throw userError;
    }

    const user = userRows?.[0];

    if (!user || user.Password !== password) {
      showMessage(
        "Invalid mobile number or password."
      );
      return;
    }

    const {
      data: workRows
    } = await supabaseClient
      .from("work_details")
      .select(
        'User_id, Work_type, Experience, Skill, Work_location, "Available time"'
      )
      .eq("User_id", user.Id)
      .limit(1);

    const work = workRows?.[0];

    const loggedUser = {
      id: user.Id,
      name: user.Name,
      mobile: user.Mobile,
      email: user.Email,
      location: user.Location,

      workType: work?.Work_type || "",
      experience: work?.Experience || "",
      skill: work?.Skill || "",
      workLocation: work?.Work_location || "",
      availableTime:
        work?.["Available time"] || "",

      role: work?.Work_type
        ? "provider"
        : "customer"
    };

    saveUser(loggedUser);

    closeLogin();

    updateLoginButton();
    updateProviderDashboardButton();

    addMyBookingsButton();

    showMessage("Login successful!");

    goHome();

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    showMessage(
      `Login failed: ${
        error.message || "Please try again."
      }`
    );
  }
}

// =========================
// ACCOUNT / PROFILE / SETTINGS
// =========================

function updateLoginButton() {
  const loginBtn =
    document.querySelector(".login-btn");

  if (!loginBtn) return;

  const user = getSavedUser();

  loginBtn.textContent =
    user
      ? user.name || "Account"
      : "Login";
}

function logoutUser() {
  clearUser();

  updateLoginButton();
  updateProviderDashboardButton();

  removeMyBookingsButton();

  closeAccountMenu();

  showMessage(
    "Logged out successfully."
  );

  goHome();
}

function openAccountMenu() {
  const modal =
    document.getElementById("accountModal");

  if (!modal) return;

  const user = getSavedUser();

  const title =
    modal.querySelector(".account-name");

  const subtitle =
    modal.querySelector(".account-mobile");

  if (title) {
    title.textContent =
      user
        ? user.name
        : "Welcome";
  }

  if (subtitle) {
    subtitle.textContent =
      user
        ? user.mobile
        : "Please login";
  }

  modal.style.display = "flex";
}

function closeAccountMenu() {
  const modal =
    document.getElementById("accountModal");

  if (modal) {
    modal.style.display = "none";
  }
}

function accountLogin() {
  closeAccountMenu();
  openLogin();
}

function openProfile() {
  closeAccountMenu();

  const modal =
    document.getElementById("profileModal");

  if (!modal) return;

  const user = getSavedUser();

  if (!user) {
    openLogin();
    return;
  }

  const name =
    modal.querySelector(".profile-name");

  const mobile =
    modal.querySelector(".profile-mobile");

  const email =
    modal.querySelector(".profile-email");

  const location =
    modal.querySelector(".profile-location");

  const work =
    modal.querySelector(".profile-work");

  if (name) {
    name.textContent =
      user.name || "-";
  }

  if (mobile) {
    mobile.textContent =
      user.mobile || "-";
  }

  if (email) {
    email.textContent =
      user.email || "-";
  }

  if (location) {
    location.textContent =
      user.location || "-";
  }

  if (work) {
    work.textContent =
      user.workType || "Customer";
  }

  modal.style.display = "flex";
}

function closeProfile() {
  const modal =
    document.getElementById("profileModal");

  if (modal) {
    modal.style.display = "none";
  }
}

function openSettings() {
  closeAccountMenu();

  const modal =
    document.getElementById("settingsModal");

  if (modal) {
    modal.style.display = "flex";
  }

  updateProviderDashboardButton();
}

function closeSettings() {
  const modal =
    document.getElementById("settingsModal");

  if (modal) {
    modal.style.display = "none";
  }
}

function updateProviderDashboardButton() {
  const container =
    document.querySelector(".settings-content") ||
    document.querySelector(
      "#settingsModal .modal-content"
    );

  if (!container) return;

  let button =
    document.getElementById(
      "providerDashboardBtn"
    );

  if (!isProviderUser()) {
    if (button) {
      button.remove();
    }

    return;
  }

  if (!button) {
    button =
      document.createElement("button");

    button.id =
      "providerDashboardBtn";

    button.className =
      "settings-option";

    button.textContent =
      "Provider Dashboard";

    button.addEventListener(
      "click",
      openProviderDashboard
    );

    container.appendChild(button);
  }
}

function goHome() {
  closeAccountMenu();
  closeProfile();
  closeSettings();
  closeBooking();
  closeProviderProfile();
  closeProviderDashboard();

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display = "block";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function searchProviders() {
  const input =
    document.getElementById("searchInput") ||
    document.querySelector(
      ".search-input"
    );

  const query =
    input?.value
      .trim()
      .toLowerCase() || "";

  if (!query) {
    showProviders();
    return;
  }

  const results =
    staticProviders.filter(provider =>
      `${provider.name}
       ${provider.service}
       ${provider.location}
       ${provider.skill}`
        .toLowerCase()
        .includes(query)
    );

  renderProviders(
    results,
    `Search Results for "${query}"`
  );
}

function showAppInfo() {
  alert(
    "Quick Help connects customers with local service professionals."
  );
}

function showHelp() {
  alert(
    "Choose a service, select a professional, and tap Book Now."
  );
}

function showPrivacy() {
  alert(
    "Please use the app responsibly. This prototype stores account data in Supabase."
  );
}

// =========================
// BOOKING SYSTEM
// =========================

let selectedBookingProvider = null;

function openBooking(provider) {
  if (!isLoggedIn()) {
    showMessage(
      "Please login first to book a service."
    );

    openLogin();

    return;
  }

  selectedBookingProvider =
    provider;

  const modal =
    document.getElementById(
      "bookingModal"
    );

  if (!modal) return;

  const providerName =
    modal.querySelector(
      ".booking-provider-name"
    );

  const providerService =
    modal.querySelector(
      ".booking-provider-service"
    );

  if (providerName) {
    providerName.textContent =
      provider.name || "";
  }

  if (providerService) {
    providerService.textContent =
      provider.service || "";
  }

  const serviceInput =
    document.getElementById(
      "bookingService"
    );

  const addressInput =
    document.getElementById(
      "bookingAddress"
    );

  if (serviceInput) {
    serviceInput.value =
      provider.service || "";
  }

  if (
    addressInput &&
    !addressInput.value
  ) {
    addressInput.value =
      getSavedUser()?.location || "";
  }

  setMinBookingDate();

  modal.style.display = "flex";
}

function closeBooking() {
  const modal =
    document.getElementById(
      "bookingModal"
    );

  if (modal) {
    modal.style.display = "none";
  }

  selectedBookingProvider =
    null;
}

async function confirmBooking(event) {
  if (event) {
    event.preventDefault();
  }

  const user =
    getSavedUser();

  if (!user) {
    closeBooking();
    openLogin();
    return;
  }

  if (!selectedBookingProvider) {
    showMessage(
      "Please select a provider."
    );

    return;
  }

  const bookingDate =
    document.getElementById(
      "bookingDate"
    )?.value;

  const bookingTime =
    document.getElementById(
      "bookingTime"
    )?.value.trim();

  const address =
    document.getElementById(
      "bookingAddress"
    )?.value.trim();

  const problem =
    document.getElementById(
      "problemDescription"
    )?.value.trim();

  const estimatedPrice =
    document.getElementById(
      "estimatedPrice"
    )?.value;

  if (
    !bookingDate ||
    !bookingTime ||
    !address
  ) {
    showMessage(
      "Please fill date, time and address."
    );

    return;
  }

  try {
    const {
      error
    } = await supabaseClient
      .from("bookings")
      .insert([
        {
          user_id:
            user.id || user.Id,

          provider_user_id:
            selectedBookingProvider.userId ||
            null,

          provider_name:
            selectedBookingProvider.name,

          provider_phone:
            selectedBookingProvider.phone ||
            "",

          service:
            selectedBookingProvider.service,

          booking_date:
            bookingDate,

          booking_time:
            bookingTime,

          address:
            address,

          problem_description:
            problem || "",

          status:
            "Pending",

          estimated_price:
            estimatedPrice
              ? Number(estimatedPrice)
              : null
        }
      ]);

    if (error) {
      throw error;
    }

    closeBooking();

    showMessage(
      "Booking confirmed and sent to the provider."
    );

  } catch (error) {
    console.error(
      "Booking error:",
      error
    );

    showMessage(
      `Booking failed: ${
        error.message ||
        "Please try again."
      }`
    );
  }
}
async function showMyBookings() {
  closeAccountMenu();

  if (!isLoggedIn()) {
    openLogin();
    return;
  }

  const user = getSavedUser();

  try {
    const {
      data: bookings,
      error
    } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq(
        "user_id",
        user.id || user.Id
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );

    if (error) {
      throw error;
    }

    const container =
      document.getElementById(
        "myBookingsContainer"
      ) ||
      document.getElementById(
        "providerContainer"
      );

    if (!container) {
      return;
    }

    container.innerHTML =
      `<h2>My Bookings</h2>`;

    if (!bookings?.length) {
      container.innerHTML +=
        "<p>No bookings found.</p>";

      return;
    }

    bookings.forEach(booking => {
      const card =
        document.createElement("div");

      card.className =
        "booking-card";

      card.innerHTML = `
        <h3>
          ${escapeHtml(
            booking.service
          )}
        </h3>

        <p>
          <strong>Provider:</strong>
          ${escapeHtml(
            booking.provider_name
          )}
        </p>

        <p>
          <strong>Date:</strong>
          ${escapeHtml(
            formatDate(
              booking.booking_date
            )
          )}
        </p>

        <p>
          <strong>Time:</strong>
          ${escapeHtml(
            booking.booking_time
          )}
        </p>

        <p>
          <strong>Address:</strong>
          ${escapeHtml(
            booking.address
          )}
        </p>

        <p>
          <strong>Status:</strong>
          ${escapeHtml(
            booking.status
          )}
        </p>

        ${
          booking.final_price != null
            ? `
              <p>
                <strong>
                  Final Price:
                </strong>
                ₹${escapeHtml(
                  booking.final_price
                )}
              </p>
            `
            : ""
        }

        <div class="booking-actions"></div>
      `;

      const actions =
        card.querySelector(
          ".booking-actions"
        );

      if (
        booking.status === "Pending" ||
        booking.status === "Confirmed"
      ) {
        const cancelBtn =
          document.createElement(
            "button"
          );

        cancelBtn.textContent =
          "Cancel Booking";

        cancelBtn.addEventListener(
          "click",
          () =>
            cancelBooking(
              booking.id
            )
        );

        actions.appendChild(
          cancelBtn
        );
      }

      if (booking.provider_phone) {
        const callBtn =
          document.createElement(
            "a"
          );

        callBtn.href =
          `tel:${booking.provider_phone}`;

        callBtn.textContent =
          "Call Provider";

        actions.appendChild(
          callBtn
        );
      }

      container.appendChild(card);
    });

    const section =
      document.getElementById(
        "myBookingsSection"
      );

    if (section) {
      section.style.display =
        "block";
    }

  } catch (error) {
    console.error(
      "My bookings error:",
      error
    );

    showMessage(
      `Unable to load bookings: ${
        error.message ||
        "Try again."
      }`
    );
  }
}

async function cancelBooking(
  bookingId
) {
  if (
    !confirm(
      "Cancel this booking?"
    )
  ) {
    return;
  }

  try {
    const {
      error
    } = await supabaseClient
      .from("bookings")
      .update({
        status: "Cancelled"
      })
      .eq(
        "id",
        bookingId
      );

    if (error) {
      throw error;
    }

    showMessage(
      "Booking cancelled."
    );

    showMyBookings();

  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );

    showMessage(
      `Unable to cancel: ${
        error.message ||
        "Try again."
      }`
    );
  }
}

// =========================
// PROVIDER PROFILE + REVIEWS
// =========================

let selectedProfileProvider =
  null;

async function openProviderProfile(
  provider
) {
  selectedProfileProvider =
    provider;

  const modal =
    document.getElementById(
      "providerProfileModal"
    );

  if (!modal) {
    return;
  }

  const name =
    modal.querySelector(
      ".provider-profile-name"
    );

  const service =
    modal.querySelector(
      ".provider-profile-service"
    );

  const phone =
    modal.querySelector(
      ".provider-profile-phone"
    );

  const location =
    modal.querySelector(
      ".provider-profile-location"
    );

  const experience =
    modal.querySelector(
      ".provider-profile-experience"
    );

  const skill =
    modal.querySelector(
      ".provider-profile-skill"
    );

  const availability =
    modal.querySelector(
      ".provider-profile-availability"
    );

  if (name) {
    name.textContent =
      provider.name || "-";
  }

  if (service) {
    service.textContent =
      provider.service || "-";
  }

  if (phone) {
    phone.textContent =
      provider.phone || "-";
  }

  if (location) {
    location.textContent =
      provider.location || "-";
  }

  if (experience) {
    experience.textContent =
      provider.experience || "-";
  }

  if (skill) {
    skill.textContent =
      provider.skill || "-";
  }

  if (availability) {
    availability.textContent =
      provider.availability || "-";
  }

  modal.style.display =
    "flex";

  await loadProviderReviews(
    provider
  );
}

function closeProviderProfile() {
  const modal =
    document.getElementById(
      "providerProfileModal"
    );

  if (modal) {
    modal.style.display =
      "none";
  }

  selectedProfileProvider =
    null;
}

async function loadProviderReviews(
  provider
) {
  const container =
    document.getElementById(
      "reviewsContainer"
    ) ||
    document.querySelector(
      ".reviews-container"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    `
      <h3>Reviews</h3>
      <p>Loading...</p>
    `;

  try {
    let query =
      supabaseClient
        .from("reviews")
        .select("*")
        .eq(
          "provider_name",
          provider.name
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    if (provider.service) {
      query =
        query.eq(
          "service",
          provider.service
        );
    }

    const {
      data: reviews,
      error
    } = await query;

    if (error) {
      throw error;
    }

    const list =
      reviews || [];

    const average =
      list.length
        ? (
            list.reduce(
              (
                sum,
                review
              ) =>
                sum +
                Number(
                  review.rating ||
                  0
                ),
              0
            ) /
            list.length
          ).toFixed(1)
        : "0.0";

    container.innerHTML = `
      <h3>Reviews</h3>

      <p>
        <strong>Rating:</strong>
        ⭐ ${average}
        (${list.length} reviews)
      </p>
    `;

    if (!list.length) {
      container.innerHTML +=
        "<p>No reviews yet.</p>";

      return;
    }

    list.forEach(review => {
      const item =
        document.createElement(
          "div"
        );

      item.className =
        "review-item";

      item.innerHTML = `
        <strong>
          ${escapeHtml(
            review.reviewer_name
          )}
        </strong>

        <div>
          ⭐ ${escapeHtml(
            review.rating
          )}/5
        </div>

        <p>
          ${escapeHtml(
            review.review || ""
          )}
        </p>
      `;

      container.appendChild(
        item
      );
    });

  } catch (error) {
    console.error(
      "Reviews error:",
      error
    );

    container.innerHTML =
      `
        <h3>Reviews</h3>
        <p>
          Unable to load reviews.
        </p>
      `;
  }
}

function openReviewForm() {
  if (!isLoggedIn()) {
    openLogin();
    return;
  }

  if (!selectedProfileProvider) {
    showMessage(
      "Select a provider first."
    );

    return;
  }

  const modal =
    document.getElementById(
      "reviewModal"
    );

  if (modal) {
    modal.style.display =
      "flex";
  }
}

function closeReviewForm() {
  const modal =
    document.getElementById(
      "reviewModal"
    );

  if (modal) {
    modal.style.display =
      "none";
  }
}

async function submitReview(
  event
) {
  if (event) {
    event.preventDefault();
  }

  const user =
    getSavedUser();

  if (
    !user ||
    !selectedProfileProvider
  ) {
    showMessage(
      "Please login and select a provider."
    );

    return;
  }

  const rating =
    Number(
      document.getElementById(
        "reviewRating"
      )?.value
    ) ||
    Number(
      document.querySelector(
        'input[name="rating"]:checked'
      )?.value
    );

  const review =
    document.getElementById(
      "reviewText"
    )?.value.trim() || "";

  if (
    !rating ||
    rating < 1 ||
    rating > 5
  ) {
    showMessage(
      "Please select a rating."
    );

    return;
  }

  try {
    const {
      error
    } = await supabaseClient
      .from("reviews")
      .insert([
        {
          provider_user_id:
            selectedProfileProvider.userId ||
            null,

          provider_name:
            selectedProfileProvider.name,

          service:
            selectedProfileProvider.service,

          reviewer_user_id:
            user.id || user.Id,

          reviewer_name:
            user.name,

          rating:
            rating,

          review:
            review
        }
      ]);

    if (error) {
      throw error;
    }

    closeReviewForm();

    showMessage(
      "Review submitted successfully."
    );

    await loadProviderReviews(
      selectedProfileProvider
    );

  } catch (error) {
    console.error(
      "Review error:",
      error
    );

    showMessage(
      `Review failed: ${
        error.message ||
        "Please try again."
      }`
    );
  }
}

// =========================
// PROVIDER DASHBOARD
// =========================

async function openProviderDashboard() {
  if (!isLoggedIn()) {
    openLogin();
    return;
  }

  if (!isProviderUser()) {
    showMessage(
      "Provider Dashboard is available only for providers."
    );

    return;
  }

  const modal =
    document.getElementById(
      "providerDashboardModal"
    );

  if (!modal) {
    await loadProviderDashboard();
    return;
  }

  modal.style.display =
    "flex";

  await loadProviderDashboard();
}

function closeProviderDashboard() {
  const modal =
    document.getElementById(
      "providerDashboardModal"
    );

  if (modal) {
    modal.style.display =
      "none";
  }
}

async function loadProviderDashboard() {
  const user =
    getSavedUser();

  const providerId =
    user?.id ||
    user?.Id;

  if (!providerId) {
    return;
  }

  const container =
    document.getElementById(
      "providerDashboardContainer"
    ) ||
    document.querySelector(
      ".provider-dashboard-container"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    "<p>Loading bookings...</p>";

  try {
    const {
      data: bookings,
      error
    } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq(
        "provider_user_id",
        providerId
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );

    if (error) {
      throw error;
    }

    const list =
      bookings || [];

    const customerIds = [
      ...new Set(
        list
          .map(
            booking =>
              booking.user_id
          )
          .filter(Boolean)
      )
    ];

    let customerMap =
      new Map();

    if (customerIds.length) {
      const {
        data: customers
      } = await supabaseClient
        .from("users")
        .select(
          "Id, Name, Mobile"
        )
        .in(
          "Id",
          customerIds
        );

      (customers || [])
        .forEach(customer => {
          customerMap.set(
            String(customer.Id),
            customer
          );
        });
    }

    container.innerHTML = `
      <h2>
        Provider Dashboard
      </h2>

      <p>
        <strong>Provider:</strong>
        ${escapeHtml(
          user.name
        )}
      </p>

      <p>
        <strong>Service:</strong>
        ${escapeHtml(
          user.workType || "-"
        )}
      </p>

      <div class="dashboard-stats">
        <span>
          Total: ${list.length}
        </span>

        <span>
          Pending:
          ${
            list.filter(
              booking =>
                booking.status ===
                "Pending"
            ).length
          }
        </span>

        <span>
          Confirmed:
          ${
            list.filter(
              booking =>
                booking.status ===
                "Confirmed"
            ).length
          }
        </span>

        <span>
          Completed:
          ${
            list.filter(
              booking =>
                booking.status ===
                "Completed"
            ).length
          }
        </span>
      </div>
    `;

    if (!list.length) {
      container.innerHTML +=
        "<p>No bookings yet.</p>";

      return;
    }

    list.forEach(booking => {
      const customer =
        customerMap.get(
          String(
            booking.user_id
          )
        );

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "provider-booking-card";

      card.innerHTML = `
        <h3>
          ${escapeHtml(
            booking.service
          )}
        </h3>

        <p>
          <strong>Customer:</strong>
          ${escapeHtml(
            customer?.Name ||
            "Customer"
          )}
        </p>

        ${
          customer?.Mobile
            ? `
              <p>
                <strong>
                  Customer Phone:
                </strong>
                ${escapeHtml(
                  customer.Mobile
                )}
              </p>
            `
            : ""
        }

        <p>
          <strong>Date:</strong>
          ${escapeHtml(
            formatDate(
              booking.booking_date
            )
          )}
        </p>

        <p>
          <strong>Time:</strong>
          ${escapeHtml(
            booking.booking_time
          )}
        </p>

        <p>
          <strong>Address:</strong>
          ${escapeHtml(
            booking.address
          )}
        </p>

        <p>
          <strong>Problem:</strong>
          ${escapeHtml(
            booking.problem_description ||
            "Not provided"
          )}
        </p>

        <p>
          <strong>Status:</strong>
          <span class="booking-status">
            ${escapeHtml(
              booking.status
            )}
          </span>
        </p>

        ${
          booking.estimated_price != null
            ? `
              <p>
                <strong>
                  Estimated Price:
                </strong>
                ₹${escapeHtml(
                  booking.estimated_price
                )}
              </p>
            `
            : ""
        }

        ${
          booking.final_price != null
            ? `
              <p>
                <strong>
                  Final Price:
                </strong>
                ₹${escapeHtml(
                  booking.final_price
                )}
              </p>
            `
            : ""
        }

        <div
          class="provider-booking-actions"
        ></div>
      `;

      const actions =
        card.querySelector(
          ".provider-booking-actions"
        );

      if (
        booking.status ===
        "Pending"
      ) {
        const acceptBtn =
          document.createElement(
            "button"
          );

        acceptBtn.textContent =
          "Accept";

        acceptBtn.addEventListener(
          "click",
          () =>
            updateBookingStatus(
              booking.id,
              "Confirmed"
            )
        );

        const rejectBtn =
          document.createElement(
            "button"
          );

        rejectBtn.textContent =
          "Reject";

        rejectBtn.addEventListener(
          "click",
          () =>
            updateBookingStatus(
              booking.id,
              "Rejected"
            )
        );

        actions.appendChild(
          acceptBtn
        );

        actions.appendChild(
          rejectBtn
        );
      }

      if (
        booking.status ===
        "Confirmed"
      ) {
        const completeBtn =
          document.createElement(
            "button"
          );

        completeBtn.textContent =
          "Mark Completed";

        completeBtn.addEventListener(
          "click",
          () =>
            updateBookingStatus(
              booking.id,
              "Completed"
            )
        );

        actions.appendChild(
          completeBtn
        );
      }

      if (customer?.Mobile) {
        const callBtn =
          document.createElement(
            "a"
          );

        callBtn.href =
          `tel:${customer.Mobile}`;

        callBtn.textContent =
          "Call Customer";

        actions.appendChild(
          callBtn
        );
      }

      container.appendChild(
        card
      );
    });

  } catch (error) {
    console.error(
      "Provider dashboard error:",
      error
    );

    container.innerHTML = `
      <h2>
        Provider Dashboard
      </h2>

      <p>
        Unable to load bookings.
      </p>

      <p>
        ${escapeHtml(
          error.message || ""
        )}
      </p>
    `;
  }
}

async function updateBookingStatus(
  bookingId,
  status
) {
  try {
    const {
      error
    } = await supabaseClient
      .from("bookings")
      .update({
        status: status
      })
      .eq(
        "id",
        bookingId
      );

    if (error) {
      throw error;
    }

    showMessage(
      `Booking ${status.toLowerCase()}.`
    );

    await loadProviderDashboard();

  } catch (error) {
    console.error(
      "Status update error:",
      error
    );

    showMessage(
      `Unable to update booking: ${
        error.message ||
        "Try again."
      }`
    );
  }
          }
// =========================
// NAVIGATION
// =========================

function addMyBookingsButton() {
  const nav = document.querySelector(".main-nav");
  if (!nav) return;

  let button = document.getElementById("myBookingsNavBtn");

  if (!button) {
    button = document.createElement("button");
    button.id = "myBookingsNavBtn";
    button.textContent = "My Bookings";
    button.addEventListener("click", showMyBookings);
    nav.appendChild(button);
  }
}

function removeMyBookingsButton() {
  document.getElementById("myBookingsNavBtn")?.remove();
}


// =========================
// EVENT LISTENERS
// =========================

document.addEventListener("DOMContentLoaded", () => {

  updateLoginButton();
  updateProviderDashboardButton();

  if (isLoggedIn()) {
    addMyBookingsButton();
  }

  setMinBookingDate();


  // Register form
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }


  // Login form
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }


  // Booking form
  const bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    bookingForm.addEventListener("submit", confirmBooking);
  }


  // Review form
  const reviewForm = document.getElementById("reviewForm");

  if (reviewForm) {
    reviewForm.addEventListener("submit", submitReview);
  }


  // Category cards
  document.querySelectorAll(".category-card").forEach(card => {

    if (card.dataset.quickHelpBound === "true") {
      return;
    }

    const service =
      card.dataset.service ||
      card.getAttribute("data-category") ||
      card.querySelector("[data-service]")?.getAttribute("data-service");

    if (!service) {
      return;
    }

    card.dataset.quickHelpBound = "true";

    card.addEventListener("click", () => {
      showProviders(service);
    });

  });

});


// =========================
// CLOSE MODALS BY OUTSIDE CLICK
// =========================

window.addEventListener("click", event => {

  const modalIds = [
    "loginModal",
    "registerModal",
    "accountModal",
    "profileModal",
    "settingsModal",
    "bookingModal",
    "providerProfileModal",
    "reviewModal",
    "providerDashboardModal"
  ];

  modalIds.forEach(id => {

    const modal = document.getElementById(id);

    if (modal && event.target === modal) {
      modal.style.display = "none";
    }

  });

});


// =========================
// ESC KEY CLOSE
// =========================

document.addEventListener("keydown", event => {

  if (event.key !== "Escape") {
    return;
  }

  closeLogin();
  closeRegister();
  closeAccountMenu();
  closeProfile();
  closeSettings();
  closeBooking();
  closeProviderProfile();
  closeReviewForm();
  closeProviderDashboard();

});


// =========================
// MAKE FUNCTIONS AVAILABLE
// TO EXISTING HTML onclick
// =========================

window.openLogin = openLogin;
window.closeLogin = closeLogin;

window.openRegister = openRegister;
window.closeRegister = closeRegister;

window.handleRegister = handleRegister;
window.handleLogin = handleLogin;

window.openAccountMenu = openAccountMenu;
window.closeAccountMenu = closeAccountMenu;

window.accountLogin = accountLogin;

window.openProfile = openProfile;
window.closeProfile = closeProfile;

window.openSettings = openSettings;
window.closeSettings = closeSettings;

window.goHome = goHome;

window.searchProviders = searchProviders;

window.showProviders = showProviders;

window.showAppInfo = showAppInfo;
window.showHelp = showHelp;
window.showPrivacy = showPrivacy;

window.logoutUser = logoutUser;

window.showMyBookings = showMyBookings;

window.openBooking = openBooking;
window.closeBooking = closeBooking;
window.confirmBooking = confirmBooking;
window.cancelBooking = cancelBooking;

window.openProviderProfile = openProviderProfile;
window.closeProviderProfile = closeProviderProfile;

window.openReviewForm = openReviewForm;
window.closeReviewForm = closeReviewForm;
window.submitReview = submitReview;

window.openProviderDashboard = openProviderDashboard;
window.closeProviderDashboard = closeProviderDashboard;
window.updateBookingStatus = updateBookingStatus;


// =========================
// INITIAL PROVIDER LIST
// =========================

showProviders();
