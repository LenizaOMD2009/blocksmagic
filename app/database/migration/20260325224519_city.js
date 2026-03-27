exports.up = function (knex) {
    return knex.schema.createTable('city', (table) => {
        table.comment('Tabela de cidades disponíveis no sistema');
        table.bigIncrements('id').primary(); //Código cidade
        table.bigInteger('id_uf'); // ID do estado (FK)
        table.text('codigo').nullable(); // Código IBGE da cidade
        table.text('nome').nullable(); // Nome cidade
         // Data e hora de criação 
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da atualização 
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
        //forenkey
        table.foreign('id_uf').references('id').inTable('federative_unit').onDelete('CASCADE').onUpdate('NO ACTION');       // ao atualizar o pai, não faz nada
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('city');
};