const firebaseConfig = {
  apiKey: "AIzaSyApZH0la4dyXRJ1rSJVBlusIrLhmAIehLk",
  authDomain: "dream-land-e55e0.firebaseapp.com",
  databaseURL: "https://dream-land-e55e0-default-rtdb.firebaseio.com",
  projectId: "dream-land-e55e0",
  storageBucket: "dream-land-e55e0.appspot.com",
  messagingSenderId: "544133561119",
  appId: "1:544133561119:web:2a30b38a7b1d9f93cfce2a"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const $ = (id) => document.getElementById(id);
const show = (id) => $(id).classList.remove("hidden");
const hide = (id) => $(id).classList.add("hidden");

$("goLogin").onclick = () => { hide("welcome"); show("login"); };
$("backHome1").onclick = () => { hide("login"); show("welcome"); };
$("backHome2").onclick = () => { hide("result"); show("welcome"); };

$("togglePass").onclick = () => {
  const p = $("pass");
  p.type = (p.type === "password") ? "text" : "password";
};

function renderRow(row) {
  $("v_code").textContent = row["1_ CODE"] ?? "";
  $("v_name").textContent = row["2_ NAME"] ?? "";
  $("v_nid").textContent = row["3_ NID NO"] ?? "";
  $("v_phone").textContent = row["4_ PHONE"] ?? "";
  $("v_inst").textContent = row["5_ INSTALMENT"] ?? "";
  $("v_pay").textContent = row["6_TOTAL PAY"] ?? "";
}

function say(t, ok = false) {
  $("msg").textContent = t;
  $("msg").className = "msg " + (ok ? "ok" : "err");
}

async function doLogin() {
  say("");
  const code = $("code").value.trim();
  const pass = $("pass").value.trim();
  if (!code || !pass) { say("CODE এবং PASS লিখুন"); return; }
  $("loginBtn").disabled = true;
  try {
    const snap = await db.ref("friends/" + code).once("value");
    if (!snap.exists()) { say("ভুল ID ❌"); return; }
    const row = snap.val();
    const dbPass = String(row["7_ PASS"] ?? "").trim();
    if (dbPass === pass) {
      say("লগইন সফল ✅", true);
      renderRow(row);
      hide("login"); show("result");
    } else { say("ভুল পাসওয়ার্ড ❌"); }
  } catch (err) {
    console.error(err); say("Firebase Error: " + (err.message || err));
  } finally { $("loginBtn").disabled = false; }
}

$("loginBtn").onclick = doLogin;
$("logout").onclick = () => { hide("result"); show("login"); };

// PDF Download
$("download").onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.text("Dream Land Society", 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text("CODE: " + $("v_code").textContent, 20, 40);
  doc.text("NAME: " + $("v_name").textContent, 20, 50);
  doc.text("NID: " + $("v_nid").textContent, 20, 60);
  doc.text("Phone: " + $("v_phone").textContent, 20, 70);
  doc.text("Installment: " + $("v_inst").textContent, 20, 80);
  doc.text("Total Pay: " + $("v_pay").textContent, 20, 90);
  doc.save("card.pdf");
};
