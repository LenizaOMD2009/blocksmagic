export function up(knex) {
    return knex.schema.createTable('customer', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('cpf');
        table.text('rg');
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
    return knex.schema.dropTable('customer');
}