import { faker } from '@faker-js/faker/locale/pt_BR';

export async function seed(knex) {

  await knex('enterprise').del();

  const batchSize = 100;

  const total = 500;

  const cnpjs = new Set();

  while (cnpjs.size < total) {
    cnpjs.add(faker.string.numeric(14));
  }

  const cnpjArray = Array.from(cnpjs);

  for (let i = 0; i < total; i += batchSize) {
    const batch = Array.from({ length: batchSize }, (_, idx) => ({
      razao_social: faker.company.name(),
      nome_fantasia: faker.company.catchPhrase(),
      cnpj: cnpjArray[i + idx],
      email: faker.internet.email(),
      telefone: faker.phone.number('(##) #####-####'),
    }));
    await knex('enterprise').insert(batch);
  }
}
