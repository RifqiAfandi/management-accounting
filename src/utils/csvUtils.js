// Utility functions for handling CSV data and currency formatting
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });
    return obj;
  });
};

export const formatCurrency = (amount) => {
  if (!amount || amount === '0' || amount === 'Rp0') return 'Rp0';
  
  // Remove existing formatting
  const numStr = amount.toString().replace(/[Rp.,\s]/g, '');
  const num = parseInt(numStr);
  
  if (isNaN(num)) return 'Rp0';
  
  return 'Rp' + num.toLocaleString('id-ID');
};

export const parseCurrency = (amount) => {
  if (!amount) return 0;
  const numStr = amount.toString().replace(/[Rp.,\s]/g, '');
  const num = parseInt(numStr);
  return isNaN(num) ? 0 : num;
};

export const calculateBalance = (debit, kredit) => {
  const debitAmount = parseCurrency(debit);
  const kreditAmount = parseCurrency(kredit);
  return debitAmount - kreditAmount;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  
  // Handle different date formats
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${day}/${month}/${year}`;
  }
  
  return dateStr;
};

export const exportToCSV = (data, filename) => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header] || '').join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
