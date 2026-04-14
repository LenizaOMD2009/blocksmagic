import { BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'
export class Print {
    #html = null
    #opcoes = {
        marginsType: 0,
        pageSize: 'A4',
        printBackground: true,
        landscape: false
    }
    //  Factory — ponto de entrada da interface fluente
    static create() {
        return new Print();
    }
    //  Define o conteúdo HTML a ser impresso
    stringHTML(html) {
        this.#html = html;
        return this;
    }
    //Abre o PDF para exibição ou impressão
        async print() {
        if (!this.#html) {
            console.error("Nenhum HTML definido para impressão.");
            return;
        }

        // 1. Cria uma janela oculta para renderizar o HTML
        let win = new BrowserWindow({ show: false });

        // 2. Carrega o HTML (pode ser uma string ou arquivo)
        await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(this.#html)}`);

        try {
            // 3. Gera o PDF usando as opções da sua classe
            const data = await win.webContents.printToPDF(this.#opcoes);
            
            // 4. Salva o arquivo na pasta de Downloads do usuário
            const pdfPath = path.join(os.homedir(), 'Downloads', `cliente_${Date.now()}.pdf`);
            fs.writeFileSync(pdfPath, data);
            
            console.log(`PDF gerado em: ${pdfPath}`);
            return pdfPath; // Retorna o caminho para o frontend saber que deu certo
        } catch (error) {
            console.error('Falha ao gerar PDF:', error);
        } finally {
            win.close(); // Fecha a janela oculta
        }
    }

}