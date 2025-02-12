'use client'

interface DownloadLinkProps {
  url: string;
  className?: string;
}

export function DownloadLink({ url, className }: DownloadLinkProps) {
  return (
    <button
      onClick={async () => {
        try {
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'Ita-Pai-Resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          console.log('Download initiated');
        } catch (error) {
          console.error('Error downloading PDF:', error);
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
      }}
      className={className}
    >
      Download PDF
    </button>
  );
}
