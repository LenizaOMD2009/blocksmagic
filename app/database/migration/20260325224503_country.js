export function up(knex) {
    return knex.schema.createTable('country', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome', 60).notNullable().unique();
        table.text('localizacao');
        table.text('lingua');
        table.text('moeda');
        
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
    return knex.schema.dropTable('country');
}
