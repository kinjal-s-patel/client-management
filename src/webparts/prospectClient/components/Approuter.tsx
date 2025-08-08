// AppRouter.tsx
import * as React from 'react';

import {Routes,Route} from 'react-router-dom';


import Dashboard from './dashboard';
import ClientForm from './clientform';
// import AddInventory from './AddInventory';
// import CreateInvoice from './CreateInvoice';
// import Totalinvoice from './Totalinvoice';
// import Totalcustomer from './Totalcustomer';
// import Totalinventory from './Totalinventory';

import { IProspectClientProps } from './IProspectClientProps';

const AppRouter: React.FC<IProspectClientProps> = (props) => {

  return (
    <Routes>
      <Route path="/" element={<Dashboard {...props} />} />
        <Route path="clientform" element={<ClientForm {...props} />} />
     
    </Routes>
  );
};

export default AppRouter;