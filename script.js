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
   PROVIDERS
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
   SHOW PROVIDERS
========================================================= */

function showProviders(service) {

  const providerContainer =
    document.getElementById("providers");

  const serviceTitle =
    document.getElementById("serviceTitle");

  const providerCount =
    document.getElementById("providerCount");


  const filteredProviders =
    providers.filter(
      provider => provider.service === service
    );


  if (serviceTitle) {
    serviceTitle.textContent =
      service + "s";
  }


  if (providerCount) {
    providerCount.textContent =
      filteredProviders.length +
      " professionals";
  }


  if (!providerContainer) {
    return;
  }


  providerContainer.innerHTML = "";


  filteredProviders.forEach(provider => {

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
   REGISTER ACCOUNT
   DATABASE:
   users
   work_details
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
     BASIC VALIDATION
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
       INSERT USER
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
       INSERT WORK DETAILS
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
        "Account created, but work details could not be saved."
      );

      return;
    }


    /* -----------------------------------------------------
       SAVE LOCAL SESSION
       Password is NOT saved locally
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


    /* -----------------------------------------------------
       CLOSE REGISTER
    ----------------------------------------------------- */

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
   DATABASE CHECK
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

    /* -----------------------------------------------------
       FIND USER
    ----------------------------------------------------- */

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
       CREATE LOCAL SESSION
       Password NOT stored
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


    /* -----------------------------------------------------
       CLOSE LOGIN
    ----------------------------------------------------- */

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
   CLOSE MODALS
   WHEN CLICKING OUTSIDE
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
   ESC KEY CLOSE
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
