import { describe, it, expect } from 'vitest';
import { SellingPriceCalculator } from '../../app/view/pages/assets/components/SellingPriceCalculator';

describe('SellingPriceCalculator', () => {
    // create()
    describe('create()', () => {
        it('deve retornar uma instância de SellingPriceCalculator', () => {
            const calculator = SellingPriceCalculator.create();
            expect(calculator).toBeInstanceOf(SellingPriceCalculator);
        });
        it('cada chamada deve retornar uma instância nova e independente', () => {
            const a = SellingPriceCalculator.create();
            const b = SellingPriceCalculator.create();
            expect(a).not.toBe(b);
        });
    });
    // Testa o erro de – divisão por zero getData()
    describe('getData() – divisão por zero', () => {
        it('deve lançar um erro quando o divisor for igual a zero', () => {
            // totalTax=50 | profitMargin=50 | operatingCost=0 → divisor = 1 - (0.5 + 0.5 + 0) = 0
            expect(() =>
                SellingPriceCalculator
                    .create()
                    .addPurchasePrice(100)
                    .addTotalTax(50)
                    .addProfitMargin(50)
                    .addOperatingCost(0)
                    .getData()
                ).toThrow('A soma dos percentuais (100.0000%) deve ser menor que 100%. Reduza imposto, margem ou custo operacional.');
            });
    });
});