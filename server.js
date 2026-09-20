const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const LIMIT = 2;

app.use(express.json());

const users = {};
const requests = [];

function today() {
  return new Date().toISOString().slice(0, 10);
}

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Request APK by Rasya</title>
<style>
*{box-sizing:border-box;font-family:Arial}
body{margin:0;min-height:100vh;background:#07101f;color:white;display:flex;justify-content:center;align-items:center;padding:20px}
.card{width:100%;max-width:480px;background:#101a2e;padding:25px;border-radius:22px}
h1{margin-top:0}
p{color:#aeb9ca}
label{display:block;margin-top:16px;margin-bottom:7px;font-weight:bold}
input,textarea{width:100%;padding:14px;border-radius:12px;border:1px solid #34445f;background:#07101f;color:white}
textarea{height:100px}
button,a{width:100%;display:block;margin-top:16px;padding:14px;border:0;border-radius:12px;text-align:center;font-weight:bold;text-decoration:none}
button{background:#2563eb;color:white}
.cs{background:#16a34a;color:white}
.channel{background:#7c3aed;color:white}
.limit{background:#07101f;padding:13px;border-radius:12px;margin:15px 0}
#msg{display:none;margin-top:15px;padding:12px;border-radius:10px}
</style>
</head>

<body>
<div class="card">

<h1>📱 Request APK by Rasya</h1>
<p>Request aplikasi yang kamu inginkan.</p>

<div class="limit">
📊 Request hari ini:
<b><span id="jumlah">0</span>/2</b>
</div>

<form id="form">

<label>Nama</label>
<input id="nama" placeholder="Isi nama kamu" required>

<label>Aplikasi yang mau di request</label>
<input id="aplikasi" placeholder="Isi nama aplikasinya" required>

<label>Catatan tambahan</label>
<textarea id="catatan" placeholder="Fitur atau keterangan tambahan"></textarea>

<button type="submit">🚀 Kirim Request</button>

</form>

<div id="msg"></div>

<a class="cs"
href="https://wa.me/6283191831232?text=Halo%20CS%2C%20saya%20ingin%20upgrade%20batas%20request."
target="_blank">
💬 Customer Service
</a>

<a class="channel"
href="https://whatsapp.com/channel/0029VbD8IWo4NVil4QfzMZ3U"
target="_blank">
📢 Saluran Info APK
</a>

</div>

<script>
let jumlah = Number(localStorage.getItem("jumlahRequest") || 0);
let tanggal = localStorage.getItem("tanggalRequest");
let hariIni = new Date().toISOString().slice(0,10);

if(tanggal !== hariIni){
  jumlah = 0;
  localStorage.setItem("jumlahRequest",0);
  localStorage.setItem("tanggalRequest",hariIni);
}

document.getElementById("jumlah").textContent = jumlah;

document.getElementById("form").addEventListener("submit", async function(e){
  e.preventDefault();

  if(jumlah >= 2){
    const msg=document.getElementById("msg");
    msg.style.display="block";
    msg.style.background="#501c25";
    msg.textContent="Batas 2 request hari ini sudah tercapai. Hubungi Customer Service untuk upgrade.";
    return;
  }

  const nama=document.getElementById("nama").value;
  const aplikasi=document.getElementById("aplikasi").value;
  const catatan=document.getElementById("catatan").value;

  const data={
    nama,
    aplikasi,
    catatan
  };

  const response=await fetch("/request",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data)
  });

  if(response.ok){

    jumlah++;

    localStorage.setItem("jumlahRequest",jumlah);
    localStorage.setItem("tanggalRequest",hariIni);

    document.getElementById("jumlah").textContent=jumlah;

    const pesan=
`REQUEST APK BARU

Nama: ${nama}
Aplikasi: ${aplikasi}
Catatan: ${catatan || "-"}

Request ke-${jumlah}/2`;

    document.getElementById("msg").style.display="block";
    document.getElementById("msg").style.background="#123b26";
    document.getElementById("msg").textContent="Request berhasil! Membuka WhatsApp...";

    window.open(
      "https://wa.me/6283191831232?text="+encodeURIComponent(pesan),
      "_blank"
    );

    document.getElementById("form").reset();
  }
});
</script>

</body>
</html>
`);
});

app.post("/request", (req,res) => {

  const nama = String(req.body.nama || "").trim();
  const aplikasi = String(req.body.aplikasi || "").trim();
  const catatan = String(req.body.catatan || "").trim();

  if(!nama || !aplikasi){
    return res.status(400).send("Data belum lengkap");
  }

  requests.push({
    nama,
    aplikasi,
    catatan,
    waktu:new Date().toISOString()
  });

  console.log("REQUEST BARU:", {
    nama,
    aplikasi,
    catatan
  });

  res.json({success:true});
});

app.listen(PORT, () => {
  console.log("Web Request APK berjalan di port " + PORT);
});
