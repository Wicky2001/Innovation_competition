import axios from 'axios';

const downloadZipFile = async () => {
  console.log("Download button clicked");
  try {
    const response = await axios.get('http://localhost:5001/download-results', {
       responseType: 'blob',
      headers: {
        'Accept': 'application/zip',
        
      }
    });
    console.log(response.data)
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);

    console.log(blob)
    console.log(url)

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'processed-files.zip');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error downloading ZIP file:', error);
  }
};

export default downloadZipFile;
