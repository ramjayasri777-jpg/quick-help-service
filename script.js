const providers = [
  {
    name: "ishwarya",
    service: "Plumber",
    phone: "9600413842",
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


/* =========================
   SHOW PROVIDERS
========================= */

function showProviders(service) {

  const providerContainer =
    document.getElementById("providers");

  const serviceTitle =
    document.getElementById("serviceTitle");

  const providerCount =
    document.getElementById("providerCount");

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


/* =========================
   LOGIN MODAL
========================= */

function openLogin() {

  const loginModal =
    document.getElementById("loginModal");

  const registerModal =
    document.getElementById("registerModal");

  registerModal.classList.remove("active");

  loginModal.classList.add("active");

}


/* =========================
   CLOSE LOGIN
========================= */

function closeLogin() {

  const loginModal =
    document.getElementById("loginModal");

  loginModal.classList.remove("active");

}


/* =========================
   OPEN REGISTER
========================= */

function openRegister() {

  const loginModal =
    document.getElementById("loginModal");

  const registerModal =
    document.getElementById("registerModal");

  loginModal.classList.remove("active");

  registerModal.classList.add("active");

}


/* =========================
   CLOSE REGISTER
========================= */

function closeRegister() {

  const registerModal =
    document.getElementById("registerModal");

  registerModal.classList.remove("active");

}


/* =========================
   REGISTER ACCOUNT
========================= */

function handleRegister(event) {

  event.preventDefault();

  const name =
    document.getElementById("userName").value.trim();

  const mobile =
    document.getElementById("userMobile").value.trim();

  const email =
    document.getElementById("userEmail").value.trim();

  const password =
    document.getElementById("userPassword").value;

  const location =
    document.getElementById("userLocation").value.trim();

  const workType =
    document.getElementById("workType").value;

  const experience =
    document.getElementById("experience").value;

  const skills =
    document.getElementById("skills").value.trim();

  const workLocation =
    document.getElementById("workLocation").value.trim();

  const availableTime =
    document.getElementById("availableTime").value;


  /* Check existing account */

  const existingUser =
    localStorage.getItem("quickHelpUser");

  if (existingUser) {

    const oldUser =
      JSON.parse(existingUser);

    if (oldUser.mobile === mobile) {

      alert(
        "An account with this mobile number already exists. Please login."
      );

      openLogin();

      return;
    }
  }


  /* Create user */

  const user = {

    name: name,

    mobile: mobile,

    email: email,

    password: password,

    location: location,

    workType: workType,

    experience: experience,

    skills: skills,

    workLocation: workLocation,

    availableTime: availableTime,

    createdAt: new Date().toISOString()

  };


  /* Save account */

  localStorage.setItem(
    "quickHelpUser",
    JSON.stringify(user)
  );


  /* Save login session */

  localStorage.setItem(
    "quickHelpLoggedIn",
    "true"
  );


  closeRegister();


  document.getElementById("registerForm").reset();


  alert(
    "Account created successfully! Welcome to Quick Help, " +
    name +
    " 🎉"
  );


  updateLoginButton();

}


/* =========================
   LOGIN
========================= */

function handleLogin(event) {

  event.preventDefault();

  const mobile =
    document.getElementById("loginMobile").value.trim();

  const password =
    document.getElementById("loginPassword").value;


  const savedUser =
    localStorage.getItem("quickHelpUser");


  if (!savedUser) {

    alert(
      "No account found. Please create a new account first."
    );

    openRegister();

    return;
  }


  const user =
    JSON.parse(savedUser);


  if (
    user.mobile === mobile &&
    user.password === password
  ) {

    localStorage.setItem(
      "quickHelpLoggedIn",
      "true"
    );


    closeLogin();


    document.getElementById("loginForm").reset();


    alert(
      "Login successful! Welcome back, " +
      user.name +
      " 👋"
    );


    updateLoginButton();

  } else {

    alert(
      "Incorrect mobile number or password."
    );

  }

}


/* =========================
   UPDATE LOGIN BUTTON
========================= */

function updateLoginButton() {

  const loginButton =
    document.querySelector(".login-btn");

  const savedUser =
    localStorage.getItem("quickHelpUser");

  const loggedIn =
    localStorage.getItem("quickHelpLoggedIn");


  if (
    loginButton &&
    savedUser &&
    loggedIn === "true"
  ) {

    const user =
      JSON.parse(savedUser);

    loginButton.textContent =
      "👤 " + user.name;

  } else if (loginButton) {

    loginButton.textContent =
      "👤 Login / Register";

  }

}


/* =========================
   LOGOUT
========================= */

function logoutUser() {

  localStorage.removeItem(
    "quickHelpLoggedIn"
  );

  updateLoginButton();

  alert("You have been logged out.");

}


/* =========================
   CLOSE MODALS
   WHEN CLICKING OUTSIDE
========================= */

document.addEventListener(
  "click",
  function(event) {

    const loginModal =
      document.getElementById("loginModal");

    const registerModal =
      document.getElementById("registerModal");


    if (
      event.target === loginModal
    ) {

      closeLogin();

    }


    if (
      event.target === registerModal
    ) {

      closeRegister();

    }

  }
);


/* =========================
   ESC KEY CLOSE
========================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeLogin();

      closeRegister();

    }

  }
);


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateLoginButton();

  }
);
