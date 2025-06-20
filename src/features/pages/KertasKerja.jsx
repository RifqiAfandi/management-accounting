import React, { useState, useEffect } from 'react';
import { accountingDataService } from '../../services/accountingDataService.js';
import { exportToCSV, formatCurrency } from '../../utils/csvUtils.js';

const KertasKerja = () => {
  const [kertasKerjaData, setKertasKerjaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await accountingDataService.getKertasKerja();
      setKertasKerjaData(data);
    } catch (err) {
      setError('Gagal memuat data kertas kerja');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(kertasKerjaData, 'kertas-kerja.csv');
  };  const calculateColumnTotals = () => {
    const totals = {
      neracaSaldoDebit: 0,
      neracaSaldoKredit: 0,
      penyesuaianDebit: 0,
      penyesuaianKredit: 0,
      neracaSaldoSetelahPenyesuaianDebit: 0,
      neracaSaldoSetelahPenyesuaianKredit: 0,
      labaRugiDebit: 0,
      labaRugiKredit: 0
    };

    kertasKerjaData.forEach(entry => {
      totals.neracaSaldoDebit += parseFloat(entry['Neraca Saldo Debit']?.replace(/[Rp.,\s]/g, '') || '0');
      totals.neracaSaldoKredit += parseFloat(entry['Neraca Saldo Kredit']?.replace(/[Rp.,\s]/g, '') || '0');
      totals.penyesuaianDebit += parseFloat(entry['Penyesuaian Debit']?.replace(/[Rp.,\s]/g, '') || '0');
      totals.penyesuaianKredit += parseFloat(entry['Penyesuaian Kredit']?.replace(/[Rp.,\s]/g, '') || '0');
      totals.neracaSaldoSetelahPenyesuaianDebit += parseFloat(entry['Neraca Saldo Setelah Penyesuaian Debit']?.replace(/[Rp.,\s]/g, '') || '0');
      totals.neracaSaldoSetelahPenyesuaianKredit += parseFloat(entry['Neraca Saldo Setelah Penyesuaian Kredit']?.replace(/[Rp.,\s]/g, '') || '0');
      totals.labaRugiDebit += parseFloat(entry['Laba Rugi Debit']?.replace(/[Rp.,\s]/g, '') || '0');
      totals.labaRugiKredit += parseFloat(entry['Laba Rugi Kredit']?.replace(/[Rp.,\s]/g, '') || '0');
    });

    return totals;
  };

  if (loading) return <div className="loading">Memuat data...</div>;
  if (error) return <div className="error">{error}</div>;

  const totals = calculateColumnTotals();

  return (
    <div className="kertas-kerja">
      <div className="page-header">
        <h2>Kertas Kerja</h2>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleExport}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="table-container kertas-kerja-table">
        <table className="data-table">
          <thead>            <tr>
              <th rowSpan="2">Kode Akun</th>
              <th rowSpan="2">Nama Akun</th>
              <th colSpan="2">Neraca Saldo</th>
              <th colSpan="2">Penyesuaian</th>
              <th colSpan="2">Neraca Saldo Setelah Penyesuaian</th>
              <th colSpan="2">Laba Rugi</th>
            </tr>
            <tr>
              <th>Debit</th>
              <th>Kredit</th>
              <th>Debit</th>
              <th>Kredit</th>
              <th>Debit</th>
              <th>Kredit</th>
              <th>Debit</th>
              <th>Kredit</th>
            </tr>
          </thead>
          <tbody>            {kertasKerjaData.map((entry, index) => (
              <tr key={index}>
                <td>{entry['Kode Akun']}</td>
                <td>{entry['Nama Akun']}</td>
                <td className="amount">{entry['Neraca Saldo Debit'] && entry['Neraca Saldo Debit'] !== 'Rp0' ? entry['Neraca Saldo Debit'] : '-'}</td>
                <td className="amount">{entry['Neraca Saldo Kredit'] && entry['Neraca Saldo Kredit'] !== 'Rp0' ? entry['Neraca Saldo Kredit'] : '-'}</td>
                <td className="amount">{entry['Penyesuaian Debit'] && entry['Penyesuaian Debit'] !== 'Rp0' ? entry['Penyesuaian Debit'] : '-'}</td>
                <td className="amount">{entry['Penyesuaian Kredit'] && entry['Penyesuaian Kredit'] !== 'Rp0' ? entry['Penyesuaian Kredit'] : '-'}</td>
                <td className="amount">{entry['Neraca Saldo Setelah Penyesuaian Debit'] && entry['Neraca Saldo Setelah Penyesuaian Debit'] !== 'Rp0' ? entry['Neraca Saldo Setelah Penyesuaian Debit'] : '-'}</td>
                <td className="amount">{entry['Neraca Saldo Setelah Penyesuaian Kredit'] && entry['Neraca Saldo Setelah Penyesuaian Kredit'] !== 'Rp0' ? entry['Neraca Saldo Setelah Penyesuaian Kredit'] : '-'}</td>
                <td className="amount">{entry['Laba Rugi Debit'] && entry['Laba Rugi Debit'] !== 'Rp0' ? entry['Laba Rugi Debit'] : '-'}</td>
                <td className="amount">{entry['Laba Rugi Kredit'] && entry['Laba Rugi Kredit'] !== 'Rp0' ? entry['Laba Rugi Kredit'] : '-'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>            <tr className="total-row">
              <td colSpan="2"><strong>Total</strong></td>
              <td className="amount"><strong>{formatCurrency(totals.neracaSaldoDebit)}</strong></td>
              <td className="amount"><strong>{formatCurrency(totals.neracaSaldoKredit)}</strong></td>
              <td className="amount"><strong>{formatCurrency(totals.penyesuaianDebit)}</strong></td>
              <td className="amount"><strong>{formatCurrency(totals.penyesuaianKredit)}</strong></td>
              <td className="amount"><strong>{formatCurrency(totals.neracaSaldoSetelahPenyesuaianDebit)}</strong></td>
              <td className="amount"><strong>{formatCurrency(totals.neracaSaldoSetelahPenyesuaianKredit)}</strong></td>
              <td className="amount"><strong>{formatCurrency(totals.labaRugiDebit)}</strong></td>
              <td className="amount"><strong>{formatCurrency(totals.labaRugiKredit)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {kertasKerjaData.length === 0 && (
        <div className="no-data">
          Tidak ada data kertas kerja tersedia.
        </div>
      )}
    </div>
  );
};

export default KertasKerja;
