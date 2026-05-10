// 🔥 Check token on page load (VERY IMPORTANT)
// Only redirect if we're not already on home.html
window.addEventListener("load", function () {
  const token = localStorage.getItem("token");
  const currentPage = window.location.pathname;

  if (token && !currentPage.includes("home.html")) {
    window.location.href = "home.html";
  }
});

// ================= SIGNUP =================
document.getElementById("signupForm").addEventListener("submit", registerUser);

async function registerUser(event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("signupEmail").value.trim();
  let password = document.getElementById("signupPassword").value;

  if (name === "") {
    alert("Name is required!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email!");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters!");
    return;
  }

  try {
    const response = await fetch(
      "https://resumebackend-1-v08r.onrender.com/api/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      },
    );

    if (response.ok) {
      alert("Signup Successful!");
      document.getElementById("signupForm").reset();

      // 👉 Switch to login automatically
      showLogin();
    } else {
      const error = await response.json();
      alert("Signup failed: " + (error.message || "Error"));
    }
  } catch (error) {
    alert("Network error: " + error.message);
  }
}

// ================= TOGGLE =================
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const title = document.getElementById("formTitle");

function showSignup() {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
  title.innerText = "Sign Up";
}

function showLogin() {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  title.innerText = "Login";
}

// ================= LOGIN =================
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(
      "https://resumebackend-1-v08r.onrender.com/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    if (response.ok) {
      const data = await response.json();

      // ✅ Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", JSON.stringify(data.user));
      alert("Login Successful!");

      // 🔥 Reload page (then auto redirect will work)
      window.location.reload();
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    alert("Network error: " + error.message);
  }
});
async function updateResume() {
  const user = JSON.parse(localStorage.getItem("userName"));
  const resumeId = user?.id;

  const updatedData = {
    fullName: document.getElementById("name").innerText,
    email: document.getElementById("email").innerText,
    skills: ["HTML", "CSS"], // you can make dynamic later
  };

  try {
    const response = await fetch(
      `https://resumebackend-1-v08r.onrender.com/api/resume/${resumeId}`,
      {
        method: "PUT", // 🔥 IMPORTANT
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // if protected
        },
        body: JSON.stringify(updatedData),
      },
    );

    if (response.ok) {
      alert("Resume Updated Successfully!");
    } else {
      alert("Update failed");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}
