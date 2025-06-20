import React, { useState, useEffect } from 'react';
import { accountingDataService } from '../../services/accountingDataService.js';
import { exportToCSV, formatCurrency } from '../../utils/csvUtils.js';

const Transaksi = () => {
  const [transaksiData, setTransaksiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await accountingDataService.getTransaksi();
      setTransaksiData(data);
    } catch (err) {
      setError('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(transaksiData, 'transaksi.csv');
  };

  const calculateTotal = () => {
    return transaksiData.reduce((total, entry) => {
      const nominal = parseFloat(entry['Nominal']?.replace(/[Rp.,\s]/g, '') || '0');
      return total + nominal;
    }, 0);
  };

  const getTransactionSummary = () => {
    const summary = {};
    transaksiData.forEach(entry => {
      const type = entry['Jenis Transaksi'];
      if (!summary[type]) {
        summary[type] = { count: 0, total: 0 };
      }
      summary[type].count++;
      summary[type].total += parseFloat(entry['Nominal']?.replace(/[Rp.,\s]/g, '') || '0');
    });
    return summary;
  };  if (loading) {
    return (
      <div className="transaksi-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Memuat data transaksi...</p>
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
  }  const totalTransaksi = calculateTotal();
  const transactionSummary = getTransactionSummary();

  return (
    <div className="transaksi-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Data Transaksi</h1>
        </div>
        <button 
          className="export-btn"
          onClick={handleExport}
          disabled={transaksiData.length === 0}
        >
          📤 Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card primary">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3 className="card-title">Total Transaksi</h3>
            <div className="card-value">{transaksiData.length}</div>
          </div>
        </div>
        
        <div className="summary-card success">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3 className="card-title">Total Nominal</h3>
            <div className="card-value">{formatCurrency(totalTransaksi)}</div>
          </div>
        </div>
        
        <div className="summary-card info">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3 className="card-title">Jenis Transaksi</h3>
            <div className="card-value">{Object.keys(transactionSummary).length}</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-section">
        <h3 className="section-title">Daftar Transaksi</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Transaksi</th>
                <th>Akun Debit</th>
                <th>Akun Kredit</th>
                <th>Nominal</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {transaksiData.map((transaksi, index) => (
                <tr key={index}>
                  <td>{transaksi['Tanggal']}</td>
                  <td>{transaksi['Jenis Transaksi']}</td>
                  <td>{transaksi['Akun Debit']}</td>
                  <td>{transaksi['Akun Kredit']}</td>
                  <td className="amount">{transaksi['Nominal']}</td>
                  <td>{transaksi['Keterangan']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transaksiData.length > 0 && (
          <div className="table-footer">
            <div className="total-row">
              <strong>Total Keseluruhan: {formatCurrency(totalTransaksi)}</strong>
            </div>
          </div>
        )}
      </div>

      {transaksiData.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Tidak ada data transaksi</h3>
          <p>Belum ada transaksi yang tercatat dalam sistem</p>
        </div>
      )}
    </div>
  );
};

export default Transaksi;
