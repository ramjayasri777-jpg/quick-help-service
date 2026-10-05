/* =========================================================
   SUPABASE CONNECTION
========================================================= */

const SUPABASE_URL =
  "https://mkfmwmbiylvyixjlmcba.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_c7E2D-jjrLFzLwIB_sfahg_WROFByrn";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================================================
   STATIC PROVIDERS
========================================================= */

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


/* =========================================================
   SERVICE ICON
========================================================= */

function getServiceIcon(service) {

  const icons = {
    Plumber: "🔧",
    Electrician: "⚡",
    Carpenter: "🪚",
    Painter: "🎨"
  };

  return icons[service] || "🛠️";
}


/* =========================================================
   HTML SECURITY HELPER
========================================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   RENDER PROVIDERS
========================================================= */

function renderProviders(providerList) {

  const providerContainer =
    document.getElementById("providers");

  const providerCount =
    document.getElementById("providerCount");


  if (providerCount) {

    providerCount.textContent =
      providerList.length + " professionals";

  }


  if (!providerContainer) {
    return;
  }


  providerContainer.innerHTML = "";


  if (providerList.length === 0) {

    providerContainer.innerHTML = `
      <div class="provider-card">
        <h3>No professionals found</h3>
        <p>No registered provider found in this category.</p>
      </div>
    `;

    return;
  }


  providerList.forEach(provider => {

    const card =
      document.createElement("div");


    card.className =
      "provider-card";


    const statusClass =
      provider.status === "Available"
        ? "available"
        : "busy";


    const skillsHtml =
      provider.skills
        ? `
          <div class="detail">
            🛠️ <strong>Skills:</strong>
            ${escapeHtml(provider.skills)}
          </div>
        `
        : "";


    const availableTimeHtml =
      provider.availableTime
        ? `
          <div class="detail">
            🕒 <strong>Available:</strong>
            ${escapeHtml(provider.availableTime)}
          </div>
        `
        : "";


    const callButton =
      provider.phone
        ? `
          <a
            class="call-btn"
            href="tel:${escapeHtml(provider.phone)}"
          >
            📞 Call Now
          </a>
        `
        : "";


    card.innerHTML = `

      <div class="provider-top">

        <div class="provider-avatar">
          ${escapeHtml(provider.icon)}
        </div>

        <div class="provider-info">

          <h3>
            ${escapeHtml(provider.name)}
          </h3>

          <div class="service-name">
            ${escapeHtml(provider.service)}
          </div>

          <div class="rating">
            ⭐ ${escapeHtml(provider.rating)}
          </div>

        </div>

      </div>


      <div class="details">

        <div class="detail">
          📍 <strong>Location:</strong>
          ${escapeHtml(provider.location)}
        </div>

        <div class="detail">
          💼 <strong>Experience:</strong>
          ${escapeHtml(provider.experience)}
        </div>

        ${skillsHtml}

        ${availableTimeHtml}

        <div class="detail ${statusClass}">
          ● ${escapeHtml(provider.status)}
        </div>

      </div>

      ${callButton}

    `;


    providerContainer.appendChild(card);

  });

}


/* =========================================================
   SHOW PROVIDERS
   LOAD STATIC + SUPABASE PROVIDERS
========================================================= */

async function showProviders(service) {

  const providerContainer =
    document.getElementById("providers");

  const serviceTitle =
    document.getElementById("serviceTitle");

  const providerCount =
    document.getElementById("providerCount");


  if (serviceTitle) {

    serviceTitle.textContent =
      service + "s";

  }


  if (providerCount) {

    providerCount.textContent =
      "Loading professionals...";

  }


  if (providerContainer) {

    providerContainer.innerHTML = `
      <div class="provider-card">
        <h3>Loading...</h3>
        <p>Finding ${escapeHtml(service)} professionals...</p>
      </div>
    `;

  }


  try {

    /* -------------------------------------------------------
       GET ALL WORK DETAILS
    ------------------------------------------------------- */

    const {
      data: workRows,
      error: workFetchError
    } = await supabaseClient
      .from("work_details")
      .select(
        '"User_id", "Work_type", "Experience", "Skill", "Work_location", "Available time"'
      );


    if (workFetchError) {

      throw workFetchError;

    }


    /* -------------------------------------------------------
       FILTER SELECTED CATEGORY
       CASE-INSENSITIVE
    ------------------------------------------------------- */

    const selectedService =
      String(service)
        .trim()
        .toLowerCase();


    const matchingWorkRows =
      (workRows || []).filter(row => {

        return String(row.Work_type || "")
          .trim()
          .toLowerCase() === selectedService;

      });


    /* -------------------------------------------------------
       GET USER IDS
    ------------------------------------------------------- */

    const userIds = [
      ...new Set(
        matchingWorkRows
          .map(row => row.User_id)
          .filter(id => id !== null && id !== undefined)
      )
    ];


    let registeredProviders = [];


    /* -------------------------------------------------------
       GET USERS
    ------------------------------------------------------- */

    if (userIds.length > 0) {

      const {
        data: users,
        error: usersError
      } = await supabaseClient
        .from("users")
        .select(
          '"Id", "Name", "Mobile", "Email", "Location"'
        )
        .in("Id", userIds);


      if (usersError) {

        throw usersError;

      }


      const userMap =
        new Map(
          (users || []).map(user => [
            String(user.Id),
            user
          ])
        );


      /* -----------------------------------------------------
         MERGE USER + WORK DETAILS
      ----------------------------------------------------- */

      registeredProviders =
        matchingWorkRows
          .map(work => {

            const user =
              userMap.get(
                String(work.User_id)
              );


            if (!user) {
              return null;
            }


            return {

              name:
                user.Name ||
                "Quick Help Provider",

              service:
                work.Work_type ||
                service,

              phone:
                user.Mobile ||
                "",

              location:
                work.Work_location ||
                user.Location ||
                "Not specified",

              experience:
                work.Experience ||
                "Not specified",

              rating:
                "New",

              status:
                "Available",

              icon:
                getServiceIcon(
                  work.Work_type || service
                ),

              skills:
                work.Skill ||
                "",

              availableTime:
                work["Available time"] ||
                ""

            };

          })
          .filter(Boolean);

    }


    /* -------------------------------------------------------
       STATIC PROVIDERS
    ------------------------------------------------------- */

    const staticProviders =
      providers.filter(provider => {

        return String(provider.service)
          .trim()
          .toLowerCase() === selectedService;

      });


    /* -------------------------------------------------------
       DATABASE PROVIDERS FIRST
       STATIC PROVIDERS AFTER
    ------------------------------------------------------- */

    const allProviders = [
      ...registeredProviders,
      ...staticProviders
    ];


    /* -------------------------------------------------------
       DISPLAY
    ------------------------------------------------------- */

    renderProviders(allProviders);


  } catch (error) {

    console.error(
      "Provider loading error:",
      error
    );


    /* -------------------------------------------------------
       FALLBACK TO STATIC PROVIDERS
    ------------------------------------------------------- */

    const staticProviders =
      providers.filter(provider => {

        return String(provider.service)
          .trim()
          .toLowerCase() ===
          String(service)
            .trim()
            .toLowerCase();

      });


    renderProviders(staticProviders);

  }

}


/* =========================================================
   LOGIN MODAL
========================================================= */

function openLogin() {

  const loginModal =
    document.getElementById("loginModal");

  const registerModal =
    document.getElementById("registerModal");


  if (registerModal) {

    registerModal.classList.remove("active");

  }


  if (loginModal) {

    loginModal.classList.add("active");

  }

}


/* =========================================================
   CLOSE LOGIN
========================================================= */

function closeLogin() {

  const loginModal =
    document.getElementById("loginModal");


  if (loginModal) {

    loginModal.classList.remove("active");

  }

}


/* =========================================================
   OPEN REGISTER
========================================================= */

function openRegister() {

  const loginModal =
    document.getElementById("loginModal");

  const registerModal =
    document.getElementById("registerModal");


  if (loginModal) {

    loginModal.classList.remove("active");

  }


  if (registerModal) {

    registerModal.classList.add("active");

  }

}


/* =========================================================
   CLOSE REGISTER
========================================================= */

function closeRegister() {

  const registerModal =
    document.getElementById("registerModal");


  if (registerModal) {

    registerModal.classList.remove("active");

  }

}


/* =========================================================
   REGISTER
========================================================= */

async function handleRegister(event) {

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


  /* -------------------------------------------------------
     VALIDATION
  ------------------------------------------------------- */

  if (
    !name ||
    !mobile ||
    !email ||
    !password ||
    !location ||
    !workType ||
    !experience ||
    !skills ||
    !workLocation ||
    !availableTime
  ) {

    alert(
      "Please fill all required fields."
    );

    return;

  }


  try {

    /* -----------------------------------------------------
       CHECK EXISTING MOBILE
    ----------------------------------------------------- */

    const {
      data: existingUsers,
      error: checkError
    } = await supabaseClient
      .from("users")
      .select('"Id"')
      .eq("Mobile", mobile)
      .limit(1);


    if (checkError) {

      console.error(
        "Check user error:",
        checkError
      );

      alert(
        "Unable to check account. Please try again."
      );

      return;

    }


    if (
      existingUsers &&
      existingUsers.length > 0
    ) {

      alert(
        "An account with this mobile number already exists. Please login."
      );

      openLogin();

      return;

    }


    /* -----------------------------------------------------
       CREATE USER
    ----------------------------------------------------- */

    const {
      data: newUser,
      error: userError
    } = await supabaseClient
      .from("users")
      .insert({

        "Created_at":
          new Date().toISOString(),

        "Name":
          name,

        "Mobile":
          mobile,

        "Email":
          email,

        "Password":
          password,

        "Location":
          location

      })
      .select('"Id"')
      .single();


    if (userError) {

      console.error(
        "User insert error:",
        userError
      );

      alert(
        "Account creation failed: " +
        userError.message
      );

      return;

    }


    /* -----------------------------------------------------
       CREATE WORK DETAILS
       IMPORTANT:
       Work_type = CATEGORY
    ----------------------------------------------------- */

    const {
      error: workError
    } = await supabaseClient
      .from("work_details")
      .insert({

        "created_at":
          new Date().toISOString(),

        "User_id":
          newUser.Id,

        "Work_type":
          workType,

        "Experience":
          experience,

        "Skill":
          skills,

        "Work_location":
          workLocation,

        "Available time":
          availableTime

      });


    if (workError) {

      console.error(
        "Work details error:",
        workError
      );

      alert(
        "Account created, but work details could not be saved: " +
        workError.message
      );

      return;

    }


    /* -----------------------------------------------------
       SAVE SESSION
    ----------------------------------------------------- */

    const user = {

      id:
        newUser.Id,

      name:
        name,

      mobile:
        mobile,

      email:
        email,

      location:
        location,

      workType:
        workType,

      experience:
        experience,

      skills:
        skills,

      workLocation:
        workLocation,

      availableTime:
        availableTime

    };


    localStorage.setItem(
      "quickHelpUser",
      JSON.stringify(user)
    );


    localStorage.setItem(
      "quickHelpLoggedIn",
      "true"
    );


    closeRegister();


    const registerForm =
      document.getElementById("registerForm");


    if (registerForm) {

      registerForm.reset();

    }


    alert(
      "Account created successfully! Welcome to Quick Help, " +
      name +
      " 🎉"
    );


    updateLoginButton();


  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    alert(
      "Something went wrong. Please try again."
    );

  }

}


/* =========================================================
   LOGIN
========================================================= */

async function handleLogin(event) {

  event.preventDefault();


  const mobile =
    document
      .getElementById("loginMobile")
      .value
      .trim();


  const password =
    document
      .getElementById("loginPassword")
      .value;


  if (!mobile || !password) {

    alert(
      "Please enter mobile number and password."
    );

    return;

  }


  try {

    const {
      data: users,
      error: loginError
    } = await supabaseClient
      .from("users")
      .select(
        '"Id", "Name", "Mobile", "Email", "Password", "Location"'
      )
      .eq("Mobile", mobile)
      .eq("Password", password)
      .limit(1);


    if (loginError) {

      console.error(
        "Login error:",
        loginError
      );

      alert(
        "Unable to login. Please try again."
      );

      return;

    }


    if (
      !users ||
      users.length === 0
    ) {

      alert(
        "Incorrect mobile number or password."
      );

      return;

    }


    const user =
      users[0];


    /* -----------------------------------------------------
       GET WORK DETAILS
    ----------------------------------------------------- */

    const {
      data: workDetails,
      error: workError
    } = await supabaseClient
      .from("work_details")
      .select(
        '"User_id", "Work_type", "Experience", "Skill", "Work_location", "Available time"'
      )
      .eq("User_id", user.Id)
      .limit(1);


    if (workError) {

      console.error(
        "Work details fetch error:",
        workError
      );

    }


    const work =
      workDetails &&
      workDetails.length > 0
        ? workDetails[0]
        : {};


    /* -----------------------------------------------------
       SAVE SESSION
    ----------------------------------------------------- */

    const loggedInUser = {

      id:
        user.Id,

      name:
        user.Name,

      mobile:
        user.Mobile,

      email:
        user.Email,

      location:
        user.Location,

      workType:
        work.Work_type || "",

      experience:
        work.Experience || "",

      skills:
        work.Skill || "",

      workLocation:
        work.Work_location || "",

      availableTime:
        work["Available time"] || ""

    };


    localStorage.setItem(
      "quickHelpUser",
      JSON.stringify(loggedInUser)
    );


    localStorage.setItem(
      "quickHelpLoggedIn",
      "true"
    );


    closeLogin();


    const loginForm =
      document.getElementById("loginForm");


    if (loginForm) {

      loginForm.reset();

    }


    alert(
      "Login successful! Welcome back, " +
      user.Name +
      " 👋"
    );


    updateLoginButton();


  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    alert(
      "Something went wrong. Please try again."
    );

  }

}


/* =========================================================
   UPDATE LOGIN BUTTON
========================================================= */

function updateLoginButton() {

  const loginButton =
    document.querySelector(".login-btn");


  const savedUser =
    localStorage.getItem(
      "quickHelpUser"
    );


  const loggedIn =
    localStorage.getItem(
      "quickHelpLoggedIn"
    );


  if (
    loginButton &&
    savedUser &&
    loggedIn === "true"
  ) {

    try {

      const user =
        JSON.parse(savedUser);


      loginButton.textContent =
        "👤 " + user.name;

    } catch (error) {

      console.error(
        "Session read error:",
        error
      );

      loginButton.textContent =
        "👤 Login / Register";

    }

  } else if (loginButton) {

    loginButton.textContent =
      "👤 Login / Register";

  }

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

  localStorage.removeItem(
    "quickHelpLoggedIn"
  );


  localStorage.removeItem(
    "quickHelpUser"
  );


  updateLoginButton();


  alert(
    "You have been logged out."
  );

}


/* =========================================================
   CLOSE MODALS OUTSIDE CLICK
========================================================= */

document.addEventListener(
  "click",
  function(event) {

    const loginModal =
      document.getElementById("loginModal");

    const registerModal =
      document.getElementById("registerModal");


    if (
      loginModal &&
      event.target === loginModal
    ) {

      closeLogin();

    }


    if (
      registerModal &&
      event.target === registerModal
    ) {

      closeRegister();

    }

  }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeLogin();

      closeRegister();

    }

  }
);


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateLoginButton();

  }
);

/* =========================================================
   QUICK HELP - PROFILE / SETTINGS / ACCOUNT
========================================================= */


/* =========================================================
   ACCOUNT MENU
========================================================= */

function openAccountMenu() {

  const loggedIn =
    localStorage.getItem("quickHelpLoggedIn") === "true";

  const modal =
    document.getElementById("accountModal");

  const title =
    document.getElementById("accountTitle");

  const subtitle =
    document.getElementById("accountSubtitle");

  const logoutButton =
    document.getElementById("logoutButton");


  if (!modal) {
    return;
  }


  if (loggedIn) {

    const savedUser =
      localStorage.getItem("quickHelpUser");


    if (savedUser) {

      try {

        const user =
          JSON.parse(savedUser);

        title.textContent =
          "Hi, " + user.name + " 👋";

        subtitle.textContent =
          "Manage your Quick Help account";

      } catch (error) {

        console.error(
          "Account data error:",
          error
        );

      }

    }


    if (logoutButton) {
      logoutButton.style.display = "block";
    }

  } else {

    title.textContent =
      "Welcome to Quick Help";

    subtitle.textContent =
      "Login to manage your account";

    if (logoutButton) {
      logoutButton.style.display = "none";
    }

  }


  modal.classList.add("active");

}


/* =========================================================
   CLOSE ACCOUNT
========================================================= */

function closeAccountMenu() {

  const modal =
    document.getElementById("accountModal");

  if (modal) {
    modal.classList.remove("active");
  }

}


/* =========================================================
   ACCOUNT LOGIN
========================================================= */

function accountLogin() {

  closeAccountMenu();

  const loggedIn =
    localStorage.getItem("quickHelpLoggedIn") === "true";


  if (loggedIn) {
    openProfile();
  } else {
    openLogin();
  }

}


/* =========================================================
   PROFILE
========================================================= */

function openProfile() {

  closeAccountMenu();
  closeSettings();


  const loggedIn =
    localStorage.getItem("quickHelpLoggedIn") === "true";


  if (!loggedIn) {

    alert(
      "Please login or create an account first."
    );

    openLogin();

    return;

  }


  loadProfileData();


  const modal =
    document.getElementById("profileModal");


  if (modal) {
    modal.classList.add("active");
  }

}


/* =========================================================
   CLOSE PROFILE
========================================================= */

function closeProfile() {

  const modal =
    document.getElementById("profileModal");

  if (modal) {
    modal.classList.remove("active");
  }

}


/* =========================================================
   LOAD PROFILE
========================================================= */

function loadProfileData() {

  const savedUser =
    localStorage.getItem("quickHelpUser");


  if (!savedUser) {
    return;
  }


  try {

    const user =
      JSON.parse(savedUser);


    const fields = {

      profileName:
        user.name || "-",

      profileMobile:
        user.mobile || "-",

      profileEmail:
        user.email || "-",

      profileLocation:
        user.location || "-",

      profileWorkType:
        user.workType || "-",

      profileExperience:
        user.experience || "-",

      profileSkills:
        user.skills || "-",

      profileWorkLocation:
        user.workLocation || "-",

      profileAvailableTime:
        user.availableTime || "-"

    };


    Object.keys(fields).forEach(id => {

      const element =
        document.getElementById(id);


      if (element) {

        element.textContent =
          fields[id];

      }

    });


  } catch (error) {

    console.error(
      "Profile loading error:",
      error
    );

  }

}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings() {

  closeAccountMenu();
  closeProfile();


  const modal =
    document.getElementById("settingsModal");


  if (modal) {
    modal.classList.add("active");
  }

}


/* =========================================================
   CLOSE SETTINGS
========================================================= */

function closeSettings() {

  const modal =
    document.getElementById("settingsModal");


  if (modal) {
    modal.classList.remove("active");
  }

}


/* =========================================================
   HOME
========================================================= */

function goHome() {

  closeAccountMenu();
  closeProfile();
  closeSettings();
  closeLogin();
  closeRegister();


  const home =
    document.getElementById("homePage");


  if (home) {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  document
    .querySelectorAll(".nav-item")
    .forEach(item => {

      item.classList.remove("active");

    });


  const homeNav =
    document.getElementById("homeNav");


  if (homeNav) {
    homeNav.classList.add("active");
  }

}


/* =========================================================
   SEARCH PROVIDERS
========================================================= */

function searchProviders() {

  const input =
    document.getElementById("providerSearch");


  if (!input) {
    return;
  }


  const search =
    input.value
      .trim()
      .toLowerCase();


  if (!search) {
    return;
  }


  const matched =
    providers.filter(provider => {

      return (
        String(provider.name)
          .toLowerCase()
          .includes(search) ||

        String(provider.service)
          .toLowerCase()
          .includes(search) ||

        String(provider.location)
          .toLowerCase()
          .includes(search)
      );

    });


  renderProviders(matched);

}


/* =========================================================
   SETTINGS - ABOUT
========================================================= */

function showAppInfo() {

  alert(
    "⚡ Quick Help\n\n" +
    "Find trusted service professionals easily.\n\n" +
    "Version: 1.0.0\n" +
    "© 2026 Quick Help"
  );

}


/* =========================================================
   SETTINGS - HELP
========================================================= */

function showHelp() {

  alert(
    "❓ Quick Help Support\n\n" +
    "1. Select a service.\n" +
    "2. Choose a professional.\n" +
    "3. Contact the professional directly.\n\n" +
    "For account problems, please login again."
  );

}


/* =========================================================
   SETTINGS - PRIVACY
========================================================= */

function showPrivacy() {

  alert(
    "🛡️ Privacy\n\n" +
    "Your Quick Help account information is used " +
    "to provide the service-finder experience.\n\n" +
    "Please do not share your password with anyone."
  );

}


/* =========================================================
   LOGOUT - IMPROVED
========================================================= */

function logoutUser() {

  const confirmLogout =
    confirm(
      "Are you sure you want to logout?"
    );


  if (!confirmLogout) {
    return;
  }


  localStorage.removeItem(
    "quickHelpLoggedIn"
  );


  localStorage.removeItem(
    "quickHelpUser"
  );


  closeAccountMenu();
  closeProfile();
  closeSettings();


  updateLoginButton();


  alert(
    "You have been logged out successfully. 👋"
  );


  goHome();

}


/* =========================================================
   MODAL OUTSIDE CLICK
========================================================= */

document.addEventListener(
  "click",
  function(event) {

    const modals = [

      "accountModal",
      "profileModal",
      "settingsModal"

    ];


    modals.forEach(id => {

      const modal =
        document.getElementById(id);


      if (
        modal &&
        event.target === modal
      ) {

        modal.classList.remove("active");

      }

    });

  }
);


/* =========================================================
   UPDATE ACCOUNT UI ON LOAD
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateLoginButton();

  }
);
/* =========================================================
   QUICK HELP - BOOKING SYSTEM
========================================================= */

let selectedProvider = null;


/* =========================
   CREATE BOOKING UI
========================= */

function openBooking(provider) {

  const loggedIn =
    localStorage.getItem("quickHelpLoggedIn") === "true";

  if (!loggedIn) {
    alert("Please login first to book a service.");
    openLogin();
    return;
  }

  selectedProvider = provider;

  let modal = document.getElementById("bookingModal");

  if (!modal) {

    modal = document.createElement("div");

    modal.id = "bookingModal";
    modal.className = "app-modal";

    modal.innerHTML = `
      <div class="booking-box">

        <button
          class="modal-close"
          onclick="closeBooking()">
          ✕
        </button>

        <div class="booking-icon">
          📅
        </div>

        <h2>Book Service</h2>

        <p class="booking-provider">
          <strong id="bookingProviderName"></strong>
          <br>
          <span id="bookingProviderService"></span>
        </p>

        <div class="input-group">
          <label>📅 Booking Date</label>
          <input
            type="date"
            id="bookingDate"
            required
          >
        </div>

        <div class="input-group">
          <label>⏰ Preferred Time</label>

          <select id="bookingTime" required>

            <option value="">
              Select time
            </option>

            <option value="8:00 AM - 10:00 AM">
              8:00 AM - 10:00 AM
            </option>

            <option value="10:00 AM - 12:00 PM">
              10:00 AM - 12:00 PM
            </option>

            <option value="12:00 PM - 2:00 PM">
              12:00 PM - 2:00 PM
            </option>

            <option value="2:00 PM - 4:00 PM">
              2:00 PM - 4:00 PM
            </option>

            <option value="4:00 PM - 6:00 PM">
              4:00 PM - 6:00 PM
            </option>

            <option value="6:00 PM - 8:00 PM">
              6:00 PM - 8:00 PM
            </option>

          </select>
        </div>

        <div class="input-group">
          <label>📍 Service Address</label>

          <textarea
            id="bookingAddress"
            rows="3"
            placeholder="Enter where the service is needed"
            required
          ></textarea>
        </div>

        <div class="input-group">
          <label>📝 Problem Description</label>

          <textarea
            id="bookingProblem"
            rows="3"
            placeholder="Tell us about the problem"
          ></textarea>
        </div>

        <button
          class="main-login-btn"
          onclick="confirmBooking()">

          ✅ Confirm Booking

        </button>

      </div>
    `;

    document.body.appendChild(modal);
  }

  document.getElementById("bookingProviderName").textContent =
    provider.name;

  document.getElementById("bookingProviderService").textContent =
    provider.service;

  const dateInput =
    document.getElementById("bookingDate");

  const today =
    new Date().toISOString().split("T")[0];

  dateInput.min = today;
  dateInput.value = today;

  document.getElementById("bookingTime").value = "";
  document.getElementById("bookingAddress").value = "";
  document.getElementById("bookingProblem").value = "";

  modal.classList.add("active");
}


/* =========================
   CLOSE BOOKING
========================= */

function closeBooking() {

  const modal =
    document.getElementById("bookingModal");

  if (modal) {
    modal.classList.remove("active");
  }

}


/* =========================
   CONFIRM BOOKING
========================= */

async function confirmBooking() {

  const loggedUser =
    JSON.parse(
      localStorage.getItem("quickHelpUser") || "null"
    );

  if (!loggedUser) {

    alert("Please login first.");

    closeBooking();

    openLogin();

    return;
  }

  const date =
    document.getElementById("bookingDate").value;

  const time =
    document.getElementById("bookingTime").value;

  const address =
    document.getElementById("bookingAddress").value.trim();

  const problem =
    document.getElementById("bookingProblem").value.trim();


  if (!date || !time || !address) {

    alert(
      "Please select date, time and service address."
    );

    return;
  }


  try {

    const { error } =
      await supabaseClient
        .from("bookings")
        .insert({

          user_id: loggedUser.id,

          provider_user_id:
            selectedProvider.userId || null,

          provider_name:
            selectedProvider.name,

          provider_phone:
            selectedProvider.phone || null,

          service:
            selectedProvider.service,

          booking_date:
            date,

          booking_time:
            time,

          address:
            address,

          problem_description:
            problem || null,

          status:
            "Pending"

        });


    if (error) {

      console.error(
        "Booking error:",
        error
      );

      alert(
        "Booking failed: " +
        error.message
      );

      return;
    }


    closeBooking();

    alert(
      "🎉 Booking confirmed successfully!"
    );

    showMyBookings();

  } catch (error) {

    console.error(error);

    alert(
      "Something went wrong while booking."
    );

  }

}


/* =========================
   MY BOOKINGS
========================= */

async function showMyBookings() {

  const loggedUser =
    JSON.parse(
      localStorage.getItem("quickHelpUser") || "null"
    );

  if (!loggedUser) {

    alert("Please login to view your bookings.");

    openLogin();

    return;
  }


  let modal =
    document.getElementById("myBookingsModal");


  if (!modal) {

    modal =
      document.createElement("div");

    modal.id =
      "myBookingsModal";

    modal.className =
      "app-modal";

    modal.innerHTML = `
      <div class="bookings-box">

        <button
          class="modal-close"
          onclick="closeMyBookings()">
          ✕
        </button>

        <div class="booking-icon">
          📋
        </div>

        <h2>My Bookings</h2>

        <div id="myBookingsList">
          Loading bookings...
        </div>

      </div>
    `;

    document.body.appendChild(modal);

  }


  modal.classList.add("active");


  const list =
    document.getElementById("myBookingsList");


  list.innerHTML =
    "<p>Loading your bookings...</p>";


  const { data, error } =
    await supabaseClient
      .from("bookings")
      .select("*")
      .eq("user_id", loggedUser.id)
      .order("created_at", {
        ascending: false
      });


  if (error) {

    console.error(error);

    list.innerHTML =
      "<p>Unable to load bookings.</p>";

    return;
  }


  if (!data || data.length === 0) {

    list.innerHTML = `
      <div class="empty-bookings">
        <div>📭</div>
        <h3>No bookings yet</h3>
        <p>Your service bookings will appear here.</p>
      </div>
    `;

    return;
  }


  list.innerHTML = "";


  data.forEach(booking => {

    const card =
      document.createElement("div");

    card.className =
      "booking-card";


    const status =
      booking.status || "Pending";


    card.innerHTML = `

      <div class="booking-card-top">

        <div>

          <h3>
            ${escapeHtml(
              booking.provider_name
            )}
          </h3>

          <span>
            ${escapeHtml(
              booking.service
            )}
          </span>

        </div>

        <strong class="booking-status">
          ${escapeHtml(status)}
        </strong>

      </div>


      <div class="booking-details">

        <p>
          📅
          <strong>Date:</strong>
          ${escapeHtml(
            booking.booking_date
          )}
        </p>

        <p>
          ⏰
          <strong>Time:</strong>
          ${escapeHtml(
            booking.booking_time
          )}
        </p>

        <p>
          📍
          <strong>Address:</strong>
          ${escapeHtml(
            booking.address
          )}
        </p>

        ${
          booking.problem_description
            ? `
              <p>
                📝
                <strong>Problem:</strong>
                ${escapeHtml(
                  booking.problem_description
                )}
              </p>
            `
            : ""
        }

      </div>

      ${
        status === "Pending"
          ? `
            <button
              class="cancel-booking-btn"
              onclick="cancelBooking(${booking.id})">

              Cancel Booking

            </button>
          `
          : ""
      }

    `;


    list.appendChild(card);

  });

}


/* =========================
   CLOSE MY BOOKINGS
========================= */

function closeMyBookings() {

  const modal =
    document.getElementById(
      "myBookingsModal"
    );

  if (modal) {

    modal.classList.remove(
      "active"
    );

  }

}


/* =========================
   CANCEL BOOKING
========================= */

async function cancelBooking(id) {

  if (
    !confirm(
      "Are you sure you want to cancel this booking?"
    )
  ) {
    return;
  }


  const { error } =
    await supabaseClient
      .from("bookings")
      .update({
        status: "Cancelled"
      })
      .eq("id", id);


  if (error) {

    alert(
      "Unable to cancel booking."
    );

    console.error(error);

    return;
  }


  alert(
    "Booking cancelled successfully."
  );


  showMyBookings();

}


/* =========================================================
   OVERRIDE PROVIDER RENDER
   ADD BOOK NOW BUTTON
========================================================= */

function renderProviders(providerList) {

  const providerContainer =
    document.getElementById("providers");

  const providerCount =
    document.getElementById("providerCount");


  if (providerCount) {

    providerCount.textContent =
      providerList.length +
      " professionals";

  }


  if (!providerContainer) {
    return;
  }


  providerContainer.innerHTML = "";


  if (providerList.length === 0) {

    providerContainer.innerHTML = `
      <div class="provider-card">

        <h3>No professionals found</h3>

        <p>
          No professionals available.
        </p>

      </div>
    `;

    return;
  }


  providerList.forEach(provider => {

    const card =
      document.createElement("div");

    card.className =
      "provider-card";


    const statusClass =
      provider.status === "Available"
        ? "available"
        : "busy";


    card.innerHTML = `

      <div class="provider-top">

        <div class="provider-avatar">
          ${escapeHtml(
            provider.icon ||
            getServiceIcon(
              provider.service
            )
          )}
        </div>

        <div class="provider-info">

          <h3>
            ${escapeHtml(
              provider.name
            )}
          </h3>

          <div class="service-name">
            ${escapeHtml(
              provider.service
            )}
          </div>

          <div class="rating">
            ⭐
            ${escapeHtml(
              provider.rating || "New"
            )}
          </div>

        </div>

      </div>


      <div class="details">

        <div class="detail">
          📍
          <strong>Location:</strong>
          ${escapeHtml(
            provider.location || "Chennai"
          )}
        </div>

        <div class="detail">
          💼
          <strong>Experience:</strong>
          ${escapeHtml(
            provider.experience || "-"
          )}
        </div>

        ${
          provider.skills
            ? `
              <div class="detail">
                🛠️
                <strong>Skills:</strong>
                ${escapeHtml(
                  provider.skills
                )}
              </div>
            `
            : ""
        }

        ${
          provider.availableTime
            ? `
              <div class="detail">
                🕒
                <strong>Available:</strong>
                ${escapeHtml(
                  provider.availableTime
                )}
              </div>
            `
            : ""
        }

        <div class="detail ${statusClass}">
          ●
          ${escapeHtml(
            provider.status ||
            "Available"
          )}
        </div>

      </div>


      <div class="provider-actions">

        <button
          class="book-now-btn"
          onclick='openBooking(${JSON.stringify(
            provider
          ).replace(/'/g, "&#039;")})'>

          📅 Book Now

        </button>


        ${
          provider.phone
            ? `
              <a
                class="call-btn"
                href="tel:${escapeHtml(
                  provider.phone
                )}">

                📞 Call Now

              </a>
            `
            : ""
        }

      </div>

    `;


    providerContainer.appendChild(card);

  });

}


/* =========================================================
   ADD MY BOOKINGS TO NAV
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const nav =
      document.querySelector(
        ".main-nav"
      );


    if (
      nav &&
      !document.getElementById(
        "myBookingsNav"
      )
    ) {

      const button =
        document.createElement(
          "button"
        );

      button.id =
        "myBookingsNav";

      button.className =
        "nav-item";

      button.innerHTML =
        "📋 <span>My Bookings</span>";

      button.onclick =
        showMyBookings;

      nav.appendChild(button);

    }

  }
);
/* =========================================================
   PROVIDER PROFILE + REVIEWS
========================================================= */

let selectedProfileProvider = null;


/* =========================
   OPEN PROVIDER PROFILE
========================= */

async function openProviderProfile(provider) {

  selectedProfileProvider = provider;

  let modal =
    document.getElementById("providerProfileModal");

  if (!modal) {

    modal = document.createElement("div");

    modal.id = "providerProfileModal";
    modal.className = "app-modal";

    modal.innerHTML = `
      <div class="provider-profile-box">

        <button
          class="modal-close"
          onclick="closeProviderProfile()">
          ✕
        </button>

        <div id="providerProfileContent">
          Loading...
        </div>

      </div>
    `;

    document.body.appendChild(modal);
  }

  modal.classList.add("active");

  await loadProviderProfile(provider);
}


/* =========================
   LOAD PROFILE
========================= */

async function loadProviderProfile(provider) {

  const content =
    document.getElementById(
      "providerProfileContent"
    );

  content.innerHTML = `
    <div class="profile-loading">
      Loading provider profile...
    </div>
  `;


  const { data: reviews, error } =
    await supabaseClient
      .from("reviews")
      .select("*")
      .eq("provider_name", provider.name)
      .order("created_at", {
        ascending: false
      });


  if (error) {
    console.error(error);
  }


  const reviewList = reviews || [];


  let average = 0;

  if (reviewList.length > 0) {

    average =
      reviewList.reduce(
        (sum, item) =>
          sum + Number(item.rating),
        0
      ) / reviewList.length;

  } else {

    average =
      Number(provider.rating) || 0;

  }


  const roundedAverage =
    average
      ? average.toFixed(1)
      : "New";


  content.innerHTML = `

    <div class="provider-profile-header">

      <div class="large-provider-avatar">
        ${
          provider.icon ||
          getServiceIcon(provider.service)
        }
      </div>

      <h2>
        ${escapeHtml(provider.name)}
      </h2>

      <div class="profile-service">
        ${escapeHtml(provider.service)}
      </div>

      <div class="profile-rating">
        ⭐ ${roundedAverage}

        ${
          reviewList.length
            ? `(${reviewList.length} reviews)`
            : "(No reviews yet)"
        }

      </div>

    </div>


    <div class="profile-info-grid">

      <div>
        <span>📍</span>
        <strong>Location</strong>
        <p>
          ${escapeHtml(
            provider.location || "Chennai"
          )}
        </p>
      </div>

      <div>
        <span>💼</span>
        <strong>Experience</strong>
        <p>
          ${escapeHtml(
            provider.experience || "-"
          )}
        </p>
      </div>

      <div>
        <span>🛠️</span>
        <strong>Skills</strong>
        <p>
          ${escapeHtml(
            provider.skills || "Professional service"
          )}
        </p>
      </div>

      <div>
        <span>🕒</span>
        <strong>Available</strong>
        <p>
          ${escapeHtml(
            provider.availableTime || "Contact provider"
          )}
        </p>
      </div>

    </div>


    <div class="profile-action-buttons">

      <button
        class="book-now-btn"
        onclick='closeProviderProfile(); openBooking(${JSON.stringify(provider).replace(/'/g, "&#039;")})'>

        📅 Book Now

      </button>

      ${
        provider.phone
          ? `
            <a
              class="call-btn"
              href="tel:${escapeHtml(provider.phone)}">

              📞 Call Now

            </a>
          `
          : ""
      }

    </div>


    <div class="reviews-section">

      <div class="reviews-title">

        <h3>⭐ Reviews & Ratings</h3>

        ${
          reviewList.length
            ? `<span>${reviewList.length} reviews</span>`
            : ""
        }

      </div>


      ${
        reviewList.length === 0
          ? `
            <div class="no-reviews">
              ⭐
              <h4>No reviews yet</h4>
              <p>Be the first to review this provider.</p>
            </div>
          `
          : reviewList
              .map(
                item => `

                  <div class="review-card">

                    <div class="review-top">

                      <strong>
                        ${escapeHtml(
                          item.reviewer_name
                        )}
                      </strong>

                      <span>
                        ${"⭐".repeat(
                          Number(item.rating)
                        )}
                      </span>

                    </div>

                    ${
                      item.review
                        ? `
                          <p>
                            ${escapeHtml(
                              item.review
                            )}
                          </p>
                        `
                        : ""
                    }

                  </div>

                `
              )
              .join("")
      }


      <button
        class="review-btn"
        onclick="openReviewForm()">

        ⭐ Write a Review

      </button>

    </div>

  `;
}


/* =========================
   CLOSE PROFILE
========================= */

function closeProviderProfile() {

  const modal =
    document.getElementById(
      "providerProfileModal"
    );

  if (modal) {
    modal.classList.remove("active");
  }

}


/* =========================
   REVIEW FORM
========================= */

function openReviewForm() {

  const loggedUser =
    JSON.parse(
      localStorage.getItem(
        "quickHelpUser"
      ) || "null"
    );

  if (!loggedUser) {

    alert(
      "Please login to write a review."
    );

    closeProviderProfile();

    openLogin();

    return;
  }


  const content =
    document.getElementById(
      "providerProfileContent"
    );


  content.innerHTML = `

    <button
      class="modal-close"
      onclick="closeProviderProfile()">
      ✕
    </button>

    <div class="review-form">

      <div class="review-form-icon">
        ⭐
      </div>

      <h2>Rate Your Experience</h2>

      <p>
        How was your experience with
        <strong>
          ${escapeHtml(
            selectedProfileProvider.name
          )}
        </strong>?
      </p>


      <div class="star-selector">

        <button onclick="selectRating(1)">★</button>
        <button onclick="selectRating(2)">★</button>
        <button onclick="selectRating(3)">★</button>
        <button onclick="selectRating(4)">★</button>
        <button onclick="selectRating(5)">★</button>

      </div>


      <input
        type="hidden"
        id="selectedRating"
        value="0"
      />


      <textarea
        id="reviewText"
        rows="5"
        placeholder="Write your review..."
      ></textarea>


      <button
        class="submit-review-btn"
        onclick="submitProviderReview()">

        ⭐ Submit Review

      </button>

    </div>

  `;

}


/* =========================
   SELECT RATING
========================= */

function selectRating(rating) {

  document.getElementById(
    "selectedRating"
  ).value = rating;


  const stars =
    document.querySelectorAll(
      ".star-selector button"
    );


  stars.forEach(
    (star, index) => {

      star.classList.toggle(
        "selected",
        index < rating
      );

    }
  );

}


/* =========================
   SUBMIT REVIEW
========================= */

async function submitProviderReview() {

  const loggedUser =
    JSON.parse(
      localStorage.getItem(
        "quickHelpUser"
      ) || "null"
    );


  const rating =
    Number(
      document.getElementById(
        "selectedRating"
      ).value
    );


  const review =
    document.getElementById(
      "reviewText"
    ).value.trim();


  if (rating < 1) {

    alert(
      "Please select a star rating."
    );

    return;
  }


  try {

    const { error } =
      await supabaseClient
        .from("reviews")
        .insert({

          provider_user_id:
            selectedProfileProvider.userId ||
            null,

          provider_name:
            selectedProfileProvider.name,

          service:
            selectedProfileProvider.service,

          reviewer_user_id:
            loggedUser.id,

          reviewer_name:
            loggedUser.name,

          rating:
            rating,

          review:
            review || null

        });


    if (error) {

      console.error(error);

      alert(
        "Unable to submit review."
      );

      return;
    }


    alert(
      "⭐ Review submitted successfully!"
    );


    await loadProviderProfile(
      selectedProfileProvider
    );


  } catch (error) {

    console.error(error);

    alert(
      "Something went wrong."
    );

  }

}


/* =========================================================
   PROVIDER CARD - ADD PROFILE BUTTON
========================================================= */

function renderProviders(providerList) {

  const providerContainer =
    document.getElementById("providers");

  const providerCount =
    document.getElementById("providerCount");


  if (providerCount) {

    providerCount.textContent =
      providerList.length +
      " professionals";

  }


  if (!providerContainer) {
    return;
  }


  providerContainer.innerHTML = "";


  if (providerList.length === 0) {

    providerContainer.innerHTML = `
      <div class="provider-card">

        <h3>No professionals found</h3>

        <p>No professionals available.</p>

      </div>
    `;

    return;
  }


  providerList.forEach(provider => {

    const card =
      document.createElement("div");

    card.className =
      "provider-card";


    card.innerHTML = `

      <div class="provider-top">

        <div class="provider-avatar">

          ${
            provider.icon ||
            getServiceIcon(
              provider.service
            )
          }

        </div>

        <div class="provider-info">

          <h3>
            ${escapeHtml(provider.name)}
          </h3>

          <div class="service-name">
            ${escapeHtml(provider.service)}
          </div>

          <div class="rating">
            ⭐
            ${escapeHtml(
              provider.rating || "New"
            )}
          </div>

        </div>

      </div>


      <div class="details">

        <div class="detail">
          📍
          <strong>Location:</strong>
          ${escapeHtml(
            provider.location || "Chennai"
          )}
        </div>

        <div class="detail">
          💼
          <strong>Experience:</strong>
          ${escapeHtml(
            provider.experience || "-"
          )}
        </div>

        ${
          provider.skills
            ? `
              <div class="detail">
                🛠️
                <strong>Skills:</strong>
                ${escapeHtml(
                  provider.skills
                )}
              </div>
            `
            : ""
        }

        ${
          provider.availableTime
            ? `
              <div class="detail">
                🕒
                <strong>Available:</strong>
                ${escapeHtml(
                  provider.availableTime
                )}
              </div>
            `
            : ""
        }

      </div>


      <div class="provider-actions">

        <button
          class="profile-view-btn"
          onclick='openProviderProfile(${JSON.stringify(provider).replace(/'/g, "&#039;")})'>

          👤 View Profile

        </button>


        <button
          class="book-now-btn"
          onclick='openBooking(${JSON.stringify(provider).replace(/'/g, "&#039;")})'>

          📅 Book Now

        </button>

      </div>

    `;


    providerContainer.appendChild(card);

  });

}
/* =========================================================
   PROVIDER DASHBOARD
========================================================= */

async function openProviderDashboard() {

  const loggedUser =
    JSON.parse(
      localStorage.getItem("quickHelpUser") || "null"
    );

  if (!loggedUser) {
    alert("Please login first.");
    openLogin();
    return;
  }

  const { data: work, error: workError } =
    await supabaseClient
      .from("work_details")
      .select("*")
      .eq("User_id", loggedUser.id)
      .maybeSingle();

  if (workError || !work) {
    alert("Provider profile not found.");
    return;
  }

  let modal =
    document.getElementById("providerDashboardModal");

  if (!modal) {

    modal = document.createElement("div");

    modal.id = "providerDashboardModal";
    modal.className = "app-modal";

    modal.innerHTML = `
      <div class="provider-dashboard-box">

        <button
          class="modal-close"
          onclick="closeProviderDashboard()">
          ✕
        </button>

        <div id="providerDashboardContent">
          Loading...
        </div>

      </div>
    `;

    document.body.appendChild(modal);
  }

  modal.classList.add("active");

  await loadProviderDashboard(loggedUser, work);
}


/* =========================
   LOAD DASHBOARD
========================= */

async function loadProviderDashboard(user, work) {

  const content =
    document.getElementById(
      "providerDashboardContent"
    );

  const { data: bookings, error } =
    await supabaseClient
      .from("bookings")
      .select("*")
      .eq("provider_user_id", user.id)
      .order("created_at", {
        ascending: false
      });

  if (error) {
    console.error(error);
    content.innerHTML =
      "<p>Unable to load bookings.</p>";
    return;
  }

  const list = bookings || [];

  const pending =
    list.filter(
      b => b.status === "Pending"
    ).length;

  const confirmed =
    list.filter(
      b => b.status === "Confirmed"
    ).length;

  const completed =
    list.filter(
      b => b.status === "Completed"
    ).length;


  content.innerHTML = `

    <div class="provider-dashboard-header">

      <div class="dashboard-avatar">
        👨‍🔧
      </div>

      <div>

        <h2>
          Provider Dashboard
        </h2>

        <p>
          Welcome, ${escapeHtml(user.name)}
        </p>

        <span class="provider-service-badge">
          ${escapeHtml(work.Work_type)}
        </span>

      </div>

    </div>


    <div class="dashboard-stats">

      <div class="dashboard-stat">
        <strong>${pending}</strong>
        <span>Pending</span>
      </div>

      <div class="dashboard-stat">
        <strong>${confirmed}</strong>
        <span>Confirmed</span>
      </div>

      <div class="dashboard-stat">
        <strong>${completed}</strong>
        <span>Completed</span>
      </div>

    </div>


    <div class="dashboard-section">

      <h3>📋 Customer Bookings</h3>

      <div id="providerBookingsList">

        ${
          list.length === 0
            ? `
              <div class="dashboard-empty">
                <div>📭</div>
                <h4>No bookings yet</h4>
                <p>
                  New customer bookings
                  will appear here.
                </p>
              </div>
            `
            : list.map(
                booking =>
                  providerBookingCard(
                    booking
                  )
              ).join("")
        }

      </div>

    </div>

  `;
}


/* =========================
   BOOKING CARD
========================= */

function providerBookingCard(booking) {

  let actions = "";

  if (booking.status === "Pending") {

    actions = `

      <div class="provider-booking-actions">

        <button
          class="accept-booking-btn"
          onclick="updateBookingStatus(
            ${booking.id},
            'Confirmed'
          )">

          ✅ Accept

        </button>

        <button
          class="reject-booking-btn"
          onclick="updateBookingStatus(
            ${booking.id},
            'Rejected'
          )">

          ❌ Reject

        </button>

      </div>

    `;

  }

  if (booking.status === "Confirmed") {

    actions = `

      <button
        class="complete-booking-btn"
        onclick="updateBookingStatus(
          ${booking.id},
          'Completed'
        )">

        ✅ Mark Service Completed

      </button>

    `;

  }


  return `

    <div class="provider-booking-card">

      <div class="provider-booking-top">

        <div>

          <h4>
            👤 ${escapeHtml(
              booking.user_id
                ? "Customer"
                : "Customer"
            )}
          </h4>

          <span>
            ${escapeHtml(
              booking.service
            )}
          </span>

        </div>

        <strong class="
          dashboard-status
          ${booking.status.toLowerCase()}
        ">

          ${escapeHtml(
            booking.status
          )}

        </strong>

      </div>


      <div class="provider-booking-details">

        <p>
          📅
          <strong>Date:</strong>
          ${escapeHtml(
            booking.booking_date
          )}
        </p>

        <p>
          ⏰
          <strong>Time:</strong>
          ${escapeHtml(
            booking.booking_time
          )}
        </p>

        <p>
          📍
          <strong>Address:</strong>
          ${escapeHtml(
            booking.address
          )}
        </p>

        ${
          booking.problem_description
            ? `
              <p>
                📝
                <strong>Problem:</strong>
                ${escapeHtml(
                  booking.problem_description
                )}
              </p>
            `
            : ""
        }

      </div>


      ${actions}

    </div>

  `;
}


/* =========================
   UPDATE STATUS
========================= */

async function updateBookingStatus(
  bookingId,
  newStatus
) {

  const message =
    newStatus === "Confirmed"
      ? "Accept this booking?"
      : newStatus === "Rejected"
      ? "Reject this booking?"
      : "Mark this service as completed?";


  if (!confirm(message)) {
    return;
  }


  const { error } =
    await supabaseClient
      .from("bookings")
      .update({
        status: newStatus
      })
      .eq("id", bookingId);


  if (error) {

    console.error(error);

    alert(
      "Unable to update booking status."
    );

    return;
  }


  alert(
    newStatus === "Confirmed"
      ? "✅ Booking accepted!"
      : newStatus === "Rejected"
      ? "❌ Booking rejected."
      : "🎉 Service marked as completed!"
  );


  await openProviderDashboard();

}


/* =========================
   CLOSE DASHBOARD
========================= */

function closeProviderDashboard() {

  const modal =
    document.getElementById(
      "providerDashboardModal"
    );

  if (modal) {
    modal.classList.remove("active");
  }

}


/* =========================================================
   ADD PROVIDER DASHBOARD TO ACCOUNT MENU
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const settings =
      document.querySelector(
        ".settings-content"
      );

    if (
      settings &&
      !document.getElementById(
        "providerDashboardBtn"
      )
    ) {

      const button =
        document.createElement("button");

      button.id =
        "providerDashboardBtn";

      button.className =
        "settings-option";

      button.innerHTML =
        "👨‍🔧 Provider Dashboard";

      button.onclick =
        openProviderDashboard;

      settings.prepend(button);

    }

  }
);
