import React, { useState, useEffect } from 'react';
import { accountingDataService } from '../../services/accountingDataService.js';
import { exportToCSV } from '../../utils/csvUtils.js';

const DaftarAkun = () => {
  const [daftarAkun, setDaftarAkun] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await accountingDataService.getDaftarAkun();
      setDaftarAkun(data);
    } catch (err) {
      setError('Gagal memuat daftar akun');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(daftarAkun, 'daftar-akun.csv');
  };
  const getAccountSummary = () => {
    const summary = {};
    daftarAkun.forEach(akun => {
      const kodeAkun = akun['Kode Akun'];
      
      let kategori = 'Lainnya';
      // Updated logic for specific account codes
      switch (kodeAkun) {
        case '111':
          kategori = 'Aset';
          break;
        case '112':
          kategori = 'Pendapatan';
          break;
        case '113':
        case '115':
        case '116':
          kategori = 'Beban';
          break;
        case '114':
          kategori = 'Aset';
          break;
        default:
          // Fallback to prefix-based categorization
          const prefix = kodeAkun?.charAt(0);
          switch (prefix) {
            case '1':
              kategori = 'Aset';
              break;
            case '2':
              kategori = 'Kewajiban';
              break;
            case '3':
              kategori = 'Ekuitas';
              break;
            case '4':
              kategori = 'Pendapatan';
              break;
            case '5':
              kategori = 'Beban';
              break;
            default:
              kategori = 'Lainnya';
          }
      }
      
      if (!summary[kategori]) {
        summary[kategori] = 0;
      }
      summary[kategori]++;
    });
    return summary;
  };

  if (loading) {
    return (
      <div className="transaksi-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Memuat daftar akun...</p>
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

  const accountSummary = getAccountSummary();

  return (
    <div className="transaksi-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Daftar Akun</h1>
        </div>
        <button 
          className="export-btn"
          onClick={handleExport}
          disabled={daftarAkun.length === 0}
        >
          📤 Export CSV
        </button>
      </div>

      {/* Data Table */}
      <div className="data-section">
        <h3 className="section-title">Daftar Akun</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>Kategori</th>
              </tr>
            </thead>
            <tbody>              {daftarAkun.map((akun, index) => {
                const kodeAkun = akun['Kode Akun'];
                
                let kategori = 'Lainnya';
                // Updated logic for specific account codes
                switch (kodeAkun) {
                  case '111':
                    kategori = 'Aset';
                    break;
                  case '112':
                    kategori = 'Pendapatan';
                    break;
                  case '113':
                  case '115':
                  case '116':
                    kategori = 'Beban';
                    break;
                  case '114':
                    kategori = 'Aset';
                    break;
                  default:
                    // Fallback to prefix-based categorization
                    const prefix = kodeAkun?.charAt(0);
                    switch (prefix) {
                      case '1':
                        kategori = 'Aset';
                        break;
                      case '2':
                        kategori = 'Kewajiban';
                        break;
                      case '3':
                        kategori = 'Ekuitas';
                        break;
                      case '4':
                        kategori = 'Pendapatan';
                        break;
                      case '5':
                        kategori = 'Beban';
                        break;
                      default:
                        kategori = 'Lainnya';
                    }
                }

                return (
                  <tr key={index}>
                    <td className="code">{kodeAkun}</td>
                    <td>{akun['Nama Akun']}</td>
                    <td>
                      <span className={`category-badge ${kategori.toLowerCase()}`}>
                        {kategori}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {daftarAkun.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Tidak ada data akun</h3>
          <p>Belum ada akun yang tercatat dalam sistem</p>
        </div>
      )}
    </div>
  );
};

export default DaftarAkun;
