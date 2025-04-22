// server/services/googleMapsScraper.js
const puppeteer = require('puppeteer');

class GoogleMapsScraper {
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
    
    // Configurar viewport
    await this.page.setViewport({ width: 1366, height: 768 });
    
    // Melhorar performance
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (resourceType === 'image' || resourceType === 'font' || resourceType === 'media') {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async searchBusinesses(category, location, maxPages = 15) {
    if (!this.browser) {
      await this.initialize();
    }

    const searchQuery = `${category} em ${location}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `https://www.google.com/search?q=${encodedQuery}&tbm=lcl`;
    
    await this.page.goto(url, { waitUntil: 'networkidle2' });
    
    let allBusinesses = [];
    let pageNumber = 1;
    
    // Loop através das páginas
    while (pageNumber <= maxPages) {
      console.log(`Pesquisando empresas na página ${pageNumber} em: ${location}`);
      
      const businesses = await this._extractBusinessData();
      allBusinesses = allBusinesses.concat(businesses);
      
      // Tentar avançar para a próxima página
      const nextButton = await this.page.$('a#pnnext');
      if (nextButton) {
        await nextButton.click();
        await this.page.waitForTimeout(2000); // Espera para carregar
      } else {
        break; // Fim das páginas
      }
      
      pageNumber++;
    }
    
    return allBusinesses;
  }
  
  async _extractBusinessData() {
    return this.page.evaluate(() => {
      const businesses = [];
      
      // Seleciona os cards de negócios
      const cards = document.querySelectorAll('.rllt__details');
      
      cards.forEach(card => {
        try {
          // Extrair dados básicos
          const name = card.querySelector('.dbg0pd')?.innerText || '';
          const addressElement = card.querySelector('.rllt__details div:nth-child(3)');
          const address = addressElement ? addressElement.innerText.split('·')[0].trim() : '';
          
          // Tentar obter telefone e site
          const fullCardElement = card.closest('.uMdZh');
          const phoneElement = fullCardElement.querySelector('[data-dtype="d3ph"]');
          const phone = phoneElement ? phoneElement.innerText.trim() : '';
          
          // Obter URL do site
          const siteElement = fullCardElement.querySelector('a.yYlJEf');
          const website = siteElement ? siteElement.href : '';
          
          // Link para a página do Google Maps
          const mapsLinkElement = card.querySelector('.dbg0pd')?.closest('a');
          const googleMapsUrl = mapsLinkElement ? mapsLinkElement.href : '';
          
          // Categoria do negócio (quando disponível)
          const categoryElement = card.querySelector('.rllt__details div:nth-child(2)');
          const category = categoryElement ? categoryElement.innerText.split('·')[0].trim() : '';
          
          businesses.push({
            name,
            address,
            phone,
            website,
            googleMapsUrl,
            category
          });
        } catch (e) {
          console.error('Erro ao extrair dados:', e);
        }
      });
      
      return businesses;
    });
  }
}

module.exports = new GoogleMapsScraper();