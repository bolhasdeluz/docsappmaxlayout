import { db, G } from './config.js';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const STATUS_CFG = {
    futura: { label: 'Futura', dot: '#c8a000', border: '#c8a000', btnAction: 'andamento', btnText: '▶️ Iniciar' },
    andamento: { label: 'Em andamento', dot: '#c4396b', border: '#c4396b', btnAction: 'concluida', btnText: '✅ Concluir' },
    concluida: { label: 'Concluída', dot: '#3a9a78', border: '#3a9a78', btnAction: 'futura', btnText: '↩️ Retornar' },
};

export function initManutencao() {
    onSnapshot(query(collection(db, 'manutencao'), orderBy('criadoEm', 'desc')), (snap) => {
        const manutData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderManut(manutData);
    });
}

function renderManut(manutList) {
    const el = document.getElementById('manut-content');
    if (!el) return;
    const groups = { andamento: [], futura: [], concluida: [] };
    manutList.forEach(t => { if (groups[t.status]) groups[t.status].push(t); });
    
    let html = '';
    ['andamento', 'futura', 'concluida'].forEach(status => {
        const cfg = STATUS_CFG[status];
        const items = groups[status];
        html += `<div class="section"><div class="sec-hd"><span class="sec-dot" style="background:${cfg.dot}"></span><span class="sec-lbl">${cfg.label}</span><span class="sec-cnt">${items.length}</span></div>`;
        if (!items.length) html += '<div class="empty">Nenhuma tarefa</div>';
        
        items.forEach(t => {
            html += `<div class="card" style="border-left:3px solid ${cfg.border}"><div class="card-row">
            <div class="card-left"><span class="card-emoji">${(t.emoji || '🔧')}</span><div>
            <div class="card-title">${t.titulo}</div>
            ${t.desc ? `<div class="card-desc">${t.desc}</div>` : ''}
            </div></div>
            <div class="card-acts">
            <button class="btn-vou" style="font-size:10px;padding:4px 8px;border:none" onclick="cycleStatus('${t.id}','${cfg.btnAction}')">${cfg.btnText}</button>
            <button class="bic bic-e" onclick="openEditManut('${t.id}')">✏️</button>
            <button class="bic bic-d" onclick="delManut('${t.id}')">🗑️</button>
            </div></div></div>`;
        });
        html += `</div>`;
    });
    el.innerHTML = html;
}

// Funções anexadas ao Window para o HTML encontrar
G.cycleStatus = async function(id, nextStatus) {
    try { await updateDoc(doc(db, 'manutencao', id), { status: nextStatus }); } catch (e) { console.error(e); }
};

G.addManutTask = async function() {
    const titulo = document.getElementById('manut-new-titulo').value.trim();
    if (!titulo) return;
    await addDoc(collection(db, 'manutencao'), { 
        titulo, 
        emoji: document.getElementById('manut-new-emoji').value.trim() || '🔧', 
        desc: document.getElementById('manut-new-desc').value.trim(), 
        status: document.getElementById('manut-new-status').value, 
        criadoEm: serverTimestamp() 
    });
    document.getElementById('manut-new-titulo').value = '';
    document.getElementById('manut-add-box').style.display = 'none';
    document.getElementById('manut-add-btn').style.display = 'block';
};

G.delManut = async function(id) { await deleteDoc(doc(db, 'manutencao', id)); };

initManutencao();