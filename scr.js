const emergencyChannel = new BroadcastChannel('emergency_link');
let peer;
let localStream;

// --- User Registration Logic ---
window.onload = () => {
    const savedName = localStorage.getItem('safetyName');
    const savedPhone = localStorage.getItem('safetyPhone');
    
    if (savedName && savedPhone) {
        updateUI(savedName, savedPhone);
    }
};

function registerUser() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;

    if (!name || !phone) {
        alert("Please fill in both fields!");
        return;
    }

    localStorage.setItem('safetyName', name);
    localStorage.setItem('safetyPhone', phone);
    
    updateUI(name, phone);
    alert("Profile Saved Successfully!");
}

function updateUI(name, phone) {
    document.getElementById('welcomeUser').innerText = `Welcome back, ${name}! System Armed.`;
    document.getElementById('contactDisplay').innerText = `Emergency Contact: ${phone}`;
    // Optionally hide registration card after success
    document.getElementById('regCard').style.opacity = "0.7";
}

// --- Emergency Functions ---
function scrollToSection() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

function accidentAlert() {
    const el = document.getElementById('accidentMsg');
    const userName = localStorage.getItem('safetyName') || "Unknown User";
    el.innerText = `🚨 ${userName}: Detection active...`;
    
    navigator.geolocation.getCurrentPosition((pos) => {
        el.innerHTML = `🚨 Alert Sent for ${userName}! <br> <small>Lat: ${pos.coords.latitude.toFixed(4)}</small>`;
    });
}

async function sosAlert() {
    const el = document.getElementById('sosMsg');
    const phone = localStorage.getItem('safetyPhone') || "9162327765";
    const userName = localStorage.getItem('safetyName') || "User";

    el.innerText = '🆘 Initializing Video...';

    try {
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        document.getElementById('videoContainer').style.display = 'block';
        document.getElementById('localVideo').srcObject = localStream;

        peer = new Peer();
        peer.on('open', (id) => {
            emergencyChannel.postMessage({
                type: 'SOS_TRIGGERED',
                peerId: id,
                victimName: userName,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                contact: phone 
            });
            el.innerText = `🆘 SOS Broadcasted to ${phone}.`;
        });

        peer.on('call', (call) => {
            call.answer(localStream);
            call.on('stream', (stream) => { document.getElementById('remoteVideo').srcObject = stream; });
        });
    } catch (err) {
        el.innerText = "❌ Camera/GPS Denied.";
    }
}

// Responder Logic (Receiver)
emergencyChannel.onmessage = (event) => {
    if (event.data.type === 'SOS_TRIGGERED') {
        const { peerId, lat, lon, contact, victimName } = event.data;
        const alertBox = document.getElementById('accidentMsg');
        alertBox.innerHTML = `
            <div style="background: #ff4b2b; color: white; padding: 10px; border-radius: 8px;">
                <strong>🚨 SOS: ${victimName}</strong><br>
                <span>Call: ${contact}</span><br>
                <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" style="color:yellow">📍 View Location</a>
            </div>`;

        if (!peer) peer = new Peer();
        const call = peer.call(peerId, null);
        call.on('stream', (stream) => {
            document.getElementById('videoContainer').style.display = 'block';
            document.getElementById('remoteVideo').srcObject = stream;
        });
    }
};

function endCall() { location.reload(); }