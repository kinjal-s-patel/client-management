import * as React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRouter from './Approuter';
import { IProspectClientProps } from './/IProspectClientProps';

const Home: React.FC<IProspectClientProps> = (props) => {
  return (
    <Router>
      <AppRouter {...props} />
    </Router>
  );
};

export default Home;