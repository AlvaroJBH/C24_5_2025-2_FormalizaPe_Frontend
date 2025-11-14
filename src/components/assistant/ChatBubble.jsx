import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { SmartToy as BotIcon, Person as PersonIcon } from '@mui/icons-material';

const ChatBubble = ({ text, from = 'bot', suggestions }) => {
  const isBot = from === 'bot';

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1.5,
      mb: 2,
      justifyContent: isBot ? 'flex-start' : 'flex-end',
    }}>
      {isBot && (
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
          <BotIcon fontSize="small" />
        </Avatar>
      )}

      <Box sx={{ 
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isBot ? 'flex-start' : 'flex-end',
      }}>
        <Box sx={{ 
          backgroundColor: isBot ? 'grey.100' : 'primary.main',
          color: isBot ? 'text.primary' : 'white',
          borderRadius: 2,
          p: 1.5,
          boxShadow: 1,
        }}>
          <Typography variant="body2">
            {text}
          </Typography>
        </Box>

        {/* Sugerencias de preguntas relacionadas */}
        {suggestions && suggestions.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((sug, index) => (
              <Box 
                key={index}
                sx={{ 
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                {sug}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {!isBot && (
        <Avatar sx={{ bgcolor: 'grey.400', width: 36, height: 36 }}>
          <PersonIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatBubble;
