import React, { useState, useEffect } from 'react';
import { accountingDataService } from '../../services/accountingDataService.js';
import { exportToCSV, formatCurrency } from '../../utils/csvUtils.js';

const LaporanLabaRugi = () => {
  const [labaRugiData, setLabaRugiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await accountingDataService.getLaporanLabaRugi();
      setLabaRugiData(data);
    } catch (err) {
      setError('Gagal memuat data laporan laba rugi');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(labaRugiData, 'laporan-laba-rugi.csv');
  };

  const categorizeAccounts = () => {
    const categories = {
      pendapatan: [],
      beban: []
    };

    labaRugiData.forEach(entry => {
      const kategori = entry['Kategori']?.toLowerCase();
      if (kategori === 'pendapatan') {
        categories.pendapatan.push(entry);
      } else if (kategori === 'beban') {
        categories.beban.push(entry);
      }
    });

    return categories;
  };
  const calculateTotals = () => {
    const { pendapatan, beban } = categorizeAccounts();
    
    const totalPendapatan = pendapatan.reduce((sum, item) => {
      return sum + parseFloat(item['Nominal']?.replace(/[Rp.,\s]/g, '') || '0');
    }, 0);

    const totalBeban = beban.reduce((sum, item) => {
      return sum + parseFloat(item['Nominal']?.replace(/[Rp.,\s]/g, '') || '0');
    }, 0);

    const labaRugi = totalPendapatan - totalBeban;

    return { totalPendapatan, totalBeban, labaRugi };
  };

  const getProfitMargin = () => {
    const { totalPendapatan, labaRugi } = calculateTotals();
    if (totalPendapatan === 0) return 0;
    return (labaRugi / totalPendapatan) * 100;
  };

  if (loading) {
    return (
      <div className="transaksi-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Memuat laporan laba rugi...</p>
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

  const { pendapatan, beban } = categorizeAccounts();
  const { totalPendapatan, totalBeban, labaRugi } = calculateTotals();
  const profitMargin = getProfitMargin();
  const isProfitable = labaRugi >= 0;
  return (
    <div className="transaksi-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Laporan Laba Rugi</h1>
        </div>
        <button 
          className="export-btn"
          onClick={handleExport}
          disabled={labaRugiData.length === 0}
        >
          📤 Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card success">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3 className="card-title">Total Pendapatan</h3>
            <div className="card-value">{formatCurrency(totalPendapatan)}</div>
          </div>
        </div>
        
        <div className="summary-card warning">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3 className="card-title">Total Beban</h3>
            <div className="card-value">{formatCurrency(totalBeban)}</div>
          </div>
        </div>
        
        <div className={`summary-card ${isProfitable ? 'success' : 'warning'}`}>
          <div className="card-icon">{isProfitable ? '📈' : '📉'}</div>
          <div className="card-content">
            <h3 className="card-title">Laba/Rugi Bersih</h3>
            <div className="card-value">
              {formatCurrency(Math.abs(labaRugi))}
              <span className="profit-status"> {isProfitable ? '(Laba)' : '(Rugi)'}</span>
            </div>
          </div>
        </div>

        <div className="summary-card info">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3 className="card-title">Margin Laba</h3>
            <div className="card-value">{profitMargin.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="data-section">
        <h3 className="section-title">Pendapatan</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {pendapatan.map((item, index) => (
                <tr key={index}>
                  <td className="code">{item['Kode Akun']}</td>
                  <td>{item['Nama Akun']}</td>
                  <td className="amount success">{item['Nominal']}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="2"><strong>Total Pendapatan</strong></td>
                <td className="amount success"><strong>{formatCurrency(totalPendapatan)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="data-section">
        <h3 className="section-title">Beban</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {beban.map((item, index) => (
                <tr key={index}>
                  <td className="code">{item['Kode Akun']}</td>
                  <td>{item['Nama Akun']}</td>
                  <td className="amount warning">{item['Nominal']}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="2"><strong>Total Beban</strong></td>
                <td className="amount warning"><strong>{formatCurrency(totalBeban)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Final Result Summary */}
      <div className="data-section">
        <h3 className="section-title">Ringkasan Laba Rugi</h3>
        <div className="table-container">
          <table className="data-table profit-loss-summary">
            <tbody>
              <tr>
                <td className="summary-label">Total Pendapatan</td>
                <td className="amount success"><strong>{formatCurrency(totalPendapatan)}</strong></td>
              </tr>
              <tr>
                <td className="summary-label">Total Beban</td>
                <td className="amount warning"><strong>({formatCurrency(totalBeban)})</strong></td>
              </tr>
              <tr className="divider-row">
                <td colSpan="2"><hr /></td>
              </tr>
              <tr className="final-result-row">
                <td className="summary-label"><strong>Laba/Rugi Bersih</strong></td>
                <td className={`amount ${isProfitable ? 'success' : 'error'} final-amount`}>
                  <strong>
                    {formatCurrency(Math.abs(labaRugi))} 
                    <span className="profit-indicator">
                      {isProfitable ? ' 📈 (LABA)' : ' 📉 (RUGI)'}
                    </span>
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {labaRugiData.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Tidak ada data laporan laba rugi</h3>
          <p>Belum ada data laporan laba rugi yang tercatat dalam sistem</p>
        </div>
      )}
    </div>
  );
};

export default LaporanLabaRugi;
