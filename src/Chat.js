import React, { useState, useEffect } from 'react';
import { Button, Accordion, AccordionSummary, AccordionDetails, Typography, Divider, Grid } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatInterface from './ChatInterface';

function Chat() {
  const [topics, setTopics] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [methods, setMethods] = useState([]);
  const [currentAlts, setCurrentAlts] = useState({});
  const [data, setData] = useState();
  const [shuffleCount, setShuffleCount] = useState({});

  useEffect(() => {
    const cachedData = sessionStorage.getItem('cachedData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setData(parsedData);
      processFetchedData(parsedData); // Process the cached data to extract methods and alternatives
    } else {
      // Fetching data from the API and processing it
      fetch('https://gs.jasonaa.me/?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vSmp889ksBKKVVwpaxhlIzpDzXNOWjnszEXBP7SC5AyoebSIBFuX5qrcwwv6ud4RCYw2t_BZRhGLT0u/pubhtml?gid=1980586524&single=true')
        .then(response => response.json())
        .then(fetchedData => {
          sessionStorage.setItem('cachedData', JSON.stringify(fetchedData));
          setData(fetchedData);
          processFetchedData(fetchedData); // Process the fetched data to extract methods and alternatives
        })
        .catch(error => {
          console.error('Fetching data failed:', error);
        });
    }
  }, []);

  // Function to process data and extract methods and alternatives
  const processFetchedData = (fetchedData) => {
    if (fetchedData && Array.isArray(fetchedData)) {
      // Extract unique methods and shuffle them
      let uniqueMethods = fetchedData.map(item => item.Uniques).filter(unique => unique);
      for (let i = uniqueMethods.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueMethods[i], uniqueMethods[j]] = [uniqueMethods[j], uniqueMethods[i]];
      }
  
      // Only pull in 5 random Unique key values
      uniqueMethods = uniqueMethods.slice(0, 5);
  
      // Map each unique method to its alternatives
      const altsMapping = uniqueMethods.reduce((acc, unique) => {
        const alts = fetchedData
          .filter(item => item.Uniques === unique)
          .map(item => ({ Alt1: item['Alt 1'], Alt2: item['Alt 2'], Alt3: item['Alt 3'] }))
          .reduce((altsAcc, item) => {
            // Flatten the alternatives into a single array and filter out empty strings
            return [...altsAcc, item.Alt1, item.Alt2, item.Alt3].filter(alt => alt);
          }, []);
    
        acc[unique] = alts;
        return acc;
      }, {});
  
      setMethods(uniqueMethods);
      setCurrentAlts(altsMapping);
      setShuffleCount(uniqueMethods.reduce((acc, method) => {
        acc[method] = 0;
        return acc;
      }, {}));
      
    } else {
      // Handle the case where data is not as expected
      console.error('Data is not in the expected format:', fetchedData);
    }
    console.log(currentAlts)
  };

  const handleShuffleClick = (methodName) => {
    // Ensure we have the original alternatives to shuffle
    const originalAlternatives = currentAlts[methodName] || [];
  
    if (originalAlternatives.length === 0) {
      console.error('No alternatives found for method:', methodName); // Debugging log
      return;
    }
  
    // Log the original alternatives for the method
    console.log(`Original alternatives for "${methodName}":`, originalAlternatives);
  
    // Shuffle the original alternatives
    let shuffledAlternatives = shuffleAlternatives(originalAlternatives);
    
    // Update the shuffle count for the method
    setShuffleCount(prevShuffleCount => {
      const updatedCount = prevShuffleCount[methodName] + 1;
  
      // If we've gone through all alternatives, reset the count and use the original method name
      if (updatedCount > originalAlternatives.length) {
        setCurrentAlts(prevCurrentAlts => ({
          ...prevCurrentAlts,
          [methodName]: originalAlternatives
        }));
        return {
          ...prevShuffleCount,
          [methodName]: 0
        };
      } else {
        // Update the alternatives for the method with the shuffled alternatives
        setCurrentAlts(prevCurrentAlts => ({
          ...prevCurrentAlts,
          [methodName]: shuffledAlternatives
        }));
        return {
          ...prevShuffleCount,
          [methodName]: updatedCount
        };
      }
    });
  };

  function shuffleAlternatives(alternatives) {
    let shuffled = alternatives.slice(); // Create a copy of the alternatives array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  }

  const handleDeleteMethod = (methodName) => {
    setMethods(prevMethods => prevMethods.filter(method => method !== methodName));
    const { [methodName]: deletedMethod, ...remainingAlts } = currentAlts;
    setCurrentAlts(remainingAlts);
    const { [methodName]: deletedCount, ...remainingCounts } = shuffleCount;
    setShuffleCount(remainingCounts);
  };

  const handleNewTopic = () => {
    setTopics(['Untitled']);
    setShowDetails(false);
  };

  const handleRenameTopic = (index) => {
    const newTopics = [...topics];
    newTopics[index] = 'Journey one';
    setTopics(newTopics);
    setShowDetails(true);
  };

  return (
    <Grid container style={{ height: '100vh' }}>
      <Grid item style={{ width: '25%', backgroundColor: 'black', color: 'white', padding: '10px' }}>
        <h3>CUSTOM JOURNEY</h3>
        <Button style={{width: '90%'}} variant={topics.length === 0 ? "contained" : "outlined"} color="primary" onClick={handleNewTopic}>
          New Topic
        </Button>
        {topics.map((topic, index) => (
          <div key={index}>
            <Button
              variant="contained"
              style={{ marginTop: '10px', width: '90%' }}
              onClick={() => handleRenameTopic(index)}
            >
              {topic}
            </Button>
          </div>
        ))}
       {methods && methods.map((method, index) => (
        <React.Fragment key={index}>
          <Divider style={{ backgroundColor: 'grey', marginTop: '10px' }} />
          <Accordion>
          <AccordionSummary
            expandIcon={
              <>
                <ShuffleIcon onClick={(e) => {
                  e.stopPropagation();
                  handleShuffleClick(method);
                }} />
                <DeleteIcon onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMethod(method);
                }} />
              </>
            }
          >
            <Typography>
              {shuffleCount[method] === 0
                ? method
                : currentAlts[method] && currentAlts[method][shuffleCount[method] - 1]}
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                This is a placeholder text paragraph designed to simulate conversation content. It will be replaced with actual chat history in the future.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </React.Fragment>
      ))}
    </Grid>
    <Grid item xs>
      <ChatInterface />
    </Grid>
  </Grid>
  );
}

export default Chat;
