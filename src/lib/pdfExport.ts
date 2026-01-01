export const exportToPDF = async () => {
  const element = document.getElementById("resume-preview");
  if (!element) {
    throw new Error("Resume preview element not found");
  }

  // Use browser print functionality for clean PDF
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Could not open print window. Please allow popups.");
  }

  const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Georgia, serif;
        line-height: 1.4;
        color: black;
        background: white;
      }
      @page {
        size: letter;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Resume</title>
        ${styles}
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
