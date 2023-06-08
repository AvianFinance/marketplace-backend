import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getFunctiondetails, getFunction } from '../api/sell.js';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from 'react-select'

const steps = ['Select Function', 'Set Requires', 'Set Modifiers', 'Set events', 'Set Body'];

const Functiondetails = ({contract_type, bodyvalues, setbodyvalues}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [functionList, setfunctionList] = React.useState([]);
  const [requires, setRequires] = React.useState([]);
  const [modifiers, setModifiers] = React.useState([]);
  const [body, setBody] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [refresh, setrefresh] = React.useState(false);
  const [defaults, setDefaults] = React.useState([]);
  const [overall, setOverall] = React.useState({})

  const handleNext = () => {
    if(activeStep!==4){
      const newActiveStep = (activeStep + 1)%steps.length;
      setActiveStep(newActiveStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    if(step===0){
      getFunctiondetails(contract_type)
        .then((res) => {
            setfunctionList(res.data.data)
        })
    }
    setActiveStep(step);
  };

  useEffect(() => {
    getFunctiondetails(contract_type)
      .then((res) => {
          setfunctionList(res.data.data)
      })
  }, [contract_type])

  useEffect(() => {
    setbodyvalues(overall)
  }, [overall])


  const getFunctionDetails = (function_name) => {
    getFunction(contract_type, function_name)
      .then((res) => {
          setModifiers(res.data.data.modifiers)
          setRequires(res.data.data.requires)
          setEvents(res.data.data.events)
          let defaultselects = []
          res.data.data.body[0].map((item) => {
            defaultselects.push(item[1])
          })
          let newlist = []
          let deultvalues = []
          res.data.data.body[1].map((item, index) => {
            newlist.push({value: item[0] , label: (item[0]+" : "+item[1])})
            if(defaultselects.includes(item[0])){
                deultvalues.push(newlist[index])
            }
          })
          setDefaults(deultvalues)
          setBody(newlist)
          setOverall(res.data.data)
      })
    setActiveStep(1);
  }

  const handleEvents = (id, name, description, value) => {
      let bodyval = overall

      let boolval
      if (value===1){
          boolval = 0
      } else {
          boolval = 1
      }
      let newValue =  [name, description, boolval]
      let previouslist = events
      previouslist[id] = newValue;
      bodyval.events = previouslist
      setEvents(previouslist);
      setrefresh(!refresh)
      setOverall(bodyval)
  }

  console.log(overall)

  const handleModifiers = (id, name, description, value) => {
    let bodyval = overall

    let boolval
    if (value===1){
        boolval = 0
    } else {
        boolval = 1
    }
    let newValue =  [name, description, boolval]
    let previouslist = modifiers
    previouslist[id] = newValue;
    bodyval.modifiers = previouslist
    setModifiers(previouslist);
    setrefresh(!refresh)
    setOverall(bodyval)
  }

  const handleRequires = (id, name, description, value) => {
    let bodyval = overall

    let boolval
    if (value===1){
        boolval = 0
    } else {
        boolval = 1
    }
    let newValue =  [name, description, boolval]
    let previouslist = requires
    previouslist[id] = newValue;
    bodyval.requires = previouslist
    setRequires(previouslist);
    setrefresh(!refresh)
    setOverall(bodyval)
  }
  
  const handleChange = (selectedOptions) => {
      let bodyval = overall
      bodyval.body[0] = selectedOptions
      setOverall(bodyval)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
          <React.Fragment>
            {activeStep===0 ? <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              <FormGroup>
                  {functionList.length>0 ? functionList.map((functionval, id) => {
                      return(<FormControlLabel onClick={() => getFunctionDetails(functionval)} key={id} control={<Checkbox />} label={functionval} />)
                  }) : null}
              </FormGroup>
            </Typography> : null }
            {activeStep===1 ? <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              <FormGroup>
                  {requires.length>0 ? requires.map((requireval, id) => {
                      return(<FormControlLabel onClick={() => handleRequires(id, requireval[0], requireval[1], requireval[2])} key={id} control={<Checkbox checked={Boolean(requireval[2])}/>} label={requireval[0] + " - " + requireval[1]} />)
                  }) : null}
              </FormGroup>
            </Typography> : null }
            {activeStep===2 ? <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              <FormGroup>
                {modifiers.length>0 ? modifiers.map((modifier, id) => {
                      return(<FormControlLabel onClick={() => handleModifiers(id, modifier[0], modifier[1], modifier[2])} key={id} control={<Checkbox checked={Boolean(modifier[2])}/>} label={modifier[0] + " - " + modifier[1]} />)
                  }) : null}
              </FormGroup>
            </Typography> : null }
            {activeStep===3 ? <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              <FormGroup>
                  {events.length>0 ? events.map((event, id) => {
                      return(<FormControlLabel onClick={() => handleEvents(id, event[0], event[1], event[2])} key={id} control={<Checkbox checked={Boolean(event[2])}/>} label={event[0] + " - " + event[1]} />)
                  }) : null}
              </FormGroup>
            </Typography> : null }
            {activeStep===4 ? <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              <Select options={body} isMulti defaultValue={defaults} onChange={handleChange}/>
            </Typography> : null }
            {activeStep===0 ? <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
            </Typography> : null }
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }} disabled={activeStep === 4}>
                Next
              </Button>
            </Box>
          </React.Fragment>
      </div>
    </Box>
  );
}

export default Functiondetails;
