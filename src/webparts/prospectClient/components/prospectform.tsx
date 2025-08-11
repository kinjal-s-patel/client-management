import * as React from 'react';
import { useState } from 'react';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './prospectform.module.scss';
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel } from "@fluentui/react-components";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/LOGO.png';

interface IProspectFormProps {
  context: any; // SPFx context
}

const ProspectForm: React.FC<IProspectFormProps> = ({ context }) => {
  const sp = spfi().using(SPFx(context));
   const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Section 1: Prospect Information
  const [prospectInfo, setProspectInfo] = useState({
    ContactPersonName: '',
    Designation: '',
    CompanyName: '',
    Website: '',
    Linkedin: '',
    Industry: '',
    Email: '',
    PhoneNumber: '',
    Location: '',
    AdditionalContactPersonName: '',
    additionalEmail: '',
    additionalDesignation: '',
    additionalMobilenumber: ''
  });

  // Section 2: Sales Interaction Details
  const [salesInteraction, setSalesInteraction] = useState({
    SalespersonName: context.pageContext.user.displayName,
    DateofFirstContact: '',
    FollowUpDate1: '',
    FollowUpDate2: '',
    FollowUpDate3: '',
    ContactMethod: '',
    MeetingDate: '',
    NotesfromInteraction: ''
  });

  // Section 3: Prospect Status
  const [prospectStatus, setProspectStatus] = useState({
    CurrentStatus: '',
    ClientResponse: '',
    NextSteps: ''
  });

  const handleChange = (section: string, field: string, value: string) => {
    if (section === 'prospectInfo') {
      setProspectInfo({ ...prospectInfo, [field]: value });
    } else if (section === 'salesInteraction') {
      setSalesInteraction({ ...salesInteraction, [field]: value });
    } else if (section === 'prospectStatus') {
      setProspectStatus({ ...prospectStatus, [field]: value });
    }
  };

const saveStep = async () => {
  try {
    if (step === 1) {
      await sp.web.lists.getByTitle("Prospect List").items.add({
        ContactPersonName: prospectInfo.ContactPersonName || "",
        Designation: prospectInfo.Designation || "",
        CompanyName: prospectInfo.CompanyName || "",
        Website: prospectInfo.Website || "",
        Linkedin: prospectInfo.Linkedin || "",
        Industry: prospectInfo.Industry || "",
        Email: prospectInfo.Email || "",
        PhoneNumber: prospectInfo.PhoneNumber ? Number(prospectInfo.PhoneNumber) : null,
        Location: prospectInfo.Location || "",
        AdditionalContactPersonName: prospectInfo.AdditionalContactPersonName || "",
        additionalEmail: prospectInfo.additionalEmail || "",
        additionalDesignation: prospectInfo.additionalDesignation || "",
        additionalMobilenumber: prospectInfo.additionalMobilenumber ? Number(prospectInfo.additionalMobilenumber) : null
      });
      alert("✅ Prospect Info saved successfully!");
      setStep(2);
    } 
  if (step === 2) {
  if (!salesInteraction.SalespersonName || !salesInteraction.DateofFirstContact || !salesInteraction.FollowUpDate1) {
    alert("Please fill in all required fields in Sales Interaction Details.");
    return;
  }

  await sp.web.lists.getByTitle("Sales Interaction Details").items.add({
    SalespersonName: salesInteraction.SalespersonName,
    DateofFirstContact: new Date(salesInteraction.DateofFirstContact),
    FollowUpDate1: new Date(salesInteraction.FollowUpDate1),
    FollowUpDate2: salesInteraction.FollowUpDate2 ? new Date(salesInteraction.FollowUpDate2) : null,
    FollowUpDate3: salesInteraction.FollowUpDate3 ? new Date(salesInteraction.FollowUpDate3) : null,
    ContactMethod: salesInteraction.ContactMethod || "",
    MeetingDate: salesInteraction.MeetingDate ? new Date(salesInteraction.MeetingDate) : null,
    NotesfromInteraction: salesInteraction.NotesfromInteraction || ""
  });

  alert("✅ Sales Interaction Details saved successfully!");
  setStep(step + 1);
}

    else if (step === 3) {
      await sp.web.lists.getByTitle("Prospect Status").items.add({
        CurrentStatus: prospectStatus.CurrentStatus || "",
        ClientResponse: prospectStatus.ClientResponse || "",
        NextSteps: prospectStatus.NextSteps || ""
      });
      alert("✅ Prospect Status saved successfully!");
      alert("🎉 All sections saved successfully!");
    }

  } catch (err) {
    console.error("❌ Error saving data:", err);
    alert(`Error saving data in Step ${step}. Please check console for details.`);
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
          <button className={styles.navButton} onClick={() => navigate('/clientform')}>Client Form</button>
          <button className={styles.navButton} onClick={() => navigate('/generateagreement')}>Generate Agreement</button>
          <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button>
          <button className={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
        </nav>
      </header>

<div className={styles.formWrapper}>
  <h2 className={styles.pageTitle}>Prospect Form</h2>

  <Accordion multiple={false} collapsible>
    {/* Section 1 */}
    <AccordionItem value="1">
      <AccordionHeader>1. Prospect Information</AccordionHeader>
      <AccordionPanel>

        {/* Row 1 */}
<div className={styles.formRow}>
    <div className={styles.formGroup}>
      <label>Contact Person Name <span className={styles.required}>*</span></label>
      <input
        type="text"
        value={prospectInfo.ContactPersonName}
        required
        onChange={(e) => handleChange('prospectInfo', 'ContactPersonName', e.target.value)}
      />
    </div>
    <div className={styles.formGroup}>
      <label>Designation <span className={styles.required}>*</span></label>
      <input
        type="text"
        value={prospectInfo.Designation}
        required
        onChange={(e) => handleChange('prospectInfo', 'Designation', e.target.value)}
      />
    </div>
    <div className={styles.formGroup}>
      <label>Company Name <span className={styles.required}>*</span></label>
      <input
        type="text"
        value={prospectInfo.CompanyName}
        required
        onChange={(e) => handleChange('prospectInfo', 'CompanyName', e.target.value)}
      />
    </div>
  </div>

  {/* Row 2 */}
  <div className={styles.formRow}>
    <div className={styles.formGroup}>
      <label>Website <span className={styles.required}>*</span></label>
      <input
        type="text"
        value={prospectInfo.Website}
        required
        onChange={(e) => handleChange('prospectInfo', 'Website', e.target.value)}
      />
    </div>
    <div className={styles.formGroup}>
      <label>LinkedIn <span className={styles.required}>*</span></label>
      <input
        type="text"
        value={prospectInfo.Linkedin}
        required
        onChange={(e) => handleChange('prospectInfo', 'Linkedin', e.target.value)}
      />
    </div>
    <div className={styles.formGroup}>
      <label>Industry <span className={styles.required}>*</span></label>
      <input
        type="text"
        value={prospectInfo.Industry}
        required
        onChange={(e) => handleChange('prospectInfo', 'Industry', e.target.value)}
      />
    </div>
  </div>

  {/* Row 3 */}
  <div className={styles.formRow}>
    <div className={styles.formGroup}>
      <label>Email <span className={styles.required}>*</span></label>
      <input
        type="email"
        value={prospectInfo.Email}
        required
        onChange={(e) => handleChange('prospectInfo', 'Email', e.target.value)}
      />
    </div>
    <div className={styles.formGroup}>
      <label>Phone Number <span className={styles.required}>*</span></label>
      <input
        type="text"
        value={prospectInfo.PhoneNumber}
        required
        onChange={(e) => handleChange('prospectInfo', 'PhoneNumber', e.target.value)}
      />
    </div>
    <div className={styles.formGroup}>
      <label>Location <span className={styles.required}>*</span></label>
      <input
        type="text"
        value={prospectInfo.Location}
        required
        onChange={(e) => handleChange('prospectInfo', 'Location', e.target.value)}
      />
    </div>
  </div>

        {/* Row 4 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Additional Contact Person Name</label>
            <input type="text" value={prospectInfo.AdditionalContactPersonName} onChange={(e) => handleChange('prospectInfo', 'AdditionalContactPersonName', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Additional Email</label>
            <input type="email" value={prospectInfo.additionalEmail} onChange={(e) => handleChange('prospectInfo', 'AdditionalEmail', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Additional Designation</label>
            <input type="text" value={prospectInfo.additionalDesignation} onChange={(e) => handleChange('prospectInfo', 'AdditionalDesignation', e.target.value)} />
          </div>
        </div>

        {/* Row 5 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Additional Mobile</label>
            <input type="text" value={prospectInfo.additionalMobilenumber} onChange={(e) => handleChange('prospectInfo', 'AdditionalMobile', e.target.value)} />
          </div>
        </div>

        <button onClick={saveStep} className={styles.saveBtn}>Save & Next</button>
      </AccordionPanel>
    </AccordionItem>

    {/* Section 2 */}
    <AccordionItem value="2">
      <AccordionHeader>2. Sales Interaction Details</AccordionHeader>
      <AccordionPanel>

        {/* Row 1 */}
      <div className={styles.formRow}>
  <div className={styles.formGroup}>
    <label>Salesperson Name <span style={{ color: 'red' }}>*</span></label>
    <input
      type="text"
      value={salesInteraction.SalespersonName}
      onChange={(e) => handleChange('salesInteraction', 'SalespersonName', e.target.value)}
      required
    />
  </div>

  <div className={styles.formGroup}>
    <label>Date of First Contact <span style={{ color: 'red' }}>*</span></label>
    <input
      type="date"
      value={salesInteraction.DateofFirstContact}
      onChange={(e) => handleChange('salesInteraction', 'DateofFirstContact', e.target.value)}
      required
    />
  </div>

  <div className={styles.formGroup}>
    <label>Follow Up Date 1 <span style={{ color: 'red' }}>*</span></label>
    <input
      type="date"
      value={salesInteraction.FollowUpDate1}
      onChange={(e) => handleChange('salesInteraction', 'FollowUpDate1', e.target.value)}
      required
    />
  </div>
</div>


        {/* Row 2 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Follow Up Date 2</label>
            <input type="date" value={salesInteraction.FollowUpDate2} onChange={(e) => handleChange('salesInteraction', 'FollowUpDate2', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Follow Up Date 3</label>
            <input type="date" value={salesInteraction.FollowUpDate3} onChange={(e) => handleChange('salesInteraction', 'FollowUpDate3', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Contact Method</label>
            <select value={salesInteraction.ContactMethod} onChange={(e) => handleChange('salesInteraction', 'ContactMethod', e.target.value)}>
              <option value="">Select Method</option>
              <option>Email</option>
              <option>Call</option>
              <option>Meeting</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Meeting Date</label>
            <input type="date" value={salesInteraction.MeetingDate} onChange={(e) => handleChange('salesInteraction', 'MeetingDate', e.target.value)} />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Notes</label>
            <textarea value={salesInteraction.NotesfromInteraction} onChange={(e) => handleChange('salesInteraction', 'NotesfromInteraction', e.target.value)} />
          </div>
        </div>

        <button onClick={saveStep} className={styles.saveBtn}>Save & Next</button>
      </AccordionPanel>
    </AccordionItem>

    {/* Section 3 */}
    <AccordionItem value="3">
      <AccordionHeader>3. Prospect Status</AccordionHeader>
      <AccordionPanel>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Current Status</label>
            <select value={prospectStatus.CurrentStatus} onChange={(e) => handleChange('prospectStatus', 'CurrentStatus', e.target.value)}>
              <option value="">Select Status</option>
              <option>Contacted</option>
              <option>Meeting Scheduled</option>
              <option>Follow-up Needed</option>
              <option>Onboarded</option>
              <option>Not Interested</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Client Response</label>
            <select value={prospectStatus.ClientResponse} onChange={(e) => handleChange('prospectStatus', 'ClientResponse', e.target.value)}>
              <option value="">Select Response</option>
              <option>Yes – Proceed to Agreement</option>
              <option>No – Reconnect Later</option>
              <option>No – Not Interested</option>
            </select>
          </div>
          < div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Next Steps</label>
            <textarea value={prospectStatus.NextSteps} onChange={(e) => handleChange('prospectStatus', 'NextSteps', e.target.value)} />
          </div>
        </div>

        <button onClick={saveStep} className={styles.saveBtn}>Save</button>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
</div>
</div>

     {/* Footer */}
      <footer className={styles.footer}>
        © 2025 client Management. All rights reserved.
      </footer>
    </div>

  );
};

export default ProspectForm;
