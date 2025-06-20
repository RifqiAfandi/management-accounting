import React, { useState, useEffect } from 'react';
import { accountingDataService } from '../../services/accountingDataService.js';
import { formatCurrency } from '../../utils/csvUtils.js';

const InputLaporan = () => {
  const [daftarAkun, setDaftarAkun] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jenisTransaksi: '',
    akunDebit: '',
    akunKredit: '',
    nominal: '',
    keterangan: ''
  });

  useEffect(() => {
    loadDaftarAkun();
  }, []);

  const loadDaftarAkun = async () => {
    try {
      const data = await accountingDataService.getDaftarAkun();
      setDaftarAkun(data);
    } catch (err) {
      setError('Gagal memuat daftar akun');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.jenisTransaksi || !formData.akunDebit || !formData.akunKredit || !formData.nominal || !formData.keterangan) {
      setError('Semua field harus diisi');
      return;
    }

    if (formData.akunDebit === formData.akunKredit) {
      setError('Akun debit dan kredit tidak boleh sama');
      return;
    }

    if (parseFloat(formData.nominal) <= 0) {
      setError('Nominal harus lebih besar dari 0');
      return;
    }

    try {
      setLoading(true);
      
      // Format data for submission
      const transactionData = {
        ...formData,
        nominal: formatCurrency(parseFloat(formData.nominal))
      };

      // Submit transaction (assuming addTransaksi method exists)
      await accountingDataService.addTransaksi(transactionData);
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        jenisTransaksi: '',
        akunDebit: '',
        akunKredit: '',
        nominal: '',
        keterangan: ''
      });
      
    } catch (err) {
      setError('Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const jenisTransaksiOptions = [
    'Penjualan Tunai',
    'Penjualan Kredit',
    'Pembelian Tunai',
    'Pembelian Kredit',
    'Pembayaran Gaji',
    'Pembayaran Sewa',
    'Pembayaran Utilitas',
    'Penerimaan Kas',
    'Pengeluaran Kas',
    'Lainnya'
  ];

  return (
    <div className="transaksi-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Input Laporan Transaksi</h1>
          <p className="page-subtitle">Tambahkan transaksi baru ke dalam sistem</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="data-section">
        <h3 className="section-title">Form Input Transaksi</h3>
        
        {/* Status Messages */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <span>✅ Transaksi berhasil disimpan</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-grid">
            {/* Tanggal */}
            <div className="form-group">
              <label htmlFor="tanggal">Tanggal</label>
              <input
                type="date"
                id="tanggal"
                value={formData.tanggal}
                onChange={(e) => handleInputChange('tanggal', e.target.value)}
                required
              />
            </div>

            {/* Jenis Transaksi */}
            <div className="form-group">
              <label htmlFor="jenisTransaksi">Jenis Transaksi</label>
              <select
                id="jenisTransaksi"
                value={formData.jenisTransaksi}
                onChange={(e) => handleInputChange('jenisTransaksi', e.target.value)}
                required
              >
                <option value="">Pilih Jenis Transaksi</option>
                {jenisTransaksiOptions.map((jenis, index) => (
                  <option key={index} value={jenis}>{jenis}</option>
                ))}
              </select>
            </div>

            {/* Akun Debit */}
            <div className="form-group">
              <label htmlFor="akunDebit">Akun Debit</label>
              <select
                id="akunDebit"
                value={formData.akunDebit}
                onChange={(e) => handleInputChange('akunDebit', e.target.value)}
                required
              >
                <option value="">Pilih Akun Debit</option>
                {daftarAkun.map((akun, index) => (
                  <option key={index} value={akun['Nama Akun']}>
                    {akun['Kode Akun']} - {akun['Nama Akun']}
                  </option>
                ))}
              </select>
            </div>

            {/* Akun Kredit */}
            <div className="form-group">
              <label htmlFor="akunKredit">Akun Kredit</label>
              <select
                id="akunKredit"
                value={formData.akunKredit}
                onChange={(e) => handleInputChange('akunKredit', e.target.value)}
                required
              >
                <option value="">Pilih Akun Kredit</option>
                {daftarAkun.map((akun, index) => (
                  <option key={index} value={akun['Nama Akun']}>
                    {akun['Kode Akun']} - {akun['Nama Akun']}
                  </option>
                ))}
              </select>
            </div>

            {/* Nominal */}
            <div className="form-group">
              <label htmlFor="nominal">Nominal</label>
              <input
                type="number"
                id="nominal"
                placeholder="Masukkan nominal"
                value={formData.nominal}
                onChange={(e) => handleInputChange('nominal', e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Keterangan */}
            <div className="form-group full-width">
              <label htmlFor="keterangan">Keterangan</label>
              <textarea
                id="keterangan"
                placeholder="Masukkan keterangan transaksi"
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                rows="3"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner small"></span>
                  Menyimpan...
                </>
              ) : (
                <>
                  💾 Simpan Transaksi
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Transaction Preview */}
      {formData.jenisTransaksi && formData.akunDebit && formData.akunKredit && formData.nominal && (
        <div className="data-section">
          <h3 className="section-title">Preview Transaksi</h3>
          <div className="preview-card">
            <div className="preview-row">
              <span className="preview-label">Tanggal:</span>
              <span className="preview-value">{formData.tanggal}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Jenis Transaksi:</span>
              <span className="preview-value">{formData.jenisTransaksi}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Akun Debit:</span>
              <span className="preview-value">{formData.akunDebit}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Akun Kredit:</span>
              <span className="preview-value">{formData.akunKredit}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Nominal:</span>
              <span className="preview-value">{formatCurrency(parseFloat(formData.nominal || 0))}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Keterangan:</span>
              <span className="preview-value">{formData.keterangan}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputLaporan;
