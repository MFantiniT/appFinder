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
        await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Extrair todo o texto da página
        const pageContent = await this.page.evaluate(() => {
          return document.body.innerText;
        });
        
        // Procurar CNPJ com ou sem formatação usando regex
        const cnpjRegex = /(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})|(\d{14})/g;
        const cnpjMatches = pageContent.match(cnpjRegex);
        
        if (cnpjMatches && cnpjMatches.length > 0) {
          console.log(`CNPJ encontrado: ${cnpjMatches[0]}`);
          return cnpjMatches[0]; // Retorna o primeiro CNPJ encontrado
        } else {
          console.log(`Nenhum CNPJ encontrado para: ${businessName}`);
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