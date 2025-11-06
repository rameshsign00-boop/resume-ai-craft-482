import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportResumeToPDF = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume preview element not found');
  }

  // Clone the element to modify styles for PDF
  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '0';
  clonedElement.style.width = element.offsetWidth + 'px';
  clonedElement.style.background = '#ffffff';
  
  // Apply PDF-friendly styles
  const applyPdfStyles = (el: HTMLElement) => {
    // Make all text darker and more readable
    const color = window.getComputedStyle(el).color;
    if (color.includes('rgba') || color.includes('rgb')) {
      el.style.color = '#000000';
    }
    
    // Fix muted text
    if (el.classList.contains('text-muted-foreground')) {
      el.style.color = '#666666';
    }
    
    // Fix foreground text
    if (el.classList.contains('text-foreground')) {
      el.style.color = '#000000';
    }
    
    // Ensure backgrounds are solid
    const bgColor = window.getComputedStyle(el).backgroundColor;
    if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
      el.style.backgroundColor = 'transparent';
    }
    
    // Process all children
    Array.from(el.children).forEach(child => {
      if (child instanceof HTMLElement) {
        applyPdfStyles(child);
      }
    });
  };
  
  applyPdfStyles(clonedElement);
  document.body.appendChild(clonedElement);

  try {
    // Capture the cloned element with high quality
    const canvas = await html2canvas(clonedElement, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: clonedElement.scrollWidth,
      windowHeight: clonedElement.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.background = '#ffffff';
        }
      },
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
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight, '', 'FAST');
    heightLeft -= (pdfHeight - 2 * margin);
    
    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= (pdfHeight - 2 * margin);
    }
    
    pdf.save(`${fileName}.pdf`);
  } finally {
    // Clean up cloned element
    document.body.removeChild(clonedElement);
  }
};
