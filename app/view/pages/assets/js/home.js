async function loadHomeProductCount() {
    try {
        const response = await api.product.find({ limit: 1, offset: 0 });
        const total = Number(response?.recordsTotal ?? 0);
        const counter = document.querySelector('#home-product-count');
        if (counter) counter.textContent = total;
    } catch (error) {
        console.error('Erro ao carregar contagem de produtos:', error);
    }
}

async function loadHomeCustomerCount() {
    try {
        const response = await api.customer.find({ limit: 1, offset: 0 });
        const total = Number(response?.recordsTotal ?? 0);
        const counter = document.querySelector('#home-customer-count');
        if (counter) counter.textContent = total;
    } catch (error) {
        console.error('Erro ao carregar contagem de clientes:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadHomeProductCount();
    loadHomeCustomerCount();
    
    // Recarregar dados quando há mudanças
    if (api?.product?.onReload) {
        api.product.onReload(loadHomeProductCount);
    }
    
    if (api?.customer?.onReload) {
        api.customer.onReload(loadHomeCustomerCount);
    }
});
