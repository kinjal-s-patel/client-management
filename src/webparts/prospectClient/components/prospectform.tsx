import * as React from 'react';
import { useState, useEffect } from 'react';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './prospectform.module.scss';
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel } from "@fluentui/react-components";
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/LOGO.png';

// interface IProspect {
//   context: any; // SPFx context
// }

interface ProspectInfo {
  ProspectID: string;
  ContactPersonName: string;
  Designation: string;
  CompanyName: string;
  Website: string;
  Linkedin: string;
  Industry: string;
  Email: string;
  PhoneNumber: string;
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

const ProspectForm: React.FC<{ context: any }> = ({ context }) => {
  const sp = spfi().using(SPFx(context));
  const navigate = useNavigate();
  const { prospectId } = useParams();

  const [step, setStep] = useState(1);
  const [itemId, setItemId] = useState<number | null>(null);

  const [prospectInfo, setProspectInfo] = useState<ProspectInfo>({
    ProspectID: '',
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
  DateofFirstContact: new Date().toISOString().split('T')[0], // default to today
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
  const setCurrentUser = async () => {
    const spInstance = spfi().using(SPFx(context)); // use destructured context
    const currentUser = await spInstance.web.currentUser();
    setProspectInfo(prev => ({ ...prev, SalespersonName: currentUser.Title }));
  };

  setCurrentUser();
}, [context]); // include context in dependency array


  useEffect(() => {
    if (prospectId) {
      sp.web.lists.getByTitle("Prospect List").items
        .filter(`ProspectID eq '${prospectId}'`)
        .top(1)()
        .then(items => {
          if (items.length > 0) {
            const item = items[0];
            setProspectInfo({
              ProspectID: item.ProspectID || '',
              ContactPersonName: item.ContactPersonName || '',
              Designation: item.Designation || '',
              CompanyName: item.CompanyName || '',
              Website: item.Website || '',
              Linkedin: item.Linkedin || '',
              Industry: item.Industry || '',
              Email: item.Email || '',
              PhoneNumber: item.PhoneNumber ? item.PhoneNumber.toString() : '',
              Location: item.Location || '',
              AdditionalContactPersonName: item.AdditionalContactPersonName || '',
              additionalEmail: item.additionalEmail || '',
              additionalDesignation: item.additionalDesignation || '',
              additionalMobilenumber: item.additionalMobilenumber ? item.additionalMobilenumber.toString() : '',
              SalespersonName: item.SalespersonName || '',
              DateofFirstContact: item.DateofFirstContact ? new Date(item.DateofFirstContact).toISOString().split('T')[0] : '',
              FollowUpDate1: item.FollowUpDate1 ? new Date(item.FollowUpDate1).toISOString().split('T')[0] : '',
              FollowUpDate2: item.FollowUpDate2 ? new Date(item.FollowUpDate2).toISOString().split('T')[0] : '',
              FollowUpDate3: item.FollowUpDate3 ? new Date(item.FollowUpDate3).toISOString().split('T')[0] : '',
              ContactMethod: item.ContactMethod || '',
              MeetingDate: item.MeetingDate ? new Date(item.MeetingDate).toISOString().split('T')[0] : '',
              NotesfromInteraction: item.NotesfromInteraction || '',
              CurrentStatus: item.CurrentStatus || '',
              ClientResponse: item.ClientResponse || '',
              NextSteps: item.NextSteps || ''
            });
            setItemId(item.Id);
            setStep(1);
          }
        })
        .catch(err => console.error("Failed to load prospect data:", err));
    } else {
      generateProspectId();
    }
  }, [prospectId]);

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

  async function generateProspectId() {
    try {
      const items = await sp.web.lists.getByTitle("Prospect List").items
        .orderBy("ID", false).top(1)();

      const lastIdRaw = items.length > 0 && items[0]?.ProspectID
        ? parseInt(items[0].ProspectID.split('-')[1])
        : 0;

      const lastId = isNaN(lastIdRaw) ? 0 : lastIdRaw;
      const newId = `PROS-${(lastId + 1).toString().padStart(4, "0")}`;

      setProspectInfo(prev => ({
        ...prev,
        ProspectID: newId
      }));
    } catch (err) {
      console.error("Error generating Prospect ID", err);
    }
  }

  const handleChange = <K extends keyof ProspectInfo>(section: "prospectInfo", field: K, value: ProspectInfo[K]): void => {
    if (section === "prospectInfo") {
      setProspectInfo(prev => ({
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

        if (!itemId) {
          const addResult = await sp.web.lists.getByTitle("Prospect List").items.add({
            ProspectID: prospectInfo.ProspectID,
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

          setItemId(addResult?.data?.Id || addResult?.Id);
          alert("✅ Prospect Info saved successfully!");
          setStep(2);
        } else {
          await sp.web.lists.getByTitle("Prospect List").items.getById(itemId).update({
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
          alert("✅ Prospect Info updated successfully!");
          setStep(2);
        }
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
          { key: 'CurrentStatus', label: 'Current Status' }
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

if (prospectInfo.ClientResponse === "Yes – Proceed to Agreement") {
try {
      // Fetch all client IDs and pick the maximum
      const items = await sp.web.lists.getByTitle("client list")
        .items.select("CLIENTId0")
        .top(5000)(); // fetch up to 5000 clients

      let newClientID = 1;
      if (items.length > 0) {
        const ids = items
          .map(i => parseInt(i.CLIENTId0, 10))
          .filter(n => !isNaN(n));

        if (ids.length > 0) {
          const maxId = Math.max(...ids);
          newClientID = maxId + 1;
        }
      }
    // 2️⃣ Add the client → Convert to string!
   await sp.web.lists.getByTitle("client list").items.add({
        CLIENTId0: newClientID.toString(),   // string expected
        ClientName: prospectInfo.CompanyName || "",
        ContactPersonforHiring: prospectInfo.ContactPersonName || "",
        EmailAddress_x002d_Hiring: prospectInfo.Email || "",
        ClientLocation: prospectInfo.Location || "",
        Mobilenumber: prospectInfo.PhoneNumber ? Number(prospectInfo.PhoneNumber) : null,
        ClientIndustry: prospectInfo.Industry || "",
        status: "Active"
      });

      alert(`✅ Client added successfully with Client ID: ${newClientID}`);

    navigate('/totalclient');
  } catch (err) {
    console.error("Error adding client:", err);
    alert("❌ Failed to add client. See console for details.");
  }
} else {
  alert("✅ Prospect status updated successfully!");
  alert("🎉 All sections saved successfully!");
  navigate('/totalprospects');
}

      }
    } catch (err) {
      console.error("Error saving data:", err);
      alert("❌ Failed to save data. See console for details.");
    }
  };

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
            {/* <button className={styles.navButton} onClick={() => navigate('/agreementform')}>Generate Agreement</button> */}
            {/* <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button> */}
            <button className={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
          </nav>
        </header>

        <div className={styles.formWrapper}>
          <h2 className={styles.pageTitle}>Prospect Form</h2>

          <Accordion
            multiple={false}
            collapsible
            openItems={[step.toString()]}
            onToggle={(e, data) => {
              const newStep = data.openItems && data.openItems.length > 0
                ? Number(data.openItems[0])
                : 0;
              setStep(newStep);
            }}
          >
            <AccordionItem value="1">
              <AccordionHeader>1. Prospect Information</AccordionHeader>
              <AccordionPanel>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Prospect ID</label>
                    <input type="text" value={prospectInfo.ProspectID} readOnly style={{ backgroundColor: '#fff', cursor: 'not-allowed' }} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Contact Person Name <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={prospectInfo.ContactPersonName}
                      onChange={e => handleChange("prospectInfo", "ContactPersonName", e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Designation <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={prospectInfo.Designation}
                      onChange={(e) => handleChange('prospectInfo', 'Designation', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Company Name <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={prospectInfo.CompanyName}
                      onChange={(e) => handleChange('prospectInfo', 'CompanyName', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Website <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={prospectInfo.Website}
                      onChange={(e) => handleChange('prospectInfo', 'Website', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>LinkedIn <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={prospectInfo.Linkedin}
                      onChange={(e) => handleChange('prospectInfo', 'Linkedin', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Industry <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={prospectInfo.Industry}
                      onChange={(e) => handleChange('prospectInfo', 'Industry', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email <span className={styles.required}>*</span></label>
                    <input
                      type="email"
                      value={prospectInfo.Email}
                      onChange={(e) => handleChange('prospectInfo', 'Email', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={prospectInfo.PhoneNumber}
                      onChange={(e) => handleChange('prospectInfo', 'PhoneNumber', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Location <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={prospectInfo.Location}
                      onChange={(e) => handleChange('prospectInfo', 'Location', e.target.value)}
                      required
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

                <button className={styles.saveBtn} onClick={saveStep}>Next</button>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem value="2">
              <AccordionHeader>2. Sales Interaction Details</AccordionHeader>
              <AccordionPanel>
                <div className={styles.formRow}>
<div className={styles.formGroup}>
  <label>Salesperson Name <span className={styles.required}>*</span></label>
  <input
    type="text"
    value={prospectInfo.SalespersonName}
    onChange={(e) => handleChange('prospectInfo', 'SalespersonName', e.target.value)}
    required
  />
</div>

                  <div className={styles.formGroup}>
  <label>Date of First Contact <span className={styles.required}>*</span></label>
  <input
    type="date"
    value={prospectInfo.DateofFirstContact}
    onChange={(e) => handleChange('prospectInfo', 'DateofFirstContact', e.target.value)}
    required
  />
</div>
                  <div className={styles.formGroup}>
                    <label>Follow Up Date 1 <span className={styles.required}>*</span></label>
                    <input
                      type="date"
                      value={prospectInfo.FollowUpDate1}
                      onChange={(e) => handleChange('prospectInfo', 'FollowUpDate1', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Follow Up Date 2</label>
                    <input
                      type="date"
                      value={prospectInfo.FollowUpDate2}
                      onChange={(e) => handleChange('prospectInfo', 'FollowUpDate2', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Follow Up Date 3</label>
                    <input
                      type="date"
                      value={prospectInfo.FollowUpDate3}
                      onChange={(e) => handleChange('prospectInfo', 'FollowUpDate3', e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
  <label>Contact Method <span className={styles.required}>*</span></label>
  <select
    value={prospectInfo.ContactMethod}
    onChange={(e) => handleChange('prospectInfo', 'ContactMethod', e.target.value)}
  >
    <option value="">-- Select Contact Method --</option>
    <option value="Email">Email</option>
    <option value="Call">Call</option>
    <option value="Meeting">Meeting</option>
    <option value="DM">DM</option>
  </select>
</div>

                  <div className={styles.formGroup}>
                    <label>Meeting Date</label>
                    <input
                      type="date"
                      value={prospectInfo.MeetingDate}
                      onChange={(e) => handleChange('prospectInfo', 'MeetingDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ width: "100%" }}>
                    <label>Notes from Interaction</label>
                    <textarea
                      rows={4}
                      value={prospectInfo.NotesfromInteraction}
                      onChange={(e) => handleChange('prospectInfo', 'NotesfromInteraction', e.target.value)}
                    />
                  </div>
                </div>

                <button className={styles.saveBtn} onClick={saveStep}>Next</button>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem value="3">
              <AccordionHeader>3. Prospect Status</AccordionHeader>
              <AccordionPanel>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Current Status <span className={styles.required}>*</span></label>
                    <select
                      value={prospectInfo.CurrentStatus}
                      onChange={(e) => handleChange('prospectInfo', 'CurrentStatus', e.target.value)}
                      required
                    >
                      <option value="">-- Select Status --</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Meeting Scheduled">Meeting Scheduled</option>
                      <option value="Follow-up Needed">Follow-up Needed</option>
                      <option value="Onboarded">Onboarded</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Client Response </label>
                    <select
                      value={prospectInfo.ClientResponse}
                      onChange={(e) => handleChange('prospectInfo', 'ClientResponse', e.target.value)}
                      
                    >
                      <option value="">-- Select Response --</option>
                      <option value="Yes – Proceed to Agreement">Yes – Proceed to Agreement</option>
                      <option value="No – Reconnect Later">No – Reconnect Later</option>
                      <option value="In-communication">In-communication</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ width: "100%" }}>
                    <label>Next Steps</label>
                    <textarea
                      rows={4}
                      value={prospectInfo.NextSteps}
                      onChange={(e) => handleChange('prospectInfo', 'NextSteps', e.target.value)}
                    />
                  </div>
                </div>

                <button className={styles.saveBtn} onClick={saveStep}>Save All</button>
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