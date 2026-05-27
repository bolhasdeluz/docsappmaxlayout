import { db, G } from './config.js';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Funções de Cálculo
function supStatus(item) {
    if (item.qtd !== undefined) {
        const min = item.min ?? 1;
        if (item.qtd <= 0) return 'urgente';
        if (item.qtd < min) return 'baixo';
        return 'ok';
    }
    return item.tem ? 'ok' : 'urgente';
}

function getTradutorQtd(item) {
    return item.qtd !== undefined ? item.qtd : (item.tem ? (item.min ?? 1) : 0);
}

// Renderização
export function initSuprimentos() {
    onSnapshot(query(collection(db, 'estoque'), orderBy('criadoEm', 'asc')), (snap) => {
        const estoque = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderSuprimentos(estoque);
    });
}

function renderSuprimentos(estoque) {
    const el = document.getElementById('sup-precisamos');
    if (!el) return;
    
    // Filtro simples por urgência para testar a conexão
    const urgente = estoque.filter(i => supStatus(i) === 'urgente');
    let html = '';
    
    if (urgente.length > 0) {
        html += `<div class="sec-hd"><span class="sec-dot" style="background:var(--red)"></span><span class="sec-lbl">Sem estoque</span></div>`;
        urgente.forEach(i => {
            html += `<div class="sup-item urgente"><div class="sup-top"><span style="font-size:18px">❌</span><div class="sup-nome">${i.nome}</div></div></div>`;
        });
    } else {
        html = '<div class="empty">Tudo em ordem!</div>';
    }
    el.innerHTML = html;
}

// Funções para o HTML
G.ajustarQtd = async function(id, delta) {
    // Lógica para clicar no + ou -
};

G.addSupItem = async function() {
    // Lógica para adicionar novo item
};

initSuprimentos();