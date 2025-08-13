import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './clientform.module.scss';
import { TextField, Dropdown, IDropdownOption, DatePicker } from '@fluentui/react';
import { spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/LOGO.png';

interface IClientFormProps {
  context: WebPartContext;
}

const statusOptions: IDropdownOption[] = [
  { key: 'Active', text: 'Active' },
  { key: 'Inactive', text: 'Inactive' },
];

const ClientForm: React.FC<IClientFormProps> = ({ context }) => {
  const navigate = useNavigate();
  const sp = spfi().using(SPFx(context));
  const { id } = useParams<{ id?: string }>(); // optional id from URL
const [clientID, setClientID] = useState<string>("");

  const [formData, setFormData] = useState<any>({
    DateofAgreement: '',
    SalesPersonName: '',
    ClientName: '',
    ClientLocation: '',
    ClientLocation_x003a_Street: '',
    ClientLocation_x003a_City: '',
    ClientLocation_x003a_State: '',
    ClientLocation_x003a_Country_x00: '',
    ClientLocation_x003a_PostalCode: '',
    ClientLocation_x003a_Name: '',
    ContactPersonforHiring: '',
    EmailAddress_x002d_Hiring: '',
    Mobilenumber: '',
    Billing_x002f_Accounting: '',
    EmailAddress_x002d_Accounting_x0: '',
    MobileNumber_x002d_Billing_x002f: '',
    CommercialsDecided: '',
    PaymentPeriod: '',
    ReplacementPeriod: '',
    GSTNumber: '',
    ClientWebsite: '',
    LinkedinProfile1: '',
    Linkedinprofile2: '',
    ClientIndustry: '',
    status: ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };


useEffect(() => {
  const fetchClient = async () => {
    if (id) {
      // EDIT MODE
      try {
        const item = await sp.web.lists.getByTitle("client list").items.getById(parseInt(id.replace("JMS-", "")))();
        setFormData(item);
        setClientID(item.ClientID); // keep the same ClientID
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    } else {
      // CREATE MODE
      try {
        const items = await sp.web.lists.getByTitle("client list")
          .items.select("ClientID")
          .orderBy("ID", false)
          .top(1)();

        let newID = "JMS-001";
        if (items.length > 0 && items[0].ClientID) {
          const lastNumber = parseInt(items[0].ClientID.replace("JMS-", ""), 10);
          const nextNumber = lastNumber + 1;
          newID = `JMS-${String(nextNumber).padStart(3, "0")}`;
        }

        setClientID(newID);
      } catch (error) {
        console.error("Error fetching Client ID:", error);
      }
    }
  };

  fetchClient();
}, [id, sp]);


  // Submit form - add new or update existing
  const handleSubmit = async () => {
    try {
      if (id) {
        // Update existing client
        await sp.web.lists.getByTitle("client list").items.getById(parseInt(id)).update({
          SalesPersonName: formData.SalesPersonName,
          DateofAgreement: formData.DateofAgreement,
          ClientName: formData.ClientName,
          ClientLocation: formData.ClientLocation,
          ClientLocation_x003a_Street: formData.ClientLocation_x003a_Street,
          ClientLocation_x003a_City: formData.ClientLocation_x003a_City,
          ClientLocation_x003a_State: formData.ClientLocation_x003a_State,
          ClientLocation_x003a_Country_x00: formData.ClientLocation_x003a_Country_x00,
          ClientLocation_x003a_PostalCode: formData.ClientLocation_x003a_PostalCode,
          ClientLocation_x003a_Name: formData.ClientLocation_x003a_Name,
          ContactPersonforHiring: formData.ContactPersonforHiring,
          EmailAddress_x002d_Hiring: formData.EmailAddress_x002d_Hiring,
          Mobilenumber: formData.Mobilenumber,
          Billing_x002f_Accounting: formData.Billing_x002f_Accounting,
          EmailAddress_x002d_Accounting_x0: formData.EmailAddress_x002d_Accounting_x0,
          MobileNumber_x002d_Billing_x002f: formData.MobileNumber_x002d_Billing_x002f,
          CommercialsDecided: formData.CommercialsDecided,
          PaymentPeriod: formData.PaymentPeriod,
          ReplacementPeriod: formData.ReplacementPeriod,
          GSTNumber: formData.GSTNumber,
          ClientWebsite: formData.ClientWebsite,
          LinkedinProfile1: formData.LinkedinProfile1,
          Linkedinprofile2: formData.Linkedinprofile2,
          ClientIndustry: formData.ClientIndustry,
          status: formData.status,
        });
        alert(`Client updated successfully!`);
      } else {
        // Add new client
        await sp.web.lists.getByTitle("client list").items.add({
          ClientID: clientID,
          SalesPersonName: formData.SalesPersonName,
          DateofAgreement: formData.DateofAgreement,
          ClientName: formData.ClientName,
          ClientLocation: formData.ClientLocation,
          ClientLocation_x003a_Street: formData.ClientLocation_x003a_Street,
          ClientLocation_x003a_City: formData.ClientLocation_x003a_City,
          ClientLocation_x003a_State: formData.ClientLocation_x003a_State,
          ClientLocation_x003a_Country_x00: formData.ClientLocation_x003a_Country_x00,
          ClientLocation_x003a_PostalCode: formData.ClientLocation_x003a_PostalCode,
          ClientLocation_x003a_Name: formData.ClientLocation_x003a_Name,
          ContactPersonforHiring: formData.ContactPersonforHiring,
          EmailAddress_x002d_Hiring: formData.EmailAddress_x002d_Hiring,
          Mobilenumber: formData.Mobilenumber,
          Billing_x002f_Accounting: formData.Billing_x002f_Accounting,
          EmailAddress_x002d_Accounting_x0: formData.EmailAddress_x002d_Accounting_x0,
          MobileNumber_x002d_Billing_x002f: formData.MobileNumber_x002d_Billing_x002f,
          CommercialsDecided: formData.CommercialsDecided,
          PaymentPeriod: formData.PaymentPeriod,
          ReplacementPeriod: formData.ReplacementPeriod,
          GSTNumber: formData.GSTNumber,
          ClientWebsite: formData.ClientWebsite,
          LinkedinProfile1: formData.LinkedinProfile1,
          Linkedinprofile2: formData.Linkedinprofile2,
          ClientIndustry: formData.ClientIndustry,
          status: formData.status,
        });
        alert(`Client created successfully! Assigned ID: ${clientID}`);
        navigate('/totalclients'); // go back to clients list
      }
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
            <h1 className={styles.title}>Client Management</h1>
            <p className={styles.subtitle}>Streamlined Prospect and Client Management</p>
          </div>
        </div>
        <nav className={styles.navBar}>
          <button className={styles.navButton} onClick={() => navigate('/prospectform')}>Prospect Form</button>
          <button className={styles.navButton} onClick={() => navigate('/generateagreement')}>Generate Agreement</button>
          <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button>
          <button className={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
        </nav>
      </header>
      
<div className={styles.clientFormWrapper}>
  <h2>Client Onboarding Form</h2>
<div className={styles.formGrid}>
  <TextField  label="Client ID"  value={clientID} readOnly  styles={{    fieldGroup: { backgroundColor: "#fff" } }}/>
  <TextField label="Sales Person Name" value={formData.SalesPersonName} onChange={(_, val) => handleChange('SalesPersonName', val)} />
  <DatePicker label="Date of Agreement" onSelectDate={(date) => handleChange('DateofAgreement', date)} />
  <TextField label="Client Name" value={formData.ClientName} onChange={(_, val) => handleChange('ClientName', val)} />
  <TextField label="Client Location" value={formData.ClientLocation} onChange={(_, val) => handleChange('ClientLocation', val)} />
  <TextField label="Client Location: Street" value={formData.ClientLocation_x003a_Street} onChange={(_, val) => handleChange('ClientLocation_x003a_Street', val)} />
  <TextField label="Client Location: City" value={formData.ClientLocation_x003a_City} onChange={(_, val) => handleChange('ClientLocation_x003a_City', val)} />
  <TextField label="Client Location: State" value={formData.ClientLocation_x003a_State} onChange={(_, val) => handleChange('ClientLocation_x003a_State', val)} />
  <TextField label="Client Location: Country/Region" value={formData.ClientLocation_x003a_Country_x00} onChange={(_, val) => handleChange('ClientLocation_x003a_Country_x00', val)} />
  <TextField label="Client Location: Postal Code" value={formData.ClientLocation_x003a_PostalCode} onChange={(_, val) => handleChange('ClientLocation_x003a_PostalCode', val)} />
  <TextField label="Client Location: Name" value={formData.ClientLocation_x003a_Name} onChange={(_, val) => handleChange('ClientLocation_x003a_Name', val)} />
  <TextField label="Contact Person for Hiring" value={formData.ContactPersonforHiring} onChange={(_, val) => handleChange('ContactPersonforHiring', val)} />
  <TextField label="Email Address - Hiring" value={formData.EmailAddress_x002d_Hiring} onChange={(_, val) => handleChange('EmailAddress_x002d_Hiring', val)} />
  <TextField label="Mobile number" value={formData.Mobilenumber} onChange={(_, val) => handleChange('Mobilenumber', val)} />
  <TextField label="Billing/Accounting" value={formData.Billing_x002f_Accounting} onChange={(_, val) => handleChange('Billing_x002f_Accounting', val)} />
  <TextField label="Email Address - Accounting/ Billing" value={formData.EmailAddress_x002d_Accounting_x0} onChange={(_, val) => handleChange('EmailAddress_x002d_Accounting_x0', val)} />
  <TextField label="Mobile Number - Billing/Accounting" value={formData.MobileNumber_x002d_Billing_x002f} onChange={(_, val) => handleChange('MobileNumber_x002d_Billing_x002f', val)} />
  <TextField label="Commercials Decided" value={formData.CommercialsDecided} onChange={(_, val) => handleChange('CommercialsDecided', val)} />
  <TextField label="Payment Period" value={formData.PaymentPeriod} onChange={(_, val) => handleChange('PaymentPeriod', val)} />
  <TextField label="Replacement Period" value={formData.ReplacementPeriod} onChange={(_, val) => handleChange('ReplacementPeriod', val)} />
  <TextField label="GST Number" value={formData.GSTNumber} onChange={(_, val) => handleChange('GSTNumber', val)} />
  <TextField label="Client Website" value={formData.ClientWebsite} onChange={(_, val) => handleChange('ClientWebsite', val)} />
  <TextField label="Linkedin Profile 1" value={formData.LinkedinProfile1} onChange={(_, val) => handleChange('LinkedinProfile1', val)} />
  <TextField label="Linkedin Profile 2" value={formData.Linkedinprofile2} onChange={(_, val) => handleChange('Linkedinprofile2', val)} />
  <TextField label="Client Industry" value={formData.ClientIndustry} onChange={(_, val) => handleChange('ClientIndustry', val)} />
  <Dropdown label="Status" options={statusOptions} selectedKey={formData.status} onChange={(_, option) => handleChange('status', option?.key)} />
</div>


  {/* Submit Button */}
  <div className={styles.submitSection}>
    <button onClick={handleSubmit}>Submit</button>
  </div>
  </div>
  </div>

    {/* Footer */}
      <footer className={styles.footer}>
        © 2025 client Management. All rights reserved.
      </footer>
</div>
  );
};

export default ClientForm;
