// server/services/cnpjScraper.js
const puppeteer = require('puppeteer');

class CnpjScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    this.page = await this.browser.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async findCnpj(businessName, state, maxRetries = 5) {
    if (!this.browser) {
      await this.initialize();
    }

    console.log(`Pesquisando CNPJ para: ${businessName} (${state})`);
    
    // Formatar a consulta
    const query = `${businessName} cnpj ${state}`.replace(/ /g, '+');
    const url = `https://www.google.com/search?q=${query}`;
    
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        await this.page.goto(url, { waitUntil: 'networkidle2' });
        
        // Aguardar carregamento dos resultados
        await this.page.waitForSelector('div.g', { timeout: 5000 });
        
        // Extrair o texto do primeiro resultado
        const result = await this.page.evaluate(() => {
          const firstResult = document.querySelector('div.g');
          return firstResult ? firstResult.innerText : '';
        });
        
        // Procurar CNPJ com ou sem formatação
        const cnpjRegex = /(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})|(\d{14})/;
        const cnpjFound = result.match(cnpjRegex);
        
        if (cnpjFound) {
          return cnpjFound[0];
        } else {
          return null;
        }
      } catch (error) {
        console.error(`Erro ao pesquisar CNPJ: ${error.message}`);
        retries++;
        
        if (retries >= maxRetries) {
          // Reiniciar navegador em caso de muitas falhas
          await this.close();
          await this.initialize();
        } else {
          // Esperar antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    return null;
  }
}

module.exports = new CnpjScraper();