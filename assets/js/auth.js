document.addEventListener('DOMContentLoaded', () => {

  // ================= PASSWORD TOGGLE (SIGNUP) =================

  const togglePassword =
    document.getElementById('togglePassword');

  const passwordInput =
    document.getElementById('password');

  if (togglePassword && passwordInput) {

    togglePassword.addEventListener('click', () => {

      const type =
        passwordInput.type === 'password'
          ? 'text'
          : 'password';

      passwordInput.type = type;

      togglePassword.classList.toggle('active');

      togglePassword.textContent =
        type === 'password'
          ? '👁️'
          : '👁️‍🗨️';

    });

  }

  // ================= PASSWORD TOGGLE (LOGIN) =================

  const loginToggle =
    document.querySelector('.password-toggle');

  const loginPassword =
    document.getElementById('loginPassword');

  if (loginToggle && loginPassword) {

    loginToggle.addEventListener('click', () => {

      const type =
        loginPassword.type === 'password'
          ? 'text'
          : 'password';

      loginPassword.type = type;

      loginToggle.classList.toggle('active');

    });

  }

  // ================= SIGNUP FORM =================

  const signUpForm =
    document.getElementById('signupForm');

  if (signUpForm) {

    signUpForm.addEventListener('submit', (e) => {

      e.preventDefault();

      const name =
        document.getElementById("fullName")
          .value
          .trim();

      const email =
        document.getElementById("email")
          .value
          .trim()
          .toLowerCase();

      const matricNo =
        document.getElementById("matricNo")
          .value
          .trim();

      const dpt =
        document.getElementById("dpt")
          .value
          .trim();

      const pass =
        document.getElementById("password")
          .value
          .trim();

      // ================= VALIDATION =================

      if (!name || !email || !pass) {

        showError(
          signUpForm,
          "Name, Email and Password are required"
        );

        return;

      }

      // Email Validation

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {

        showError(
          signUpForm,
          "Please enter a valid email"
        );

        return;

      }

      // Password Validation

      if (pass.length < 6) {

        showError(
          signUpForm,
          "Password must be at least 6 characters"
        );

        return;

      }

      // ================= USER OBJECT =================

      const u = {

        id: Date.now(),

        name: name,

        email: email,

        matricNo: matricNo,

        department: dpt,

        password: pass,

        level: "100L",

        gpa: "0.00",

        cgpa: "0.00",

        semester: "First",

        bio: "",

        faculty: "Computing",

        courses: [

          {
            code: "CSC 101",
            unit: 3,
            status: "Active"
          },

          {
            code: "MTH 101",
            unit: 3,
            status: "Active"
          }

        ]

      };

      const signupBtn =
        document.getElementById("registerBtn");

      setLoading(signupBtn, "Registering...");

      try {

    console.log("Saving User:", u);

const response =
  saveRegisteredUser(u);

        clearLoading(signupBtn);

        if (response.status === "success") {

          showToast(
            response.message,
            "success"
          );

          signUpForm.reset();

          setTimeout(() => {

            window.location.href =
              "login.html";

          }, 1000);

        } else {

          showToast(
            response.message,
            "error"
          );

        }

      } catch (error) {

        clearLoading(signupBtn);

        console.error(error);

        showToast(
          "Registration failed",
          "error"
        );

      }

    });

  }

  // ================= LOGIN FORM =================

  const loginForm =
    document.getElementById('loginForm');

  if (loginForm) {

    loginForm.addEventListener('submit', (e) => {

      e.preventDefault();

      const email =
        document.getElementById("loginEmail")
          .value
          .trim()
          .toLowerCase();

      const password =
        document.getElementById("loginPassword")
          .value
          .trim();

      if (!email || !password) {

        showError(
          loginForm,
          "Email and Password are required"
        );

        return;

      }

      const loginBtn =
        loginForm.querySelector(
          'button[type="submit"]'
        );

      setLoading(loginBtn, "Logging in...");

      try {

        const response =
          loginUser(email, password);

        clearLoading(loginBtn);

        if (response.status === "success") {

          showToast(
            response.message,
            "success"
          );

          setTimeout(() => {

            window.location.href =
              "dashboard.html";

          }, 1000);

        } else {

          showToast(
            response.message,
            "error"
          );

        }

      } catch (error) {

        clearLoading(loginBtn);

        console.error(error);

        showToast(
          "Login failed",
          "error"
        );

      }

    });

  }

  // ================= LOADING FUNCTIONS =================

  function setLoading(button, text = "Processing...") {

    if (!button) return;

    button.disabled = true;

    button.dataset.originalText =
      button.innerHTML;

    button.innerHTML = `
      <span class="spinner"></span>
      ${text}
    `;

  }

  function clearLoading(button) {

    if (!button) return;

    button.disabled = false;

    button.innerHTML =
      button.dataset.originalText;

  }

  // ================= SHOW ERROR =================

  function showError(form, message) {

    let errorDiv =
      form.querySelector('.form-error-global');

    if (!errorDiv) {

      errorDiv =
        document.createElement('div');

      errorDiv.className =
        'form-error-global';

      errorDiv.style.cssText = `
        background: rgba(239,68,68,.15);
        border: 1px solid red;
        border-radius: 10px;
        padding: 12px;
        margin-bottom: 15px;
        color: white;
        text-align: center;
      `;

      form.prepend(errorDiv);

    }

    errorDiv.textContent = message;

  }

  // ================= TOAST =================

  function showToast(message, type = "info") {

    const toast =
      document.createElement('div');

    toast.className =
      `toast ${type}`;

    toast.innerHTML = `
      <span>
        ${type === "success"
          ? "✓"
          : type === "error"
          ? "✕"
          : "ℹ"}
      </span>
      ${message}
    `;

    document.body.appendChild(toast);

    setTimeout(() => {

      toast.remove();

    }, 3000);

  }

  // ================= SAVE REGISTERED USER =================

  function saveRegisteredUser(userData) {

    let users =
      JSON.parse(
        localStorage.getItem("users")
      );

    // Ensure users is array

    if (!Array.isArray(users)) {

      users = [];

    }


    // Check existing email

    const existingUser =
      users.find(
        user =>
          user.email.trim().toLowerCase() ===
          userData.email.trim().toLowerCase()
      );


    if (existingUser) {

      return {

        status: "error",

        message:
          "Email already registered"

      };

    }

    // Save User

    users.push(userData);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    return {

      status: "success",

      message:
        "Account created successfully"

    };

  }

  // ================= LOGIN USER =================

  function loginUser(email, password) {

    let users =
      JSON.parse(
        localStorage.getItem("users")
      );

    // Ensure users is array

    if (!Array.isArray(users)) {

      users = [];

    }

    const foundUser =
      users.find(user =>

        user.email
          .trim()
          .toLowerCase() ===
        email.trim().toLowerCase()

        &&

        user.password === password

      );

    if (foundUser) {

      // Save Session

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(foundUser)
      );

      localStorage.setItem(
        "currentUser",
        foundUser.email
      );

      return {

        status: "success",

        message:
          "Login successful",

        user: foundUser

      };

    }

    return {

      status: "error",

      message:
        "Incorrect email or password"

    };

  }

  // ================= GET USER BY EMAIL =================
function getUserByEmail(email) {

  if (!email) {

    return {
      status: "error",
      message: "No email provided"
    };

  }

  let users =
    JSON.parse(
      localStorage.getItem("users")
    );

  if (!Array.isArray(users)) {

    users = [];

  }

  const foundUser =
    users.find(user =>

      user.email &&
      user.email.trim().toLowerCase() ===
      email.trim().toLowerCase()

    );

  if (foundUser) {

    return {

      status: "success",

      user: foundUser

    };

  }

  return {

    status: "error",

    message: "User not found"

  };

}

});