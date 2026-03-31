import { Datatables } from "../components/Datatables.js";

api.contact.onReload(() => {
    $('#table-contact').DataTable().ajax.reload(null, false);
});

// Inicializa a tabela
Datatables.SetTable('#table-contact', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'email' },
    { data: 'telefone' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editContact(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteContact(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.contact.find(filter));

async function deleteContact(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.contact.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-contact').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editContact(id) {
    try {
        // 1. Busca os dados completos do contato
        const contact = await api.contact.findById(id);
        if (!contact) {
            toast('error', 'Erro', 'Contato não encontrado.');
            return;
        }
        // 2. Salva no temp store com a ação 'e' (editar)
        await api.temp.set('contact:edit', {
            action: 'e',
            ...contact,
        });
        // 3. Abre a modal
        api.window.openModal('pages/contact', {
            width: 600,
            height: 500,
            title: 'Editar Contato',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

window.deleteContact = deleteContact;
window.editContact = editContact;
