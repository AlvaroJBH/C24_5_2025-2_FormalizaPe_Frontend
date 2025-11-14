import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import { 
  Lightbulb as LightbulbIcon,
  Calculate as CalculateIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const FaqSidebar = ({ onQuestionClick }) => {
  const faqCategories = [
    {
      title: 'Regímenes Tributarios',
      icon: <CalculateIcon />,
      color: '#3563E9',
      questions: [
        '¿Qué es el RUS y quién puede acogerse?',
        '¿Cuáles son las ventajas del RER?',
        '¿Cuándo conviene el MYPE Tributario?',
        '¿Puedo cambiar de régimen tributario?',
      ],
    },
    {
      title: 'Constitución de Empresa',
      icon: <BusinessIcon />,
      color: '#10B981',
      questions: [
        '¿Cuál es la diferencia entre SAC y SRL?',
        '¿Qué es una EIRL y cuándo conviene?',
        '¿Cuánto cuesta constituir una empresa?',
        '¿Cuánto tiempo demora el proceso?',
      ],
    },
    {
      title: 'Trámites y Documentos',
      icon: <DescriptionIcon />,
      color: '#F59E0B',
      questions: [
        '¿Qué documentos necesito para el RUC?',
        '¿Cómo obtener la licencia municipal?',
        '¿Qué es el registro en ESSALUD?',
        '¿Dónde tramitar los permisos?',
      ],
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LightbulbIcon color="warning" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Preguntas Frecuentes
          </Typography>
        </Box>

        {faqCategories.map((category, catIndex) => (
          <Box key={catIndex} sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1,
              color: category.color,
            }}>
              {category.icon}
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {category.title}
              </Typography>
            </Box>

            <List dense disablePadding>
              {category.questions.map((question, qIndex) => (
                <ListItem key={qIndex} disablePadding>
                  <ListItemButton 
                    onClick={() => onQuestionClick && onQuestionClick(question)}
                    sx={{ 
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={question}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {catIndex < faqCategories.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default FaqSidebar;
