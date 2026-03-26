export function up(knex) {
    return knex.schema.createTable('supplier', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome_fantasia').notNullable();
        table.text('razao_social');
        table.text('cnpj').unique().notNullable();
        table.text('inscricao_estadual');
        table.text('email');
        table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false);
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
    return knex.schema.dropTable('supplier');
}
