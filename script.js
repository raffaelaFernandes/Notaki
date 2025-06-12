const form = document.getElementById("noteForm");
const noteContentInput = document.getElementById("noteContent");
const noteContainer = document.getElementById("noteContainer");
const modal = document.getElementById("addNoteModal");

document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;

    if (path.includes("index.html") || path === "/" || path === "/index") {
        document.getElementById("nav-notas")?.classList.add("ativo");
        renderizarNotas();
    } else if (path.includes("marcadores")) {
        document.getElementById("nav-marcadores")?.classList.add("ativo");
        // Implementar depois se precisar
    } else if (path.includes("lixeira")) {
        document.getElementById("nav-lixeira")?.classList.add("ativo");
        renderizarLixeira();
    }

    atualizarEstadoVazio();

    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("hidden");
        });
    }

    const addButton = document.getElementById("addNota");
    const closeButton = document.getElementById("closeModal");

    if (addButton && modal && closeButton) {
        addButton.addEventListener("click", () => {
            modal.classList.add("active");
        });

        closeButton.addEventListener("click", () => {
            modal.classList.remove("active");
        });

        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    }

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const conteudo = noteContentInput.value.trim();
            const tagSelecionada = document.querySelector('input[name="noteTag"]:checked')?.value;
            if (!conteudo || !tagSelecionada) return;

            const novaNota = {
                id: Date.now().toString(),
                conteudo: conteudo,
                tag: tagSelecionada,
                data: new Date().toLocaleDateString()
            };

            const notas = carregarNotas();
            notas.push(novaNota);
            salvarNotas(notas);

            form.reset();
            modal.classList.remove("active");
            renderizarNotas();
            atualizarEstadoVazio();
        });
    }

    const filtroSelect = document.getElementById('filtroSelect');
    if (filtroSelect) {
        filtroSelect.addEventListener('change', function () {
            const filtro = this.value;
            const notas = document.querySelectorAll('.note-card');

            notas.forEach(nota => {
                const tag = nota.getAttribute('data-tag');
                nota.style.display = (filtro === 'todas' || tag === filtro) ? 'flex' : 'none';
            });

            atualizarEstadoVazio();
        });
    }

    const inputPesquisa = document.getElementById("inputPesquisa");
    if (inputPesquisa) {
        inputPesquisa.addEventListener("input", function () {
            const termo = this.value.toLowerCase();
            const notas = document.querySelectorAll(".note-card");

            notas.forEach(nota => {
                const conteudo = nota.querySelector(".note-text").textContent.toLowerCase();
                nota.style.display = conteudo.includes(termo) ? "flex" : "none";
            });

            atualizarEstadoVazio();
        });
    }
});

function salvarNotas(notas) {
    localStorage.setItem('notas', JSON.stringify(notas));
}

function carregarNotas() {
    const notas = localStorage.getItem('notas');
    return notas ? JSON.parse(notas) : [];
}

function renderizarNotas() {
    const notas = carregarNotas();
    if (!noteContainer) return;
    noteContainer.innerHTML = "";

    notas.forEach(nota => {
        const notaHTML = `
        <div class="note-card" data-tag="${nota.tag}">
            <div class="note-content">
                <div class="note-header">
                    <h3 class="note-title">${nota.conteudo.slice(0, 20)}...</h3>
                    <div class="note-actions">
                        <button class="delete-btn" onclick="deletarNota('${nota.id}')"><i class="ph ph-trash"></i></button>
                    </div>
                </div>
                <p class="note-text">${nota.conteudo}</p>
                <div class="note-footer">
                    <span class="note-tag tag-${nota.tag}">
                        <i class="ph ph-tag"></i> ${nota.tag}
                    </span>
                    <span class="note-date">${nota.data}</span>
                </div>
            </div>
        </div>
        `;
        noteContainer.insertAdjacentHTML("beforeend", notaHTML);
    });
}

function deletarNota(id) {
    const confirmar = confirm("Tem certeza que deseja mover esta nota para a lixeira?");
    if (!confirmar) return;

    let notas = carregarNotas();
    const notaRemovida = notas.find(n => n.id === id);
    notas = notas.filter(n => n.id !== id);
    salvarNotas(notas);

    let lixeira = carregarLixeira();
    lixeira.push(notaRemovida);
    salvarLixeira(lixeira);

    renderizarNotas();
    atualizarEstadoVazio();
}

function carregarLixeira() {
    const lixo = localStorage.getItem('notasLixeira');
    return lixo ? JSON.parse(lixo) : [];
}

function salvarLixeira(notasLixo) {
    localStorage.setItem('notasLixeira', JSON.stringify(notasLixo));
}

function renderizarLixeira() {
    const container = document.getElementById("lixeiraContainer");
    if (!container) return;

    const lixeira = carregarLixeira();
    container.innerHTML = "";

    lixeira.forEach(nota => {
        const notaHTML = `
        <div class="note-card">
            <div class="note-content">
                <div class="note-header">
                    <h3 class="note-title">${nota.conteudo.slice(0, 20)}...</h3>
                    <div class="note-actions">
                        <button class="delete-btn" onclick="apagarPermanentemente('${nota.id}')">
                            <i class="ph ph-x-circle"></i>
                        </button>
                    </div>
                </div>
                <p class="note-text">${nota.conteudo}</p>
                <div class="note-footer">
                    <span class="note-tag tag-${nota.tag}">
                        <i class="ph ph-tag"></i> ${nota.tag}
                    </span>
                    <span class="note-date">${nota.data}</span>
                </div>
            </div>
        </div>
        `;
        container.insertAdjacentHTML("beforeend", notaHTML);
    });

    atualizarEstadoVazio();
}

function apagarPermanentemente(id) {
    const confirmar = confirm("Deseja apagar esta nota permanentemente?");
    if (!confirmar) return;

    let lixeira = carregarLixeira();
    lixeira = lixeira.filter(n => n.id !== id);
    salvarLixeira(lixeira);
    renderizarLixeira();
}

function atualizarEstadoVazio() {
    const emptyState = document.getElementById("emptyState");
    if (!emptyState) return;

    const cards = document.querySelectorAll(".note-card");

    emptyState.style.display = cards.length === 0 ? "block" : "none";
}



document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("marcadores.html")) {
    renderizarMarcadores();
  }
});

function renderizarMarcadores() {
  const container = document.getElementById("marcadoresContainer");
  const notas = carregarNotas();
  const tagsAgrupadas = {};

  // Agrupa notas por tag
  notas.forEach(nota => {
    if (!tagsAgrupadas[nota.tag]) {
      tagsAgrupadas[nota.tag] = [];
    }
    tagsAgrupadas[nota.tag].push(nota);
  });

  container.innerHTML = "";

  Object.keys(tagsAgrupadas).forEach(tag => {
    const grupoHTML = document.createElement("div");
    grupoHTML.classList.add("tag-group");

    const titulo = document.createElement("h2");
    titulo.textContent = `${tag} (${tagsAgrupadas[tag].length})`;
    titulo.classList.add("tag-title");

    const lista = document.createElement("div");
    lista.classList.add("tag-notes");

    // Alterna visibilidade
    titulo.addEventListener("click", () => {
      lista.classList.toggle("hidden");
    });

    tagsAgrupadas[tag].forEach(nota => {
      const notaHTML = `
        <div class="note-card tag-${nota.tag}">
          <div class="note-content">
            <div class="note-header">
              <h3 class="note-title">${nota.conteudo.slice(0, 20)}...</h3>
            </div>
            <p class="note-text">${nota.conteudo}</p>
            <div class="note-footer">
              <span class="note-tag tag-${nota.tag}">
                <i class="ph ph-tag"></i> ${nota.tag}
              </span>
              <span class="note-date">${nota.data}</span>
            </div>
          </div>
        </div>
      `;
      lista.insertAdjacentHTML("beforeend", notaHTML);
    });

    grupoHTML.appendChild(titulo);
    grupoHTML.appendChild(lista);
    container.appendChild(grupoHTML);
  });
}