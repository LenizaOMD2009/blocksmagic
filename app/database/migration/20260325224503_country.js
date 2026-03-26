exports.up = function (knex) {
    return knex.schema.createTable('country', (table) => {
        table.comment('Tabela de países disponíveis no sistema, linguísticas e monetárias de cada país.');
        table.bigIncrements('id').primary();
        table.text('codigo').nullable();
        table.text('nome').nullable();
        table.text('localizacao').nullable();  
        table.text('lingua').nullable();
        table.text('moeda').nullable();
         // Data e hora de criação 
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da atualização 
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('country');
};