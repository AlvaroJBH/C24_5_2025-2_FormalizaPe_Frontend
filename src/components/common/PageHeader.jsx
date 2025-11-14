import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, backPath = '/dashboard' }) => (
  <header className="page-header">
    <Link to={backPath} className="back-link">← Volver al Dashboard</Link>
    <h1>{title}</h1>
  </header>
);

export default PageHeader;
