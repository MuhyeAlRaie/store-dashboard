const LOGIN_API = "https://script.google.com/macros/s/AKfycbyjhVoFuBThqJlBensobrcyh8hFIEGO44l_wb8MCFH1xsEJf2DnD3UMtSblUxosBi5gKg/exec"; // ← غيّر إلى رابطك

  function verifyLogin() {
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    fetch(LOGIN_API, {
      method: "POST",
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("dashboard-auth", "true");
        showDashboard();
      } else {
        document.getElementById("loginError").textContent = "❌ بيانات الدخول غير صحيحة";
      }
    })
    .catch(() => {
      document.getElementById("loginError").textContent = "⚠️ خطأ في الاتصال بالسيرفر";
    });
  }

  function showDashboard() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("dashboardContent").style.display = "block";
  }

  window.onload = () => {
    if (localStorage.getItem("dashboard-auth") === "true") {
      showDashboard();
    }
  };


    function logout() {
    localStorage.removeItem("dashboard-auth");
    location.reload();
  }