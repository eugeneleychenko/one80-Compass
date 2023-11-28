import React, { useState } from 'react';
import { Button, Accordion, AccordionSummary, AccordionDetails, Typography, Divider, Grid } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ChatInterface from './ChatInterface';

function Chat() {
  const [topics, setTopics] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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
        {showDetails && [...Array(5).keys()].map((methodIndex) => (
          <React.Fragment key={methodIndex}>
            <Divider style={{ backgroundColor: 'grey', marginTop: '10px' }} />
            <Accordion>
              <AccordionSummary expandIcon={<ShuffleIcon />}>
                <Typography>Method {methodIndex + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
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
