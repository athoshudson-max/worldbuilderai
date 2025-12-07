import { jsPDF } from "jspdf";
import { WorldData } from '../types';

export const generateWorldPDF = (data: WorldData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - margin * 2;
  let yPosition = 20;

  // Add a helper for page breaks
  const checkPageBreak = (heightNeeded: number) => {
    if (yPosition + heightNeeded > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(45, 42, 46); // #2d2a2e
  const title = data.basics.name || "Mundo Sem Nome";
  doc.text(title, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;

  // Subtitle / Description
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  const desc = data.basics.description || "Sem descrição";
  const splitDesc = doc.splitTextToSize(desc, maxLineWidth);
  doc.text(splitDesc, pageWidth / 2, yPosition, { align: "center" });
  yPosition += (splitDesc.length * 5) + 15;

  // Sections
  const sections: { title: string, key: keyof WorldData }[] = [
    { title: "Básico", key: "basics" },
    { title: "Geografia", key: "geography" },
    { title: "Locais de Significância", key: "locations" },
    { title: "Clima e Tempo", key: "weather" },
    { title: "Povos e Espécies", key: "people" },
    { title: "Idiomas", key: "languages" },
    { title: "Estrutura Social", key: "socialFrameworks" },
    { title: "Civilização", key: "civilization" },
    { title: "Religião", key: "religion" },
    { title: "Educação", key: "education" },
    { title: "Lazer", key: "leisure" },
    { title: "Magia, Tecnologia e Armas", key: "magicTechWeapons" },
    { title: "Economia", key: "economy" },
    { title: "Transporte", key: "transportation" },
    { title: "Negócios", key: "business" },
    { title: "Política e Lei", key: "politics" },
  ];

  sections.forEach(section => {
    checkPageBreak(40);

    // Section Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(139, 94, 60); // #8b5e3c
    doc.text(section.title.toUpperCase(), margin, yPosition);
    yPosition += 8;
    
    // Line separator
    doc.setDrawColor(139, 94, 60);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    const contentObj = data[section.key];
    const fields = Object.entries(contentObj);
    
    if (fields.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Sem informações.", margin, yPosition);
      yPosition += 10;
    }

    fields.forEach(([key, value]) => {
      // Skip empty fields if desired, or show them. Let's show only filled or placeholders.
      if (!value) return; 

      const textVal = String(value);
      
      // Field Label
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      checkPageBreak(15);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(label, margin, yPosition);
      yPosition += 6;

      // Field Content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60);
      
      const splitText = doc.splitTextToSize(textVal, maxLineWidth);
      
      // Check if text block fits, if not page break and continue
      // Simple check: if block is huge, just page break start
      if (checkPageBreak(splitText.length * 5)) {
          // Re-print label if page break happened? No, just continue text.
          // But simpler to just print.
      }
      
      doc.text(splitText, margin, yPosition);
      yPosition += (splitText.length * 5) + 8;
    });
    
    yPosition += 5;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount} - Gerado por WorldBuilder AI`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  doc.save(`${(data.basics.name || "worldbuilder").replace(/\s+/g, '_').toLowerCase()}.pdf`);
};