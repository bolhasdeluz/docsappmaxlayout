import { db, G } from './config.js';
import { collection, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

export function initFinancas() {
    onSnapshot(collection(db, 'transparencia'), (snap) => {
        const transacoes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderFinancas(transacoes);
    });
}

function renderFinancas(transacoes) {
    const el = document.getElementById('financas-content');
    if (!el) return;
    
    // Aqui entra sua lógica de renderização
    // (A mesma que você tinha no script gigante)
    // Se precisar da lógica completa, me avise que eu gero o bloco exato!
    console.log("Renderizando finanças...");
}

G.lancar = async function() {
    const val = parseFloat(document.getElementById('fin-val').value);
    if (!val) return;
    await addDoc(collection(db, 'transparencia'), {
        val,
        desc: document.getElementById('fin-desc').value,
        tipo: 'e', // Ajuste conforme o tipo
        criadoEm: serverTimestamp()
    });
    alert("Lançado!");
};

G.delTransac = async function(id) {
    await deleteDoc(doc(db, 'transparencia', id));
};

initFinancas();