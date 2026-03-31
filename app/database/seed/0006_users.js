import { faker } from '@faker-js/faker/locale/pt_BR';
import bcrypt from 'bcrypt';

export async function seed(knex) {

  await knex('users').del();

  const batchSize = 100;

  const total = 1000;

  for (let i = 0; i < total; i += batchSize) {
    const batch = Array.from({ length: batchSize }, () => ({
      enterprise_id: faker.number.int({ min: 1, max: 10 }),
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      senha: bcrypt.hashSync('senha123', 10),
      ativo: faker.datatype.boolean(),
    }));
    await knex('users').insert(batch);
  }
}
