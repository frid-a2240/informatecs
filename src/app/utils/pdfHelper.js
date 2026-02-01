// src/app/utils/pdfHelper.js
import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { ConstanciaPDF } from '../components/Constancias';

export const descargarConstanciaPDF = async (datos) => {
  try {
    // 1. Generar el QR dinámico
    const urlVerificacion = `${window.location.origin}/verificar/${datos.folio}`;
    const qrDataURL = await QRCode.toDataURL(urlVerificacion, {
      width: 200,
      margin: 1,
    });

    // 2. Crear el documento PDF con los datos y el QR
    const doc = <ConstanciaPDF datos={{ ...datos, qrData: qrDataURL }} />;
    
    // 3. Generar el archivo (Blob) y disparar descarga
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Constancia_${datos.folio}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    return true;
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw error;
  }
};