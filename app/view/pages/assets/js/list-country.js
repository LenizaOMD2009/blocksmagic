import { Datatables } from "../components/Datatables.js";

api.country.onReload(() => {
    $('#table-country').DataTable().ajax.reload(null, false);
});

// Inicializa a tabela
Datatables.SetTable('#table-country', [
    { data: 'id' },
    { data: 'codigo' },
    { data: 'nome' },
    { data: 'localizacao' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editCountry(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteCountry(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.country.find(filter));

async function deleteCountry(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.country.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-country').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editCountry(id) {
    try {
        // 1. Busca os dados completos do país
        const country = await api.country.findById(id);
        if (!country) {
            toast('error', 'Erro', 'País não encontrado.');
            return;
        }
        // 2. Salva no temp store com a ação 'e' (editar)
        await api.temp.set('country:edit', {
            action: 'e',
            ...country,
        });
        // 3. Abre a modal
        api.window.openModal('pages/country', {
            width: 600,
            height: 500,
            title: 'Editar País',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

window.deleteCountry = deleteCountry;
window.editCountry = editCountry;
