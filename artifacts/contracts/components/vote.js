import React, { useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSigner, useAccount} from 'wagmi';
import { ethers } from "ethers";
import { getContracts } from '../api/contracts';
import  SellProxy  from '../contracts/ASEProxy/ASE_Proxy.json';
import RentProxy from '../contracts/AREProxy/ARE_Proxy.json';
import InsProxy from  '../contracts/AIEProxy/AIE_Proxy.json';
import CircularProgress from '@mui/material/CircularProgress';
import { sell_token, rent_token, ins_token} from "../config.js";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function VotingTable() {
    const [open, setOpen] = React.useState(false);
    const handlevote = (address) => {
        console.log("handlevote",address)
        setOpen(true)
    }
    const { data: signer } = useSigner()
    const [isloading, setisloading] = React.useState(false);
    const [numofVotes, setnumofVotes] = React.useState(null);

    const [contracts, setContracts] = React.useState([]);

    let sell_marketplace
    let rent_marketplace
    let ins_marketplace

    const handleVotes = async () => {
        sell_marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
            sell_token,
            SellProxy.abi,
            signer
        );
        rent_marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
            rent_token,
            RentProxy.abi,
            signer
        );
        ins_marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
            ins_token,
            InsProxy.abi,
            signer
        );
        console.log(sell_marketplace)
        console.log(rent_marketplace)
        console.log(ins_marketplace)
        let sellvotes  = await sell_marketplace.calculateVotingResult()
        console.log(sellvotes)
        let rentvotes  = await rent_marketplace.calculateVotingResult()
        console.log(rentvotes)
        let insvotes  = await ins_marketplace.calculateVotingResult()
        console.log(insvotes)
        if (sellvotes===null){
            sellvotes = null
        } else {
            sellvotes = parseInt((sellvotes._hex), 16)
        }
        if (rentvotes===null){
            rentvotes = null
        } else {
            rentvotes = parseInt((rentvotes._hex), 16)
        }
        if (insvotes===null){
            insvotes = null
        } else {
            insvotes = parseInt((insvotes._hex), 16)
        }
        console.log({sell: sellvotes, rent: rentvotes, ins: insvotes})
        setnumofVotes({sell: sellvotes, rent: rentvotes, ins: insvotes})
    }

    useEffect(() => {
        getContracts()
				.then(async(res) => {
                    if(res.data){
                        setContracts(res.data.data)
                    }
                    handleVotes()
				})
        // fetch('http://127.0.0.1:5000/upgraded_contracts')
        //     .then(response => response.json())
        //     .then(data => {
        //         // Handle the response data
        //         console.log(data.data);
        //         setContracts(data.data)
        //     })
        //     .catch(error => {
        //         // Handle any errors
        //         console.error('Error:', error);
        //     });
    }, [])

    const { isConnected } = useAccount()
    const handleupgrade = async (address) => {
        setisloading(true)
        if(isConnected){
            try {
                let _marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
                    '0xf45BE31c4ba4E71D027864F93282C782E2edcFF1',
                    SellProxy.abi,
                    signer
                );
                console.log('marketplace',_marketplace)
                await _marketplace.updateImplContract();
                toast.success('Successfully Updated', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            } catch (error) {
                toast.error(error.reason, {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } else {
            toast.error('Connect Your Metamask', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } 
        setisloading(false)
        
    }
    
    const handleview = (address) => {
        console.log("handleview",address)
        let val = address.split("/")
        console.log(val[val.length - 1])
        window.open(`/viewcontract/${val[val.length - 1]}`, '_blank');
    }

    const voteinfavour = async (status) => {
        setisloading(true)
        if(isConnected){
            console.log("voteinfavour")
            try {
                let _marketplace
                if(status === "sell"){
                    _marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
                        sell_token,
                        SellProxy.abi,
                        signer
                    );
                } else if(status === "rent"){
                    _marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
                        rent_token,
                        RentProxy.abi,
                        signer
                    );
                } else{
                    _marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
                        ins_token,
                        InsProxy.abi,
                        signer
                    );
                }
                let transaction = await _marketplace.voteOnProposal(true);
                console.log('transaction',transaction)
                toast.success('Voting Successfull', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            } catch (error) {
                toast.error(error.reason, {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } else {
            toast.error('Connect Your Metamask', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } 
        setisloading(false)
    }
    const voteagainst = async (status) => {
        setisloading(true)
        if(isConnected){
            try {
                let _marketplace
                if(status === "sell"){
                    _marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
                        sell_token,
                        SellProxy.abi,
                        signer
                    );
                } else if(status === "rent"){
                    _marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
                        rent_token,
                        RentProxy.abi,
                        signer
                    );
                } else{
                    _marketplace = await new ethers.Contract( // We will use this to interact with the AuctionManager
                        ins_token,
                        InsProxy.abi,
                        signer
                    );
                }
                await _marketplace.voteOnProposal(false);
                toast.success('Voting Successfull', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            } catch (error) {
                toast.error(error.reason, {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } else {
            toast.error('Connect Your Metamask', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }    
        setisloading(false)
    }
    
    
    if(isloading){
        return(
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', height: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <CircularProgress />
                </Box>
            </div>
            )
    } else {
        return (
            <div style={{display: 'flex', flexDirection:'row', justifyContent:'center', alignContent: 'center'}}>
                <ToastContainer
                    position="top-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Stack direction="row" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} spacing={3}>
                            <Button variant="outlined" color="primary" onClick={()=>voteinfavour()}>
                                Voting in favor 
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={()=>voteagainst()}>
                                Voting against
                            </Button>
                        </Stack>
                    </Box>
                </Modal>
                <TableContainer sx={{ width: '80%', marginTop: '100px'}} component={Paper} >
                    <Table  aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Contract Address</TableCell>
                            <TableCell align="center">Contract Type</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Number of Votes</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {contracts.map((row) => (
                            <TableRow
                            key={row.contract_address}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell align="center" component="th" scope="row">
                                {row.contract_address}
                            </TableCell>
                            <TableCell align="center">{row.contract_name}</TableCell>
                            <TableCell align="center">{row.status}</TableCell>
                            {row.contract_name === "sell" ? <TableCell align="center">{row.status==="pending" && numofVotes!==null ? numofVotes.sell : "-"}</TableCell> : null}
                            {row.contract_name === "rent" ? <TableCell align="center">{row.status==="pending" && numofVotes!==null ? numofVotes.rent : "-"}</TableCell> : null}
                            {row.contract_name === "ins" ? <TableCell align="center">{row.status==="pending" && numofVotes!==null ? numofVotes.ins : "-"}</TableCell> : null}
                            <TableCell align="center">
                                <Stack direction="row" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} spacing={3}>
                                    <Button disabled={row.status!=="pending"} variant="outlined" color="primary" onClick={()=>handlevote(row.status)}>
                                        Vote
                                    </Button>
                                    <Button disabled={row.status!=="pending"} variant="outlined" color="secondary" onClick={()=>handleupgrade(row.status)}>
                                        Upgrade
                                    </Button>
                                    <Button variant="outlined" color="success" onClick={()=>handleview(row.address)}>
                                        View Contract
                                    </Button>
                                </Stack>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            
        );
    }
}