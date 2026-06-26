let contadorTiques = 0;
let enCS = null;
let procesos = [
    {id: 0, status: 'IDLE', tique: null},
    {id: 1, status: 'IDLE', tique: null},
    {id: 2, status: 'IDLE', tique: null}
];

function actualizarUI() {
    const container = document.getElementById('cards-container');
    container.innerHTML = procesos.map(p => `
        <div class="card ${p.status === 'CRITICAL' ? 'critical' : ''}">
            <h4 style="margin:0; color: #1e293b;">PROCESO P${p.id}</h4>
            <p style="font-size: 0.85rem; color: #64748b;">Estado: ${p.status} | Tique: ${p.tique || '—'}</p>
            <button class="btn btn-pedir" ${p.status !== 'IDLE' ? 'disabled' : ''} onclick="pedir(${p.id})">Solicitar</button>
            <button class="btn btn-entrar" ${p.status !== 'WAITING' ? 'disabled' : ''} onclick="entrar(${p.id})">Entrar CS</button>
            <button class="btn btn-salir" ${p.status !== 'CRITICAL' ? 'disabled' : ''} onclick="salir(${p.id})">Liberar CS</button>
        </div>
    `).join('');
}

function pedir(id) { 
    contadorTiques++; procesos[id].tique = contadorTiques; procesos[id].status = 'WAITING'; 
    agregarLog(`P${id} obtuvo tique #${contadorTiques}`); actualizarUI(); 
}

function entrar(id) {
    if (enCS !== null) return agregarLog(`Error: P${id} bloqueado.`);
    let minTique = Math.min(...procesos.filter(p => p.tique !== null).map(p => p.tique));
    if (procesos[id].tique === minTique) {
        enCS = id; procesos[id].status = 'CRITICAL';
        document.getElementById('cs-box').className = 'cs-box active';
        document.getElementById('cs-box').innerText = `⚡ P${id} EN EJECUCIÓN (Tique #${procesos[id].tique})`;
        agregarLog(`P${id} entró a la Sección Crítica.`);
    } else { agregarLog(`Error: P${id} debe esperar turno.`); }
    actualizarUI();
}

function salir(id) {
    enCS = null; procesos[id].status = 'IDLE'; procesos[id].tique = null;
    document.getElementById('cs-box').className = 'cs-box';
    document.getElementById('cs-box').innerText = 'SISTEMA EN ESPERA';
    agregarLog(`P${id} liberó el recurso.`);
    actualizarUI();
}

function agregarLog(msg) {
    const log = document.getElementById('log-box');
    log.innerHTML += `<div style="padding: 3px 0; border-bottom: 1px solid #1e293b;">[${new Date().toLocaleTimeString()}] ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

actualizarUI();