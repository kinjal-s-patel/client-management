// AppRouter.tsx
import * as React from 'react';

import {Routes,Route} from 'react-router-dom';


import Dashboard from './dashboard';
import ClientForm from './clientform';
import TotalClients from './totalclient';
import ProspectFormPage from './prospectform';
import TotalProspects from './totalprospects';
// import Totalinventory from './Totalinventory';

import { IProspectClientProps } from './IProspectClientProps';

const AppRouter: React.FC<IProspectClientProps> = (props) => {

  return (
    <Routes>
      <Route path="/" element={<Dashboard {...props} />} />
        <Route path="clientform" element={<ClientForm {...props} />} />
             <Route path="totalclient" element={<TotalClients {...props} />} />
             <Route path="prospectform" element={<ProspectFormPage {...props} />} />
              <Route path="totalprospects" element={<TotalProspects {...props} />} />
              {/* <Route path="/prospectform/edit/:prospectId" element={<ProspectFormPage sp={sp} />} /> Edit */}
     
    </Routes>
  );
};

export default AppRouter; 