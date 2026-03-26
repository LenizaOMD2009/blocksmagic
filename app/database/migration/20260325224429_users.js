export function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.bigIncrements('id').primary();

    // Relacionamento com a empresa (Enterprise)
    table.bigInteger('enterprise_id') // Cria a coluna para guardar o ID da empresa
        .unsigned()                   // IDs do tipo Increments nunca são negativos
        .notNullable()                // Todo usuário precisa obrigatoriamente de uma empresa
        .references('id')             // Refere-se à coluna 'id'
        .inTable('enterprise')        // Na tabela 'enterprise'
        .onDelete('CASCADE');         // Se a empresa for excluída, os usuários dela também serão
        table.text('nome').notNullable();
        table.text('email').unique().notNullable();
        table.text('senha').notNullable(); // Aqui você salvará o hash da senha
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
    return knex.schema.dropTable('users');
}
