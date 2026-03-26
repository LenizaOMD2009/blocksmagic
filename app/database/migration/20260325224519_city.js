export function up(knex) {
    return knex.schema.createTable('city', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('codigo_ibge'); // Comum em sistemas brasileiros
        // Relacionamento com Estado
        table.bigInteger('federative_unit_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('federative_unit')
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
    return knex.schema.dropTable('city');
}
