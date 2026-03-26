export function up(knex) {
    return knex.schema.createTable('product', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('descricao');
        table.decimal('preco_compra', 18, 4);
        table.decimal('preco_venda', 18, 4);
        table.text('unidade');
        table.text('codigo_de_barras');
        //data e hora criado
        table.timestamps('criado_em', { useTz: false})
        .defaultTo(knex.fn.now())
        .comment('Data e hora de criação do registro');
        //data e hora atualizado
        table.timestamps('atualizado_em', { useTz: false})
        .defaultTo(knex.fn.now())
        .comment('Data e hora da última atualizado do registro');
    });
}

export function down(knex) {
    return knex.schema.dropTable('product');
}