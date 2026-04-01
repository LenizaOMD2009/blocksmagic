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
        // Função de trigger para customer
        return knex.raw(`
            CREATE OR REPLACE FUNCTION trigger_format_customer() RETURNS TRIGGER AS $$
            BEGIN
                NEW.cpf = format_cpf(NEW.cpf);
                NEW.atualizado_em = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }).then(() => {
        // Função de trigger para supplier
        return knex.raw(`
            CREATE OR REPLACE FUNCTION trigger_format_supplier() RETURNS TRIGGER AS $$
            BEGIN
                NEW.cnpj = format_cnpj(NEW.cnpj);
                NEW.atualizado_em = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }).then(() => {
        // Função de trigger para enterprise
        return knex.raw(`
            CREATE OR REPLACE FUNCTION trigger_format_enterprise() RETURNS TRIGGER AS $$
            BEGIN
                NEW.cnpj = format_cnpj(NEW.cnpj);
                NEW.atualizado_em = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }).then(() => {
        // Função de trigger para product
        return knex.raw(`
            CREATE OR REPLACE FUNCTION trigger_format_product() RETURNS TRIGGER AS $$
            BEGIN
                NEW.codigo_barra = format_codigo_barra(NEW.codigo_barra);
                NEW.atualizado_em = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    });
};

exports.down = function (knex) {
    return knex.raw(`
        DROP FUNCTION IF EXISTS trigger_format_product();
        DROP FUNCTION IF EXISTS trigger_format_enterprise();
        DROP FUNCTION IF EXISTS trigger_format_supplier();
        DROP FUNCTION IF EXISTS trigger_format_customer();
        DROP FUNCTION IF EXISTS format_codigo_barra(TEXT);
        DROP FUNCTION IF EXISTS format_cnpj(TEXT);
        DROP FUNCTION IF EXISTS format_cpf(TEXT);
    `);
};