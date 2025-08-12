import * as React from 'react';
import { useState, useEffect } from 'react';
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

interface ProspectInfo {
   ProspectID: string;  // <-- added here
  ContactPersonName: string;
  Designation: string;
  CompanyName: string;
  Website: string;
  Linkedin: string;
  Industry: string;
  Email: string;
  PhoneNumber: string; // Keep as string for input fields
  Location: string;
  AdditionalContactPersonName: string;
  additionalEmail: string;
  additionalDesignation: string;
  additionalMobilenumber: string;
  SalespersonName: string;
  DateofFirstContact: string;
  FollowUpDate1: string;
  FollowUpDate2: string;
  FollowUpDate3: string;
  ContactMethod: string;
  MeetingDate: string;
  NotesfromInteraction: string;
  CurrentStatus: string;
  ClientResponse: string;
  NextSteps: string;
}


const ProspectForm: React.FC<IProspectFormProps> = ({ context }) => {
  const sp = spfi().using(SPFx(context));
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [prospectId, setProspectId] = useState("");
  const [itemId, setItemId] = useState<number | null>(null);

const [prospectInfo, setProspectInfo] = useState({
    ProspectID: '',  // <-- added here
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
  additionalMobilenumber: '',
  SalespersonName: '',
  DateofFirstContact: '',
  FollowUpDate1: '',
  FollowUpDate2: '',
  FollowUpDate3: '',
  ContactMethod: '',
  MeetingDate: '',
  NotesfromInteraction: '',
  CurrentStatus: '',
  ClientResponse: '',
  NextSteps: ''
});

  useEffect(() => {
    generateProspectId();
  }, []);

async function generateProspectId() {
  try {
    const items = await sp.web.lists.getByTitle("Prospect List").items
      .orderBy("ID", false).top(1)();

    // Extract last numeric part of ProspectID or default 0
    const lastIdRaw = items.length > 0 && items[0]?.ProspectID
      ? parseInt(items[0].ProspectID.split('-')[1])
      : 0;

    const lastId = isNaN(lastIdRaw) ? 0 : lastIdRaw;

    // Format new ProspectID like PROS-0001
    const newId = `PROS-${(lastId + 1).toString().padStart(4, "0")}`;

    setProspectId(newId);

    setProspectInfo(prev => ({
      ...prev,
      ProspectID: newId
    }));
  } catch (err) {
    console.error("Error generating Prospect ID", err);
  }
}


const handleChange = <
  K extends keyof ProspectInfo
>(
  section: "prospectInfo",
  field: K,
  value: ProspectInfo[K]
): void => {
  if (section === "prospectInfo") {
    setProspectInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  }
};


  const saveStep = async () => {
    try {
      if (step === 1) {
        const requiredFields = [
          { key: 'ContactPersonName', label: 'Contact Person Name' },
          { key: 'Designation', label: 'Designation' },
          { key: 'CompanyName', label: 'Company Name' },
          { key: 'Website', label: 'Website' },
          { key: 'Linkedin', label: 'LinkedIn' },
          { key: 'Industry', label: 'Industry' },
          { key: 'Email', label: 'Email' },
          { key: 'PhoneNumber', label: 'Phone Number' },
          { key: 'Location', label: 'Location' }
        ];

        const missing = requiredFields
          .filter(({ key }) => !prospectInfo[key as keyof typeof prospectInfo]?.trim())
          .map(({ label }) => label);

        if (missing.length > 0) {
          alert(`Please fill all required fields:\n${missing.join(', ')}`);
          return;
        }
        
const addResult = await sp.web.lists.getByTitle("Prospect List").items.add({

          ProspectID: prospectId,
          ContactPersonName: prospectInfo.ContactPersonName,
          Designation: prospectInfo.Designation,
          CompanyName: prospectInfo.CompanyName,
          Website: prospectInfo.Website,
          Linkedin: prospectInfo.Linkedin,
          Industry: prospectInfo.Industry,
          Email: prospectInfo.Email,
          PhoneNumber: Number(prospectInfo.PhoneNumber),
          Location: prospectInfo.Location,
          AdditionalContactPersonName: prospectInfo.AdditionalContactPersonName || "",
          additionalEmail: prospectInfo.additionalEmail || "",
          additionalDesignation: prospectInfo.additionalDesignation || "",
          additionalMobilenumber: prospectInfo.additionalMobilenumber ? Number(prospectInfo.additionalMobilenumber) : null
        });

  const newId = addResult?.data?.Id || addResult?.Id;
if (!newId) {
  throw new Error("Could not retrieve Id from addResult");
}
setItemId(newId);

console.log("Add Result:", addResult);

        alert("✅ Prospect Info saved successfully!");
        setStep(2);
      }

      else if (step === 2 && itemId) {
        const requiredFields = [
          { key: 'SalespersonName', label: 'Salesperson Name' },
          { key: 'DateofFirstContact', label: 'Date of First Contact' },
          { key: 'FollowUpDate1', label: 'Follow Up Date 1' }
        ];

        const missing = requiredFields
          .filter(({ key }) => !prospectInfo[key as keyof typeof prospectInfo]?.trim())
          .map(({ label }) => label);

        if (missing.length > 0) {
          alert(`Please fill all required fields:\n${missing.join(', ')}`);
          return;
        }

        await sp.web.lists.getByTitle("Prospect List").items.getById(itemId).update({
          SalespersonName: prospectInfo.SalespersonName,
          DateofFirstContact: new Date(prospectInfo.DateofFirstContact),
          FollowUpDate1: new Date(prospectInfo.FollowUpDate1),
          FollowUpDate2: prospectInfo.FollowUpDate2 ? new Date(prospectInfo.FollowUpDate2) : null,
          FollowUpDate3: prospectInfo.FollowUpDate3 ? new Date(prospectInfo.FollowUpDate3) : null,
          ContactMethod: prospectInfo.ContactMethod || "",
          MeetingDate: prospectInfo.MeetingDate ? new Date(prospectInfo.MeetingDate) : null,
          NotesfromInteraction: prospectInfo.NotesfromInteraction || ""
        });

        alert("✅ Sales Interaction Details saved successfully!");
        setStep(3);
      }

      else if (step === 3 && itemId) {
        const requiredFields = [
          { key: 'CurrentStatus', label: 'Current Status' },
          { key: 'ClientResponse', label: 'Client Response' }
        ];

        const missing = requiredFields
          .filter(({ key }) => !prospectInfo[key as keyof typeof prospectInfo]?.trim())
          .map(({ label }) => label);

        if (missing.length > 0) {
          alert(`Please fill all required fields:\n${missing.join(', ')}`);
          return;
        }

        await sp.web.lists.getByTitle("Prospect List").items.getById(itemId).update({
          CurrentStatus: prospectInfo.CurrentStatus,
          ClientResponse: prospectInfo.ClientResponse,
          NextSteps: prospectInfo.NextSteps
        });

        alert("✅ Prospect Status saved successfully!");
        alert("🎉 All sections saved successfully!");
      }
    } catch (err) {
      console.error("❌ Error saving data:", err);
      alert(`Error saving data in Step ${step}. Please check console for details.`);
    }
  };

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
      }}>
    <div className={styles.dashboardWrapper}>
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
  <AccordionItem value="1">
    <AccordionHeader>1. Prospect Information</AccordionHeader>
    <AccordionPanel>
      {/* Row 1 */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Prospect ID</label>
          <input
            type="text"
            value={prospectInfo.ProspectID}
            readOnly
            style={{ backgroundColor: '#fff', cursor: 'not-allowed' }}
          />
        </div>
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
      </div>

      {/* Row 2 */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Company Name <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={prospectInfo.CompanyName}
            required
            onChange={(e) => handleChange('prospectInfo', 'CompanyName', e.target.value)}
          />
        </div>
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
      </div>

      {/* Row 3 */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Industry <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={prospectInfo.Industry}
            required
            onChange={(e) => handleChange('prospectInfo', 'Industry', e.target.value)}
          />
        </div>
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
        </div>

{/* Row 4 */}
<div className={styles.formRow}>
  <div className={styles.formGroup}>
    <label>Location <span className={styles.required}>*</span></label>
    <input
      type="text"
      value={prospectInfo.Location}
      required
      onChange={(e) => handleChange('prospectInfo', 'Location', e.target.value)}
    />
  </div>

  <div className={styles.formGroup}>
    <label>Additional Contact Person Name</label>
    <input
      type="text"
      value={prospectInfo.AdditionalContactPersonName}
      onChange={(e) => handleChange('prospectInfo', 'AdditionalContactPersonName', e.target.value)}
    />
  </div>

  <div className={styles.formGroup}>
    <label>Additional Email</label>
    <input
      type="email"
      value={prospectInfo.additionalEmail}
      onChange={(e) => handleChange('prospectInfo', 'additionalEmail', e.target.value)}
    />
  </div>
</div>

{/* Row 5 */}
<div className={styles.formRow}>
  <div className={styles.formGroup}>
    <label>Additional Designation</label>
    <input
      type="text"
      value={prospectInfo.additionalDesignation}
      onChange={(e) => handleChange('prospectInfo', 'additionalDesignation', e.target.value)}
    />
  </div>

  <div className={styles.formGroup}>
    <label>Additional Mobile</label>
    <input
      type="text"
      value={prospectInfo.additionalMobilenumber}
      onChange={(e) => handleChange('prospectInfo', 'additionalMobilenumber', e.target.value)}
    />
  </div>
</div>

      <button onClick={saveStep} className={styles.saveBtn}>Save & Next</button>
    </AccordionPanel>
  </AccordionItem>



          <AccordionItem value="2">
            <AccordionHeader>2. Sales Interaction Details</AccordionHeader>
            <AccordionPanel>
           
        {/* Row 1 */}
      <div className={styles.formRow}>
  <div className={styles.formGroup}>
    <label>Salesperson Name <span style={{ color: 'red' }}>*</span></label>
    <input
      type="text"
      value={prospectInfo.SalespersonName}
      onChange={(e) => handleChange('prospectInfo', 'SalespersonName', e.target.value)}
      required
    />
  </div>

  <div className={styles.formGroup}>
    <label>Date of First Contact <span style={{ color: 'red' }}>*</span></label>
    <input
      type="date"
      value={prospectInfo.DateofFirstContact}
      onChange={(e) => handleChange('prospectInfo', 'DateofFirstContact', e.target.value)}
      required
    />
  </div>

  <div className={styles.formGroup}>
    <label>Follow Up Date 1 <span style={{ color: 'red' }}>*</span></label>
    <input
      type="date"
      value={prospectInfo.FollowUpDate1}
      onChange={(e) => handleChange('prospectInfo', 'FollowUpDate1', e.target.value)}
      required
    />
  </div>
</div>


        {/* Row 2 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Follow Up Date 2</label>
            <input type="date" value={prospectInfo.FollowUpDate2} onChange={(e) => handleChange('prospectInfo', 'FollowUpDate2', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Follow Up Date 3</label>
            <input type="date" value={prospectInfo.FollowUpDate3} onChange={(e) => handleChange('prospectInfo', 'FollowUpDate3', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Contact Method</label>
            <select value={prospectInfo.ContactMethod} onChange={(e) => handleChange('prospectInfo', 'ContactMethod', e.target.value)}>
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
            <input type="date" value={prospectInfo.MeetingDate} onChange={(e) => handleChange('prospectInfo', 'MeetingDate', e.target.value)} />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Notes</label>
            <textarea value={prospectInfo.NotesfromInteraction} onChange={(e) => handleChange('prospectInfo', 'NotesfromInteraction', e.target.value)} />
          </div>
        </div>
              <button onClick={saveStep} className={styles.saveBtn}>Save & Next</button>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="3">
            <AccordionHeader>3. Prospect Status</AccordionHeader>
            <AccordionPanel>
                 <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Current Status</label>
            <select value={prospectInfo.CurrentStatus} onChange={(e) => handleChange('prospectInfo', 'CurrentStatus', e.target.value)}>
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
            <select value={prospectInfo.ClientResponse} onChange={(e) => handleChange('prospectInfo', 'ClientResponse', e.target.value)}>
              <option value="">Select Response</option>
              <option>Yes – Proceed to Agreement</option>
              <option>No – Reconnect Later</option>
              <option>No – Not Interested</option>
            </select>
          </div>
          < div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Next Steps</label>
            <textarea value={prospectInfo.NextSteps} onChange={(e) => handleChange('prospectInfo', 'NextSteps', e.target.value)} />
          </div>
        </div>

              <button onClick={saveStep} className={styles.saveBtn}>Save</button>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>

      <footer className={styles.footer}>
        © 2025 Client Management. All rights reserved.
      </footer>
    </div>

  );
};

export default ProspectForm;
