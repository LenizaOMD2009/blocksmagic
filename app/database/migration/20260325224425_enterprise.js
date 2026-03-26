export function up(knex) {
    return knex.schema.createTable('enterprise', (table) => {
        table.bigIncrements('id').primary();
        table.text('razao_social').notNullable();
        table.text('nome_fantasia');
        table.text('cnpj').unique().notNullable();
        table.text('email');
        table.text('telefone');
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
    return knex.schema.dropTable('enterprise');
}
