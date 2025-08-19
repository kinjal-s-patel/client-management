import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './agreementform.module.scss';
import { TextField, DatePicker } from '@fluentui/react';
import { spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/LOGO.png';

interface IGenerateAgreementFormProps {
  context: WebPartContext;
}

const GenerateAgreementForm: React.FC<IGenerateAgreementFormProps> = ({ context }) => {
  const navigate = useNavigate();
  const sp = spfi().using(SPFx(context));
  const { id } = useParams(); // agreement or client id from route

  const [itemId, setItemId] = useState<number | null>(null);
  const [clientData, setClientData] = useState<any>({});
  const [formData, setFormData] = useState<any>({
    AgreementDate: '',
    AdditionalRequirements: '',
    SpecialTerms: ''
  });

  // ✅ Universal change handler
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ Fetch client & agreement details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load client details
        const clientList = sp.web.lists.getByTitle("client list");
        const clientItems = await clientList.items.filter(`CLIENTId0 eq '${id}'`).top(1)();

        if (clientItems.length > 0) {
          setClientData(clientItems[0]);
        }

        // Load agreement if already exists (edit mode)
        const agreementList = sp.web.lists.getByTitle("agreements");
        const agreements = await agreementList.items.filter(`ClientID eq '${id}'`).top(1)();

        if (agreements.length > 0) {
          const ag = agreements[0];
          setFormData({
            AgreementDate: ag.AgreementDate
              ? new Date(ag.AgreementDate).toISOString().split("T")[0]
              : '',
            AdditionalRequirements: ag.AdditionalRequirements || '',
            SpecialTerms: ag.SpecialTerms || ''
          });
          setItemId(ag.Id); // set SP internal Id for update
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        if (id) {
          const items = await sp.web.lists.getByTitle("client list")
            .items.filter(`CLIENTId0 eq '${id}'`) // match your internal name
            .top(1)();

          if (items.length > 0) {
            setClientData(items[0]); // save client record
          }
        }
      } catch (err) {
        console.error("Error fetching client:", err);
      }
    };

    fetchClient();
  }, [id]);

  // ✅ Save Agreement (Add or Update)
  const saveAgreement = async () => {
    try {
      const list = sp.web.lists.getByTitle("agreements");

      if (!itemId) {
        // ADD NEW AGREEMENT
        const addResult = await list.items.add({
          Title: `Agreement for ${clientData.ClientName}`,
          ClientID: clientData.CLIENTId0,
          ClientName: clientData.ClientName,
          SalesPerson: clientData.SalesPersonName,
          ClientLocation: clientData.ClientLocation,
          AgreementDate: formData.AgreementDate
            ? new Date(formData.AgreementDate).toISOString()
            : null,
          AdditionalRequirements: formData.AdditionalRequirements,
          SpecialTerms: formData.SpecialTerms
        });

        setItemId(addResult?.data?.Id || addResult?.item?.Id);
        alert("✅ Agreement generated successfully!");
      } else {
        // UPDATE AGREEMENT
        await list.items.getById(itemId).update({
          AgreementDate: formData.AgreementDate
            ? new Date(formData.AgreementDate).toISOString()
            : null,
          AdditionalRequirements: formData.AdditionalRequirements,
          SpecialTerms: formData.SpecialTerms
        });

        alert("✅ Agreement updated successfully!");
      }

      navigate("/reports");
    } catch (err) {
      console.error("Error saving agreement:", err);
      alert("❌ Failed to save agreement");
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
            <button className={styles.navButton} onClick={() => navigate('/clientform')}>Client Form</button>
            <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button>
            <button className={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
          </nav>
        </header>

        {/* Agreement Form */}
        <div className={styles.clientFormWrapper}>
          <h2>Agreement Form</h2>
<div className={styles.formGrid}>


    {/* Auto-populated client details */}
    <TextField label="Client ID" value={clientData.CLIENTId0 || ""} readOnly />
    <TextField label="Client Name" value={clientData.ClientName || ""} readOnly />
    <TextField label="Sales Person" value={clientData.SalesPersonName || ""} readOnly />
    <TextField label="Client Location" value={clientData.ClientLocation || ""} readOnly />

    {/* Agreement-specific fields */}
    <DatePicker
      label="Agreement Date"
      placeholder="Select agreement date"
      onSelectDate={(date) =>
        handleChange('AgreementDate', date ? date.toISOString().split("T")[0] : "")
      }
      value={formData.AgreementDate ? new Date(formData.AgreementDate) : undefined}
    />

    <TextField
      label="Additional Requirements"
      multiline
      rows={3}
      value={formData.AdditionalRequirements}
      onChange={(_, val) => handleChange('AdditionalRequirements', val || "")}
    />

    <TextField
      label="Special Terms"
      multiline
      rows={3}
      value={formData.SpecialTerms}
      onChange={(_, val) => handleChange('SpecialTerms', val || "")}
    />
  </div>

  {/* Submit */}
  <div className={styles.submitSection}>
    <button onClick={saveAgreement}>
      {itemId ? "Update Agreement" : "Generate Agreement"}
    </button>
  </div>
</div>


        {/* Footer */}
        <footer className={styles.footer}>© 2025 Agreement Management. All rights reserved.</footer>
      </div>
    </div>
  );
};

export default GenerateAgreementForm;
 