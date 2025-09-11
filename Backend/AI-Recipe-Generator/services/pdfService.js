// services/pdfService.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

class PdfService {
  constructor() {
    // Read the template file once when the service is initialized
    const templatePath = path.join(__dirname, '..', 'templates', 'recipe-pdf.html');
    this.templateHtml = fs.readFileSync(templatePath, 'utf8');
    this.template = handlebars.compile(this.templateHtml);
  }

  async generatePdfFromRecipe(recipe) {
    // Prepare data for the template
    const data = {
      ...recipe,
      ingredientsList: recipe.ingredients.map(ing => <li><strong>${ing.name}:</strong> ${ing.quantity}</li>).join(''),
      stepsList: recipe.steps.map((step, i) => <li><strong>Step ${i + 1}:</strong> ${step}</li>).join('')
    };

    // Compile the template with data
    const finalHtml = this.template(data);

    let browser;
    try {
      browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      return pdfBuffer;
    } catch(error) {
        throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
      if (browser) await browser.close();
    }
  }
}

module.exports = new PdfService();