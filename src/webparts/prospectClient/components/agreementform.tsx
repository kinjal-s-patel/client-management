import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './agreementform.module.scss';
import { PrimaryButton, DefaultButton, TextField, DatePicker,Dialog , DialogFooter, DialogType} from '@fluentui/react';
import { spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/LOGO.png';
import { PDFDownloadLink } from "@react-pdf/renderer";
import AgreementDocument from "./agreementstructure";



interface IGenerateAgreementFormProps {
  context: WebPartContext;
}

const GenerateAgreementForm: React.FC<IGenerateAgreementFormProps> = ({ context }) => {
  const navigate = useNavigate();
  const sp = spfi().using(SPFx(context));
  const { id } = useParams(); // client id (if navigating from total clients)

  const [showPreview, setShowPreview] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);
  const [agreementId, setAgreementId] = useState<string>("");
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

  // ✅ Generate Next Agreement ID (JMS-XXX)
  const generateNextAgreementId = async () => {
    const list = sp.web.lists.getByTitle("Agreements");
    const items = await list.items.orderBy("Id", false).top(1)();
    if (items.length > 0 && items[0].AgreementID) {
      const lastId = items[0].AgreementID;
      const num = parseInt(lastId.split("-")[1]) + 1;
      return `JMS-${num.toString().padStart(3, "0")}`;
    }
    return "JMS-001";
  };

  // ✅ Fetch client & agreement details
useEffect(() => {
  const fetchData = async () => {
    try {
      if (id) {
        // fetch client
        const clientList = sp.web.lists.getByTitle("client list");
        const clientItems = await clientList.items.filter(`CLIENTId0 eq '${id}'`).top(1)();
        if (clientItems.length > 0) {
          setClientData(clientItems[0]);
        }

        // check if agreement exists
        const agreementList = sp.web.lists.getByTitle("Agreements");
        const agreements = await agreementList.items.filter(`clientid eq '${id}'`).top(1)();
        const fields = await sp.web.lists.getByTitle("Agreements").fields();
console.log(fields.map(f => ({ Title: f.Title, InternalName: f.InternalName })));


        if (agreements.length > 0) {
          // ✅ existing agreement → load it
          const ag = agreements[0];
          setFormData({
            AgreementDate: ag.AgreementDate ? new Date(ag.AgreementDate).toISOString().split("T")[0] : '',
            AdditionalRequirements: ag.AdditionalRequirements || '',
            SpecialTerms: ag.SpecialTerms || ''
          });
          setAgreementId(ag.AgreementID);
          setItemId(ag.Id);
          return;
        } else {
          // ⬇️ no agreement for this client → generate new ID
          const newId = await generateNextAgreementId();
          setAgreementId(newId);
        }
      } else {
        // ⬇️ brand new agreement form (no client id passed)
        const newId = await generateNextAgreementId();
        setAgreementId(newId);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();
}, [id]);


  // ✅ Save Agreement
  const saveAgreement = async () => {
    try {
      const list = sp.web.lists.getByTitle("Agreements");

      if (!itemId) {

        const addResult = await list.items.add({
          Title: `Agreement ${agreementId}`,
          AgreementID: agreementId,
          clientid: clientData.CLIENTId0 || "",
          clientname: clientData.ClientName || "",
          salesperson: clientData.SalesPersonName || "",
          clientlocation: clientData.ClientLocation || "",
          AgreementDate: formData.AgreementDate ? new Date(formData.AgreementDate).toISOString() : null,
          AdditionalRequirements: formData.AdditionalRequirements,
          SpecialTerms: formData.SpecialTerms
        });

        setItemId(addResult?.data?.Id || addResult?.item?.Id);
        alert("✅ Agreement generated successfully!");
      } else {

        await list.items.getById(itemId).update({
          AgreementDate: formData.AgreementDate ? new Date(formData.AgreementDate).toISOString() : null,
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

  // ✅ Inject Full Page Styles
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
            <button className={styles.navButton} onClick={() => navigate('/agreementform')}>Generate Agreement</button>
            <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button>
            <button className={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
          </nav>
        </header>

        {/* Agreement Form OR Preview */}

          <div className={styles.clientFormWrapper}>
            <h2>Agreement Form</h2>
            <div className={styles.formGrid}>
                  <TextField label="AgreementID" value={agreementId} readOnly />

<TextField
  label="Client ID"
  value={clientData.CLIENTId0 || ""}
  readOnly={!!id}   // ✅ only readonly if opened from Total Clients
  onChange={(_, val) => !id && setClientData((prev: any) => ({ ...prev, CLIENTId0: val || "" }))}
/>

<TextField
  label="Client Name"
  value={clientData.ClientName || ""}
  readOnly={!!id}
  onChange={(_, val) => !id && setClientData((prev: any) => ({ ...prev, ClientName: val || "" }))}
/>

<TextField
  label="Sales Person"
  value={clientData.SalesPersonName || ""}
  readOnly={!!id}
  onChange={(_, val) => !id && setClientData((prev: any) => ({ ...prev, SalesPersonName: val || "" }))}
/>

<TextField
  label="Client Location"
  value={clientData.ClientLocation || ""}
  readOnly={!!id}
  onChange={(_, val) => !id && setClientData((prev: any) => ({ ...prev, ClientLocation: val || "" }))}
/>


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

            {/* Actions */}
            <div className={styles.submitSection}>
              <PrimaryButton text="Preview Agreement" onClick={() => setShowPreview(true)} />
            </div>
          </div>

{/* Preview Dialog */}
<Dialog
  hidden={!showPreview}
  onDismiss={() => setShowPreview(false)}
  dialogContentProps={{
    type: DialogType.largeHeader,
    title: "Agreement Preview",
  }}
  minWidth={800}
  maxWidth={1000}
>
  <div className={styles.previewDocument}>
    {/* Client Details */}
    <div className={styles.previewSection}>
      <h3>Client Details</h3>
      <div className={styles.previewRow}><b>Client ID:</b> {clientData.CLIENTId0}</div>
      <div className={styles.previewRow}><b>Client Name:</b> {clientData.ClientName}</div>
      <div className={styles.previewRow}><b>Sales Person:</b> {clientData.SalesPersonName}</div>
      <div className={styles.previewRow}><b>Client Location:</b> {clientData.ClientLocation}</div>
    </div>

    {/* Agreement Details */}
    <div className={styles.previewSection}>
      <h3>Agreement Details</h3>
      <div className={styles.previewRow}><b>Agreement ID:</b> {agreementId}</div>
      <div className={styles.previewRow}><b>Agreement Date:</b> {formData.AgreementDate}</div>
      <div className={styles.previewRow}><b>Additional Requirements:</b> {formData.AdditionalRequirements}</div>
      <div className={styles.previewRow}><b>Special Terms:</b> {formData.SpecialTerms}</div>
    </div>
  </div>

  {/* Actions */}
<DialogFooter>
  <DefaultButton text="Back to Edit" onClick={() => setShowPreview(false)} />
  <PrimaryButton text={itemId ? "Update & Save" : "Save Agreement"} onClick={saveAgreement} />
</DialogFooter>

{/* ✅ New Download PDF button */}

<PDFDownloadLink
  document={
    <AgreementDocument
      clientData={clientData}
      formData={formData}
      agreementId={agreementId}
    />
  }
  fileName={`Agreement_${agreementId}.pdf`}
>
  {({ loading }) =>
    loading ? (
      <span>Generating PDF...</span>
    ) : (
      <PrimaryButton text="Download PDF" />
    )
  }
</PDFDownloadLink>

</Dialog>


        {/* Footer */}
        <footer className={styles.footer}>
          © 2025 Client Management. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default GenerateAgreementForm;
