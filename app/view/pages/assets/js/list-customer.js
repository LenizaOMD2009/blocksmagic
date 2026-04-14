import { Datatables } from "../components/Datatables.js";
api.customer.onReload(() => {
    $('#table-customers').DataTable().ajax.reload(null, false);
});
// Inicializa a tabela
Datatables.SetTable('#table-customers', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'cpf' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="printCustomer(${row.id})" class="btn btn-xs btn-info btn-sm">
                    <i class="fa-solid fa-print"></i> Imprimir
                </button>
                <button onclick="editCustomer(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteCustomer(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.customer.find(filter));
async function deleteCustomer(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.customer.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-customers').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}
async function editCustomer(id) {
}
async function printCustomer(id) {
    try {
        // Agora chamamos o caminho correto que você liberou no preload
        const response = await api.customer.print(id);

        if (response.status) {
            toast('success', 'Sucesso', 'O PDF do cliente foi gerado!');
        } else {
            toast('error', 'Erro', response.msg);
        }
    } catch (err) {
        toast('error', 'Falha', 'Erro ao processar impressão: ' + err.message);
    }
}



window.deleteCustomer = deleteCustomer;
window.editCustomer = editCustomer;
window.printCustomer = printCustomer;