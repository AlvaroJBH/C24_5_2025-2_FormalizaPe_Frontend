import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Card, Typography } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import ChatBubble from './ChatBubble';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: '¡Hola! Soy tu asistente virtual para la formalización de negocios en el Perú. Estoy aquí para ayudarte con tus dudas sobre trámites, regímenes tributarios, costos y más. ¿En qué puedo ayudarte hoy?', 
      from: 'bot',
      suggestions: [
        '¿Qué régimen tributario me conviene?',
        '¿Cómo constituir una empresa?',
        '¿Cuáles son los costos de formalización?',
        '¿Qué documentos necesito?',
      ],
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = { id: Date.now(), text: input, from: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simular respuesta del bot
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Procesando tu consulta... (Esta es una simulación. En producción, aquí se conectaría con el backend de IA)',
        from: 'bot'
      }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card sx={{ 
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header del chat */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'primary.main',
        color: 'white',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          🤖 Asistente Virtual - Formaliza.pe
        </Typography>
        <Typography variant="caption">
          Experto en trámites tributarios y constitución de empresas en el Perú
        </Typography>
      </Box>

      {/* Mensajes */}
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        p: 2,
        backgroundColor: 'background.default',
      }}>
        {messages.map(msg => (
          <ChatBubble 
            key={msg.id} 
            text={msg.text} 
            from={msg.from}
            suggestions={msg.suggestions}
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'white',
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta sobre formalización de negocios..."
            variant="outlined"
            size="small"
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default ChatWindow;
