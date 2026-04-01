exports.up = function (knex) {
    return knex.raw(`
        CREATE TRIGGER format_customer_trigger
        BEFORE INSERT OR UPDATE ON customer
        FOR EACH ROW EXECUTE FUNCTION trigger_format_customer();
    `).then(() => {
        return knex.raw(`
            CREATE TRIGGER format_supplier_trigger
            BEFORE INSERT OR UPDATE ON supplier
            FOR EACH ROW EXECUTE FUNCTION trigger_format_supplier();
        `);
    }).then(() => {
        return knex.raw(`
            CREATE TRIGGER format_enterprise_trigger
            BEFORE INSERT OR UPDATE ON enterprise
            FOR EACH ROW EXECUTE FUNCTION trigger_format_enterprise();
        `);
    }).then(() => {
        return knex.raw(`
            CREATE TRIGGER format_product_trigger
            BEFORE INSERT OR UPDATE ON product
            FOR EACH ROW EXECUTE FUNCTION trigger_format_product();
        `);
    });
};

exports.down = function (knex) {
    return knex.raw(`
        DROP TRIGGER IF EXISTS format_product_trigger ON product;
        DROP TRIGGER IF EXISTS format_enterprise_trigger ON enterprise;
        DROP TRIGGER IF EXISTS format_supplier_trigger ON supplier;
        DROP TRIGGER IF EXISTS format_customer_trigger ON customer;
    `);
};