import { Datatables } from "../components/Datatables.js";

api.federative_unit.onReload(() => {
    $('#table-federative_unit').DataTable().ajax.reload(null, false);
});

// Inicializa a tabela
Datatables.SetTable('#table-federative_unit', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'sigla' },
    { data: 'codigo' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editFederativeUnit(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteFederativeUnit(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.federative_unit.find(filter));

async function deleteFederativeUnit(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.federative_unit.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-federative_unit').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editFederativeUnit(id) {
    try {
        // 1. Busca os dados completos da unidade federativa
        const federative_unit = await api.federative_unit.findById(id);
        if (!federative_unit) {
            toast('error', 'Erro', 'Unidade federativa não encontrada.');
            return;
        }
        // 2. Salva no temp store com a ação 'e' (editar)
        await api.temp.set('federative_unit:edit', {
            action: 'e',
            ...federative_unit,
        });
        // 3. Abre a modal
        api.window.openModal('pages/federative_unit', {
            width: 600,
            height: 500,
            title: 'Editar Unidade Federativa',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

window.deleteFederativeUnit = deleteFederativeUnit;
window.editFederativeUnit = editFederativeUnit;
