import connection from '../database/Connection.js';
export default class Product {
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
    //Implementamos a criação do produto
    static async create(data) {
        const clean = Product.#sanitize(data);  
        try {
            const [id] = await connection(Product.table).insert(clean).returning('id');
            return { status: true, msg: 'Criado com sucesso!', id };
        }
        catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    // Compatibilidade com a rota que chama Product.insert
    static async insert(data) {
        return Product.create(data);
    }

    //Implementamos a atualização do produto
    static async update(id, data) {
        if (!id) return { status: false, msg: 'ID é obrigatório' };
        const clean = Product.#sanitize(data);
        try {
            await connection(Product.table).where({ id }).
                update(clean);
            return { status: true, msg: 'Atualizado com sucesso!' };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }       
    }

    //Implementamos a exclusão do produto
    static async delete(id) {
        if (!id) return { status: false, msg: 'ID é obrigatório' };

        try {
            await connection(Product.table).where({ id }).del();
            return { status: true, msg: 'Excluído com sucesso!' };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    //Remove campos vazios e converte tipos.
    static #sanitize(data) {
        // Campos de controle do form — não existem no banco
        const ignore = ['id', 'action'];

        const clean = {};

        for (const [key, value] of Object.entries(data)) {
            if (ignore.includes(key)) continue;
            if (value === '' || value === null || value === undefined) continue;
            if (value === 'true') { clean[key] = true; continue; }
            if (value === 'false') { clean[key] = false; continue; }
            clean[key] = value;
        }

        return clean;
    }
}