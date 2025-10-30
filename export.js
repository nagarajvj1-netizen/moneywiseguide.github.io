// Export Module - PDF, CSV, and Image exports

// Download chart as image
function downloadChart(chartId) {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
        console.error('Chart not found:', chartId);
        return;
    }

    const link = document.createElement('a');
    link.download = `${chartId}_${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Export metrics table to CSV
function exportToCSV() {
    const table = document.getElementById('metrics-table');
    if (!table) {
        alert('No data available to export');
        return;
    }

    let csv = [];
    const rows = table.querySelectorAll('tr');

    for (let row of rows) {
        const cols = row.querySelectorAll('td, th');
        const csvRow = [];
        
        for (let col of cols) {
            let text = col.innerText.replace(/"/g, '""'); // Escape quotes
            csvRow.push(`"${text}"`);
        }
        
        csv.push(csvRow.join(','));
    }

    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mutual_fund_analysis_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Download report as PDF
async function downloadReportPDF() {
    const { jsPDF } = window.jspdf;
    
    if (!jsPDF) {
        alert('PDF library not loaded. Please try again.');
        return;
    }

    try {
        // Show loading message
        const originalContent = document.getElementById('report-content').innerHTML;
        const loadingMsg = document.createElement('div');
        loadingMsg.style.textAlign = 'center';
        loadingMsg.style.padding = '20px';
        loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        
        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (2 * margin);
        let yPosition = margin;

        // Helper function to add text with word wrap
        function addText(text, fontSize = 10, isBold = false, color = [0, 0, 0]) {
            pdf.setFontSize(fontSize);
            pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
            pdf.setTextColor(...color);
            
            const lines = pdf.splitTextToSize(text, contentWidth);
            
            for (let line of lines) {
                if (yPosition > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }
                pdf.text(line, margin, yPosition);
                yPosition += fontSize * 0.5;
            }
            yPosition += 3; // Add spacing after text
        }

        // Add title
        addText('Mutual Fund Performance Analysis Report', 18, true, [0, 102, 204]);
        yPosition += 5;

        // Add date
        addText(`Generated on: ${new Date().toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        })}`, 10, false, [100, 100, 100]);
        yPosition += 8;

        // Extract report content
        const reportContent = document.getElementById('report-content');
        const sections = reportContent.querySelectorAll('.report-section');

        for (let section of sections) {
            // Section title
            const titleElem = section.querySelector('h4');
            if (titleElem) {
                const title = titleElem.innerText.replace(/[^\w\s&:-]/g, '').trim();
                addText(title, 14, true, [0, 102, 204]);
                yPosition += 2;
            }

            // Section content
            const paragraphs = section.querySelectorAll('p');
            for (let p of paragraphs) {
                const text = p.innerText.trim();
                if (text) {
                    addText(text, 10);
                    yPosition += 2;
                }
            }

            // Lists
            const lists = section.querySelectorAll('ul, ol');
            for (let list of lists) {
                const items = list.querySelectorAll('li');
                for (let item of items) {
                    const text = '• ' + item.innerText.trim();
                    addText(text, 9);
                }
                yPosition += 3;
            }

            // Subsections
            const subsections = section.querySelectorAll('h5');
            for (let i = 0; i < subsections.length; i++) {
                const subsection = subsections[i];
                const title = subsection.innerText.replace(/[^\w\s&:-]/g, '').trim();
                addText(title, 11, true, [0, 168, 107]);
                
                // Get content after this subsection until next subsection or end
                let nextElem = subsection.nextElementSibling;
                while (nextElem && nextElem.tagName !== 'H5') {
                    if (nextElem.tagName === 'P') {
                        addText(nextElem.innerText.trim(), 10);
                        yPosition += 2;
                    } else if (nextElem.tagName === 'UL' || nextElem.tagName === 'OL') {
                        const items = nextElem.querySelectorAll('li');
                        for (let item of items) {
                            addText('• ' + item.innerText.trim(), 9);
                        }
                        yPosition += 2;
                    }
                    nextElem = nextElem.nextElementSibling;
                }
            }

            yPosition += 5; // Space between sections
        }

        // Add footer to all pages
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(
                `Page ${i} of ${pageCount} | Mutual Fund Performance Analyzer | Disclaimer: Past performance is not indicative of future results`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        const fileName = `MF_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

        // Show success message
        setTimeout(() => {
            alert('PDF downloaded successfully!');
        }, 500);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Export selected data as JSON (for advanced users)
function exportDataJSON(data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mutual_fund_data_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export all charts as a single image (composite)
async function exportAllCharts() {
    const chartsContainer = document.querySelector('.charts-container');
    if (!chartsContainer) {
        alert('No charts available to export');
        return;
    }

    try {
        const canvas = await html2canvas(chartsContainer, {
            backgroundColor: '#ffffff',
            scale: 2 // Higher quality
        });

        const link = document.createElement('a');
        link.download = `all_charts_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error exporting charts:', error);
        alert('Error exporting charts. Please try individual chart downloads.');
    }
}
