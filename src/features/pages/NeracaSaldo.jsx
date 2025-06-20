import React, { useState, useEffect } from 'react';
import { accountingDataService } from '../../services/accountingDataService.js';
import { exportToCSV, formatCurrency } from '../../utils/csvUtils.js';

const NeracaSaldo = () => {
  const [neracaSaldoData, setNeracaSaldoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await accountingDataService.getNeracaSaldo();
      setNeracaSaldoData(data);
    } catch (err) {
      setError('Gagal memuat data neraca saldo');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(neracaSaldoData, 'neraca-saldo.csv');
  };

  const calculateTotals = () => {
    let totalDebit = 0;
    let totalKredit = 0;

    neracaSaldoData.forEach(entry => {
      const debit = parseFloat(entry['Debit']?.replace(/[Rp.,\s]/g, '') || '0');
      const kredit = parseFloat(entry['Kredit']?.replace(/[Rp.,\s]/g, '') || '0');
      totalDebit += debit;
      totalKredit += kredit;
    });

    return { totalDebit, totalKredit };
  };
  const getAccountsByType = () => {
    const types = {
      'Aset': [],
      'Liabilitas': [],
      'Ekuitas': [],
      'Pendapatan': [],
      'Beban': []
    };

    neracaSaldoData.forEach(entry => {
      const kodeAkun = entry['Kode Akun'];
      
      // Klasifikasi berdasarkan kode akun (asumsi standar)
      if (kodeAkun.startsWith('1')) {
        types['Aset'].push(entry);
      } else if (kodeAkun.startsWith('2')) {
        types['Liabilitas'].push(entry);
      } else if (kodeAkun.startsWith('3')) {
        types['Ekuitas'].push(entry);
      } else if (kodeAkun.startsWith('4')) {
        types['Pendapatan'].push(entry);
      } else if (kodeAkun.startsWith('5')) {
        types['Beban'].push(entry);
      } else {
        types['Aset'].push(entry);
      }
    });

    return types;
  };

  if (loading) {
    return (
      <div className="transaksi-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Memuat data neraca saldo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaksi-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Terjadi Kesalahan</h3>
          <p>{error}</p>
          <button onClick={loadData} className="retry-btn">Coba Lagi</button>
        </div>
      </div>
    );
  }

  const { totalDebit, totalKredit } = calculateTotals();
  const accountsByType = getAccountsByType();
  const isBalanced = totalDebit === totalKredit;

  return (
    <div className="transaksi-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Neraca Saldo</h1>
        </div>
        <button 
          className="export-btn"
          onClick={handleExport}
          disabled={neracaSaldoData.length === 0}
        >
          📤 Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card primary">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3 className="card-title">Total Akun</h3>
            <div className="card-value">{neracaSaldoData.length}</div>
          </div>
        </div>
        
        <div className="summary-card success">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3 className="card-title">Total Debit</h3>
            <div className="card-value">{formatCurrency(totalDebit)}</div>
          </div>
        </div>
        
        <div className="summary-card info">
          <div className="card-icon">💳</div>
          <div className="card-content">
            <h3 className="card-title">Total Kredit</h3>
            <div className="card-value">{formatCurrency(totalKredit)}</div>
          </div>
        </div>

        <div className={`summary-card ${isBalanced ? 'success' : 'warning'}`}>
          <div className="card-icon">{isBalanced ? '⚖️' : '⚠️'}</div>
          <div className="card-content">
            <h3 className="card-title">Status</h3>
            <div className="card-value">{isBalanced ? 'Seimbang' : 'Tidak Seimbang'}</div>
          </div>
        </div>
      </div>


      {/* Data Table */}
      <div className="data-section">
        <h3 className="section-title">Daftar Neraca Saldo</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>Debit</th>
                <th>Kredit</th>
              </tr>
            </thead>
            <tbody>
              {neracaSaldoData.map((entry, index) => (
                <tr key={index}>
                  <td className="code">{entry['Kode Akun']}</td>
                  <td>{entry['Nama Akun']}</td>
                  <td className="amount debit">
                    {entry['Debit'] && entry['Debit'] !== 'Rp0' ? entry['Debit'] : '-'}
                  </td>
                  <td className="amount kredit">
                    {entry['Kredit'] && entry['Kredit'] !== 'Rp0' ? entry['Kredit'] : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="2"><strong>Total</strong></td>
                <td className="amount debit"><strong>{formatCurrency(totalDebit)}</strong></td>
                <td className="amount kredit"><strong>{formatCurrency(totalKredit)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {neracaSaldoData.length > 0 && (
          <div className="table-footer">
            <div className="total-row">
              <div className="balance-summary">
                <span className="balance-label">Status Neraca: </span>
                <span className={`balance-status ${isBalanced ? 'balanced' : 'unbalanced'}`}>
                  {isBalanced ? '⚖️ Seimbang' : '⚠️ Tidak Seimbang'}
                </span>
                {!isBalanced && (
                  <span className="balance-diff">
                    (Selisih: {formatCurrency(Math.abs(totalDebit - totalKredit))})
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {neracaSaldoData.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Tidak ada data neraca saldo</h3>
          <p>Belum ada data neraca saldo yang tercatat dalam sistem</p>
        </div>
      )}
    </div>
  );
};

export default NeracaSaldo;
