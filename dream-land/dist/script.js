// Firebase config (আপনারটাই)
const firebaseConfig = {
  apiKey: "AIzaSyApZH0la4dyXRJ1rSJVBlusIrLhmAIehLk",
  authDomain: "dream-land-e55e0.firebaseapp.com",
  databaseURL: "https://dream-land-e55e0-default-rtdb.firebaseio.com",
  projectId: "dream-land-e55e0",
  storageBucket: "dream-land-e55e0.firebasestorage.app",
  messagingSenderId: "544133561119",
  appId: "1:544133561119:web:2a30b38a7b1d9f93cfce2a"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Helpers
const $ = (id) => document.getElementById(id);
const show = (id) => $(id).classList.remove("hidden");
const hide = (id) => $(id).classList.add("hidden");

// Nav
$("goLogin").onclick = () => {
  hide("welcome");
  hide("committees");
  show("login");
};
$("goCommittees").onclick = () => {
  hide("welcome");
  hide("login");
  show("committees");
};
$("backHome1").onclick = () => {
  hide("login");
  show("welcome");
};
$("backHome2").onclick = () => {
  hide("result");
  show("welcome");
};
$("backHome3").onclick = () => {
  hide("committees");
  show("welcome");
};

// Eye toggle
$("togglePass").onclick = () => {
  const p = $("pass");
  if (p.type === "password") {
    p.type = "text";
    $("togglePass").textContent = "🙈";
  } else {
    p.type = "password";
    $("togglePass").textContent = "👁";
  }
};

// Render result
function renderRow(row) {
  $("v_code").textContent = row["1_ CODE"] ?? "";
  $("v_name").textContent = row["2_ NAME"] ?? "";
  $("v_nid").textContent = row["3_ NID NO"] ?? "";
  $("v_phone").textContent = row["4_ PHONE"] ?? "";
  $("v_inst").textContent = row["5_ INSTALMENT"] ?? "";
  $("v_pay").textContent = row["6_TOTAL PAY"] ?? "";
}

// Message helper
function say(t, ok = false) {
  $("msg").textContent = t;
  $("msg").className = "msg " + (ok ? "ok" : "err");
}

// Login
async function doLogin() {
  say("");
  hide("result");
  const code = $("code").value.trim();
  const pass = $("pass").value.trim();
  if (!code || !pass) {
    say("CODE এবং PASS লিখুন");
    return;
  }

  $("loginBtn").disabled = true;
  try {
    const snap = await db.ref("friends/" + code).once("value");
    if (!snap.exists()) {
      say("ভুল ID ❌");
      return;
    }
    const row = snap.val();
    const dbPass = String(row["7_ PASS"] ?? "").trim();

    if (dbPass === pass) {
      say("লগইন সফল ✅", true);
      renderRow(row);
      hide("login");
      show("result");
    } else {
      say("ভুল পাসওয়ার্ড ❌");
    }
  } catch (err) {
    console.error(err);
    say("Firebase Error: " + (err.message || err));
  } finally {
    $("loginBtn").disabled = false;
  }
}
$("loginBtn").onclick = doLogin;
$("pass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});
$("code").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});
$("logout").onclick = () => {
  hide("result");
  show("login");
};