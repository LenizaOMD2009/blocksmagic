import { faker } from '@faker-js/faker/locale/pt_BR';

export async function seed(knex) {
  // 1. Limpa a tabela
  await knex('address').del();

  // 2. Carrega apenas os IDs (mais rápido que select '*')
  const customers = await knex('customer').select('id');
  const cities = await knex('city').select('id');

  if (customers.length === 0 || cities.length === 0) {
    throw new Error('Restrição: Cadastre clientes e cidades antes de rodar este seed.');
  }

  const addresses = [];

  for (const customer of customers) {
    // Define quantos endereços esse cliente terá
    const qtd = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < qtd; i++) {
      const city = faker.helpers.arrayElement(cities);

      addresses.push({
        id_cidade: city.id,
        id_cliente: customer.id,
        titulo: i === 0 ? 'Endereço Principal' : `Endereço ${i + 1}`,
        cep: faker.location.zipCode('#####-###'),
        numero: faker.location.buildingNumber(),
        logradouro: faker.location.street(),
        bairro: faker.location.secondaryAddress(),
        // Ajustado: complementos e referências menores
        complemento: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }),
        referencia: faker.helpers.maybe(() => faker.lorem.sentence(3), { probability: 0.2 }),
        ibge: faker.string.numeric(7),
        endereco_padrao: i === 0,
      });
    }
  }

  // 3. O SEGREDO: Use batchInsert para não estourar o limite do banco
  // O Knex divide automaticamente em pedaços de 100 em 100
  await knex.batchInsert('address', addresses, 100);
}
