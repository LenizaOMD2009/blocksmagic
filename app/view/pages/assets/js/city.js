const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action')
const Id = document.getElementById('id')
const form = document.getElementById('form');

// CARREGA AS UNIDADES FEDERATIVAS NO SELECT
(async () => {
    try {
        const result = await api.federative_unit.find({ limit: 9999 });
        const select = document.getElementById('id_uf');
        
        result.data.forEach(federative_unit => {
            const option = document.createElement('option');
            option.value = federative_unit.id;
            option.textContent = federative_unit.nome;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao carregar unidades federativas:', err);
    }
})();

//  CARREGA DADOS DE EDIÇÃO (se existirem)
(async () => {
    const editData = await api.temp.get('city:edit');
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
            ? await api.city.insert(data)
            : await api.city.update(id, data);

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
