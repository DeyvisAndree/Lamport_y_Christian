const appState = { rtt: 200, offset: -4500000, isSynced: false, eventId: 1 };

function updateRTT(val) { appState.rtt = parseInt(val); document.getElementById('rttVal').innerText = val; }

function formatTime(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    const us = String(Math.floor(Math.random() * 999)).padStart(3, '0');
    return `${h}:${m}:${s}.${ms}${us}`;
}

function registrarResultado(estado, ajuste) {
    const tbody = document.querySelector("#resultsTable tbody");
    const row = tbody.insertRow(0);
    row.innerHTML = `<td>#${appState.eventId++}</td><td>${new Date().toLocaleTimeString()}</td><td>${appState.rtt} ms</td><td>${ajuste}</td><td style="color:${appState.isSynced ? '#10b981' : '#b91c1c'}">● ${estado}</td>`;
}

function actualizarRelojes() {
    const ahora = new Date();
    document.getElementById('timerServ').innerText = formatTime(ahora);
    document.getElementById('timerLocal').innerText = formatTime(new Date(ahora.getTime() + (appState.offset / 1000)));
}

function sincronizar() {
    appState.offset = (appState.rtt / 2) * 1000;
    appState.isSynced = true;
    document.getElementById('statusTag').innerText = "SINCRONIZADO";
    document.getElementById('statusTag').style.background = "#d1fae5";
    document.getElementById('statusTag').style.color = "#065f46";
    registrarResultado("SYNC_SUCCESS", `+${(appState.rtt/2).toFixed(2)} ms`);
}

function reiniciar() {
    appState.offset = -4500000;
    appState.isSynced = false;
    document.getElementById('statusTag').innerText = "DESINCRONIZADO";
    document.getElementById('statusTag').style.background = "#fee2e2";
    document.getElementById('statusTag').style.color = "#b91c1c";
    registrarResultado("RESET_SYSTEM", "0.00 ms");
}

setInterval(actualizarRelojes, 50);