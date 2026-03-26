export function up(knex) {
    return knex.schema.createTable('contact', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable(); // Ex: "João Silva"
        table.string('email');
        table.string('telefone', 20);
        table.string('celular', 20);
        table.text('cargo'); // Ex: "Gerente de Compras" ou "Proprietário"
        
        // Relacionamento com a Tabela de Cliente (Customer)
        table.bigInteger('customer_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('customer')
            .onUpdate('CASCADE')
            .onDelete('CASCADE'); // Se o cliente for apagado, os contatos dele somem

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
    return knex.schema.dropTable('contact');
}
