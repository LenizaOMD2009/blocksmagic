export function up(knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.string('sigla', 2).notNullable();
        table.integer('codigo_ibge'); // Ex: 11 para Rondônia

        // Relacionamento com o País
        table.bigInteger('country_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('country')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');

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
    return knex.schema.dropTable('federative_unit');
}
