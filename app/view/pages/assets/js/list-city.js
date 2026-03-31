import { Datatables } from "../components/Datatables.js";

api.city.onReload(() => {
    $('#table-city').DataTable().ajax.reload(null, false);
});

// Inicializa a tabela
Datatables.SetTable('#table-city', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'codigo' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editCity(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteCity(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.city.find(filter));

async function deleteCity(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.city.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-city').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editCity(id) {
    try {
        // 1. Busca os dados completos da cidade
        const city = await api.city.findById(id);
        if (!city) {
            toast('error', 'Erro', 'Cidade não encontrada.');
            return;
        }
        // 2. Salva no temp store com a ação 'e' (editar)
        await api.temp.set('city:edit', {
            action: 'e',
            ...city,
        });
        // 3. Abre a modal
        api.window.openModal('pages/city', {
            width: 600,
            height: 500,
            title: 'Editar Cidade',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

window.deleteCity = deleteCity;
window.editCity = editCity;
