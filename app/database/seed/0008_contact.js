import { faker } from '@faker-js/faker/locale/pt_BR';

export async function seed(knex) {

  await knex('contact').del();

  const batchSize = 500;

  const total = 5000;

  // Pega todos os customer_id que existem
  const customers = await knex('customer').select('id');
  
  if (customers.length === 0) {
    console.log('Nenhum cliente encontrado. Pulando seed de contatos.');
    return;
  }

  for (let i = 0; i < total; i += batchSize) {
    const batch = Array.from({ length: batchSize }, () => ({
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: faker.phone.number('(##) 9999-9999'),
      celular: faker.phone.number('(##) 99999-9999'),
      cargo: faker.person.jobTitle(),
      customer_id: customers[Math.floor(Math.random() * customers.length)].id,
    }));
    await knex('contact').insert(batch);
  }
}

