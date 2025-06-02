import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className={`relative ${isFullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {isFullScreen && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsFullScreen(false)}
            className="bg-[#0c5a79] text-white px-4 py-2 rounded hover:opacity-90"
          >
            Close
          </button>
        </div>
      )}
      
      <div className={`${isFullScreen ? 'h-screen overflow-auto' : 'h-[200px] overflow-hidden'}`}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
        >
          <Page
            pageNumber={currentPage}
            scale={isFullScreen ? 1.2 : 0.3}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {!isFullScreen && (
        <div className="mt-2 flex justify-center gap-2">
          <button
            onClick={() => setIsFullScreen(true)}
            className="bg-[#0c5a79] text-white px-3 py-1 text-sm rounded hover:opacity-90"
          >
            View Full Screen
          </button>
        </div>
      )}

      {isFullScreen && numPages && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white p-2 rounded shadow-lg">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-[#0c5a79] text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-[#0c5a79]">
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
            disabled={currentPage >= numPages}
            className="px-3 py-1 bg-[#0c5a79] text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer; 