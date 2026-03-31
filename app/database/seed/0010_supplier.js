import { faker } from '@faker-js/faker/locale/pt_BR';

export async function seed(knex) {

  await knex('supplier').del();

  const batchSize = 100;

  const total = 500;

  for (let i = 0; i < total; i += batchSize) {
    const batch = Array.from({ length: batchSize }, () => ({
      nome_fantasia: faker.company.name(),
      razao_social: faker.company.catchPhrase(),
      cnpj: faker.string.numeric(14),
      inscricao_estadual: faker.string.numeric(12),
      email: faker.internet.email(),
      ativo: faker.datatype.boolean(),
    }));
    await knex('supplier').insert(batch);
  }
}
