const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action')
const Id = document.getElementById('id')
const form = document.getElementById('form');
Inputmask('9.999999.999999').mask('#codigo_barra');
Inputmask("currency", {
    radixPoint: ',',
    inputtype: "text",
    prefix: 'R$ ',
    autoGroup: true,
    groupSeparator: '.',
    rightAlign: false,
    onBeforeMask: function (value) {
        return String(value).replace('.', ',');
    }
}).mask("#preco_venda, #preco_compra");

//  CARREGA DADOS DE EDIÇÃO (se existirem)
(async () => {
    const editData = await api.temp.get('product:edit');
    if (editData) {
        // Modo edição
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        // Preenche todos os campos pelo atributo name
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);

            if (!field) continue;

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else if (key === 'codigo_barra') {
                field.value = Inputmask.format(value || '', '9.999999.999999');
            } else if (key === 'preco_venda' || key === 'preco_compra') {
                field.value = Inputmask.format(value || '', {
                    radixPoint: ',',
                    inputtype: "text",
                    prefix: 'R$ ',
                    autoGroup: true,
                    groupSeparator: '.',
                    rightAlign: false,
                    onBeforeMask: function (val) {
                        return String(val).replace('.', ',');
                    }
                });
            } else {
                field.value = value || '';
            }
        }
    } else {
        // Modo cadastro novo
        Action.value = 'c';
        Id.value = '';
    }
})();

InsertButton.addEventListener('click', async () => {
    let timer = 3000;
    $('#insert').prop('disabled', true);
    const data = formToJson(form);
    // Se NÃO é cadastro novo, pega o ID para update
    let id = Action.value !== 'c' ? Id.value : null;
    try {

        const response = Action.value === 'c'
            ? await api.product.insert(data)
            : await api.product.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }
        toast('success', 'Sucesso', response.msg, timer);
        form.reset();
        // Fecha a janela modal após 1.5s (tempo do toast)
        setTimeout(() => {
            api.window.close();
        }, timer);

    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});