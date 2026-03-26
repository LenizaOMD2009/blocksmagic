export function up(knex) {
    return knex.schema.createTable('address', (table) => {
        table.bigIncrements('id').primary();
        table.text('logradouro').notNullable(); // Rua, Av, etc.
        table.string('numero', 10);
        table.text('complemento');
        table.text('bairro');
        table.string('cep', 8);

        // Relacionamento com a Cidade (Foreign Key)
        table.bigInteger('city_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('city')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');

        // Se o endereço pertencer a um Cliente específico:
        table.bigInteger('customer_id')
            .unsigned()
            .references('id')
            .inTable('customer')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');

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
    return knex.schema.dropTable('address');
}
