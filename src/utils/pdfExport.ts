import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportResumeToPDF = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume preview element not found');
  }

  // Capture the element as canvas with high quality
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  // PDF dimensions (A4)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210; // A4 width in mm
  const pdfHeight = 297; // A4 height in mm
  const margin = 10; // Margin in mm
  const contentWidth = pdfWidth - (2 * margin);
  
  // Calculate scaled dimensions
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // Handle multi-page PDFs
  let heightLeft = imgHeight;
  let position = margin;
  
  // Add first page
  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, '', 'FAST');
  heightLeft -= (pdfHeight - 2 * margin);
  
  // Add additional pages if needed
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, '', 'FAST');
    heightLeft -= (pdfHeight - 2 * margin);
  }
  
  pdf.save(`${fileName}.pdf`);
};
