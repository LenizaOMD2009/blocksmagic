export function up(knex) {
    return knex.schema.createTable('customer', (table) => {
        table.comment('Tabela de clientes disponíveis no sistema.');
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('cpf');
        table.text('rg');
        table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false);
        // Data e hora de criação do registro — preenchida automaticamente
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
    return knex.schema.dropTable('customer');
}