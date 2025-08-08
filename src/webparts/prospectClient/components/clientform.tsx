import * as React from 'react';
import { useState } from 'react';
import styles from './clientform.module.scss';
import { TextField, Dropdown, DatePicker, IDropdownOption } from '@fluentui/react';
import { spfi } from "@pnp/sp";
import { SPFx } from "@pnp/sp/presets/all"; // ✅ this is correct for SPFx browser apps
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/LOGO.png';

interface IClientFormProps {
  context: WebPartContext;
}

const statusOptions: IDropdownOption[] = [
  { key: 'In Progress', text: 'In Progress' },
  { key: 'Funnel', text: 'Funnel' },
  { key: 'Close/Win', text: 'Close/Win' },
];

const ClientForm: React.FC<IClientFormProps> = ({ context }) => {
  const navigate = useNavigate();
  const sp = spfi().using(SPFx(context));

  const [formData, setFormData] = useState({
    agreementDate: null,
    salesPerson: '',
    clientName: '',
    clientLocation: '',
    hiringContact: '',
    hiringEmail: '',
    hiringMobile: '',
    billingContact: '',
    billingEmail: '',
    billingMobile: '',
    commercials: '',
    paymentPeriod: '',
    replacementPeriod: '',
    gstNumber: '',
    website: '',
    linkedin1: '',
    linkedin2: '',
    industry: '',
    status: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    locationName: ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await sp.web.lists.getByTitle("client list").items.add({
        Title: formData.clientName,
        SalesPersonName: formData.salesPerson,
        AgreementDate: formData.agreementDate,
        ClientLocation: formData.clientLocation,
        HiringContact: formData.hiringContact,
        HiringEmail: formData.hiringEmail,
        HiringMobile: formData.hiringMobile,
        BillingContact: formData.billingContact,
        BillingEmail: formData.billingEmail,
        BillingMobile: formData.billingMobile,
        Commercials: formData.commercials,
        PaymentPeriod: formData.paymentPeriod,
        ReplacementPeriod: formData.replacementPeriod,
        GSTNumber: formData.gstNumber,
        Website: formData.website,
        Linkedin1: formData.linkedin1,
        Linkedin2: formData.linkedin2,
        Industry: formData.industry,
        Status: formData.status,
        Street: formData.street,
        City: formData.city,
        State: formData.state,
        Country: formData.country,
        PostalCode: formData.postalCode,
        LocationName: formData.locationName
      });
      alert('Client form submitted successfully.');
      setFormData({
        agreementDate: null,
        salesPerson: '',
        clientName: '',
        clientLocation: '',
        hiringContact: '',
        hiringEmail: '',
        hiringMobile: '',
        billingContact: '',
        billingEmail: '',
        billingMobile: '',
        commercials: '',
        paymentPeriod: '',
        replacementPeriod: '',
        gstNumber: '',
        website: '',
        linkedin1: '',
        linkedin2: '',
        industry: '',
        status: '',
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        locationName: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

   React.useEffect(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        #SuiteNavWrapper,
        #spSiteHeader,
        #spLeftNav,
        .spAppBar,
        .sp-appBar,
        .sp-appBar-mobile,
        div[data-automation-id="pageCommandBar"],
        div[data-automation-id="pageHeader"],
        div[data-automation-id="pageFooter"] {
          display: none !important;
          height: 0 !important;
          overflow: hidden !important;
        }
  
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          overflow: hidden !important;
          background: #fff !important;
        }
  
        #spPageCanvasContent, .CanvasComponent, .CanvasZone, .CanvasSection, .control-zone {
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          max-width: 100vw !important;
        }
  
        .ms-FocusZone {
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);
    }, []);
  

  return (
     <div
  style={{
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    overflow: 'auto',
    backgroundColor: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999
  }}
  >
    <div className={styles.dashboardWrapper}>
      {/* Header Section */}
      <header className={styles.dashboardHeader}>
        <div className={styles.logoSection}>
         <img src={logo} alt="Logo" className={styles.logo} />
          <div>
            <h1 className={styles.title}>Engage360</h1>
            <p className={styles.subtitle}>Streamlined Prospect and Client Management</p>
          </div>
        </div>
        <nav className={styles.navBar}>
          <button className={styles.navButton} onClick={() => navigate('/prospectform')}>Prospect Form</button>
          <button className={styles.navButton} onClick={() => navigate('/clientform')}>Client Form</button>
          <button className={styles.navButton} onClick={() => navigate('/generateagreement')}>Generate Agreement</button>
          <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button>
        </nav>
      </header>
      

    <h2>Client Onboarding Form</h2>

  {/* 2-column layout form inside one container */}
  <div className={styles.formGrid}>
    <TextField label="Sales Person Name" value={formData.salesPerson} onChange={(_, val) => handleChange('salesPerson', val)} />
    <DatePicker label="Date of Agreement" onSelectDate={(date) => handleChange('agreementDate', date)} />
    <TextField label="Client Name" value={formData.clientName} onChange={(_, val) => handleChange('clientName', val)} />
    <TextField label="Client Location" value={formData.clientLocation} onChange={(_, val) => handleChange('clientLocation', val)} />
    <TextField label="Contact Person for Hiring" value={formData.hiringContact} onChange={(_, val) => handleChange('hiringContact', val)} />
    <TextField label="Email Address - Hiring" value={formData.hiringEmail} onChange={(_, val) => handleChange('hiringEmail', val)} />
    <TextField label="Mobile number" value={formData.hiringMobile} onChange={(_, val) => handleChange('hiringMobile', val)} />
    <TextField label="Billing/Accounting" value={formData.billingContact} onChange={(_, val) => handleChange('billingContact', val)} />
    <TextField label="Email Address - Accounting/ Billing" value={formData.billingEmail} onChange={(_, val) => handleChange('billingEmail', val)} />
    <TextField label="Mobile Number - Billing/Accounting" value={formData.billingMobile} onChange={(_, val) => handleChange('billingMobile', val)} />
    <TextField label="Commercials Decided" value={formData.commercials} onChange={(_, val) => handleChange('commercials', val)} />
    <TextField label="Payment Period" value={formData.paymentPeriod} onChange={(_, val) => handleChange('paymentPeriod', val)} />
    <TextField label="Replacement Period" value={formData.replacementPeriod} onChange={(_, val) => handleChange('replacementPeriod', val)} />
    <TextField label="GST Number" value={formData.gstNumber} onChange={(_, val) => handleChange('gstNumber', val)} />
    <TextField label="Client Website" value={formData.website} onChange={(_, val) => handleChange('website', val)} />
    <TextField label="Linkedin Profile 1" value={formData.linkedin1} onChange={(_, val) => handleChange('linkedin1', val)} />
    <TextField label="Linkedin Profile 2" value={formData.linkedin2} onChange={(_, val) => handleChange('linkedin2', val)} />
    <TextField label="Client Industry" value={formData.industry} onChange={(_, val) => handleChange('industry', val)} />
    <Dropdown label="Status" options={statusOptions} selectedKey={formData.status} onChange={(_, option) => handleChange('status', option?.key)} />
    <TextField label="Client Location: Street" value={formData.street} onChange={(_, val) => handleChange('street', val)} />
    <TextField label="Client Location: City" value={formData.city} onChange={(_, val) => handleChange('city', val)} />
    <TextField label="Client Location: State" value={formData.state} onChange={(_, val) => handleChange('state', val)} />
    <TextField label="Client Location: Country/Region" value={formData.country} onChange={(_, val) => handleChange('country', val)} />
    <TextField label="Client Location: Postal Code" value={formData.postalCode} onChange={(_, val) => handleChange('postalCode', val)} />
    <TextField label="Client Location: Name" value={formData.locationName} onChange={(_, val) => handleChange('locationName', val)} />
  </div>

  {/* Submit Button */}
  <div className={styles.submitSection}>
    <button onClick={handleSubmit}>Submit</button>
  </div>
  </div>
  </div>

  );
};

export default ClientForm;
