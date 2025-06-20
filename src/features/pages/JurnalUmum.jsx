import React, { useState, useEffect } from 'react';
import { accountingDataService } from '../../services/accountingDataService.js';
import { exportToCSV, formatCurrency } from '../../utils/csvUtils.js';

const JurnalUmum = () => {
  const [jurnalData, setJurnalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await accountingDataService.getJurnalUmum();
      setJurnalData(data);
    } catch (err) {
      setError('Gagal memuat data jurnal umum');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(jurnalData, 'jurnal-umum.csv');
  };

  const calculateTotal = () => {
    let totalDebit = 0;
    let totalKredit = 0;

    jurnalData.forEach(entry => {
      const debit = parseFloat(entry['Debit']?.replace(/[Rp.,\s]/g, '') || '0');
      const kredit = parseFloat(entry['Kredit']?.replace(/[Rp.,\s]/g, '') || '0');
      totalDebit += debit;
      totalKredit += kredit;
    });

    return { totalDebit, totalKredit };
  };

  const getJournalSummary = () => {
    const summary = {};
    jurnalData.forEach(entry => {
      const tanggal = entry['Tanggal'];
      if (tanggal) {
        const bulan = tanggal.split('/')[1] || tanggal.split('-')[1];
        const bulanKey = `Bulan ${bulan}`;
        
        if (!summary[bulanKey]) {
          summary[bulanKey] = { count: 0, totalDebit: 0, totalKredit: 0 };
        }
        
        summary[bulanKey].count++;
        summary[bulanKey].totalDebit += parseFloat(entry['Debit']?.replace(/[Rp.,\s]/g, '') || '0');
        summary[bulanKey].totalKredit += parseFloat(entry['Kredit']?.replace(/[Rp.,\s]/g, '') || '0');
      }
    });
    return summary;
  };

  if (loading) {
    return (
      <div className="transaksi-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Memuat data jurnal umum...</p>
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

  const { totalDebit, totalKredit } = calculateTotal();
  const journalSummary = getJournalSummary();
  const isBalanced = totalDebit === totalKredit;

  return (
    <div className="transaksi-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Jurnal Umum</h1>
        </div>
        <button 
          className="export-btn"
          onClick={handleExport}
          disabled={jurnalData.length === 0}
        >
          📤 Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card primary">
          <div className="card-icon">📝</div>
          <div className="card-content">
            <h3 className="card-title">Total Entri</h3>
            <div className="card-value">{jurnalData.length}</div>
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
          <div className="card-icon">{isBalanced ? '✅' : '⚠️'}</div>
          <div className="card-content">
            <h3 className="card-title">Status</h3>
            <div className="card-value">{isBalanced ? 'Seimbang' : 'Tidak Seimbang'}</div>
          </div>
        </div>
      </div>


      {/* Data Table */}
      <div className="data-section">
        <h3 className="section-title">Daftar Jurnal Umum</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>Debit</th>
                <th>Kredit</th>
              </tr>
            </thead>
            <tbody>
              {jurnalData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry['Tanggal']}</td>
                  <td>{entry['Keterangan']}</td>
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
                <td colSpan="4"><strong>Total</strong></td>
                <td className="amount debit"><strong>{formatCurrency(totalDebit)}</strong></td>
                <td className="amount kredit"><strong>{formatCurrency(totalKredit)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {jurnalData.length > 0 && (
          <div className="table-footer">
            <div className="total-row">
              <div className="balance-summary">
                <span className="balance-label">Status Neraca: </span>
                <span className={`balance-status ${isBalanced ? 'balanced' : 'unbalanced'}`}>
                  {isBalanced ? '✅ Seimbang' : '⚠️ Tidak Seimbang'}
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

      {jurnalData.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Tidak ada data jurnal</h3>
          <p>Belum ada entri jurnal yang tercatat dalam sistem</p>
        </div>
      )}
    </div>
  );
};

export default JurnalUmum;
