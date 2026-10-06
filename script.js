/* =========================================================
   QUICK HELP - SERVICE FINDER
   SCRIPT.JS
   PART 1 / 4

   Includes:
   - Supabase setup
   - Session handling
   - Static providers
   - Home navigation
   - Account menu
   - Login
   - Registration
   - Profile
   - Settings
   - Logout
========================================================= */


/* =========================================================
   1. SUPABASE CONFIG
========================================================= */

const SUPABASE_URL = "https://mkfmwmbiylvyixjlmcba.supabase.co";

/*
  IMPORTANT:
  Keezha irukkura YOUR_SUPABASE_ANON_KEY place-la
  un existing Supabase publishable/anon key-a paste pannu.

  Example:
  const SUPABASE_ANON_KEY = "eyJhbGciOi...";
*/

const SUPABASE_ANON_KEY = "sb_publishable_c7E2D-jjrLFzLwIB_sfahg_WROFByrn";


/* =========================================================
   2. GLOBAL VARIABLES
========================================================= */

let supabaseClient = null;

let currentUser = null;

let currentProviderList = [];

let selectedService = "";

let registeredProviders = [];

let currentProvider = null;

let currentBooking = null;


/* =========================================================
   3. STATIC PROVIDERS
========================================================= */

const staticProviders = [

  {
    id: "static-plumber-1",
    userId: null,
    name: "Ravi Kumar",
    service: "Plumber",
    phone: "9876543210",
    location: "Chennai",
    experience: "8 years",
    skills: "Pipe repair, bathroom fitting, water leakage",
    workLocation: "Chennai",
    availableTime: "Full Day",
    rating: 4.7,
    reviews: 23
  },

  {
    id: "static-plumber-2",
    userId: null,
    name: "Suresh Plumbing Services",
    service: "Plumber",
    phone: "9876501234",
    location: "Chennai",
    experience: "6 years",
    skills: "Tap repair, pipe fitting, tank repair",
    workLocation: "Chennai",
    availableTime: "Morning",
    rating: 4.5,
    reviews: 18
  },

  {
    id: "static-electrician-1",
    userId: null,
    name: "Arun Electrical Works",
    service: "Electrician",
    phone: "9898989898",
    location: "Chennai",
    experience: "7 years",
    skills: "Wiring, fan repair, switch repair",
    workLocation: "Chennai",
    availableTime: "Full Day",
    rating: 4.8,
    reviews: 31
  },

  {
    id: "static-electrician-2",
    userId: null,
    name: "Muthu Electrical",
    service: "Electrician",
    phone: "9787654321",
    location: "Chennai",
    experience: "5 years",
    skills: "House wiring, lights, inverter service",
    workLocation: "Chennai",
    availableTime: "Evening",
    rating: 4.6,
    reviews: 16
  },

  {
    id: "static-carpenter-1",
    userId: null,
    name: "Kannan Carpenter Works",
    service: "Carpenter",
    phone: "9865432109",
    location: "Chennai",
    experience: "10 years",
    skills: "Furniture repair, door work, wood work",
    workLocation: "Chennai",
    availableTime: "Full Day",
    rating: 4.8,
    reviews: 27
  },

  {
    id: "static-carpenter-2",
    userId: null,
    name: "Mani Wood Works",
    service: "Carpenter",
    phone: "9753124680",
    location: "Chennai",
    experience: "7 years",
    skills: "Table, chair, cupboard, furniture repair",
    workLocation: "Chennai",
    availableTime: "Afternoon",
    rating: 4.5,
    reviews: 14
  },

  {
    id: "static-painter-1",
    userId: null,
    name: "Raj Painting Services",
    service: "Painter",
    phone: "9845012345",
    location: "Chennai",
    experience: "9 years",
    skills: "Interior painting, exterior painting, wall putty",
    workLocation: "Chennai",
    availableTime: "Full Day",
    rating: 4.7,
    reviews: 21
  },

  {
    id: "static-painter-2",
    userId: null,
    name: "Karthik Painters",
    service: "Painter",
    phone: "9797979797",
    location: "Chennai",
    experience: "5 years",
    skills: "House painting, texture painting, colour work",
    workLocation: "Chennai",
    availableTime: "Morning",
    rating: 4.4,
    reviews: 12
  }

];


/* =========================================================
   4. BASIC HELPERS
========================================================= */

function $(id) {
  return document.getElementById(id);
}


function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function showMessage(message) {
  alert(message);
}


function closeAllModals() {

  document.querySelectorAll(".app-modal").forEach(function(modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  });

  document.querySelectorAll(".login-modal").forEach(function(modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  });

}


/* =========================================================
   5. SUPABASE INITIALIZATION
========================================================= */

function initSupabase() {

  try {

    if (
      typeof window.supabase === "undefined" ||
      typeof window.supabase.createClient !== "function"
    ) {

      console.error("Supabase library not loaded.");

      return false;
    }


    if (
      !SUPABASE_URL ||
      SUPABASE_URL.includes("YOUR-PROJECT")
    ) {

      console.warn(
        "Supabase URL is still placeholder."
      );

      return false;
    }


    if (
      !SUPABASE_ANON_KEY ||
      SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY"
    ) {

      console.warn(
        "Supabase anon key is still placeholder."
      );

      return false;
    }


    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );


    console.log("Supabase initialized.");

    return true;

  } catch (error) {

    console.error(
      "Supabase initialization error:",
      error
    );

    return false;
  }

}


/* =========================================================
   6. LOCAL SESSION
========================================================= */

function saveCurrentUser(user) {

  currentUser = user;

  try {

    if (user) {

      localStorage.setItem(
        "quickHelpUser",
        JSON.stringify(user)
      );

    } else {

      localStorage.removeItem(
        "quickHelpUser"
      );

    }

  } catch (error) {

    console.error(
      "Session save error:",
      error
    );

  }

}


function loadCurrentUser() {

  try {

    const savedUser =
      localStorage.getItem("quickHelpUser");


    if (!savedUser) {

      currentUser = null;

      return null;
    }


    currentUser =
      JSON.parse(savedUser);


    return currentUser;

  } catch (error) {

    console.error(
      "Session load error:",
      error
    );

    currentUser = null;

    return null;
  }

}


/* =========================================================
   7. UPDATE ACCOUNT BUTTON
========================================================= */

function updateAccountUI() {

  const loginButton =
    document.querySelector(".login-btn");

  const logoutButton =
    $("logoutButton");


  if (currentUser) {

    if (loginButton) {

      loginButton.textContent =
        "👤 " +
        (
          currentUser.Name ||
          currentUser.name ||
          "Account"
        );

    }


    if (logoutButton) {

      logoutButton.style.display =
        "block";

    }

  } else {

    if (loginButton) {

      loginButton.textContent =
        "👤 Login / Register";

    }


    if (logoutButton) {

      logoutButton.style.display =
        "block";

    }

  }

}


/* =========================================================
   8. HOME
========================================================= */

function goHome() {

  closeAllModals();


  const homePage =
    $("homePage");

  if (homePage) {

    homePage.style.display =
      "block";

  }


  document
    .querySelectorAll(".nav-item")
    .forEach(function(item) {

      item.classList.remove("active");

    });


  const homeNav =
    $("homeNav");

  if (homeNav) {

    homeNav.classList.add("active");

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   9. ACCOUNT MENU
========================================================= */

function openAccountMenu() {

  const modal =
    $("accountModal");


  if (!modal) {
    return;
  }


  const title =
    $("accountTitle");

  const subtitle =
    $("accountSubtitle");


  if (currentUser) {

    if (title) {

      title.textContent =
        "Welcome, " +
        (
          currentUser.Name ||
          currentUser.name ||
          "User"
        );

    }


    if (subtitle) {

      subtitle.textContent =
        "Manage your Quick Help account";

    }

  } else {

    if (title) {

      title.textContent =
        "Welcome to Quick Help";

    }


    if (subtitle) {

      subtitle.textContent =
        "Login to manage your account";

    }

  }


  modal.style.display =
    "flex";

  modal.classList.add("active");

}


function closeAccountMenu() {

  const modal =
    $("accountModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


/* =========================================================
   10. LOGIN / REGISTER NAVIGATION
========================================================= */

function accountLogin() {

  closeAccountMenu();

  openLogin();

}


function openLogin() {

  const modal =
    $("loginModal");


  if (!modal) {
    return;
  }


  modal.style.display =
    "flex";

  modal.classList.add("active");


  const mobile =
    $("loginMobile");

  const password =
    $("loginPassword");


  if (mobile) {
    mobile.value = "";
  }


  if (password) {
    password.value = "";
  }

}


function closeLogin() {

  const modal =
    $("loginModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


function openRegister() {

  closeLogin();


  const modal =
    $("registerModal");


  if (!modal) {
    return;
  }


  modal.style.display =
    "flex";

  modal.classList.add("active");

}


function closeRegister() {

  const modal =
    $("registerModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


/* =========================================================
   11. LOGIN
========================================================= */

async function handleLogin(event) {

  event.preventDefault();


  const mobileInput =
    $("loginMobile");

  const passwordInput =
    $("loginPassword");


  const mobile =
    mobileInput
      ? mobileInput.value.trim()
      : "";

  const password =
    passwordInput
      ? passwordInput.value
      : "";


  if (!mobile || !password) {

    showMessage(
      "Please enter mobile number and password."
    );

    return;
  }


  if (!supabaseClient) {

    showMessage(
      "Supabase is not connected. Please check script.js configuration."
    );

    return;
  }


  try {

    const result =
      await supabaseClient
        .from("users")
        .select("*")
        .eq("Mobile", mobile)
        .eq("Password", password)
        .maybeSingle();


    if (result.error) {

      console.error(
        "Login error:",
        result.error
      );

      showMessage(
        "Login failed. Please try again."
      );

      return;
    }


    if (!result.data) {

      showMessage(
        "Invalid mobile number or password."
      );

      return;
    }


    const user =
      result.data;


    currentUser =
      user;


    /*
      Provider details will be loaded in
      Part 2.
    */

    saveCurrentUser(user);

    updateAccountUI();

    closeLogin();


    showMessage(
      "Login successful! Welcome " +
      (user.Name || "User")
    );


    await loadLoggedInUserDetails();


  } catch (error) {

    console.error(
      "Login exception:",
      error
    );


    showMessage(
      "Something went wrong during login."
    );

  }

}


/* =========================================================
   12. LOAD USER WORK DETAILS
========================================================= */

async function loadLoggedInUserDetails() {

  if (!currentUser) {
    return;
  }


  if (!supabaseClient) {
    return;
  }


  try {

    const result =
      await supabaseClient
        .from("work_details")
        .select("*")
        .eq("User_id", currentUser.Id)
        .maybeSingle();


    if (result.error) {

      console.error(
        "Work details error:",
        result.error
      );

      return;
    }


    if (result.data) {

      currentUser.workDetails =
        result.data;


      saveCurrentUser(
        currentUser
      );

    }


  } catch (error) {

    console.error(
      "Load work details exception:",
      error
    );

  }

}


/* =========================================================
   13. REGISTRATION
========================================================= */

async function handleRegister(event) {

  event.preventDefault();


  const name =
    $("userName")?.value.trim() || "";

  const mobile =
    $("userMobile")?.value.trim() || "";

  const email =
    $("userEmail")?.value.trim() || "";

  const password =
    $("userPassword")?.value || "";

  const location =
    $("userLocation")?.value.trim() || "";

  const workType =
    $("workType")?.value || "";

  const experience =
    $("experience")?.value || "";

  const skills =
    $("skills")?.value.trim() || "";

  const workLocation =
    $("workLocation")?.value.trim() || "";

  const availableTime =
    $("availableTime")?.value || "";


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

    showMessage(
      "Please fill all required details."
    );

    return;
  }


  if (!supabaseClient) {

    showMessage(
      "Supabase is not connected. Please check script.js configuration."
    );

    return;
  }


  try {

    /*
      Check existing mobile.
    */

    const existingMobile =
      await supabaseClient
        .from("users")
        .select("Id")
        .eq("Mobile", mobile)
        .maybeSingle();


    if (existingMobile.error) {

      console.error(
        "Existing mobile check error:",
        existingMobile.error
      );

      showMessage(
        "Unable to verify mobile number."
      );

      return;
    }


    if (existingMobile.data) {

      showMessage(
        "This mobile number is already registered."
      );

      return;
    }


    /*
      Check existing email.
    */

    const existingEmail =
      await supabaseClient
        .from("users")
        .select("Id")
        .eq("Email", email)
        .maybeSingle();


    if (existingEmail.error) {

      console.error(
        "Existing email check error:",
        existingEmail.error
      );

      showMessage(
        "Unable to verify email."
      );

      return;
    }


    if (existingEmail.data) {

      showMessage(
        "This email is already registered."
      );

      return;
    }


    /*
      Insert user.
    */

    const { data: newUser, error: userError } =
    await supabaseClient
        .from("users")
        .insert([{
            Created_at: new Date().toISOString(),
            Name: name,
            Mobile: mobile,
            Email: email,
            Password: password,
            Location: location
        }])
        .select()
        .single();


    if (userInsert.error) {

      console.error(
        "User registration error:",
        userInsert.error
      );

      showMessage(
        "Registration failed: " +
        userInsert.error.message
      );

      return;
    }


    const newUser =
      userInsert.data;


    /*
      Insert work details.
    */

    const workInsert =
      await supabaseClient
        .from("work_details")
        .insert([
          {
            User_id: newUser.Id,
            Work_type: workType,
            Experience: experience,
            Skill: skills,
            Work_location: workLocation,
            "Available time": availableTime
          }
        ]);


    if (workInsert.error) {

      console.error(
        "Work details registration error:",
        workInsert.error
      );


      /*
        User was created but work details failed.
        Keep user account because it can be repaired
        later from provider profile/dashboard.
      */

      showMessage(
        "Account created, but work details could not be saved."
      );

    } else {

      showMessage(
        "Account created successfully!"
      );

    }


    /*
      Login immediately after registration.
    */

    currentUser =
      newUser;


    currentUser.workDetails = {
      Work_type: workType,
      Experience: experience,
      Skill: skills,
      Work_location: workLocation,
      "Available time": availableTime
    };


    saveCurrentUser(
      currentUser
    );


    updateAccountUI();


    closeRegister();


    const form =
      $("registerForm");

    if (form) {
      form.reset();
    }


    await loadLoggedInUserDetails();


    /*
      Continue provider loading/dashboard
      logic in Part 2/3/4.
    */


  } catch (error) {

    console.error(
      "Registration exception:",
      error
    );


    showMessage(
      "Something went wrong during registration."
    );

  }

}


/* =========================================================
   14. PROFILE
========================================================= */

function openProfile() {

  closeAccountMenu();

  closeSettings();


  const modal =
    $("profileModal");


  if (!modal) {
    return;
  }


  if (!currentUser) {

    closeProfile();

    openLogin();

    return;
  }


  updateProfileUI();


  modal.style.display =
    "flex";

  modal.classList.add("active");


  document
    .querySelectorAll(".nav-item")
    .forEach(function(item) {

      item.classList.remove("active");

    });

}


function closeProfile() {

  const modal =
    $("profileModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


/* =========================================================
   15. PROFILE UI
========================================================= */

function updateProfileUI() {

  if (!currentUser) {
    return;
  }


  const work =
    currentUser.workDetails || {};


  const profileName =
    $("profileName");

  const profileMobile =
    $("profileMobile");

  const profileEmail =
    $("profileEmail");

  const profileLocation =
    $("profileLocation");

  const profileWorkType =
    $("profileWorkType");

  const profileExperience =
    $("profileExperience");

  const profileSkills =
    $("profileSkills");

  const profileWorkLocation =
    $("profileWorkLocation");

  const profileAvailableTime =
    $("profileAvailableTime");


  if (profileName) {

    profileName.textContent =
      currentUser.Name ||
      "-";

  }


  if (profileMobile) {

    profileMobile.textContent =
      currentUser.Mobile ||
      "-";

  }


  if (profileEmail) {

    profileEmail.textContent =
      currentUser.Email ||
      "-";

  }


  if (profileLocation) {

    profileLocation.textContent =
      currentUser.Location ||
      "-";

  }


  if (profileWorkType) {

    profileWorkType.textContent =
      work.Work_type ||
      "-";

  }


  if (profileExperience) {

    profileExperience.textContent =
      work.Experience ||
      "-";

  }


  if (profileSkills) {

    profileSkills.textContent =
      work.Skill ||
      "-";

  }


  if (profileWorkLocation) {

    profileWorkLocation.textContent =
      work.Work_location ||
      "-";

  }


  if (profileAvailableTime) {

    profileAvailableTime.textContent =
      work["Available time"] ||
      "-";

  }

}


/* =========================================================
   16. SETTINGS
========================================================= */

function openSettings() {

  closeAccountMenu();

  closeProfile();


  const modal =
    $("settingsModal");


  if (!modal) {
    return;
  }


  modal.style.display =
    "flex";

  modal.classList.add("active");


  /*
    Provider Dashboard button,
    My Bookings button and other
    dynamic options are added
    in later parts.
  */

}


function closeSettings() {

  const modal =
    $("settingsModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


/* =========================================================
   17. LOGOUT
========================================================= */

function logoutUser() {

  const confirmLogout =
    confirm(
      "Are you sure you want to logout?"
    );


  if (!confirmLogout) {
    return;
  }


  currentUser = null;

  currentProvider = null;

  currentBooking = null;


  try {

    localStorage.removeItem(
      "quickHelpUser"
    );

  } catch (error) {

    console.error(
      "Logout storage error:",
      error
    );

  }


  updateAccountUI();

  closeAllModals();

  goHome();


  showMessage(
    "You have been logged out."
  );

}


/* =========================================================
   18. SETTINGS INFORMATION
========================================================= */

function showAppInfo() {

  alert(
    "⚡ Quick Help\n\n" +
    "Find trusted service professionals near you.\n\n" +
    "Services available:\n" +
    "🔧 Plumber\n" +
    "⚡ Electrician\n" +
    "🪚 Carpenter\n" +
    "🎨 Painter\n\n" +
    "© 2026 Quick Help"
  );

}


function showHelp() {

  alert(
    "❓ Quick Help Support\n\n" +
    "1. Select a service.\n" +
    "2. Choose a professional.\n" +
    "3. View the provider profile.\n" +
    "4. Contact or book the professional.\n\n" +
    "For account problems, check your login details."
  );

}


function showPrivacy() {

  alert(
    "🛡️ Privacy\n\n" +
    "Quick Help stores account, provider, booking " +
    "and review information required for the app."
  );

}


/* =========================================================
   19. INITIAL PAGE LOAD
========================================================= */

async function initializeQuickHelp() {

  console.log(
    "Initializing Quick Help..."
  );


  initSupabase();


  loadCurrentUser();


  updateAccountUI();


  if (currentUser) {

    await loadLoggedInUserDetails();

    updateProfileUI();

  }


  /*
    Provider loading/search/dashboard
    will continue in Part 2.
  */


  console.log(
    "Quick Help Part 1 loaded."
  );

}


/* =========================================================
   20. MAKE FUNCTIONS GLOBAL
========================================================= */

window.goHome =
  goHome;

window.openAccountMenu =
  openAccountMenu;

window.closeAccountMenu =
  closeAccountMenu;

window.accountLogin =
  accountLogin;

window.openLogin =
  openLogin;

window.closeLogin =
  closeLogin;

window.openRegister =
  openRegister;

window.closeRegister =
  closeRegister;

window.handleLogin =
  handleLogin;

window.handleRegister =
  handleRegister;

window.openProfile =
  openProfile;

window.closeProfile =
  closeProfile;

window.openSettings =
  openSettings;

window.closeSettings =
  closeSettings;

window.logoutUser =
  logoutUser;

window.showAppInfo =
  showAppInfo;

window.showHelp =
  showHelp;

window.showPrivacy =
  showPrivacy;


/* =========================================================
   21. START APP
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeQuickHelp
  );

} else {

  initializeQuickHelp();

}


/* =========================================================
   END OF PART 1

   PART 2 CONTINUES DIRECTLY BELOW THIS LINE.

   DO NOT ADD ANOTHER <script> TAG.
   DO NOT DELETE THIS PART.

========================================================= */
/* =========================================================
   QUICK HELP - SCRIPT.JS
   PART 2 / 4

   Includes:
   - Provider loading
   - Registered providers
   - Category filtering
   - Search
   - Provider cards
   - Provider profile
   - Call / WhatsApp
   - Rating display
========================================================= */


/* =========================================================
   22. GET ALL PROVIDERS
========================================================= */

async function loadRegisteredProviders() {

  registeredProviders = [];


  if (!supabaseClient) {

    console.warn(
      "Supabase not available. Using static providers."
    );

    return [];

  }


  try {

    /*
      Get all users.
    */

    const usersResult =
      await supabaseClient
        .from("users")
        .select("*")
        .order("Id", {
          ascending: false
        });


    if (usersResult.error) {

      console.error(
        "Provider users loading error:",
        usersResult.error
      );

      return [];

    }


    const users =
      usersResult.data || [];


    if (!users.length) {

      return [];

    }


    /*
      Get all work details.
    */

    const workResult =
      await supabaseClient
        .from("work_details")
        .select("*");


    if (workResult.error) {

      console.error(
        "Provider work details loading error:",
        workResult.error
      );

      return [];

    }


    const workDetails =
      workResult.data || [];


    /*
      Convert database users + work details
      into provider objects.
    */

    registeredProviders =
      users
        .map(function(user) {

          const work =
            workDetails.find(function(item) {

              return String(item.User_id) ===
                String(user.Id);

            });


          /*
            Only users having work details
            are treated as service providers.
          */

          if (!work) {

            return null;

          }


          return {

            id:
              "db-provider-" +
              user.Id,

            userId:
              user.Id,

            name:
              user.Name || "Service Provider",

            service:
              work.Work_type || "Other",

            phone:
              user.Mobile || "",

            email:
              user.Email || "",

            location:
              user.Location || "",

            experience:
              work.Experience || "",

            skills:
              work.Skill || "",

            workLocation:
              work.Work_location || "",

            availableTime:
              work["Available time"] || "",

            rating:
              0,

            reviews:
              0

          };

        })
        .filter(Boolean);


    /*
      Load ratings for registered providers.
    */

    await loadProviderRatings();


    return registeredProviders;


  } catch (error) {

    console.error(
      "Provider loading exception:",
      error
    );

    return [];

  }

}


/* =========================================================
   23. LOAD PROVIDER RATINGS
========================================================= */

async function loadProviderRatings() {

  if (!supabaseClient) {
    return;
  }


  try {

    const result =
      await supabaseClient
        .from("reviews")
        .select(
          "provider_user_id, rating"
        );


    if (result.error) {

      console.error(
        "Review loading error:",
        result.error
      );

      return;

    }


    const reviews =
      result.data || [];


    registeredProviders.forEach(
      function(provider) {

        const providerReviews =
          reviews.filter(
            function(review) {

              return String(
                review.provider_user_id
              ) === String(
                provider.userId
              );

            }
          );


        if (!providerReviews.length) {

          provider.rating = 0;

          provider.reviews = 0;

          return;

        }


        const total =
          providerReviews.reduce(
            function(sum, item) {

              return sum +
                Number(item.rating || 0);

            },
            0
          );


        provider.rating =
          Number(
            (
              total /
              providerReviews.length
            ).toFixed(1)
          );


        provider.reviews =
          providerReviews.length;

      }
    );


  } catch (error) {

    console.error(
      "Provider ratings exception:",
      error
    );

  }

}


/* =========================================================
   24. GET COMBINED PROVIDERS
========================================================= */

function getAllProviders() {

  const combined = [];


  /*
    Registered providers first.
  */

  registeredProviders.forEach(
    function(provider) {

      combined.push(provider);

    }
  );


  /*
    Add static providers.

    Avoid duplicate names/phones.
  */

  staticProviders.forEach(
    function(provider) {

      const duplicate =
        combined.some(
          function(item) {

            return (
              item.phone &&
              provider.phone &&
              item.phone === provider.phone
            );

          }
        );


      if (!duplicate) {

        combined.push(provider);

      }

    }
  );


  return combined;

}


/* =========================================================
   25. LOAD PROVIDERS
========================================================= */

async function refreshProviders() {

  await loadRegisteredProviders();


  /*
    If user already selected a service,
    refresh that service.
  */

  if (selectedService) {

    showProviders(
      selectedService
    );

  }

}


/* =========================================================
   26. SHOW PROVIDERS BY SERVICE
========================================================= */

async function showProviders(service) {

  selectedService =
    service || "";


  const providerContainer =
    $("providers");


  const title =
    $("serviceTitle");


  const count =
    $("providerCount");


  if (!providerContainer) {

    console.error(
      "Provider container #providers not found."
    );

    return;

  }


  /*
    Show loading state.
  */

  providerContainer.innerHTML = `

    <div class="welcome-card">

      <div class="welcome-icon">
        ⏳
      </div>

      <h3>
        Finding professionals...
      </h3>

      <p>
        Please wait a moment.
      </p>

    </div>

  `;


  /*
    Make sure registered providers
    are refreshed from Supabase.
  */

  await loadRegisteredProviders();


  const allProviders =
    getAllProviders();


  const serviceProviders =
    allProviders.filter(
      function(provider) {

        return String(
          provider.service || ""
        ).toLowerCase() ===
        String(service || "").toLowerCase();

      }
    );


  currentProviderList =
    serviceProviders;


  if (title) {

    title.textContent =
      service
        ? service + " Professionals"
        : "Available Professionals";

  }


  if (count) {

    count.textContent =
      serviceProviders.length +
      (
        serviceProviders.length === 1
          ? " professional"
          : " professionals"
      );

  }


  renderProviders(
    serviceProviders
  );


  /*
    Scroll toward providers.
  */

  setTimeout(
    function() {

      const section =
        document.querySelector(
          ".provider-section"
        );


      if (section) {

        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    },
    100
  );

}


/* =========================================================
   27. RENDER PROVIDER CARDS
========================================================= */

function renderProviders(providers) {

  const container =
    $("providers");


  if (!container) {
    return;
  }


  if (!providers || !providers.length) {

    container.innerHTML = `

      <div class="welcome-card">

        <div class="welcome-icon">
          😔
        </div>

        <h3>
          No professionals found
        </h3>

        <p>
          No ${escapeHTML(
            selectedService || "service"
          )} professionals are currently available.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    providers
      .map(
        function(provider) {

          return createProviderCard(
            provider
          );

        }
      )
      .join("");


}


/* =========================================================
   28. CREATE PROVIDER CARD
========================================================= */

function createProviderCard(provider) {

  const rating =
    Number(provider.rating || 0);


  const ratingText =
    rating > 0
      ? rating.toFixed(1)
      : "New";


  const reviewCount =
    Number(provider.reviews || 0);


  const safeName =
    escapeHTML(
      provider.name ||
      "Service Provider"
    );


  const safeService =
    escapeHTML(
      provider.service ||
      "Service"
    );


  const safeLocation =
    escapeHTML(
      provider.workLocation ||
      provider.location ||
      "Location not specified"
    );


  const safeExperience =
    escapeHTML(
      provider.experience ||
      "Experience not specified"
    );


  const safeAvailability =
    escapeHTML(
      provider.availableTime ||
      "Contact provider"
    );


  const providerId =
    escapeHTML(
      provider.id
    );


  return `

    <div
      class="provider-card"
      data-provider-id="${providerId}"
    >

      <div class="provider-top">

        <div class="provider-avatar">
          👨‍🔧
        </div>


        <div class="provider-main">

          <h3>
            ${safeName}
          </h3>

          <p class="provider-service">
            ${safeService}
          </p>

        </div>

      </div>


      <div class="provider-rating">

        <span>
          ⭐ ${ratingText}
        </span>

        <small>
          (${reviewCount} reviews)
        </small>

      </div>


      <div class="provider-details">

        <p>
          📍 ${safeLocation}
        </p>

        <p>
          💼 ${safeExperience}
        </p>

        <p>
          ⏰ ${safeAvailability}
        </p>

      </div>


      <div class="provider-actions">

        <button
          class="main-login-btn"
          onclick="openProviderProfile('${providerId}')"
        >
          👤 View Profile
        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   29. SEARCH PROVIDERS
========================================================= */

async function searchProviders() {

  const searchInput =
    $("providerSearch");


  if (!searchInput) {
    return;
  }


  const query =
    searchInput.value
      .trim()
      .toLowerCase();


  /*
    If search is empty and a service
    was selected, show that service.
  */

  if (!query) {

    if (selectedService) {

      renderProviders(
        currentProviderList
      );

      const count =
        $("providerCount");

      if (count) {

        count.textContent =
          currentProviderList.length +
          (
            currentProviderList.length === 1
              ? " professional"
              : " professionals"
          );

      }

    }

    return;

  }


  /*
    Refresh registered providers
    before searching.
  */

  await loadRegisteredProviders();


  const allProviders =
    getAllProviders();


  const filtered =
    allProviders.filter(
      function(provider) {

        const searchableText = [

          provider.name,

          provider.service,

          provider.phone,

          provider.location,

          provider.workLocation,

          provider.experience,

          provider.skills,

          provider.availableTime

        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


        return searchableText.includes(
          query
        );

      }
    );


  currentProviderList =
    filtered;


  const title =
    $("serviceTitle");


  const count =
    $("providerCount");


  if (title) {

    title.textContent =
      "Search Results";

  }


  if (count) {

    count.textContent =
      filtered.length +
      (
        filtered.length === 1
          ? " professional"
          : " professionals"
      );

  }


  renderProviders(
    filtered
  );

}


/* =========================================================
   30. FIND PROVIDER BY ID
========================================================= */

function findProviderById(providerId) {

  const allProviders =
    getAllProviders();


  return allProviders.find(
    function(provider) {

      return String(
        provider.id
      ) === String(
        providerId
      );

    }
  ) || null;

}


/* =========================================================
   31. CREATE PROVIDER PROFILE MODAL
========================================================= */

function createProviderProfileModal() {

  if ($("providerProfileModal")) {

    return;

  }


  const modal =
    document.createElement("div");


  modal.id =
    "providerProfileModal";


  modal.className =
    "app-modal";


  modal.innerHTML = `

    <div
      class="profile-box"
      id="providerProfileContent"
    >

      <button
        class="modal-close"
        onclick="closeProviderProfile()"
      >
        ✕
      </button>


      <div class="profile-avatar">
        👨‍🔧
      </div>


      <h2 id="providerProfileName">
        Service Provider
      </h2>


      <p
        id="providerProfileService"
        style="text-align:center;"
      >
        Service
      </p>


      <div class="profile-info">


        <div>

          <span>
            ⭐ Rating
          </span>

          <strong id="providerProfileRating">
            New
          </strong>

        </div>


        <div>

          <span>
            📱 Mobile
          </span>

          <strong id="providerProfilePhone">
            -
          </strong>

        </div>


        <div>

          <span>
            📍 Location
          </span>

          <strong id="providerProfileLocation">
            -
          </strong>

        </div>


        <div>

          <span>
            💼 Experience
          </span>

          <strong id="providerProfileExperience">
            -
          </strong>

        </div>


        <div>

          <span>
            🧰 Skills
          </span>

          <strong id="providerProfileSkills">
            -
          </strong>

        </div>


        <div>

          <span>
            📍 Work Location
          </span>

          <strong id="providerProfileWorkLocation">
            -
          </strong>

        </div>


        <div>

          <span>
            ⏰ Available Time
          </span>

          <strong id="providerProfileAvailableTime">
            -
          </strong>

        </div>


      </div>


      <div
        id="providerProfileButtons"
        style="
          display:flex;
          flex-direction:column;
          gap:10px;
          margin-top:18px;
        "
      >

      </div>


      <div
        id="providerReviewsArea"
        style="margin-top:20px;"
      >

      </div>


    </div>

  `;


  document.body.appendChild(
    modal
  );

}


/* =========================================================
   32. OPEN PROVIDER PROFILE
========================================================= */

async function openProviderProfile(providerId) {

  createProviderProfileModal();


  const provider =
    findProviderById(
      providerId
    );


  if (!provider) {

    showMessage(
      "Provider information not found."
    );

    return;

  }


  currentProvider =
    provider;


  const modal =
    $("providerProfileModal");


  if (!modal) {
    return;
  }


  const name =
    $("providerProfileName");

  const service =
    $("providerProfileService");

  const rating =
    $("providerProfileRating");

  const phone =
    $("providerProfilePhone");

  const location =
    $("providerProfileLocation");

  const experience =
    $("providerProfileExperience");

  const skills =
    $("providerProfileSkills");

  const workLocation =
    $("providerProfileWorkLocation");

  const availableTime =
    $("providerProfileAvailableTime");

  const buttons =
    $("providerProfileButtons");


  if (name) {

    name.textContent =
      provider.name ||
      "Service Provider";

  }


  if (service) {

    service.textContent =
      provider.service ||
      "Service";

  }


  if (rating) {

    rating.textContent =
      provider.rating > 0
        ? "⭐ " +
          Number(provider.rating).toFixed(1) +
          " (" +
          Number(provider.reviews || 0) +
          " reviews)"
        : "⭐ New provider";

  }


  if (phone) {

    phone.textContent =
      provider.phone ||
      "-";

  }


  if (location) {

    location.textContent =
      provider.location ||
      "-";

  }


  if (experience) {

    experience.textContent =
      provider.experience ||
      "-";

  }


  if (skills) {

    skills.textContent =
      provider.skills ||
      "-";

  }


  if (workLocation) {

    workLocation.textContent =
      provider.workLocation ||
      "-";

  }


  if (availableTime) {

    availableTime.textContent =
      provider.availableTime ||
      "-";

  }


  if (buttons) {

    const phoneNumber =
      String(
        provider.phone || ""
      ).replace(
        /[^0-9+]/g,
        ""
      );


    const whatsappNumber =
      phoneNumber
        .replace(
          /^\+/,
          ""
        );


    buttons.innerHTML = `

      ${
        phoneNumber
          ? `
            <button
              class="main-login-btn"
              onclick="callProvider()"
            >
              📞 Call Provider
            </button>
          `
          : ""
      }


      ${
        whatsappNumber
          ? `
            <button
              class="main-login-btn"
              onclick="whatsappProvider()"
            >
              💬 WhatsApp
            </button>
          `
          : ""
      }


      <button
        class="main-login-btn"
        onclick="openBookingForCurrentProvider()"
      >
        📅 Book Service
      </button>


      <button
        class="register-btn"
        onclick="openReviewForCurrentProvider()"
      >
        ⭐ Rate & Review
      </button>

    `;

  }


  /*
    Reviews will be loaded here.
  */

  await renderProviderReviews(
    provider
  );


  modal.style.display =
    "flex";

  modal.classList.add("active");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   33. CLOSE PROVIDER PROFILE
========================================================= */

function closeProviderProfile() {

  const modal =
    $("providerProfileModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


/* =========================================================
   34. CALL PROVIDER
========================================================= */

function callProvider() {

  if (!currentProvider) {

    showMessage(
      "Provider not selected."
    );

    return;

  }


  if (!currentProvider.phone) {

    showMessage(
      "Provider phone number is not available."
    );

    return;

  }


  window.location.href =
    "tel:" +
    currentProvider.phone;

}


/* =========================================================
   35. WHATSAPP PROVIDER
========================================================= */

function whatsappProvider() {

  if (!currentProvider) {

    showMessage(
      "Provider not selected."
    );

    return;

  }


  if (!currentProvider.phone) {

    showMessage(
      "Provider phone number is not available."
    );

    return;

  }


  let phone =
    String(
      currentProvider.phone
    ).replace(
      /[^0-9]/g,
      ""
    );


  /*
    India number support.
    If 10 digit number, add 91.
  */

  if (
    phone.length === 10
  ) {

    phone =
      "91" +
      phone;

  }


  const message =
    encodeURIComponent(
      "Hi " +
      (
        currentProvider.name ||
        "Provider"
      ) +
      ", I found you on Quick Help. I need your " +
      (
        currentProvider.service ||
        "service"
      ) +
      " service."
    );


  window.open(
    "https://wa.me/" +
    phone +
    "?text=" +
    message,
    "_blank"
  );

}


/* =========================================================
   36. PROVIDER REVIEWS
========================================================= */

async function getProviderReviews(
  provider
) {

  if (
    !supabaseClient ||
    !provider ||
    !provider.userId
  ) {

    return [];

  }


  try {

    const result =
      await supabaseClient
        .from("reviews")
        .select("*")
        .eq(
          "provider_user_id",
          provider.userId
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (result.error) {

      console.error(
        "Provider reviews error:",
        result.error
      );

      return [];

    }


    return result.data || [];


  } catch (error) {

    console.error(
      "Provider reviews exception:",
      error
    );

    return [];

  }

}


/* =========================================================
   37. RENDER PROVIDER REVIEWS
========================================================= */

async function renderProviderReviews(
  provider
) {

  const area =
    $("providerReviewsArea");


  if (!area) {
    return;
  }


  if (
    !provider ||
    !provider.userId
  ) {

    area.innerHTML = `

      <div class="welcome-card">

        <h3>
          ⭐ Reviews
        </h3>

        <p>
          Reviews will be available for registered providers.
        </p>

      </div>

    `;

    return;

  }


  area.innerHTML = `

    <h3>
      ⭐ Customer Reviews
    </h3>

    <p>
      Loading reviews...
    </p>

  `;


  const reviews =
    await getProviderReviews(
      provider
    );


  if (!reviews.length) {

    area.innerHTML = `

      <div class="welcome-card">

        <div class="welcome-icon">
          ⭐
        </div>

        <h3>
          No reviews yet
        </h3>

        <p>
          Be the first customer to review this provider.
        </p>

      </div>

    `;

    return;

  }


  area.innerHTML = `

    <h3>
      ⭐ Customer Reviews
    </h3>

    <div
      style="
        display:flex;
        flex-direction:column;
        gap:10px;
        margin-top:10px;
      "
    >

      ${
        reviews
          .map(
            function(review) {

              const stars =
                "⭐".repeat(
                  Math.max(
                    1,
                    Math.min(
                      5,
                      Number(
                        review.rating || 0
                      )
                    )
                  )
                );


              return `

                <div
                  style="
                    border:1px solid #e5e7eb;
                    border-radius:12px;
                    padding:12px;
                  "
                >

                  <strong>
                    ${escapeHTML(
                      review.reviewer_name ||
                      "Customer"
                    )}
                  </strong>

                  <div>
                    ${stars}
                  </div>

                  <p>
                    ${escapeHTML(
                      review.review ||
                      ""
                    )}
                  </p>

                </div>

              `;

            }
          )
          .join("")
      }

    </div>

  `;

}


/* =========================================================
   38. BOOKING PLACEHOLDER
========================================================= */

function openBookingForCurrentProvider() {

  if (!currentProvider) {

    showMessage(
      "Please select a provider first."
    );

    return;

  }


  /*
    Full booking modal and booking database
    logic comes in Part 3.
  */

  if (
    typeof openBookingModal ===
    "function"
  ) {

    openBookingModal(
      currentProvider
    );

    return;

  }


  showMessage(
    "Booking system is loading. Please try again."
  );

}


/* =========================================================
   39. REVIEW PLACEHOLDER
========================================================= */

function openReviewForCurrentProvider() {

  if (!currentProvider) {

    showMessage(
      "Please select a provider first."
    );

    return;

  }


  /*
    Full review modal and database
    logic comes in Part 3.
  */

  if (
    typeof openReviewModal ===
    "function"
  ) {

    openReviewModal(
      currentProvider
    );

    return;

  }


  showMessage(
    "Review system is loading. Please try again."
  );

}


/* =========================================================
   40. MAKE PART 2 FUNCTIONS GLOBAL
========================================================= */

window.showProviders =
  showProviders;

window.searchProviders =
  searchProviders;

window.openProviderProfile =
  openProviderProfile;

window.closeProviderProfile =
  closeProviderProfile;

window.callProvider =
  callProvider;

window.whatsappProvider =
  whatsappProvider;

window.openBookingForCurrentProvider =
  openBookingForCurrentProvider;

window.openReviewForCurrentProvider =
  openReviewForCurrentProvider;


/* =========================================================
   41. AUTO LOAD PROVIDERS
========================================================= */

async function initializeProviders() {

  try {

    await loadRegisteredProviders();

    console.log(
      "Providers loaded:",
      getAllProviders().length
    );

  } catch (error) {

    console.error(
      "Provider initialization error:",
      error
    );

  }

}


/*
  Start provider initialization after
  the main app initialization.
*/

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    function() {

      setTimeout(
        initializeProviders,
        300
      );

    }
  );

} else {

  setTimeout(
    initializeProviders,
    300
  );

}


/* =========================================================
   END OF PART 2

   PART 3 CONTINUES DIRECTLY BELOW.

   DO NOT ADD:
   <script>
   </script>

========================================================= */
/* =========================================================
   QUICK HELP - SCRIPT.JS
   PART 3 / 4

   Includes:
   - Booking system
   - Booking database
   - My Bookings
   - Booking status
   - Review & Rating
   - Reviews database
========================================================= */


/* =========================================================
   42. CREATE BOOKING MODAL
========================================================= */

function createBookingModal() {

  if ($("bookingModal")) {
    return;
  }


  const modal =
    document.createElement("div");


  modal.id =
    "bookingModal";


  modal.className =
    "login-modal";


  modal.innerHTML = `

    <div class="login-box">

      <button
        class="close-login"
        onclick="closeBookingModal()"
      >
        ✕
      </button>


      <div class="login-icon">
        📅
      </div>


      <h2>
        Book Service
      </h2>


      <p
        class="login-subtitle"
        id="bookingProviderName"
      >
        Service Provider
      </p>


      <form
        id="bookingForm"
        onsubmit="submitBooking(event)"
      >


        <div class="input-group">

          <label>
            🛠️ Service
          </label>

          <input
            type="text"
            id="bookingService"
            readonly
          >

        </div>


        <div class="input-group">

          <label>
            📅 Date
          </label>

          <input
            type="date"
            id="bookingDate"
            required
          >

        </div>


        <div class="input-group">

          <label>
            ⏰ Time
          </label>

          <input
            type="time"
            id="bookingTime"
            required
          >

        </div>


        <div class="input-group">

          <label>
            📍 Service Address
          </label>

          <input
            type="text"
            id="bookingAddress"
            placeholder="Enter service address"
            required
          >

        </div>


        <div class="input-group">

          <label>
            📝 Problem Description
          </label>

          <textarea
            id="bookingProblem"
            rows="4"
            placeholder="Describe what service you need..."
            required
          ></textarea>

        </div>


        <div class="input-group">

          <label>
            💰 Estimated Price
          </label>

          <input
            type="number"
            id="bookingEstimatedPrice"
            placeholder="Optional"
            min="0"
          >

        </div>


        <button
          type="submit"
          class="main-login-btn"
        >
          📅 Confirm Booking
        </button>


      </form>

    </div>

  `;


  document.body.appendChild(
    modal
  );

}


/* =========================================================
   43. OPEN BOOKING MODAL
========================================================= */

function openBookingModal(provider) {

  if (!currentUser) {

    closeProviderProfile();

    openLogin();

    showMessage(
      "Please login before booking a service."
    );

    return;

  }


  if (!provider) {

    showMessage(
      "Provider information not found."
    );

    return;

  }


  createBookingModal();


  currentProvider =
    provider;


  const modal =
    $("bookingModal");


  const providerName =
    $("bookingProviderName");

  const service =
    $("bookingService");

  const address =
    $("bookingAddress");

  const date =
    $("bookingDate");

  const time =
    $("bookingTime");

  const problem =
    $("bookingProblem");

  const estimatedPrice =
    $("bookingEstimatedPrice");


  if (providerName) {

    providerName.textContent =
      "Book " +
      (
        provider.name ||
        "Service Provider"
      );

  }


  if (service) {

    service.value =
      provider.service ||
      "";

  }


  /*
    Pre-fill customer location.
  */

  if (
    address &&
    !address.value
  ) {

    address.value =
      currentUser.Location ||
      "";

  }


  /*
    Minimum booking date = today.
  */

  if (date) {

    const today =
      new Date();


    const year =
      today.getFullYear();


    const month =
      String(
        today.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        today.getDate()
      ).padStart(
        2,
        "0"
      );


    const todayString =
      year +
      "-" +
      month +
      "-" +
      day;


    date.min =
      todayString;


    if (!date.value) {

      date.value =
        todayString;

    }

  }


  if (time) {

    time.value = "";

  }


  if (problem) {

    problem.value = "";

  }


  if (estimatedPrice) {

    estimatedPrice.value = "";

  }


  modal.style.display =
    "flex";

  modal.classList.add("active");


  closeProviderProfile();

}


/* =========================================================
   44. CLOSE BOOKING MODAL
========================================================= */

function closeBookingModal() {

  const modal =
    $("bookingModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


/* =========================================================
   45. SUBMIT BOOKING
========================================================= */

async function submitBooking(event) {

  event.preventDefault();


  if (!currentUser) {

    showMessage(
      "Please login before booking."
    );

    return;

  }


  if (!currentProvider) {

    showMessage(
      "Provider information is missing."
    );

    return;

  }


  if (!supabaseClient) {

    showMessage(
      "Supabase is not connected."
    );

    return;

  }


  /*
    Registered provider is required for
    database booking.
  */

  if (!currentProvider.userId) {

    showMessage(
      "This demo provider cannot receive online bookings yet. Please contact the provider directly."
    );

    return;

  }


  const service =
    $("bookingService")?.value.trim() || "";

  const bookingDate =
    $("bookingDate")?.value || "";

  const bookingTime =
    $("bookingTime")?.value || "";

  const address =
    $("bookingAddress")?.value.trim() || "";

  const problem =
    $("bookingProblem")?.value.trim() || "";

  const estimatedPriceRaw =
    $("bookingEstimatedPrice")?.value || "";


  if (
    !service ||
    !bookingDate ||
    !bookingTime ||
    !address ||
    !problem
  ) {

    showMessage(
      "Please fill all booking details."
    );

    return;

  }


  let estimatedPrice =
    null;


  if (
    estimatedPriceRaw !== ""
  ) {

    estimatedPrice =
      Number(
        estimatedPriceRaw
      );

  }


  try {

    const bookingData = {

      user_id:
        currentUser.Id,

      provider_user_id:
        currentProvider.userId,

      provider_name:
        currentProvider.name || "",

      provider_phone:
        currentProvider.phone || "",

      service:
        service,

      booking_date:
        bookingDate,

      booking_time:
        bookingTime,

      address:
        address,

      problem_description:
        problem,

      status:
        "Pending",

      estimated_price:
        estimatedPrice,

      final_price:
        null

    };


    const result =
      await supabaseClient
        .from("bookings")
        .insert([
          bookingData
        ])
        .select()
        .single();


    if (result.error) {

      console.error(
        "Booking insert error:",
        result.error
      );


      showMessage(
        "Booking failed: " +
        result.error.message
      );

      return;

    }


    currentBooking =
      result.data;


    closeBookingModal();


    showMessage(
      "✅ Booking request sent successfully!\n\n" +
      "Provider: " +
      currentProvider.name +
      "\nService: " +
      service +
      "\nStatus: Pending"
    );


    /*
      Open My Bookings after successful booking.
    */

    setTimeout(
      function() {

        openMyBookings();

      },
      300
    );


  } catch (error) {

    console.error(
      "Booking exception:",
      error
    );


    showMessage(
      "Something went wrong while creating booking."
    );

  }

}


/* =========================================================
   46. CREATE MY BOOKINGS MODAL
========================================================= */

function createMyBookingsModal() {

  if ($("myBookingsModal")) {
    return;
  }


  const modal =
    document.createElement("div");


  modal.id =
    "myBookingsModal";


  modal.className =
    "app-modal";


  modal.innerHTML = `

    <div
      class="profile-box"
      style="max-width:700px;"
    >

      <button
        class="modal-close"
        onclick="closeMyBookings()"
      >
        ✕
      </button>


      <div class="profile-avatar">
        📋
      </div>


      <h2>
        My Bookings
      </h2>


      <p
        style="
          text-align:center;
          margin-bottom:18px;
        "
      >
        View your service booking requests
      </p>


      <div
        id="myBookingsList"
      >

        <div class="welcome-card">

          <div class="welcome-icon">
            ⏳
          </div>

          <h3>
            Loading bookings...
          </h3>

        </div>

      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );

}


/* =========================================================
   47. OPEN MY BOOKINGS
========================================================= */

async function openMyBookings() {

  if (!currentUser) {

    openLogin();

    return;

  }


  createMyBookingsModal();


  const modal =
    $("myBookingsModal");


  if (!modal) {
    return;
  }


  modal.style.display =
    "flex";

  modal.classList.add("active");


  await loadMyBookings();

}


/* =========================================================
   48. CLOSE MY BOOKINGS
========================================================= */

function closeMyBookings() {

  const modal =
    $("myBookingsModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


/* =========================================================
   49. LOAD MY BOOKINGS
========================================================= */

async function loadMyBookings() {

  const container =
    $("myBookingsList");


  if (!container) {
    return;
  }


  if (!currentUser) {

    container.innerHTML = `

      <div class="welcome-card">

        <h3>
          Please login
        </h3>

      </div>

    `;

    return;

  }


  if (!supabaseClient) {

    container.innerHTML = `

      <div class="welcome-card">

        <h3>
          Database unavailable
        </h3>

        <p>
          Please check Supabase connection.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="welcome-card">

      <div class="welcome-icon">
        ⏳
      </div>

      <h3>
        Loading bookings...
      </h3>

    </div>

  `;


  try {

    const result =
      await supabaseClient
        .from("bookings")
        .select("*")
        .eq(
          "user_id",
          currentUser.Id
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (result.error) {

      console.error(
        "My bookings error:",
        result.error
      );


      container.innerHTML = `

        <div class="welcome-card">

          <div class="welcome-icon">
            ⚠️
          </div>

          <h3>
            Unable to load bookings
          </h3>

          <p>
            ${escapeHTML(
              result.error.message
            )}
          </p>

        </div>

      `;

      return;

    }


    const bookings =
      result.data || [];


    renderMyBookings(
      bookings
    );


  } catch (error) {

    console.error(
      "My bookings exception:",
      error
    );


    container.innerHTML = `

      <div class="welcome-card">

        <div class="welcome-icon">
          ⚠️
        </div>

        <h3>
          Something went wrong
        </h3>

      </div>

    `;

  }

}


/* =========================================================
   50. RENDER MY BOOKINGS
========================================================= */

function renderMyBookings(
  bookings
) {

  const container =
    $("myBookingsList");


  if (!container) {
    return;
  }


  if (!bookings.length) {

    container.innerHTML = `

      <div class="welcome-card">

        <div class="welcome-icon">
          📅
        </div>

        <h3>
          No bookings yet
        </h3>

        <p>
          Your service bookings will appear here.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    bookings
      .map(
        function(booking) {

          return createBookingCard(
            booking
          );

        }
      )
      .join("");

}


/* =========================================================
   51. CREATE BOOKING CARD
========================================================= */

function createBookingCard(
  booking
) {

  const status =
    booking.status ||
    "Pending";


  let statusIcon =
    "⏳";


  if (status === "Confirmed") {

    statusIcon =
      "✅";

  } else if (
    status === "Rejected"
  ) {

    statusIcon =
      "❌";

  } else if (
    status === "Completed"
  ) {

    statusIcon =
      "🎉";

  } else if (
    status === "Cancelled"
  ) {

    statusIcon =
      "🚫";

  }


  const statusClass =
    status
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      );


  return `

    <div
      style="
        border:1px solid #e5e7eb;
        border-radius:14px;
        padding:15px;
        margin-bottom:12px;
        background:#fff;
      "
    >


      <div
        style="
          display:flex;
          justify-content:space-between;
          gap:10px;
          align-items:flex-start;
        "
      >

        <div>

          <h3
            style="margin:0 0 5px 0;"
          >
            ${escapeHTML(
              booking.provider_name ||
              "Service Provider"
            )}
          </h3>

          <p
            style="margin:0;"
          >
            ${escapeHTML(
              booking.service ||
              "Service"
            )}
          </p>

        </div>


        <strong>

          ${statusIcon}

          ${escapeHTML(
            status
          )}

        </strong>

      </div>


      <div
        style="
          margin-top:12px;
          line-height:1.8;
        "
      >

        <div>
          📅
          ${escapeHTML(
            booking.booking_date ||
            "-"
          )}
        </div>

        <div>
          ⏰
          ${escapeHTML(
            booking.booking_time ||
            "-"
          )}
        </div>

        <div>
          📍
          ${escapeHTML(
            booking.address ||
            "-"
          )}
        </div>

        <div>
          📝
          ${escapeHTML(
            booking.problem_description ||
            "-"
          )}
        </div>

        ${
          booking.estimated_price !== null &&
          booking.estimated_price !== undefined
            ? `
              <div>
                💰 Estimated:
                ₹${escapeHTML(
                  booking.estimated_price
                )}
              </div>
            `
            : ""
        }

        ${
          booking.final_price !== null &&
          booking.final_price !== undefined
            ? `
              <div>
                💵 Final:
                ₹${escapeHTML(
                  booking.final_price
                )}
              </div>
            `
            : ""
        }

      </div>


      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:12px;
        "
      >

        ${
          booking.status === "Completed"
            ? `
              <button
                class="register-btn"
                onclick="openReviewForBooking(${booking.id})"
              >
                ⭐ Rate Service
              </button>
            `
            : ""
        }


        ${
          booking.provider_phone
            ? `
              <button
                class="main-login-btn"
                onclick="callBookingProvider('${escapeHTML(
                  booking.provider_phone
                )}')"
              >
                📞 Call
              </button>
            `
            : ""
        }

      </div>


    </div>

  `;

}


/* =========================================================
   52. CALL BOOKING PROVIDER
========================================================= */

function callBookingProvider(
  phone
) {

  if (!phone) {

    showMessage(
      "Provider phone number is unavailable."
    );

    return;

  }


  window.location.href =
    "tel:" +
    phone;

}


/* =========================================================
   53. CREATE REVIEW MODAL
========================================================= */

function createReviewModal() {

  if ($("reviewModal")) {
    return;
  }


  const modal =
    document.createElement("div");


  modal.id =
    "reviewModal";


  modal.className =
    "login-modal";


  modal.innerHTML = `

    <div class="login-box">

      <button
        class="close-login"
        onclick="closeReviewModal()"
      >
        ✕
      </button>


      <div class="login-icon">
        ⭐
      </div>


      <h2>
        Rate & Review
      </h2>


      <p
        class="login-subtitle"
        id="reviewProviderName"
      >
        Service Provider
      </p>


      <form
        id="reviewForm"
        onsubmit="submitReview(event)"
      >


        <div class="input-group">

          <label>
            ⭐ Rating
          </label>

          <select
            id="reviewRating"
            required
          >

            <option value="">
              Select rating
            </option>

            <option value="5">
              ⭐⭐⭐⭐⭐ 5 - Excellent
            </option>

            <option value="4">
              ⭐⭐⭐⭐ 4 - Very Good
            </option>

            <option value="3">
              ⭐⭐⭐ 3 - Good
            </option>

            <option value="2">
              ⭐⭐ 2 - Average
            </option>

            <option value="1">
              ⭐ 1 - Poor
            </option>

          </select>

        </div>


        <div class="input-group">

          <label>
            📝 Review
          </label>

          <textarea
            id="reviewText"
            rows="5"
            placeholder="Write your experience..."
            required
          ></textarea>

        </div>


        <button
          type="submit"
          class="main-login-btn"
        >
          ⭐ Submit Review
        </button>


      </form>

    </div>

  `;


  document.body.appendChild(
    modal
  );

}


/* =========================================================
   54. OPEN REVIEW MODAL FOR PROVIDER
========================================================= */

function openReviewModal(
  provider
) {

  if (!currentUser) {

    openLogin();

    showMessage(
      "Please login before reviewing."
    );

    return;

  }


  if (
    !provider ||
    !provider.userId
  ) {

    showMessage(
      "This provider cannot receive online reviews."
    );

    return;

  }


  createReviewModal();


  currentProvider =
    provider;


  const modal =
    $("reviewModal");


  const providerName =
    $("reviewProviderName");


  const rating =
    $("reviewRating");


  const text =
    $("reviewText");


  if (providerName) {

    providerName.textContent =
      "Review " +
      (
        provider.name ||
        "Service Provider"
      );

  }


  if (rating) {

    rating.value = "";

  }


  if (text) {

    text.value = "";

  }


  modal.style.display =
    "flex";

  modal.classList.add("active");


  closeProviderProfile();

}


/* =========================================================
   55. OPEN REVIEW FOR BOOKING
========================================================= */

async function openReviewForBooking(
  bookingId
) {

  if (!currentUser) {

    openLogin();

    return;

  }


  if (!supabaseClient) {

    showMessage(
      "Supabase is not connected."
    );

    return;

  }


  try {

    const result =
      await supabaseClient
        .from("bookings")
        .select("*")
        .eq(
          "id",
          bookingId
        )
        .eq(
          "user_id",
          currentUser.Id
        )
        .maybeSingle();


    if (result.error) {

      console.error(
        "Booking review lookup error:",
        result.error
      );

      showMessage(
        "Unable to load booking."
      );

      return;

    }


    if (!result.data) {

      showMessage(
        "Booking not found."
      );

      return;

    }


    const booking =
      result.data;


    if (
      booking.status !== "Completed"
    ) {

      showMessage(
        "You can review a service after it is completed."
      );

      return;

    }


    const provider = {

      id:
        "db-provider-" +
        booking.provider_user_id,

      userId:
        booking.provider_user_id,

      name:
        booking.provider_name,

      phone:
        booking.provider_phone,

      service:
        booking.service

    };


    currentBooking =
      booking;


    openReviewModal(
      provider
    );


  } catch (error) {

    console.error(
      "Open review exception:",
      error
    );


    showMessage(
      "Unable to open review."
    );

  }

}


/* =========================================================
   56. CLOSE REVIEW MODAL
========================================================= */

function closeReviewModal() {

  const modal =
    $("reviewModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.style.display =
    "none";

}


/* =========================================================
   57. SUBMIT REVIEW
========================================================= */

async function submitReview(event) {

  event.preventDefault();


  if (!currentUser) {

    showMessage(
      "Please login before reviewing."
    );

    return;

  }


  if (!currentProvider) {

    showMessage(
      "Provider information is missing."
    );

    return;

  }


  if (!currentProvider.userId) {

    showMessage(
      "This provider cannot receive online reviews."
    );

    return;

  }


  if (!supabaseClient) {

    showMessage(
      "Supabase is not connected."
    );

    return;

  }


  const rating =
    Number(
      $("reviewRating")?.value || 0
    );


  const reviewText =
    $("reviewText")?.value.trim() || "";


  if (
    rating < 1 ||
    rating > 5
  ) {

    showMessage(
      "Please select a rating."
    );

    return;

  }


  if (!reviewText) {

    showMessage(
      "Please write a review."
    );

    return;

  }


  try {

    /*
      Prevent duplicate review for same
      booking when a booking exists.
    */

    if (currentBooking) {

      const existing =
        await supabaseClient
          .from("reviews")
          .select("id")
          .eq(
            "reviewer_user_id",
            currentUser.Id
          )
          .eq(
            "provider_user_id",
            currentProvider.userId
          )
          .maybeSingle();


      if (
        existing.data
      ) {

        showMessage(
          "You have already reviewed this provider."
        );

        return;

      }

    }


    const reviewData = {

      provider_user_id:
        currentProvider.userId,

      provider_name:
        currentProvider.name || "",

      service:
        currentProvider.service || "",

      reviewer_user_id:
        currentUser.Id,

      reviewer_name:
        currentUser.Name || "Customer",

      rating:
        rating,

      review:
        reviewText

    };


    const result =
      await supabaseClient
        .from("reviews")
        .insert([
          reviewData
        ])
        .select()
        .single();


    if (result.error) {

      console.error(
        "Review insert error:",
        result.error
      );


      showMessage(
        "Review submission failed: " +
        result.error.message
      );

      return;

    }


    closeReviewModal();


    showMessage(
      "⭐ Thank you! Your review has been submitted."
    );


    /*
      Refresh provider ratings.
    */

    await loadRegisteredProviders();


    /*
      If provider profile is currently open,
      refresh it.
    */

    if (
      currentProvider &&
      currentProvider.userId
    ) {

      const refreshed =
        findProviderById(
          currentProvider.id
        );


      if (refreshed) {

        currentProvider =
          refreshed;

      }

    }


  } catch (error) {

    console.error(
      "Review exception:",
      error
    );


    showMessage(
      "Something went wrong while submitting review."
    );

  }

}


/* =========================================================
   58. ADD MY BOOKINGS NAV BUTTON
========================================================= */

function addMyBookingsNavButton() {

  if (
    $("myBookingsNav")
  ) {

    return;

  }


  const nav =
    document.querySelector(
      ".main-nav"
    );


  if (!nav) {
    return;
  }


  const button =
    document.createElement("button");


  button.className =
    "nav-item";


  button.id =
    "myBookingsNav";


  button.innerHTML =
    "📋 <span>My Bookings</span>";


  button.onclick =
    openMyBookings;


  nav.appendChild(
    button
  );

}


/* =========================================================
   59. MAKE BOOKING FUNCTIONS GLOBAL
========================================================= */

window.openBookingModal =
  openBookingModal;

window.closeBookingModal =
  closeBookingModal;

window.submitBooking =
  submitBooking;

window.openMyBookings =
  openMyBookings;

window.closeMyBookings =
  closeMyBookings;

window.callBookingProvider =
  callBookingProvider;

window.openReviewModal =
  openReviewModal;

window.closeReviewModal =
  closeReviewModal;

window.submitReview =
  submitReview;

window.openReviewForBooking =
  openReviewForBooking;


/* =========================================================
   60. ADD NAV BUTTON AFTER APP LOAD
========================================================= */

function initializeBookingFeatures() {

  addMyBookingsNavButton();


  console.log(
    "Booking and review system loaded."
  );

}


if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    function() {

      setTimeout(
        initializeBookingFeatures,
        500
      );

    }
  );

} else {

  setTimeout(
    initializeBookingFeatures,
    500
  );

}


/* =========================================================
   END OF PART 3

   PART 4 CONTINUES DIRECTLY BELOW.

   DO NOT ADD ANOTHER <script> TAG.

========================================================= */
// =====================================================
// PART 4 — PROVIDER DASHBOARD + FINAL SETUP
// =====================================================

// -----------------------------------------------------
// PROVIDER CHECK
// -----------------------------------------------------

async function getCurrentProviderWorkDetails() {
    if (!currentUser || !currentUser.Id) {
        return null;
    }

    // Already loaded
    if (currentUser.workDetails) {
        return currentUser.workDetails;
    }

    if (!supabaseClient) {
        return null;
    }

    const { data, error } = await supabaseClient
        .from("work_details")
        .select("*")
        .eq("User_id", currentUser.Id)
        .maybeSingle();

    if (error) {
        console.error("Provider work details error:", error);
        return null;
    }

    if (data) {
        currentUser.workDetails = data;
        saveCurrentUser(currentUser);
    }

    return data || null;
}


async function isCurrentUserProvider() {
    const workDetails = await getCurrentProviderWorkDetails();

    return !!(
        workDetails &&
        (
            workDetails.Work_type ||
            workDetails.Skill ||
            workDetails.Experience ||
            workDetails.Work_location ||
            workDetails["Available time"]
        )
    );
}


// -----------------------------------------------------
// PROVIDER DASHBOARD MODAL
// -----------------------------------------------------

function createProviderDashboardModal() {

    if (document.getElementById("providerDashboardModal")) {
        return;
    }

    const modal = document.createElement("div");

    modal.id = "providerDashboardModal";
    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-content" style="
            max-width:900px;
            width:95%;
            max-height:90vh;
            overflow-y:auto;
        ">

            <button
                class="close-btn"
                onclick="closeProviderDashboard()"
                style="float:right;"
            >
                ✕
            </button>

            <h2>🧑‍🔧 Provider Dashboard</h2>

            <p id="providerDashboardWelcome">
                Manage your service bookings here.
            </p>

            <div
                id="providerDashboardStats"
                style="
                    display:grid;
                    grid-template-columns:repeat(3,1fr);
                    gap:10px;
                    margin:20px 0;
                "
            >
                <div class="dashboard-stat">
                    <strong id="pendingBookingCount">0</strong>
                    <span>Pending</span>
                </div>

                <div class="dashboard-stat">
                    <strong id="confirmedBookingCount">0</strong>
                    <span>Confirmed</span>
                </div>

                <div class="dashboard-stat">
                    <strong id="completedBookingCount">0</strong>
                    <span>Completed</span>
                </div>
            </div>

            <hr>

            <h3>📋 Customer Bookings</h3>

            <div id="providerBookingsContainer">
                <p>Loading bookings...</p>
            </div>

        </div>
    `;

    document.body.appendChild(modal);
}


// -----------------------------------------------------
// ADD SIMPLE DASHBOARD STYLES
// -----------------------------------------------------

function addProviderDashboardStyles() {

    if (document.getElementById("providerDashboardStyles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "providerDashboardStyles";

    style.textContent = `
        .dashboard-stat {
            background:#f5f5f5;
            border-radius:12px;
            padding:15px;
            text-align:center;
        }

        .dashboard-stat strong {
            display:block;
            font-size:25px;
            margin-bottom:5px;
        }

        .dashboard-stat span {
            font-size:13px;
            color:#666;
        }

        .provider-booking-card {
            border:1px solid #ddd;
            border-radius:14px;
            padding:16px;
            margin:12px 0;
            background:#fff;
        }

        .provider-booking-card h4 {
            margin:0 0 8px 0;
        }

        .booking-status {
            display:inline-block;
            padding:5px 10px;
            border-radius:20px;
            font-size:12px;
            font-weight:bold;
            margin-bottom:10px;
        }

        .booking-status.pending {
            background:#fff3cd;
            color:#856404;
        }

        .booking-status.confirmed {
            background:#d1ecf1;
            color:#0c5460;
        }

        .booking-status.rejected {
            background:#f8d7da;
            color:#721c24;
        }

        .booking-status.completed {
            background:#d4edda;
            color:#155724;
        }

        .provider-action-row {
            display:flex;
            flex-wrap:wrap;
            gap:8px;
            margin-top:14px;
        }

        .provider-action-row button {
            padding:9px 14px;
            border:none;
            border-radius:8px;
            cursor:pointer;
        }

        .confirm-booking-btn {
            background:#198754;
            color:white;
        }

        .reject-booking-btn {
            background:#dc3545;
            color:white;
        }

        .complete-booking-btn {
            background:#0d6efd;
            color:white;
        }

        @media(max-width:600px) {
            #providerDashboardStats {
                grid-template-columns:1fr !important;
            }
        }
    `;

    document.head.appendChild(style);
}


// -----------------------------------------------------
// OPEN PROVIDER DASHBOARD
// -----------------------------------------------------

async function openProviderDashboard() {

    if (!currentUser || !currentUser.Id) {
        alert("Please login first.");
        openLogin();
        return;
    }

    const providerDetails = await getCurrentProviderWorkDetails();

    if (!providerDetails) {
        alert("Provider account not found.");
        return;
    }

    createProviderDashboardModal();
    addProviderDashboardStyles();

    const modal = document.getElementById("providerDashboardModal");

    if (!modal) {
        return;
    }

    modal.style.display = "flex";

    const welcome = document.getElementById("providerDashboardWelcome");

    if (welcome) {
        welcome.innerHTML = `
            Welcome, <strong>${escapeHTML(currentUser.Name || "Provider")}</strong> 👋
            <br>
            Service: <strong>${escapeHTML(
                providerDetails.Work_type || "Service Provider"
            )}</strong>
        `;
    }

    await loadProviderDashboardBookings();
}


// -----------------------------------------------------
// CLOSE DASHBOARD
// -----------------------------------------------------

function closeProviderDashboard() {

    const modal = document.getElementById("providerDashboardModal");

    if (modal) {
        modal.style.display = "none";
    }
}


// -----------------------------------------------------
// LOAD PROVIDER BOOKINGS
// -----------------------------------------------------

async function loadProviderDashboardBookings() {

    const container = document.getElementById(
        "providerBookingsContainer"
    );

    if (!container) {
        return;
    }

    if (!supabaseClient || !currentUser) {
        container.innerHTML = `
            <p>Unable to load bookings.</p>
        `;
        return;
    }

    container.innerHTML = `
        <p>Loading customer bookings...</p>
    `;

    const { data: bookings, error } = await supabaseClient
        .from("bookings")
        .select("*")
        .eq("provider_user_id", currentUser.Id)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Provider bookings error:",
            error
        );

        container.innerHTML = `
            <p style="color:red;">
                Failed to load bookings.
            </p>
        `;

        return;
    }

    const bookingList = bookings || [];

    // ---------------------------------------------
    // COUNTS
    // ---------------------------------------------

    const pending = bookingList.filter(
        b => String(b.status).toLowerCase() === "pending"
    ).length;

    const confirmed = bookingList.filter(
        b => String(b.status).toLowerCase() === "confirmed"
    ).length;

    const completed = bookingList.filter(
        b => String(b.status).toLowerCase() === "completed"
    ).length;

    const pendingEl = document.getElementById(
        "pendingBookingCount"
    );

    const confirmedEl = document.getElementById(
        "confirmedBookingCount"
    );

    const completedEl = document.getElementById(
        "completedBookingCount"
    );

    if (pendingEl) {
        pendingEl.textContent = pending;
    }

    if (confirmedEl) {
        confirmedEl.textContent = confirmed;
    }

    if (completedEl) {
        completedEl.textContent = completed;
    }


    // ---------------------------------------------
    // NO BOOKINGS
    // ---------------------------------------------

    if (!bookingList.length) {

        container.innerHTML = `
            <div style="
                text-align:center;
                padding:30px 10px;
            ">
                <h3>📭 No bookings yet</h3>
                <p>
                    Customer bookings will appear here.
                </p>
            </div>
        `;

        return;
    }


    // ---------------------------------------------
    // GET CUSTOMER DETAILS
    // ---------------------------------------------

    const customerIds = [
        ...new Set(
            bookingList
                .map(b => b.user_id)
                .filter(Boolean)
        )
    ];

    let customerMap = {};

    if (customerIds.length) {

        const { data: customers } = await supabaseClient
            .from("users")
            .select("Id, Name, Mobile, Email")
            .in("Id", customerIds);

        (customers || []).forEach(customer => {

            customerMap[String(customer.Id)] =
                customer;

        });
    }


    // ---------------------------------------------
    // RENDER
    // ---------------------------------------------

    container.innerHTML = bookingList
        .map(booking => {

            const customer =
                customerMap[String(booking.user_id)] || {};

            const customerName =
                customer.Name ||
                "Customer";

            const customerPhone =
                customer.Mobile ||
                "Not available";

            const status =
                booking.status ||
                "Pending";

            const statusClass =
                String(status)
                    .toLowerCase()
                    .replace(/\s+/g, "-");

            const date =
                booking.booking_date ||
                "Not selected";

            const time =
                booking.booking_time ||
                "Not selected";

            const address =
                booking.address ||
                "Not provided";

            const problem =
                booking.problem_description ||
                "No description";

            const estimatedPrice =
                booking.estimated_price !== null &&
                booking.estimated_price !== undefined &&
                booking.estimated_price !== ""
                    ? `₹${booking.estimated_price}`
                    : "Not set";

            const finalPrice =
                booking.final_price !== null &&
                booking.final_price !== undefined &&
                booking.final_price !== ""
                    ? `₹${booking.final_price}`
                    : "Not set";


            let actionButtons = "";


            // -------------------------------------
            // PENDING
            // -------------------------------------

            if (
                String(status).toLowerCase() ===
                "pending"
            ) {

                actionButtons = `
                    <div class="provider-action-row">

                        <button
                            class="confirm-booking-btn"
                            onclick="confirmProviderBooking(${Number(booking.id)})"
                        >
                            ✅ Confirm
                        </button>

                        <button
                            class="reject-booking-btn"
                            onclick="rejectProviderBooking(${Number(booking.id)})"
                        >
                            ❌ Reject
                        </button>

                    </div>
                `;
            }


            // -------------------------------------
            // CONFIRMED
            // -------------------------------------

            else if (
                String(status).toLowerCase() ===
                "confirmed"
            ) {

                actionButtons = `
                    <div class="provider-action-row">

                        <button
                            class="complete-booking-btn"
                            onclick="completeProviderBooking(${Number(booking.id)})"
                        >
                            ✅ Mark Completed
                        </button>

                    </div>
                `;
            }


            return `
                <div class="provider-booking-card">

                    <span class="booking-status ${statusClass}">
                        ${escapeHTML(status)}
                    </span>

                    <h4>
                        👤 ${escapeHTML(customerName)}
                    </h4>

                    <p>
                        📞 ${escapeHTML(customerPhone)}
                    </p>

                    <p>
                        🔧 <strong>Service:</strong>
                        ${escapeHTML(
                            booking.service || "Service"
                        )}
                    </p>

                    <p>
                        📅 <strong>Date:</strong>
                        ${escapeHTML(String(date))}
                    </p>

                    <p>
                        ⏰ <strong>Time:</strong>
                        ${escapeHTML(String(time))}
                    </p>

                    <p>
                        📍 <strong>Address:</strong>
                        ${escapeHTML(address)}
                    </p>

                    <p>
                        📝 <strong>Problem:</strong>
                        ${escapeHTML(problem)}
                    </p>

                    <p>
                        💰 <strong>Estimated Price:</strong>
                        ${escapeHTML(String(estimatedPrice))}
                    </p>

                    <p>
                        💵 <strong>Final Price:</strong>
                        ${escapeHTML(String(finalPrice))}
                    </p>

                    ${
                        actionButtons
                    }

                </div>
            `;

        })
        .join("");
}


// -----------------------------------------------------
// UPDATE BOOKING STATUS
// -----------------------------------------------------

async function updateProviderBookingStatus(
    bookingId,
    newStatus,
    priceField = null
) {

    if (!supabaseClient || !currentUser) {
        alert("Please login again.");
        return;
    }

    const updateData = {
        status: newStatus
    };


    // ---------------------------------------------
    // PRICE
    // ---------------------------------------------

    if (priceField) {

        const enteredPrice =
            prompt(
                priceField === "estimated_price"
                    ? "Enter estimated price (optional):"
                    : "Enter final price (optional):"
            );

        if (
            enteredPrice !== null &&
            enteredPrice.trim() !== ""
        ) {

            const numericPrice =
                Number(enteredPrice);

            if (
                Number.isNaN(numericPrice) ||
                numericPrice < 0
            ) {

                alert(
                    "Please enter a valid price."
                );

                return;
            }

            updateData[priceField] =
                numericPrice;
        }
    }


    const { error } = await supabaseClient
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId)
        .eq(
            "provider_user_id",
            currentUser.Id
        );

    if (error) {

        console.error(
            "Booking status update error:",
            error
        );

        alert(
            "Failed to update booking."
        );

        return;
    }


    alert(
        `Booking ${newStatus.toLowerCase()} successfully.`
    );

    await loadProviderDashboardBookings();

    // Refresh customer-side bookings too
    if (
        typeof loadMyBookings === "function"
    ) {
        await loadMyBookings();
    }
}


// -----------------------------------------------------
// CONFIRM
// -----------------------------------------------------

async function confirmProviderBooking(
    bookingId
) {

    const ok = confirm(
        "Confirm this customer booking?"
    );

    if (!ok) {
        return;
    }

    await updateProviderBookingStatus(
        bookingId,
        "Confirmed",
        "estimated_price"
    );
}


// -----------------------------------------------------
// REJECT
// -----------------------------------------------------

async function rejectProviderBooking(
    bookingId
) {

    const ok = confirm(
        "Reject this customer booking?"
    );

    if (!ok) {
        return;
    }

    await updateProviderBookingStatus(
        bookingId,
        "Rejected"
    );
}


// -----------------------------------------------------
// COMPLETE
// -----------------------------------------------------

async function completeProviderBooking(
    bookingId
) {

    const ok = confirm(
        "Mark this booking as completed?"
    );

    if (!ok) {
        return;
    }

    await updateProviderBookingStatus(
        bookingId,
        "Completed",
        "final_price"
    );
}


// -----------------------------------------------------
// ADD PROVIDER DASHBOARD BUTTON
// -----------------------------------------------------

async function addProviderDashboardButton() {

    const provider =
        await isCurrentUserProvider();

    // ---------------------------------------------
    // SETTINGS
    // ---------------------------------------------

    const settingsBox =
        document.querySelector(".settings-box");

    if (settingsBox) {

        const existing =
            document.getElementById(
                "providerDashboardSettingsBtn"
            );

        if (provider && !existing) {

            const button =
                document.createElement("button");

            button.id =
                "providerDashboardSettingsBtn";

            button.className =
                "settings-item";

            button.innerHTML =
                "🧑‍🔧 Provider Dashboard";

            button.onclick =
                openProviderDashboard;

            settingsBox.appendChild(
                button
            );
        }

        if (!provider && existing) {
            existing.remove();
        }
    }


    // ---------------------------------------------
    // ACCOUNT MODAL
    // ---------------------------------------------

    const accountModal =
        document.getElementById(
            "accountModal"
        );

    if (accountModal) {

        const accountContent =
            accountModal.querySelector(
                ".modal-content"
            );

        if (accountContent) {

            const existingAccountButton =
                document.getElementById(
                    "providerDashboardAccountBtn"
                );

            if (
                provider &&
                !existingAccountButton
            ) {

                const button =
                    document.createElement("button");

                button.id =
                    "providerDashboardAccountBtn";

                button.type = "button";

                button.innerHTML =
                    "🧑‍🔧 Provider Dashboard";

                button.onclick =
                    openProviderDashboard;

                accountContent.appendChild(
                    button
                );
            }

            if (
                !provider &&
                existingAccountButton
            ) {

                existingAccountButton.remove();
            }
        }
    }
}


// -----------------------------------------------------
// FINAL SETTINGS OPEN FUNCTION
// -----------------------------------------------------

function openSettings() {

    closeAllModals();

    const modal =
        document.getElementById(
            "settingsModal"
        );

    if (!modal) {
        return;
    }

    modal.style.display = "flex";

    // Add provider dashboard button
    addProviderDashboardButton();
}


// -----------------------------------------------------
// UPDATE DASHBOARD BUTTON AFTER LOGIN
// -----------------------------------------------------

async function refreshProviderDashboardButton() {

    if (!currentUser) {

        const settingsButton =
            document.getElementById(
                "providerDashboardSettingsBtn"
            );

        const accountButton =
            document.getElementById(
                "providerDashboardAccountBtn"
            );

        if (settingsButton) {
            settingsButton.remove();
        }

        if (accountButton) {
            accountButton.remove();
        }

        return;
    }

    await addProviderDashboardButton();
}


// -----------------------------------------------------
// FINAL APPLICATION INITIALIZATION
// -----------------------------------------------------

async function finalizeQuickHelpApp() {

    try {

        createProviderDashboardModal();

        addProviderDashboardStyles();

        if (currentUser) {

            await getCurrentProviderWorkDetails();

            await refreshProviderDashboardButton();
        }

    } catch (error) {

        console.error(
            "Final app initialization error:",
            error
        );
    }
}


// -----------------------------------------------------
// GLOBAL EXPORTS
// -----------------------------------------------------

window.getCurrentProviderWorkDetails =
    getCurrentProviderWorkDetails;

window.isCurrentUserProvider =
    isCurrentUserProvider;

window.createProviderDashboardModal =
    createProviderDashboardModal;

window.openProviderDashboard =
    openProviderDashboard;

window.closeProviderDashboard =
    closeProviderDashboard;

window.loadProviderDashboardBookings =
    loadProviderDashboardBookings;

window.updateProviderBookingStatus =
    updateProviderBookingStatus;

window.confirmProviderBooking =
    confirmProviderBooking;

window.rejectProviderBooking =
    rejectProviderBooking;

window.completeProviderBooking =
    completeProviderBooking;

window.addProviderDashboardButton =
    addProviderDashboardButton;

window.refreshProviderDashboardButton =
    refreshProviderDashboardButton;

window.openSettings =
    openSettings;


// -----------------------------------------------------
// START FINAL SETUP
// -----------------------------------------------------

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        finalizeQuickHelpApp
    );

} else {

    finalizeQuickHelpApp();

}


// =====================================================
// END OF SCRIPT.JS
// =====================================================
