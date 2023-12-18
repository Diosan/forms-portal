import axios  from 'axios';

const stylesForPrinting = `

body {
  font-family: 'Arial', sans-serif;  line-height:1.2rem;
}
*{font-size:9pt; line-height:1.2rem}
    
      .signature-format {
          width: 300px;
          border: 2px solid #000; 
          padding:5px 10px 7px 10px
        }
        
        .signature-format .col {
          padding:0px
        }
        
        .swf-e-signed{
          font-size:.8rem;
          font-weight:bold;
          color:#555
        }
        .swf-swif{
          font-size:1rem;
          font-weight:bold;
          margin-left:4px;
          color:#c13127
        }
        .swf-sign{
          display:flex;
          align-items: center;
        }
        
        .text-placeholder{
          padding: 0px;
          font-size:.75rem;
          margin:0 0 1px 0;
          text-align:right
        }
        .text-placeholder {
          line-height: 1.2;
        }
        
        .logo-placeholder {
          margin:3px 0 0 0;
          text-align:left;
        }
        
        .name-placeholder {
          line-height: 1.1;
          font-size:1rem;
          margin:5px 0;
        }
        
        .hash-placeholder {
          font-size:.8rem;
          line-height:.82rem;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
          word-break: break-all;
          margin:0
        }
      .accused-table {
          display: flex;
          flex-direction: column;
        }
        
        .flex-row {
          display: flex;
          flex-direction: row;
          align-items: center; /* Optional, for vertical centering */
          margin-bottom: 10px; /* Spacing between rows */
        }
        
        .flex-cell {
          margin-right: 10px; /* Spacing between cells */
        }
        
        .offence-table {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        .flex-header, .flex-row {
          display: flex;
          justify-content: space-between;
        }
        
        .header-cell, .row-cell {
          flex-grow: 1;
          text-align: left;
          padding: 5px; /* Adjust as needed */
          border-bottom: 1px solid #ddd; /* For a line under each row */
        }
        
        .flex-header {
          background-color: #f9f9f9; /* Optional, for header background */
          font-weight: bold; /* Optional, for header font styling */
        }
        
        .sig-top{
          padding:0 10px
        }
        
        
        
        .swf-container{
            border-radius: 5px;
            max-width: 900px;
            padding: 20px 40px;
            margin: 30px 30px 30px 300px;
            flex-grow: 1;
        }
        
        .left-column {
          box-shadow: 5px 0 5px -5px rgba(0, 0, 0, 0.2); /* Small shadow on the right */
        }
        
        
        .btn-xs {
          padding: .25rem .5rem;
          font-size: .875rem;
          line-height: 1.2;
          border-radius: .2rem;
        }
        
        
        #container-pdf{
          width:700px;
          padding:10px 50px 10px 20px;
        }
        
        
        
        .form-control, .form-select{
            border-radius:0;
            color:#000;
        }
        
        .rjsf #root {
            /* max-width: 1280px; */
            width: 100%;
            margin: 0;
            padding: 20px;
            text-align: center;
            background-color: #fff;
            /* display:flex;
            flex-wrap: wrap;
            gap:30px; */
            color: #000;
            
        
          }
        
         
        
          .swf-flex-container fieldset {
            /* max-width: 1280px; */
            width: 100%;
            margin: 0;
            text-align: center;
            background-color: #fff;
            display:flex;
            flex-wrap: wrap;
            gap:10%;
            color: #000;
          }
          .swf-flex-container fieldset .form-group{
            /* max-width: 1280px; */
            width: 45%;
          }
        
        .sw-col-a{
            flex: 0 0 200px; /* This sets the left column to a fixed width of 200px */
            max-width: 200px;
        }
        
        .sw-col-b{
          flex-grow: 1; /* This allows the right column to take up the remaining space */
            text-align: left; /* Aligns text to the left */
        }
        
        
          .flex-container {
            /* display: flex; */
            justify-content: space-between;
          }
          
          .flex-item {
            flex: 1 1 50%;
          }
        
          .group-submission{
            padding:15px;
          }
        
          .swf-step{
            padding:10px;
            color:#000;
            font-weight: bold;
            height:100%
          }
        
          .swf-step-1 {
            padding: 10px;
            color: #000;
            font-weight: bold;
            position: absolute;
            right:0;
            z-index:1000;
            top: 0;
            height: 100%;
        }
        
        .accused-card .rjsf{
            padding:0;
        }
        
        .accused-index{
          position:absolute; 
          max-width:200px;
          min-width:100px;
          font-weight:bold;
          font-size:.9rem;
          background-color:#feeee1;
          border:2px solid #f5c59e;
          color:#333;
          padding:5px 15px;
          top:-10px; right:-15px
        }
        
        .accused-card .rjsf #root{
            padding:0;
        }
        
        .add-charge .rjsf #root{
          background-color:transparent;
        
        }
        .add-charge .rjsf {
            margin-bottom: 10px;
            margin-top:20px;
        }
        
        #root__title{
            font-weight:bold;
        }
        #root__description{
            font-size: 18px;
        }

    .accused-table td {
      padding-right: 0;
    }

    .offence-table th {
      padding: 3px 5px;
    }

    .offence-table td {
      padding: 3px 5px;
      border: 1px solid #555;
    }

    .swf-tbl,
    #pdf-container .flex-header,
    .pdf-head {
      gap: 10px;
    }
    .swf-tbl {
    }
    .swf-tbl .flex-row,
    .pdf-head .header-cell {
      border-right: 1px solid #555;
      margin-bottom: 0;
      padding-bottom: 4px;
    }

    .swf-tbl .flex-row.last,
    .pdf-head .header-cell.last {
      border-right: transparent;
    }

    .swf-tbl .flex-row.first,
    .header-cell.first {
      border-left: 1px solid #555;
      padding: 5px 5px 5px 10px;
    }
    .swf-tbl {
      border-bottom: 1px solid #555;
      border-right: 1px solid #555;
    }

    .pdf-head {
      border-top: 1px solid #555;
      border-bottom: 1px solid #555;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #555;
    }

    .header-cell {
      border-bottom: transparent;
    }
    #regForm {
      background-color: #f1f1f1;
      margin: 50px auto;
      width: 100%;
      min-width: 300px;
  }
  .rjsf {
    margin-bottom: 50px;
  }
  
  .form-group {
    text-align: left;
  }
  
  
  
  .form-control {
    margin-bottom: 20px;
  }
  
  .progress-buttons {
    text-align: right;
  }
  
  .rjsf{
    padding:10px 20px;
  }
  
  .next-button {
    margin-left: 5px;
  }
  
  .control-label {
    font-weight: bold;
  }
  
  .accused-card {
    margin-bottom: 30px;
  }
  
  .add-charge fieldset {
   width: 70%;
  }
  
  .control-label {
    color: #444;
  }
  
  .submissions-container {
    background-color: #f1f1f1;
    padding: 50px 100px;
  }
  
  .submission-card {
    margin-bottom: 20px !important;
  }
  
  .new-submission-btn {
    margin-bottom: 50px;
  }
  
  .submissions-title {
    margin: 40px 0;
  }
  
  .complainant-details {
    width: 700px;
    text-align: left;
  }
  
  .complainant-details label {
    font-weight: bold;
  }
  
  .signature-frame {
    border: 3px solid #444;
    padding: 40px;
  }
  
  `

export const exportPDF = (elementId:string, serverUrl:string, submissionId:number) => {
  return new Promise((resolve, reject) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found.');
      }
      // Get the HTML content
      const htmlContent = element.outerHTML;
      const htmlToPrint = `<html><head><style>${stylesForPrinting}</style></head>
      <body>${htmlContent}</body
      </html>`;
        // Prepare the data to be sent
        const data = {
          html: htmlToPrint,
          submissionId: submissionId
        };
      // console.log(data);
      // Send the request to the server
      axios.post(serverUrl, data, {
        // responseType: 'blob' // This ensures we get the PDF data back
      })
      .then(response => {
        // Create a URL for the PDF blob
        console.log(response || "")
        // Open the PDF in a new window or tab
        // window.open(response?.data?.efilingResponse?.documentLink, '_blank');
        resolve(response?.data?.efilingResponse?.documentlink);
      })
      .catch(error => {
        console.error('Error sending HTML to server:', error);
        reject(error);
      });
    } catch (error) {
      console.error('Error in HTML to PDF conversion:', error);
      reject(error);
    }
  });
};
