import React from 'react';
import { useParams } from 'react-router-dom';


const ViewCOntract = () => {
    const { address } = useParams();
    console.log(address)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', height: '100vh' }}>          
            <h1>Upgraded Contract</h1>
            <iframe 
                style={{
                    width: "80%",
                    height: "80%",
                    overflow: "visible",
                    minHeight: "100vh",
                    minWidth: "100vw",
                    border: '2px solid black'
                }} 
                title = "Updated Contract"
                src={"https://gateway.pinata.cloud/ipfs/"+address}>
            </iframe> 
        </div>
  );
};

export default ViewCOntract;