// Data service untuk sistem akuntansi berdasarkan dummy data
import { parseCSV } from '../utils/csvUtils.js';

// Mock data berdasarkan context April 2025
const mockData = {  daftarAkun: `Kode Akun,Nama Akun
111,Persediaan
112,Pendapatan Penjualan
113,Beban Utilitas
114,Kas
115,Beban Gaji
116,Beban Sewa`,  transaksi: `Tanggal,Jenis Transaksi,Akun Debit,Akun Kredit,Nominal,Keterangan
04/01/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp31.967.160,Pendapatan makanan/minuman
04/01/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.312.933,Pembelian bahan baku makanan/minuman
04/02/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp30.470.967,Pendapatan makanan/minuman
04/02/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.846.399,Pembelian bahan baku makanan/minuman
04/03/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp32.465.850,Pendapatan makanan/minuman
04/03/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.845.431,Pembelian bahan baku makanan/minuman
04/04/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp27.482.636,Pendapatan makanan/minuman
04/04/25,Pembelian Bahan Baku,Persediaan,Kas,Rp8.595.571,Pembelian bahan baku makanan/minuman
04/05/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp37.065.223,Pendapatan makanan/minuman
04/05/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.503.371,Pembelian bahan baku makanan/minuman
04/06/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp22.553.023,Pendapatan makanan/minuman
04/06/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.237.802,Pembelian bahan baku makanan/minuman
04/07/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp21.041.875,Pendapatan makanan/minuman
04/07/25,Pembelian Bahan Baku,Persediaan,Kas,Rp7.525.381,Pembelian bahan baku makanan/minuman
04/08/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp37.262.214,Pendapatan makanan/minuman
04/08/25,Pembelian Bahan Baku,Persediaan,Kas,Rp7.834.911,Pembelian bahan baku makanan/minuman
04/09/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp35.052.671,Pendapatan makanan/minuman
04/09/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.757.622,Pembelian bahan baku makanan/minuman
04/10/25,Pembelian Bahan Baku,Persediaan,Kas,Rp7.762.098,Pembelian bahan baku makanan/minuman
04/10/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp20.208.035,Pendapatan makanan/minuman
04/11/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp22.473.735,Pendapatan makanan/minuman
04/11/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.779.455,Pembelian bahan baku makanan/minuman
04/12/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp36.732.897,Pendapatan makanan/minuman
04/12/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.107.718,Pembelian bahan baku makanan/minuman
04/13/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp36.068.276,Pendapatan makanan/minuman
04/13/25,Pembelian Bahan Baku,Persediaan,Kas,Rp7.514.954,Pembelian bahan baku makanan/minuman
04/14/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp26.014.343,Pendapatan makanan/minuman
04/14/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.047.929,Pembelian bahan baku makanan/minuman
04/15/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp39.590.659,Pendapatan makanan/minuman
04/15/25,Pembelian Bahan Baku,Persediaan,Kas,Rp8.256.327,Pembelian bahan baku makanan/minuman
04/16/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp37.314.584,Pendapatan makanan/minuman
04/16/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.429.573,Pembelian bahan baku makanan/minuman
04/17/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.346.003,Pembelian bahan baku makanan/minuman
04/17/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp32.922.560,Pendapatan makanan/minuman
04/18/25,Pembelian Bahan Baku,Persediaan,Kas,Rp7.329.932,Pembelian bahan baku makanan/minuman
04/18/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp28.765.302,Pendapatan makanan/minuman
04/19/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp28.257.772,Pendapatan makanan/minuman
04/19/25,Pembelian Bahan Baku,Persediaan,Kas,Rp7.185.591,Pembelian bahan baku makanan/minuman
04/20/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp21.602.311,Pendapatan makanan/minuman
04/20/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.846.828,Pembelian bahan baku makanan/minuman
04/21/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp30.756.579,Pendapatan makanan/minuman
04/21/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.049.351,Pembelian bahan baku makanan/minuman
04/22/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp26.473.005,Pendapatan makanan/minuman
04/22/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.271.386,Pembelian bahan baku makanan/minuman
04/23/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp25.935.627,Pendapatan makanan/minuman
04/23/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.397.672,Pembelian bahan baku makanan/minuman
04/24/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp33.467.923,Pendapatan makanan/minuman
04/24/25,Pembelian Bahan Baku,Persediaan,Kas,Rp8.075.082,Pembelian bahan baku makanan/minuman
04/25/25,Bayar Gaji,Beban Gaji,Kas,Rp60.000.000,Gaji karyawan
04/25/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.972.735,Pembelian bahan baku makanan/minuman
04/25/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp24.843.474,Pendapatan makanan/minuman
04/26/25,Pembelian Bahan Baku,Persediaan,Kas,Rp6.153.808,Pembelian bahan baku makanan/minuman
04/26/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp22.313.456,Pendapatan makanan/minuman
04/27/25,Pembelian Bahan Baku,Persediaan,Kas,Rp5.636.035,Pembelian bahan baku makanan/minuman
04/27/25,Bayar Sewa,Beban Sewa,Kas,Rp10.000.000,Pembayaran sewa bulanan
04/27/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp22.209.542,Pendapatan makanan/minuman
04/28/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp31.108.277,Pendapatan makanan/minuman
04/28/25,Pembelian Bahan Baku,Persediaan,Kas,Rp7.014.316,Pembelian bahan baku makanan/minuman
04/29/25,Penjualan Tunai,Kas,Pendapatan Penjualan,Rp33.057.408,Pendapatan makanan/minuman
04/29/25,Pembelian Bahan Baku,Persediaan,Kas,Rp8.196.112,Pembelian bahan baku makanan/minuman
04/29/25,Bayar Air/Listrik,Beban Utilitas,Kas,Rp10.000.000,Pembayaran air dan listrik`,  jurnalUmum: `Tanggal,Keterangan,Kode Akun,Nama Akun,Debit,Kredit
01/04/2025,Penjualan Tunai,114,Kas,Rp31.967.160,
01/04/2025,Penjualan Tunai,112,Pendapatan Penjualan,,Rp31.967.160
01/04/2025,Pembelian Bahan Baku,111,Persediaan,Rp6.312.933,
01/04/2025,Pembelian Bahan Baku,114,Kas,,Rp6.312.933
02/04/2025,Penjualan Tunai,114,Kas,Rp30.470.967,
02/04/2025,Penjualan Tunai,112,Pendapatan Penjualan,,Rp30.470.967
02/04/2025,Pembelian Bahan Baku,111,Persediaan,Rp5.846.399,
02/04/2025,Pembelian Bahan Baku,114,Kas,,Rp5.846.399
03/04/2025,Penjualan Tunai,114,Kas,Rp32.465.850,
03/04/2025,Penjualan Tunai,112,Pendapatan Penjualan,,Rp32.465.850
03/04/2025,Pembelian Bahan Baku,111,Persediaan,Rp6.845.431,
03/04/2025,Pembelian Bahan Baku,114,Kas,,Rp6.845.431
04/04/2025,Penjualan Tunai,114,Kas,Rp27.482.636,
04/04/2025,Penjualan Tunai,112,Pendapatan Penjualan,,Rp27.482.636
04/04/2025,Pembelian Bahan Baku,111,Persediaan,Rp8.595.571,
04/04/2025,Pembelian Bahan Baku,114,Kas,,Rp8.595.571
05/04/2025,Penjualan Tunai,114,Kas,Rp37.065.223,
05/04/2025,Penjualan Tunai,112,Pendapatan Penjualan,,Rp37.065.223
05/04/2025,Pembelian Bahan Baku,111,Persediaan,Rp5.503.371,
05/04/2025,Pembelian Bahan Baku,114,Kas,,Rp5.503.371
25/04/2025,Bayar Gaji,115,Beban Gaji,Rp60.000.000,
25/04/2025,Bayar Gaji,114,Kas,,Rp60.000.000
27/04/2025,Bayar Sewa,116,Beban Sewa,Rp10.000.000,
27/04/2025,Bayar Sewa,114,Kas,,Rp10.000.000
29/04/2025,Bayar Air/Listrik,113,Beban Utilitas,Rp10.000.000,
29/04/2025,Bayar Air/Listrik,114,Kas,,Rp10.000.000`,  bukuBesar: `Tanggal,Keterangan,Kode Akun,Akun,Debit,Kredit,Saldo
01/04/25,Penjualan Tunai,114,Kas,Rp31.967.160,Rp0,Rp31.967.160
01/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.312.933,Rp25.654.227
02/04/25,Penjualan Tunai,114,Kas,Rp30.470.967,Rp0,Rp56.125.194
02/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.846.399,Rp50.278.795
03/04/25,Penjualan Tunai,114,Kas,Rp32.465.850,Rp0,Rp82.744.645
03/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.845.431,Rp75.899.214
04/04/25,Penjualan Tunai,114,Kas,Rp27.482.636,Rp0,Rp103.381.850
04/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp8.595.571,Rp94.786.279
05/04/25,Penjualan Tunai,114,Kas,Rp37.065.223,Rp0,Rp131.851.502
05/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.503.371,Rp126.348.131
06/04/25,Penjualan Tunai,114,Kas,Rp22.553.023,Rp0,Rp148.901.154
06/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.237.802,Rp142.663.352
07/04/25,Penjualan Tunai,114,Kas,Rp21.041.875,Rp0,Rp163.705.227
07/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp7.525.381,Rp156.179.846
08/04/25,Penjualan Tunai,114,Kas,Rp37.262.214,Rp0,Rp193.442.060
08/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp7.834.911,Rp185.607.149
09/04/25,Penjualan Tunai,114,Kas,Rp35.052.671,Rp0,Rp220.659.820
09/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.757.622,Rp214.902.198
10/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp7.762.098,Rp207.140.100
10/04/25,Penjualan Tunai,114,Kas,Rp20.208.035,Rp0,Rp227.348.135
11/04/25,Penjualan Tunai,114,Kas,Rp22.473.735,Rp0,Rp249.821.870
11/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.779.455,Rp244.042.415
12/04/25,Penjualan Tunai,114,Kas,Rp36.732.897,Rp0,Rp280.775.312
12/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.107.718,Rp274.667.594
13/04/25,Penjualan Tunai,114,Kas,Rp36.068.276,Rp0,Rp310.735.870
13/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp7.514.954,Rp303.220.916
14/04/25,Penjualan Tunai,114,Kas,Rp26.014.343,Rp0,Rp329.235.259
14/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.047.929,Rp323.187.330
15/04/25,Penjualan Tunai,114,Kas,Rp39.590.659,Rp0,Rp362.777.989
15/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp8.256.327,Rp354.521.662
16/04/25,Penjualan Tunai,114,Kas,Rp37.314.584,Rp0,Rp391.836.246
16/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.429.573,Rp385.406.673
17/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.346.003,Rp379.060.670
17/04/25,Penjualan Tunai,114,Kas,Rp32.922.560,Rp0,Rp411.983.230
18/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp7.329.932,Rp404.653.298
18/04/25,Penjualan Tunai,114,Kas,Rp28.765.302,Rp0,Rp433.418.600
19/04/25,Penjualan Tunai,114,Kas,Rp28.257.772,Rp0,Rp461.676.372
19/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp7.185.591,Rp454.490.781
20/04/25,Penjualan Tunai,114,Kas,Rp21.602.311,Rp0,Rp476.093.092
20/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.846.828,Rp470.246.264
21/04/25,Penjualan Tunai,114,Kas,Rp30.756.579,Rp0,Rp501.002.843
21/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.049.351,Rp495.953.492
22/04/25,Penjualan Tunai,114,Kas,Rp26.473.005,Rp0,Rp522.426.497
22/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.271.386,Rp517.155.111
23/04/25,Penjualan Tunai,114,Kas,Rp25.935.627,Rp0,Rp543.090.738
23/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.397.672,Rp537.693.066
24/04/25,Penjualan Tunai,114,Kas,Rp33.467.923,Rp0,Rp571.160.989
24/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp8.075.082,Rp563.085.907
25/04/25,Bayar Gaji,114,Kas,Rp0,Rp60.000.000,Rp503.085.907
25/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.972.735,Rp496.113.172
25/04/25,Penjualan Tunai,114,Kas,Rp24.843.474,Rp0,Rp520.956.646
26/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp6.153.808,Rp514.802.838
26/04/25,Penjualan Tunai,114,Kas,Rp22.313.456,Rp0,Rp537.116.294
27/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp5.636.035,Rp531.480.259
27/04/25,Bayar Sewa,114,Kas,Rp0,Rp10.000.000,Rp521.480.259
27/04/25,Penjualan Tunai,114,Kas,Rp22.209.542,Rp0,Rp543.689.801
28/04/25,Penjualan Tunai,114,Kas,Rp31.108.277,Rp0,Rp574.798.078
28/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp7.014.316,Rp567.783.762
29/04/25,Penjualan Tunai,114,Kas,Rp33.057.408,Rp0,Rp600.841.170
29/04/25,Pembelian Bahan Baku,114,Kas,Rp0,Rp8.196.112,Rp592.645.058
29/04/25,Bayar Air/Listrik,114,Kas,Rp0,Rp10.000.000,Rp582.645.058
01/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.312.933,Rp0,Rp6.312.933
02/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.846.399,Rp0,Rp12.159.332
03/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.845.431,Rp0,Rp19.004.763
04/04/25,Pembelian Bahan Baku,111,Persediaan,Rp8.595.571,Rp0,Rp27.600.334
05/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.503.371,Rp0,Rp33.103.705
06/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.237.802,Rp0,Rp39.341.507
07/04/25,Pembelian Bahan Baku,111,Persediaan,Rp7.525.381,Rp0,Rp46.866.888
08/04/25,Pembelian Bahan Baku,111,Persediaan,Rp7.834.911,Rp0,Rp54.701.799
09/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.757.622,Rp0,Rp60.459.421
10/04/25,Pembelian Bahan Baku,111,Persediaan,Rp7.762.098,Rp0,Rp68.221.519
11/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.779.455,Rp0,Rp74.000.974
12/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.107.718,Rp0,Rp80.108.692
13/04/25,Pembelian Bahan Baku,111,Persediaan,Rp7.514.954,Rp0,Rp87.623.646
14/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.047.929,Rp0,Rp93.671.575
15/04/25,Pembelian Bahan Baku,111,Persediaan,Rp8.256.327,Rp0,Rp101.927.902
16/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.429.573,Rp0,Rp108.357.475
17/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.346.003,Rp0,Rp114.703.478
18/04/25,Pembelian Bahan Baku,111,Persediaan,Rp7.329.932,Rp0,Rp122.033.410
19/04/25,Pembelian Bahan Baku,111,Persediaan,Rp7.185.591,Rp0,Rp129.219.001
20/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.846.828,Rp0,Rp135.065.829
21/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.049.351,Rp0,Rp140.115.180
22/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.271.386,Rp0,Rp145.386.566
23/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.397.672,Rp0,Rp150.784.238
24/04/25,Pembelian Bahan Baku,111,Persediaan,Rp8.075.082,Rp0,Rp158.859.320
25/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.972.735,Rp0,Rp165.832.055
26/04/25,Pembelian Bahan Baku,111,Persediaan,Rp6.153.808,Rp0,Rp171.985.863
27/04/25,Pembelian Bahan Baku,111,Persediaan,Rp5.636.035,Rp0,Rp177.621.898
28/04/25,Pembelian Bahan Baku,111,Persediaan,Rp7.014.316,Rp0,Rp184.636.214
29/04/25,Pembelian Bahan Baku,111,Persediaan,Rp8.196.112,Rp0,Rp192.832.326
01/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp31.967.160,Rp31.967.160
02/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp30.470.967,Rp62.438.127
03/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp32.465.850,Rp94.903.977
04/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp27.482.636,Rp122.386.613
05/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp37.065.223,Rp159.451.836
06/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp22.553.023,Rp182.004.859
07/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp21.041.875,Rp203.046.734
08/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp37.262.214,Rp240.308.948
09/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp35.052.671,Rp275.361.619
10/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp20.208.035,Rp295.569.654
11/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp22.473.735,Rp318.043.389
12/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp36.732.897,Rp354.776.286
13/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp36.068.276,Rp390.844.562
14/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp26.014.343,Rp416.858.905
15/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp39.590.659,Rp456.449.564
16/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp37.314.584,Rp493.764.148
17/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp32.922.560,Rp526.686.708
18/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp28.765.302,Rp555.452.010
19/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp28.257.772,Rp583.709.782
20/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp21.602.311,Rp605.312.093
21/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp30.756.579,Rp636.068.672
22/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp26.473.005,Rp662.541.677
23/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp25.935.627,Rp688.477.304
24/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp33.467.923,Rp721.945.227
25/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp24.843.474,Rp746.788.701
26/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp22.313.456,Rp769.102.157
27/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp22.209.542,Rp791.311.699
28/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp31.108.277,Rp822.419.976
29/04/25,Penjualan Tunai,112,Pendapatan Penjualan,Rp0,Rp33.057.408,Rp855.477.384
25/04/25,Bayar Gaji,115,Beban Gaji,Rp60.000.000,Rp0,Rp60.000.000
27/04/25,Bayar Sewa,116,Beban Sewa,Rp10.000.000,Rp0,Rp10.000.000
29/04/25,Bayar Air/Listrik,113,Beban Utilitas,Rp10.000.000,Rp0,Rp10.000.000`,neracaSaldo: `Kode Akun,Nama Akun,Debit,Kredit
114,Kas,Rp855.477.384,Rp272.832.326
115,Beban Gaji,Rp60.000.000,Rp0
116,Beban Sewa,Rp10.000.000,Rp0
113,Beban Utilitas,Rp10.000.000,Rp0
111,Persediaan,Rp192.832.326,Rp0
112,Pendapatan Penjualan,Rp0,Rp855.477.384`,  labaRugi: `Kategori,Kode Akun,Nama Akun,Nominal
Pendapatan,112,Pendapatan Penjualan,Rp855.477.384
Beban,115,Beban Gaji,Rp60.000.000
Beban,116,Beban Sewa,Rp10.000.000
Beban,113,Beban Utilitas,Rp10.000.000
Beban,111,Persediaan,Rp192.832.326`,  kertasKerja: `Kode Akun,Nama Akun,Neraca Saldo Debit,Neraca Saldo Kredit,Penyesuaian Debit,Penyesuaian Kredit,Neraca Saldo Setelah Penyesuaian Debit,Neraca Saldo Setelah Penyesuaian Kredit,Laba Rugi Debit,Laba Rugi Kredit
114,Kas,Rp855.477.384,Rp272.832.326,Rp0,Rp0,Rp855.477.384,Rp272.832.326,Rp0,Rp0
115,Beban Gaji,Rp60.000.000,Rp0,Rp0,Rp0,Rp60.000.000,Rp0,Rp60.000.000,Rp0
116,Beban Sewa,Rp10.000.000,Rp0,Rp0,Rp0,Rp10.000.000,Rp0,Rp10.000.000,Rp0
113,Beban Utilitas,Rp10.000.000,Rp0,Rp0,Rp0,Rp10.000.000,Rp0,Rp10.000.000,Rp0
111,Persediaan,Rp192.832.326,Rp0,Rp0,Rp0,Rp192.832.326,Rp0,Rp192.832.326,Rp0
112,Pendapatan Penjualan,Rp0,Rp855.477.384,Rp0,Rp0,Rp0,Rp855.477.384,Rp0,Rp855.477.384`
};

export const accountingDataService = {
  // Daftar Akun
  getDaftarAkun: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return parseCSV(mockData.daftarAkun);
  },

  addAkun: async (akun) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: akun };
  },

  updateAkun: async (kodeAkun, akun) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: akun };
  },

  deleteAkun: async (kodeAkun) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  // Transaksi
  getTransaksi: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return parseCSV(mockData.transaksi);
  },

  addTransaksi: async (transaksi) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: transaksi };
  },

  // Jurnal Umum
  getJurnalUmum: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return parseCSV(mockData.jurnalUmum);
  },

  // Buku Besar
  getBukuBesar: async (kodeAkun = null) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = parseCSV(mockData.bukuBesar);
    if (kodeAkun) {
      return data.filter(item => item['Kode Akun'] === kodeAkun);
    }
    return data;
  },

  // Neraca Saldo
  getNeracaSaldo: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return parseCSV(mockData.neracaSaldo);
  },
  // Laporan Laba Rugi
  getLaporanLabaRugi: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return parseCSV(mockData.labaRugi);
  },

  // Kertas Kerja
  getKertasKerja: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return parseCSV(mockData.kertasKerja);
  }
};
