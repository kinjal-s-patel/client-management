import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './dashboard';
import ClientForm from './clientform';
import TotalClients from './totalclient';
import ProspectFormPage from './prospectform';
import TotalProspects from './totalprospects';
import GenerateAgreementForm from './agreementform';

import { IProspectClientProps } from './IProspectClientProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';

// Define the props interface expected by AppRouter.
// It should include context since you want to pass it to child components.
interface IAppRouterProps extends IProspectClientProps {
  context: WebPartContext;
}

const AppRouter: React.FC<IAppRouterProps> = (props) => {
  const { context, ...restProps } = props;

  return (
    <Routes>
      <Route path="/" element={<Dashboard {...restProps} context={context} />} />
      <Route path="clientform" element={<ClientForm {...restProps} context={context} />} />
     <Route path="/clientform/:id?" element={<ClientForm context={context} />} />
      <Route path="totalclient" element={<TotalClients {...restProps} context={context} />} />
      <Route path="totalprospects" element={<TotalProspects {...restProps} context={context} />} />
      <Route path="prospectform" element={<ProspectFormPage {...props} />} />
      <Route path="/prospectform/edit/:prospectId" element={<ProspectFormPage context={context} />} />
       <Route path="agreementform" element={<GenerateAgreementForm {...props} />} />

    </Routes>
  );
};

export default AppRouter;
