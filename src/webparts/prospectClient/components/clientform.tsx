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

const replacementPeriodOptions: IDropdownOption[] = [
  { key: '60', text: '60' },
  { key: '90', text: '90' },
];


const paymentPeriodOptions: IDropdownOption[] = [
  { key: '7', text: '7' },
  { key: '15', text: '15' },
  { key: '30', text: '30' },
  { key: '45', text: '45' },
];

const clientIndustryOptions: IDropdownOption[] = [
  { key: 'IT', text: 'IT' },
  { key: 'Maintenance', text: 'Maintenance' },
  { key: 'Healthcare', text: 'Healthcare' },
  { key: 'Recruitment', text: 'Recruitment' },
  { key: 'Finance', text: 'Finance' },
];

const ClientForm: React.FC<IClientFormProps> = ({ context }) => {
  const navigate = useNavigate();
  const sp = spfi().using(SPFx(context));
  const { id } = useParams();

  const [CLIENTId0, setClientID] = useState<string>("");
  const [itemId, setItemId] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({
    DateofAgreement: '',
    SalesPersonName: '',
    ClientName: '',
    ClientLocation: '',
    ClientLocation_x003a_Street: '',
    ClientLocation_x003a_City: '',
    ClientLocation_x003a_State: '',
      ClientLocation_x003a_Country_x00: "India",
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

  // ✅ Universal change handler
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ Fetch client details (edit mode) or set next ID (add mode)
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const list = sp.web.lists.getByTitle("client list");

        if (id) {
          // EDIT MODE
          const items = await list.items.filter(`CLIENTId0 eq '${id}'`).top(1)();
          if (items.length > 0) {
            const client = items[0];
setFormData({
  CLIENTId0: client.CLIENTId0 !== undefined ? Number(client.CLIENTId0) : 0,  // Number
  SalesPersonName: client.SalesPersonName || "",
  DateofAgreement: client.DateofAgreement
    ? new Date(client.DateofAgreement).toISOString().split("T")[0]
    : "",
  ClientName: client.ClientName || "",
  ClientLocation: client.ClientLocation || "",
  ClientLocation_x003a_Street: client.ClientLocation_x003a_Street || "",
  ClientLocation_x003a_City: client.ClientLocation_x003a_City || "",
  ClientLocation_x003a_State: client.ClientLocation_x003a_State || "",
  ClientLocation_x003a_Country_x00: client.ClientLocation_x003a_Country_x00 || "",
  ClientLocation_x003a_PostalCode: client.ClientLocation_x003a_PostalCode || "",
  ClientLocation_x003a_Name: client.ClientLocation_x003a_Name || "",
  ContactPersonforHiring: client.ContactPersonforHiring || "",
  EmailAddress_x002d_Hiring: client.EmailAddress_x002d_Hiring || "",

  // 👇 Numeric fields as numbers
  Mobilenumber: client.Mobilenumber !== undefined ? Number(client.Mobilenumber) : 0,
  Billing_x002f_Accounting: client.Billing_x002f_Accounting || "",
  EmailAddress_x002d_Accounting_x0: client.EmailAddress_x002d_Accounting_x0 || "",
  MobileNumber_x002d_Billing_x002f: client.MobileNumber_x002d_Billing_x002f !== undefined
    ? Number(client.MobileNumber_x002d_Billing_x002f)
    : 0,
  CommercialsDecided: client.CommercialsDecided || "",
  PaymentPeriod: client.PaymentPeriod !== undefined ? Number(client.PaymentPeriod) : 0,
  ReplacementPeriod: client.ReplacementPeriod !== undefined ? Number(client.ReplacementPeriod) : 0,

  GSTNumber: client.GSTNumber || "",
  ClientWebsite: client.ClientWebsite || "",
  LinkedinProfile1: client.LinkedinProfile1 || "",
  Linkedinprofile2: client.Linkedinprofile2 || "",
  ClientIndustry: client.ClientIndustry || "",
  status: client.status || ""
});

            setItemId(client.Id);
            setClientID(client.CLIENTId0);
          }
        } else {
          // ADD MODE → Generate next CLIENTId0
          const items = await list.items.orderBy("CLIENTId0", false).top(1)();
          const lastId = items.length ? items[0].CLIENTId0 : 0;
          const newId = lastId + 1;
          setFormData((prev: any) => ({ ...prev, CLIENTId0: newId }));
          setClientID(newId.toString());
        }
      } catch (err) {
        console.error("Error fetching client:", err);
      }
    };

    fetchClient();
  }, [id]);

  // ✅ Save Client
  const saveClient = async () => {
    try {
      const list = sp.web.lists.getByTitle("client list");

      if (!itemId) {

        // ADD NEW CLIENT

const addResult = await list.items.add({
CLIENTId0: formData.CLIENTId0 ? Number(formData.CLIENTId0) : null,
  SalesPersonName: formData.SalesPersonName,
  DateofAgreement: formData.DateofAgreement 
    ? new Date(formData.DateofAgreement).toISOString() 
    : null,
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
  Mobilenumber: formData.Mobilenumber ? Number(formData.Mobilenumber) : null,
  Billing_x002f_Accounting: formData.Billing_x002f_Accounting,
  EmailAddress_x002d_Accounting_x0: formData.EmailAddress_x002d_Accounting_x0,
  MobileNumber_x002d_Billing_x002f: formData.MobileNumber_x002d_Billing_x002f
    ? Number(formData.MobileNumber_x002d_Billing_x002f)
    : null,
  CommercialsDecided: formData.CommercialsDecided,
  PaymentPeriod: Number(formData.PaymentPeriod) || 0,
  ReplacementPeriod: Number(formData.ReplacementPeriod) || 0,
  GSTNumber: formData.GSTNumber,
  ClientWebsite: formData.ClientWebsite,
  LinkedinProfile1: formData.LinkedinProfile1,
  Linkedinprofile2: formData.Linkedinprofile2,
  ClientIndustry: formData.ClientIndustry,
  status: formData.status
});

// ✅ Fix for Id issue
const newId = addResult?.data?.Id || addResult?.item?.Id;
setItemId(newId);

alert("✅ Client added successfully!");
      } else {
        // UPDATE CLIENT
await list.items.getById(itemId).update({
  CLIENTId0: formData.CLIENTId0 ? Number(formData.CLIENTId0) : null,
  SalesPersonName: formData.SalesPersonName,
  DateofAgreement: formData.DateofAgreement 
    ? new Date(formData.DateofAgreement).toISOString() 
    : null,
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
  Mobilenumber: formData.Mobilenumber ? Number(formData.Mobilenumber) : null,
  Billing_x002f_Accounting: formData.Billing_x002f_Accounting,
  EmailAddress_x002d_Accounting_x0: formData.EmailAddress_x002d_Accounting_x0,
MobileNumber_x002d_Billing_x002f: formData.MobileNumber_x002d_Billing_x002f
    ? Number(formData.MobileNumber_x002d_Billing_x002f)
    : null,
  CommercialsDecided: formData.CommercialsDecided,
  PaymentPeriod: formData.PaymentPeriod ? Number(formData.PaymentPeriod) : null,
  ReplacementPeriod: formData.ReplacementPeriod ? Number(formData.ReplacementPeriod) : null,
  GSTNumber: formData.GSTNumber,
  ClientWebsite: formData.ClientWebsite,
  LinkedinProfile1: formData.LinkedinProfile1,
  Linkedinprofile2: formData.Linkedinprofile2,
  ClientIndustry: formData.ClientIndustry,
  status: formData.status
});

        alert("✅ Client updated successfully!");
      }

      navigate("/totalclient");
    } catch (err) {
      console.error("Error saving client:", err);
      alert("❌ Failed to save client");
    }
  };

  // ✅ Hide SharePoint UI
  useEffect(() => {
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
            {/* <button className={styles.navButton} onClick={() => navigate('/agreementform')}>Generate Agreement</button> */}
            {/* <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button> */}
            <button className={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
          </nav>
        </header>

        {/* Client Form */}
        <div className={styles.clientFormWrapper}>
          <h2>Client Onboarding Form</h2>
<div className={styles.formGrid}>
  <TextField label="Client ID" value={CLIENTId0} readOnly />

  <TextField
    label="Sales Person Name"
    placeholder="Enter the sales person’s full name"
    value={formData.SalesPersonName || ""}
    onChange={(_, val) => handleChange('SalesPersonName', val || "")}
  />

  <DatePicker
    label="Date of Agreement"
    placeholder="Select agreement date"
    onSelectDate={(date) => handleChange('DateofAgreement', date)}
    value={formData.DateofAgreement ? new Date(formData.DateofAgreement) : undefined}
  />

  <TextField
    label="Client Name"
    placeholder="Enter the client company name"
    value={formData.ClientName || ""}
    onChange={(_, val) => handleChange('ClientName', val || "")}
  />

  <TextField
    label="Client Location"
    placeholder="General client location"
    value={formData.ClientLocation || ""}
    onChange={(_, val) => handleChange('ClientLocation', val || "")}
  />

  <TextField
    label="Street"
    placeholder="Street address"
    value={formData.ClientLocation_x003a_Street || ""}
    onChange={(_, val) => handleChange('ClientLocation_x003a_Street', val || "")}
  />

  <TextField
    label="City"
    placeholder="City"
    value={formData.ClientLocation_x003a_City || ""}
    onChange={(_, val) => handleChange('ClientLocation_x003a_City', val || "")}
  />

  <TextField
    label="State"
    placeholder="State / Province"
    value={formData.ClientLocation_x003a_State || ""}
    onChange={(_, val) => handleChange('ClientLocation_x003a_State', val || "")}
  />

<TextField
  label="Country/Region"
  placeholder="Country or Region"
  value={formData.ClientLocation_x003a_Country_x00 || ""}
  onChange={(_, val) => handleChange('ClientLocation_x003a_Country_x00', val || "")}
/>

  <TextField
    label="Postal Code"
    type="number"
    placeholder="Postal / ZIP Code"
    value={formData.ClientLocation_x003a_PostalCode?.toString() || ""}
    onChange={(_, val) => handleChange('ClientLocation_x003a_PostalCode',val || "")}
  />

  <TextField
    label="Location Name"
    placeholder="Branch / Office name"
    value={formData.ClientLocation_x003a_Name || ""}
    onChange={(_, val) => handleChange('ClientLocation_x003a_Name', val || "")}
  />

  <TextField
    label="Contact Person for Hiring"
    placeholder="Full name of contact person"
    value={formData.ContactPersonforHiring || ""}
    onChange={(_, val) => handleChange('ContactPersonforHiring', val || "")}
  />

  <TextField
    label="Email - Hiring"
    type="email"
    placeholder="example@domain.com"
    value={formData.EmailAddress_x002d_Hiring || ""}
    onChange={(_, val) => handleChange('EmailAddress_x002d_Hiring', val || "")}
  />

  <TextField
    label="Mobile Number"
    type="tel"
    placeholder="Enter hiring contact number"
    value={formData.Mobilenumber || ""}
    onChange={(_, val) => handleChange('Mobilenumber', val || "")}
  />

  <TextField
    label="Billing/Accounting"
    placeholder="Billing/Accounting contact name"
    value={formData.Billing_x002f_Accounting || ""}
    onChange={(_, val) => handleChange('Billing_x002f_Accounting', val || "")}
  />

  <TextField
    label="Email - Accounting/Billing"
    type="email"
    placeholder="billing@domain.com"
    value={formData.EmailAddress_x002d_Accounting_x0 || ""}
    onChange={(_, val) => handleChange('EmailAddress_x002d_Accounting_x0', val || "")}
  />

  <TextField
    label="Mobile - Accounting/Billing"
    type="tel"
    placeholder="Enter accounting contact number"
    value={formData.MobileNumber_x002d_Billing_x002f || ""}
    onChange={(_, val) => handleChange('MobileNumber_x002d_Billing_x002f', val || "")}
  />

  <TextField
    label="Commercials Decided"
    multiline
    placeholder="Enter agreed commercials"
    value={formData.CommercialsDecided || ""}
    onChange={(_, val) => handleChange('CommercialsDecided', val || "")}
  />

<Dropdown
  label="Payment Period"
  placeholder="Select Payment Period"
  selectedKey={formData.PaymentPeriod?.toString() || ""}
  onChange={(_, option) =>
    handleChange('PaymentPeriod', option?.key ? parseInt(option.key.toString(), 10) : 0)
  }
  options={paymentPeriodOptions}
/>


<Dropdown
  label="Replacement Period"
  placeholder="Select Replacement Period"
  selectedKey={formData.ReplacementPeriod?.toString() || ""}
  onChange={(_, option) => handleChange('ReplacementPeriod', option?.key ? parseInt(option.key.toString(), 10) : 0)}
  options={replacementPeriodOptions}
/>

  <TextField
    label="GST Number"
    placeholder="Enter GST number (if applicable)"
    value={formData.GSTNumber || ""}
    onChange={(_, val) => handleChange('GSTNumber', val || "")}
  />

  <TextField
    label="Client Website"
    type="url"
    placeholder="https://www.clientwebsite.com"
    value={formData.ClientWebsite || ""}
    onChange={(_, val) => handleChange('ClientWebsite', val || "")}
  />

  <TextField
    label="LinkedIn Profile 1"
    type="url"
    placeholder="https://linkedin.com/in/..."
    value={formData.LinkedinProfile1 || ""}
    onChange={(_, val) => handleChange('LinkedinProfile1', val || "")}
  />

  <TextField
    label="LinkedIn Profile 2"
    type="url"
    placeholder="https://linkedin.com/in/..."
    value={formData.Linkedinprofile2 || ""}
    onChange={(_, val) => handleChange('Linkedinprofile2', val || "")}
  />

<Dropdown
  label="Client Industry"
  placeholder="Select Industry"
  selectedKey={formData.Industry || ""}
  onChange={(_, option) =>
    handleChange('Industry', option?.key ? option.key.toString() : "")
  }
  options={clientIndustryOptions}
/>

  <Dropdown
    label="Status"
    placeholder="Select current status"
    options={statusOptions}
    selectedKey={formData.status || undefined}
    onChange={(_, option) => handleChange('status', option?.key || "")}
  />
</div>


          {/* Submit */}
          <div className={styles.submitSection}>
            <button onClick={saveClient}>Submit</button>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>© 2025 Client Management. All rights reserved.</footer>
      </div>
    </div>
  );
};

export default ClientForm;
