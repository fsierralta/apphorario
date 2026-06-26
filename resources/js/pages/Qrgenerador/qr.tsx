import { useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
//import QRCode from 'react-qr-code';

export default function QRGenerator() {
    const [qrSvg, setQrSvg] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [inputText, setInputText] = useState<string>('');

    const generateQR = async () => {
        console.log('Generating QR code with text:', inputText);
        try { 
            const sanitizedInput = encodeURIComponent(inputText.trim());
            const response = await axios.get(route('g.qr', sanitizedInput));
            console.log('QR code generated:', response);
            
            setQrSvg(response.data.qr)
            setUrl(response.data.url)
          }       
         catch (error) {
            console.error('Error generating QR code:', error);
           

         }
         

         
            
     
        
       ;
    };

    return (
        <div>
            <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Texto para QR"
            />
            <button onClick={generateQR}>Generar QR</button>
            {qrSvg && <div dangerouslySetInnerHTML={{ __html: url }} />}
             {qrSvg && (
               /*  <div className='flex justify-center border border-gray-300 rounded-lg p-4 py-8'>
                <QRCode
                    value={qrSvg}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                     level="H" // L, M, Q, H 
                />
                <div> */
                <div className='flex justify-center border border-gray-300 rounded-lg p-4 py-8'>

                    <img src={qrSvg} alt="qr" 
                    className='border border-gray-300  '
                    />
                </div>
               

            )}

        </div>
    );
}
