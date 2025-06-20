import React, { useState, useEffect } from 'react';
import { accountingDataService } from '../../services/accountingDataService.js';
import { exportToCSV, formatCurrency } from '../../utils/csvUtils.js';

const BukuBesar = () => {
  const [bukuBesarData, setBukuBesarData] = useState([]);
  const [akuns, setAkuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    groupDataByAccount();
  }, [bukuBesarData]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bukuBesarResult, akunResult] = await Promise.all([
        accountingDataService.getBukuBesar(),
        accountingDataService.getDaftarAkun()
      ]);
      setBukuBesarData(bukuBesarResult);
      setAkuns(akunResult);
    } catch (err) {
      setError('Gagal memuat data buku besar');
    } finally {
      setLoading(false);
    }
  };

  const groupDataByAccount = () => {
    const grouped = bukuBesarData.reduce((acc, entry) => {
      const accountCode = entry['Kode Akun'];
      if (!acc[accountCode]) {
        acc[accountCode] = {
          accountName: entry['Akun'],
          entries: []
        };
      }
      acc[accountCode].entries.push(entry);
      return acc;
    }, {});
    setGroupedData(grouped);
  };

  const handleExport = () => {
    const dataToExport = selectedAccount 
      ? bukuBesarData.filter(entry => entry['Kode Akun'] === selectedAccount)
      : bukuBesarData;
    
    const filename = selectedAccount 
      ? `buku-besar-${selectedAccount}.csv`
      : 'buku-besar-semua.csv';
    
    exportToCSV(dataToExport, filename);
  };

  const calculateAccountSummary = (entries) => {
    let totalDebit = 0;
    let totalKredit = 0;
    let finalBalance = 0;

    entries.forEach(entry => {
      const debit = parseFloat(entry['Debit']?.replace(/[Rp.,\s]/g, '') || '0');
      const kredit = parseFloat(entry['Kredit']?.replace(/[Rp.,\s]/g, '') || '0');
      totalDebit += debit;
      totalKredit += kredit;
    });

    if (entries.length > 0) {
      const lastEntry = entries[entries.length - 1];
      const saldoStr = lastEntry['Saldo']?.replace(/[Rp.,\s]/g, '') || '0';
      finalBalance = parseFloat(saldoStr.replace('-', '')) * (saldoStr.includes('-') ? -1 : 1);
    }

    return { totalDebit, totalKredit, finalBalance };
  };

  const calculateGrandTotal = () => {
    let grandTotalDebit = 0;
    let grandTotalKredit = 0;
    let grandTotalSaldo = 0;

    Object.values(groupedData).forEach(accountData => {
      if (accountData) {
        const { totalDebit, totalKredit, finalBalance } = calculateAccountSummary(accountData.entries);
        grandTotalDebit += totalDebit;
        grandTotalKredit += totalKredit;
        grandTotalSaldo += Math.abs(finalBalance);
      }
    });

    return { grandTotalDebit, grandTotalKredit, grandTotalSaldo };
  };  if (loading) {
    return (
      <div className="transaksi-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Memuat data buku besar...</p>
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

  const displayData = selectedAccount 
    ? { [selectedAccount]: groupedData[selectedAccount] }
    : groupedData;
  const { grandTotalDebit, grandTotalKredit, grandTotalSaldo } = calculateGrandTotal();
  const totalAccounts = Object.keys(groupedData).length;
  const filteredAccountCount = selectedAccount ? 1 : totalAccounts;

  return (
    <div className="transaksi-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Buku Besar</h1>
        </div>
        <div className="header-actions">
          <select 
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="account-filter"
          >
            <option value="">Semua Akun</option>
            {akuns.map((akun, index) => (
              <option key={index} value={akun['Kode Akun']}>
                {akun['Kode Akun']} - {akun['Nama Akun']}
              </option>
            ))}
          </select>
          <button 
            className="export-btn"
            onClick={handleExport}
            disabled={Object.keys(displayData).length === 0}
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card primary">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3 className="card-title">Total Akun</h3>
            <div className="card-value">{filteredAccountCount}</div>
          </div>
        </div>
        
        <div className="summary-card success">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3 className="card-title">Total Debit</h3>
            <div className="card-value">{formatCurrency(grandTotalDebit)}</div>
          </div>
        </div>
        
        <div className="summary-card info">
          <div className="card-icon">💳</div>
          <div className="card-content">
            <h3 className="card-title">Total Kredit</h3>
            <div className="card-value">{formatCurrency(grandTotalKredit)}</div>
          </div>
        </div>

        <div className="summary-card warning">
          <div className="card-icon">⚖️</div>
          <div className="card-content">
            <h3 className="card-title">Total Saldo</h3>
            <div className="card-value">{formatCurrency(grandTotalSaldo)}</div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="data-section">
        <h3 className="section-title">
          {selectedAccount ? `Detail Akun ${selectedAccount}` : 'Detail Semua Akun'}
        </h3>
        
        {Object.entries(displayData).map(([accountCode, accountData]) => {
          if (!accountData) return null;
          
          const { totalDebit, totalKredit, finalBalance } = calculateAccountSummary(accountData.entries);
          
          return (
            <div key={accountCode} className="account-section">
              <div className="account-header">
                <h4 className="account-title">
                  {accountCode} - {accountData.accountName}
                </h4>
                <div className="account-summary-inline">
                  <span className="summary-badge debit">
                    Debit: {formatCurrency(totalDebit)}
                  </span>
                  <span className="summary-badge kredit">
                    Kredit: {formatCurrency(totalKredit)}
                  </span>
                  <span className={`summary-badge saldo ${finalBalance >= 0 ? 'positive' : 'negative'}`}>
                    Saldo: {formatCurrency(Math.abs(finalBalance))} {finalBalance < 0 ? '(K)' : '(D)'}
                  </span>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Keterangan</th>
                      <th>Debit</th>
                      <th>Kredit</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountData.entries.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry['Tanggal']}</td>
                        <td>{entry['Keterangan']}</td>
                        <td className="amount debit">
                          {entry['Debit'] && entry['Debit'] !== 'Rp0' ? entry['Debit'] : '-'}
                        </td>
                        <td className="amount kredit">
                          {entry['Kredit'] && entry['Kredit'] !== 'Rp0' ? entry['Kredit'] : '-'}
                        </td>
                        <td className="amount">
                          {entry['Saldo'] ? (
                            <span className={entry['Saldo'].includes('-') ? 'negative' : 'positive'}>
                              {entry['Saldo']}
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan="2"><strong>Total</strong></td>
                      <td className="amount debit"><strong>{formatCurrency(totalDebit)}</strong></td>
                      <td className="amount kredit"><strong>{formatCurrency(totalKredit)}</strong></td>
                      <td className="amount">
                        <strong className={finalBalance >= 0 ? 'positive' : 'negative'}>
                          {formatCurrency(Math.abs(finalBalance))} {finalBalance < 0 ? '(K)' : '(D)'}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(displayData).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>Tidak ada data buku besar</h3>
          <p>Belum ada data buku besar untuk akun yang dipilih</p>
        </div>
      )}
    </div>
  );
};

export default BukuBesar;
