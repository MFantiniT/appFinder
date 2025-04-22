// server/utils/excelExporter.js
const xlsx = require('xlsx');

exports.generateExcel = async (businesses) => {
  // Criar workbook
  const wb = xlsx.utils.book_new();
  
  // Definir cabeçalhos
  const headers = [
    'Nome', 
    'Endereço', 
    'Telefone', 
    'Website', 
    'Cidade', 
    'Estado',
    'CNPJ',
    'Instagram',
    'LinkedIn',
    'Facebook',
    'Proprietário',
    'Email',
    'Categoria',
    'Observações'
  ];
  
  // Criar array de dados
  const data = [headers];
  
  // Adicionar linhas para cada empresa
  businesses.forEach(business => {
    const row = [
      business.name,
      business.address,
      business.phone,
      business.website,
      business.city,
      business.state,
      business.cnpj,
      business.instagram,
      business.linkedin,
      business.facebook,
      business.ownerName,
      business.email,
      business.category,
      business.notes
    ];
    
    data.push(row);
  });
  
  // Converter para planilha
  const ws = xlsx.utils.aoa_to_sheet(data);
  
  // Adicionar planilha ao workbook
  xlsx.utils.book_append_sheet(wb, ws, 'Empresas');
  
  // Gerar buffer para download
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  
  return buffer;
};