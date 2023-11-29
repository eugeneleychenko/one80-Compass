import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Container, Grid, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';



function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const isScrolledToBottom = chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight <= chatContainerRef.current.scrollTop + (chatContainerRef.current.clientHeight * 0.75);
      if (isScrolledToBottom) {
        chatContainerRef.current.scrollBy(0, 40);
      }
    }
  }, [messages]);
  

  const userMessages = [
    "I’d like to create a custom journey for a new project",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam malesuada ante at purus lacinia, id dictum neque finibus. Morbi nunc est, mollis in tortor quis, iaculis iaculis eros. In hac habitasse platea dictumst."
  ];

  const friendMessages = [
    "Happy to help, What does your project entail?",
    "For your project, you can approach it through the following: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut efficitur sagittis quam ac accumsan. Aliquam blandit justo sed mauris pellentesque, nec cursus mi molestie. Suspendisse potenti. Discover: Method One Nam sagittis at justo quis facilisis. Nunc hendrerit leo vel ante ornare, sed pulvinar nunc commodo. Aliquam erat volutpat. Etiam ex lectus, volutpat tempor lacus sit amet, placerat",
    "Create Custom Journey from Answer"
  ];

  const handleSendClick = () => {
    setClickCount(prevCount => prevCount + 1);
    if (clickCount % 2 === 0) {
      setMessages([...messages, { text: userMessages[clickCount / 2], sender: 'user' }]);
    } else {
      setMessages([...messages, { text: friendMessages[Math.floor(clickCount / 2)], sender: 'friend' }]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Grid container sx={{ height: '100%' }}>
      <Grid item xs={12} ref={chatContainerRef} sx={{ height: '100%', overflowY: 'auto', paddingBottom: '180px' /* Adjust this value as needed */ }}>
        <List sx={{ padding: 0 }}>
            {messages.map((message, index) => (
            <ListItem key={index} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Paper elevation={3} sx={{ padding: '10px', maxWidth: '75%', width: '75%', backgroundColor: message.sender === 'user' ? '#e0f7fa' : '#fff', marginLeft: message.sender === 'user' ? 'auto' : 0, marginRight: message.sender === 'friend' ? 'auto' : 0 }}>
                <Typography variant="body1">{message.text}</Typography>
                </Paper>
            </ListItem>
            ))}
        </List>
      </Grid>
        <Grid item xs={3} sx={{ height: '100%', padding: '10px 0' }}>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px' }}>
        <TextField
            style={{ backgroundColor: 'white' }}
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
            InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    <Button variant="contained" color="primary" onClick={handleSendClick}>
                    Send
                    </Button>
                </InputAdornment>
                ),
            }}
            />
        </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ChatInterface;