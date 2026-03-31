exports.up = function (knex) {
    return knex.schema.createTable('address', (table) => {
        table.comment('Tabela de endereço disponíveis no sistema');
        table.bigIncrements('id').primary(); //Código cidade
        table.bigInteger('id_cidade');//Código cliente
        table.bigInteger('id_cliente');
        table.text('cep').nullable();
        table.text('numero').nullable();
        table.text('logradouro').nullable();
        table.text('bairro').nullable();
        table.text('complemento').nullable();
        table.text('referencia').nullable();
        table.text('ibge').nullable();
        table.text('titulo').nullable();
        table.boolean('endereco_padrao').defaultTo(false);
         // Data e hora de criação 
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da atualização 
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');

        table.foreign('id_cidade').references('id').inTable('city').onDelete('CASCADE').onUpdate('NO ACTION');
        table.foreign('id_cliente').references('id').inTable('customer').onDelete('CASCADE').onUpdate('NO ACTION');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('address');
};