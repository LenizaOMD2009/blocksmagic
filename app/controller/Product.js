import connection from '../database/Connection.js';
export default class Product {
        // --- ADICIONE ESTES MÉTODOS DENTRO DA CLASSE PRODUCT ---

    // Insere um novo produto
    static async insert(data) {
        // Validação simples (ajuste conforme os campos obrigatórios do seu banco)
        if (!data.nome || data.nome.trim() === '') {
            return { status: false, msg: 'O campo nome é obrigatório', id: null, data: [] };
        }

        try {
            const clean = Product.#sanitize(data);

            const [result] = await connection(Product.table)
                .insert(clean)
                .returning('*');

            return { status: true, msg: 'Salvo com sucesso!', id: result.id, data: [result] };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message, id: null, data: [] };
        }
    }

    // Atualiza um produto existente
    static async update(id, data) {
        if (!id) return { status: false, msg: 'ID é obrigatório', data: [] };

        try {
            const clean = Product.#sanitize(data);
            delete clean.id; // Impede tentativa de atualizar a chave primária

            const [result] = await connection(Product.table)
                .where({ id })
                .update(clean)
                .returning('*');

            if (!result) {
                return { status: false, msg: 'Produto não encontrado', data: [] };
            }

            return { status: true, msg: 'Atualizado com sucesso!', id: result.id, data: [result] };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message, data: [] };
        }
    }

    // Exclui um produto
    static async delete(id) {
        if (!id) return { status: false, msg: 'ID é obrigatório' };

        try {
            await connection(Product.table).where({ id }).del();
            return { status: true, msg: 'Excluído com sucesso!' };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    // Limpa os dados vindo do formulário (essencial para não dar erro de tipo no banco)
    static #sanitize(data) {
        const ignore = ['id', 'action'];
        const clean = {};

        for (const [key, value] of Object.entries(data)) {
            if (ignore.includes(key)) continue;
            
            // Se o valor for vazio, nulo ou indefinido, ignora
            if (value === '' || value === null || value === undefined) continue;

            // Converte strings de booleano para booleano real
            if (value === 'true') { clean[key] = true; continue; }
            if (value === 'false') { clean[key] = false; continue; }

            // IMPORTANTE: Converte preços para número (float) se forem strings
            if (key === 'preco_compra' || key === 'preco_venda') {
                clean[key] = parseFloat(value);
                continue;
            }

            clean[key] = value;
        }

        return clean;
    }

    
    // Tabela no banco
    static table = 'product';
    // Mapeamento: índice da coluna no DataTable → nome no banco
    static #columns = ['id', 'nome', 'codigo_barra', 'unidade', 'preco_compra', 'preco_venda', 'ativo', 'criado_em', 'atualizado_em', null];
    // Colunas pesquisáveis pelo termo de busca
    static #searchable = ['nome', 'codigo_barra', 'unidade', 'preco_compra', 'preco_venda'];
    //Implementamos a pesquisa completa para o produto
    static async find(data = {}) {
        const { term = '', limit = 10, offset = 0, orderType = 'asc', column = 0, draw = 1 } = data;
        //Total sem filtro
        const [{ count: total }] = await connection(Product.table).count('id as count');
        //Monta WHERE da busca
        const search = term?.trim();
        function applySearch(query) {
            if (search) {
                query.where(function () {
                    for (const col of Product.#searchable) {
                        this.orWhereRaw(`CAST("${col}" AS TEXT) ILIKE ?`, [`%${search}%`]);
                    }
                });
            }
            return query;
        }
        // Total filtrado
        const filteredQ = connection(Product.table).count('id as count');
        applySearch(filteredQ);
        const [{ count: filtered }] = await filteredQ;
        // Dados paginados
        const orderColumn = Product.#columns[column] || 'id';
        const orderDir = orderType === 'desc' ? 'desc' : 'asc';
        const dataQ = connection(Product.table).select('*');
        applySearch(dataQ);
        dataQ.orderBy(orderColumn, orderDir);
        dataQ.limit(parseInt(limit));
        dataQ.offset(parseInt(offset));
        const rows = await dataQ;
        return {
            draw: parseInt(draw),
            recordsTotal: parseInt(total),
            recordsFiltered: parseInt(filtered),
            data: rows,
        };
    }
    //Retorna apenas um produto pelo seu ID
    static async findById(id) {
        if (!id) return null;
        const row = await connection(Product.table)
            .where({ id })
            .first();
        return row || null;
    }
}