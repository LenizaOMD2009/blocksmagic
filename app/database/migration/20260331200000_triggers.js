exports.up = function (knex) {
    // Função para formatar CPF
    return knex.raw(`
        CREATE OR REPLACE FUNCTION format_cpf(cpf_text TEXT) RETURNS TEXT AS $$
        BEGIN
            IF cpf_text IS NULL OR length(regexp_replace(cpf_text, '[^0-9]', '', 'g')) != 11 THEN
                RETURN cpf_text;
            END IF;
            RETURN regexp_replace(regexp_replace(cpf_text, '[^0-9]', '', 'g'), '(\\d{3})(\\d{3})(\\d{3})(\\d{2})', '\\1.\\2.\\3-\\4');
        END;
        $$ LANGUAGE plpgsql;
    `).then(() => {
        // Função para formatar CNPJ
        return knex.raw(`
            CREATE OR REPLACE FUNCTION format_cnpj(cnpj_text TEXT) RETURNS TEXT AS $$
            BEGIN
                IF cnpj_text IS NULL OR length(regexp_replace(cnpj_text, '[^0-9]', '', 'g')) != 14 THEN
                    RETURN cnpj_text;
                END IF;
                RETURN regexp_replace(regexp_replace(cnpj_text, '[^0-9]', '', 'g'), '(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})', '\\1.\\2.\\3/\\4-\\5');
            END;
            $$ LANGUAGE plpgsql;
        `);
    }).then(() => {
        // Função para formatar código de barras (assumindo padrão de 13 dígitos)
        return knex.raw(`
            CREATE OR REPLACE FUNCTION format_codigo_barra(codigo_text TEXT) RETURNS TEXT AS $$
            BEGIN
                IF codigo_text IS NULL OR length(regexp_replace(codigo_text, '[^0-9]', '', 'g')) != 13 THEN
                    RETURN codigo_text;
                END IF;
                RETURN regexp_replace(regexp_replace(codigo_text, '[^0-9]', '', 'g'), '(\\d{1})(\\d{6})(\\d{6})', '\\1.\\2.\\3');
            END;
            $$ LANGUAGE plpgsql;
        `);
    }).then(() => {
        // Trigger para customer
        return knex.raw(`
            CREATE OR REPLACE FUNCTION trigger_format_customer() RETURNS TRIGGER AS $$
            BEGIN
                NEW.cpf = format_cpf(NEW.cpf);
                NEW.atualizado_em = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER format_customer_trigger
            BEFORE INSERT OR UPDATE ON customer
            FOR EACH ROW EXECUTE FUNCTION trigger_format_customer();
        `);
    }).then(() => {
        // Trigger para supplier
        return knex.raw(`
            CREATE OR REPLACE FUNCTION trigger_format_supplier() RETURNS TRIGGER AS $$
            BEGIN
                NEW.cnpj = format_cnpj(NEW.cnpj);
                NEW.atualizado_em = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER format_supplier_trigger
            BEFORE INSERT OR UPDATE ON supplier
            FOR EACH ROW EXECUTE FUNCTION trigger_format_supplier();
        `);
    }).then(() => {
        // Trigger para enterprise
        return knex.raw(`
            CREATE OR REPLACE FUNCTION trigger_format_enterprise() RETURNS TRIGGER AS $$
            BEGIN
                NEW.cnpj = format_cnpj(NEW.cnpj);
                NEW.atualizado_em = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER format_enterprise_trigger
            BEFORE INSERT OR UPDATE ON enterprise
            FOR EACH ROW EXECUTE FUNCTION trigger_format_enterprise();
        `);
    }).then(() => {
        // Trigger para product
        return knex.raw(`
            CREATE OR REPLACE FUNCTION trigger_format_product() RETURNS TRIGGER AS $$
            BEGIN
                NEW.codigo_barra = format_codigo_barra(NEW.codigo_barra);
                NEW.atualizado_em = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

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
        DROP FUNCTION IF EXISTS format_codigo_barra(TEXT);
        DROP FUNCTION IF EXISTS format_cnpj(TEXT);
        DROP FUNCTION IF EXISTS format_cpf(TEXT);
    `);
};