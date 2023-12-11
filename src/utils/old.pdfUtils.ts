import { jsPDF } from 'jspdf';

const exportPDF = (elementId: string, serverUrl: string, submissionId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found.');
      }

      const doc = new jsPDF({
        orientation: 'portrait', // or 'landscape'
        unit: 'px', // units like 'mm', 'cm', 'in', 'px'
        format: [850, 1100] // or [width, height]
      });

      const margins = { top:0, bottom: 50, left: 30, right: 100 };


      
      doc.html(element, {
        callback: (doc) => {
          const pdfData = doc.output('blob');
          const formData = new FormData();
          const pdfFile = new File([pdfData], "document.pdf", { type: "application/pdf" });
          formData.append('pdf', pdfFile);

          // Append the submissionId to the FormData
          formData.append('submissionId', submissionId.toString());

          fetch(serverUrl, {
            method: 'POST',
            body: formData,
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Server responded with an error.');
            }
            return response.json();
          })
          .then(responseBody => {
            resolve(responseBody.message); // Assuming the server responds with a message
          })
          .catch(error => {
            reject(error);
          });
        },
        // x: 10,
        // y: 10,
        x: margins.left,
        y: margins.top,
        // Optionally, you can set the width and height to respect right and bottom margins
        width: doc.internal.pageSize.width - margins.left - margins.right

      });
    } catch (error) {
      console.error('Error in PDF generation:', error);
      reject(error);
    }
  });
};

export { exportPDF };
