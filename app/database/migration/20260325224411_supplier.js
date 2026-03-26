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
             // Data e hora de criação 
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da atualização 
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
    });
}

export function down(knex) {
    return knex.schema.dropTable('supplier');
}
