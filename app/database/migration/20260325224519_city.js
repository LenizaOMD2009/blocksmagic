exports.up = function (knex) {
    return knex.schema.createTable('city', (table) => {
        table.comment('Tabela de cidades disponíveis no sistema');
        table.bigIncrements('id').primary(); //Código estado
        table.bigInteger('id_uf'); // Código cidade
        table.text('codigo').nullable(); // Nome cidade
        table.text('nome').nullable();
         // Data e hora de criação 
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da atualização 
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
        table
            .foreign('id_uf')             // coluna local
            .references('id')             // coluna referenciada
            .inTable('federative_unit')   // tabela referenciada
            .onDelete('CASCADE')          // ao deletar o pai, deleta os filhos
            .onUpdate('NO ACTION');       // ao atualizar o pai, não faz nada
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('city');
};