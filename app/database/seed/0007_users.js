import { faker } from '@faker-js/faker/locale/pt_BR';

export async function seed(knex) {

  await knex('users').del();

  const batchSize = 100;

  const total = 1000;

  const emails = new Set();

  while (emails.size < total) {
    emails.add(faker.internet.email());
  }

  const emailArray = Array.from(emails);

  for (let i = 0; i < total; i += batchSize) {
    const batch = Array.from({ length: batchSize }, (_, idx) => ({
      enterprise_id: faker.number.int({ min: 1, max: 10 }),
      nome: faker.person.fullName(),
      email: emailArray[i + idx],
      senha: 'senha123',
      ativo: faker.datatype.boolean(),
    }));
    await knex('users').insert(batch);
  }
}
