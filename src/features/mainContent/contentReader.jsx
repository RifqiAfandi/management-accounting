import React from "react";
import DaftarAkun from "../pages/DaftarAkun.jsx";
import Transaksi from "../pages/Transaksi.jsx";
import JurnalUmum from "../pages/JurnalUmum.jsx";
import BukuBesar from "../pages/BukuBesar.jsx";
import NeracaSaldo from "../pages/NeracaSaldo.jsx";
import KertasKerja from "../pages/KertasKerja.jsx";
import LaporanLabaRugi from "../pages/LaporanLabaRugi.jsx";
import InputLaporan from "../pages/InputLaporan.jsx";

const ContentRenderer = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <InputLaporan />;
      case "DaftarAkun":
        return <DaftarAkun />;
      case "Transaksi":
        return <Transaksi />;
      case "JurnalUmum":
        return <JurnalUmum />;
      case "BukuBesar":
        return <BukuBesar />;
      case "NeracaSaldo":
        return <NeracaSaldo />;
      case "KertasKerja":
        return <KertasKerja />;
      case "LaporanLabaRugi":
        return <LaporanLabaRugi />;
      default:
        return <InputLaporan />;
    }
  };

  return <>{renderContent()}</>;
};

export default ContentRenderer;