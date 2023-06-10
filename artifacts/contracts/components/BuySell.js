import React, {useEffect} from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Functiondetails from './functions.js';
import { getBasicData, checkFunction, deployContract, deployedContract } from '../api/sell.js';
import { useSigner, useAccount } from 'wagmi';
import  SellProxy  from '../contracts/ASEProxy/ASE_Proxy.json';
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";
import sell_token from "../config.js"

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
}));
  
const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));
  
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const BuySell = () => {
    const [expanded, setExpanded] = React.useState('panel1');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const history = useHistory();
    const { data: signer } = useSigner()
    console.log(signer)
    const [errorsList, seterrorsList] = React.useState([]);
    const [eventsList, seteventsList] = React.useState([]);
    const [modifiersList, setmodifiersList] = React.useState([]);
    const [testchecked, setChecked] = React.useState(false);
    const [refresh, setrefresh] = React.useState(false);
    const [smartcontractadd, setsmartcontractadd] = React.useState();
    const { isConnected } = useAccount()
    const [bodyvalues, setbodyvalues] = React.useState()
    const [isloading, setisloading] = React.useState(false)
    const _marketplace = new ethers.Contract( // We will use this to interact with the AuctionManager
        sell_token,
        SellProxy.abi,
        signer
    );

    useEffect(() => {
        setisloading(true)
        getBasicData('sell')
				.then((res) => {
                    if(res.data) {
                        seteventsList(res.data.events)
                        seterrorsList(res.data.errors)
                        setmodifiersList(res.data.modifiers)
                    } else {
                        toast.error('Network Error! Reload the page', {
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
				})
        setisloading(false)
    }, [])

    console.log(isloading)

    const Check = async () => {
        setisloading(true)
        console.log({ eventsList: eventsList, errorsList: errorsList, modifiersList: modifiersList, functionlist: bodyvalues })
        await checkFunction('sell', JSON.stringify({ eventsList: eventsList, errorsList: errorsList, modifiersList: modifiersList, functionlist: bodyvalues }))
            .then((res) => {
                console.log(res)
                if(res.data){
                    setsmartcontractadd({ipfs:res.data,contract_addr:""})
                    setChecked(true)
                    toast.success('Compaire the Smart Contracts and then Deploy', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                } else {
                    toast.error('Error occured while creating the new smart contract. Try Again!', {
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
            })
        setisloading(false)
    }
    
    const Deploy = async () => {
        setisloading(true)
        if(isConnected){
            await deployContract('sell', JSON.stringify({ eventsList: eventsList, errorsList: errorsList, modifiersList: modifiersList, functionlist: bodyvalues }))
				.then(async (res) => {
                    console.log(res)
                    if (res.data) {
                        setsmartcontractadd(res.data)
                        setChecked(true)
                        console.log(res)
                        let adreessval = res.data.contract_addr
                        console.log(adreessval)
                        try {
                            await _marketplace.createVotingProposal(adreessval);
                            deployedContract(adreessval)
                                .then((res) => {
                                    if (res.data){
                                        toast.success('Deployed! Compaire the Smart Contracts and then Deploy', {
                                            position: "top-left",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "light",
                                            });
                                        history.push(`/vote`)
                                    } else {
                                        toast.error('Error occured while creating the new smart contract. Try Again!', {
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
                                })
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
                        toast.error('Error occured while creating the new smart contract. Try Again!', {
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
				})
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

    const handleEvents = (id, name, description, value) => {
        let boolval
        if (value===1){
            boolval = 0
        } else {
            boolval = 1
        }
        let newValue =  [name, description, boolval]
        let previouslist = eventsList
        previouslist[id] = newValue;
        seteventsList(previouslist);
        setrefresh(!refresh)
    }

    const handleErrors = (id, name, description, value) => {
        let boolval
        if (value===1){
            boolval = 0
        } else {
            boolval = 1
        }
        let newValue =  [name, description, boolval]
        let previouslist = errorsList
        previouslist[id] = newValue;
        seterrorsList(previouslist);
        setrefresh(!refresh)
    }

    const handleModifiers = (id, name, description, value) => {
        let boolval
        if (value===1){
            boolval = 0
        } else {
            boolval = 1
        }
        let newValue =  [name, description, boolval]
        let previouslist = modifiersList
        previouslist[id] = newValue;
        setmodifiersList(previouslist);
        setrefresh(!refresh)
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', height: '100vh' }}>
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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} >
                        <div>
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography>Events</Typography>
                                </AccordionSummary>
                                <AccordionDetails style={{display: 'flex', flexDirection:'row', justifyContent:'center', alignContent: 'center'}}>
                                    <FormGroup>
                                        {eventsList.map((event, id) => {
                                            return(<FormControlLabel onClick={() => handleEvents(id, event[0], event[1], event[2])} key={id} control={<Checkbox checked={Boolean(event[2])}/>} label={event[0] + " - " + event[1]} />)
                                        })}
                                        {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                                        <FormControlLabel required control={<Checkbox />} label="Required" />
                                        <FormControlLabel disabled control={<Checkbox />} label="Disabled" /> */}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                <Typography>Errors</Typography>
                                </AccordionSummary>
                                <AccordionDetails style={{display: 'flex', flexDirection:'row', justifyContent:'center', alignContent: 'center'}}>
                                    <FormGroup>
                                        {errorsList.map((error, id) => {
                                            return(<FormControlLabel onClick={() => handleErrors(id, error[0], error[1], error[2])} key={id} control={<Checkbox checked={Boolean(error[2])}/>} label={error[0] + " - " + error[1]} />)
                                        })}
                                        {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                                        <FormControlLabel required control={<Checkbox />} label="Required" />
                                        <FormControlLabel disabled control={<Checkbox />} label="Disabled" /> */}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                <Typography>Modifiers</Typography>
                                </AccordionSummary>
                                <AccordionDetails style={{display: 'flex', flexDirection:'row', justifyContent:'center', alignContent: 'center'}}>
                                    <FormGroup>
                                        {modifiersList.map((modifier, id) => {
                                            return(<FormControlLabel onClick={() => handleModifiers(id, modifier[0], modifier[1], modifier[2])} key={id} control={<Checkbox checked={Boolean(modifier[2])}/>} label={modifier[0] + " - " + modifier[1]} />)
                                        })}
                                        {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                                        <FormControlLabel required control={<Checkbox />} label="Required" />
                                        <FormControlLabel disabled control={<Checkbox />} label="Disabled" /> */}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                                <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                                <Typography>Functions</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                        <Functiondetails contract_type={'sell'} bodyvalues={bodyvalues} setbodyvalues={setbodyvalues}/>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                        <Stack direction="row" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} spacing={3}>
                                <Button variant="outlined" color="primary" onClick={()=>Check()} >
                                    Check
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={()=>Deploy()} >
                                    Deploy
                                </Button>
                            </Stack>
                        </div>
                    </Grid>
                    {testchecked ? 
                    <>
                        <Grid item xs={12} md={6}>
                            <h1>Current Contract</h1>
                            <iframe 
                                style={{
                                    width: "80%",
                                    height: "100%",
                                    overflow: "visible",
                                    minHeight: "60vh",                 
                                    minWidth: "100vw",
                                    border: '2px solid black'
                                }} 
                                title = "Current Contract"
                                src={smartcontractadd ? smartcontractadd.ipfs : "https://res.cloudinary.com/isuruieee/raw/upload/v1685011682/sell_logic_itauje.txt"}>
                            </iframe> 
                            {/* <p>hii</p> */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h1>Updated Contract</h1>
                            <iframe 
                                style={{
                                    width: "80%",
                                    height: "100%",
                                    overflow: "visible",
                                    minHeight: "60vh",
                                    minWidth: "100vw",
                                    border: '2px solid black'
                                }}
                                title = "Updated Contract"
                                src= {smartcontractadd ? smartcontractadd.ipfs : "https://res.cloudinary.com/isuruieee/raw/upload/v1685011682/sell_logic_itauje.txt"}>
                            </iframe> 
                            {/* <p>hii</p> */}
                        </Grid>
                    </> : null}
                        
                </Grid>
            </div>
        );
    }
};

export default BuySell;