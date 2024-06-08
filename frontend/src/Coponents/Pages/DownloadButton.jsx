import React from 'react';
import downloadZipFile from '../../functions/handleDownload';

const DownloadButton =({path,processComplete})=>{

    return (
        <button onClick={()=>downloadZipFile(path)} disabled={!processComplete} >
          {(processComplete)? "Download":""}
        </button>
      );
}
export default  DownloadButton ;