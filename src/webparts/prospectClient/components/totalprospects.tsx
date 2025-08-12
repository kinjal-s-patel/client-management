import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './totalprospects.module.scss';
import logo from '../assets/LOGO.png';

export interface ITotalProspectsProps {
  sp: any; // spfi object from parent
}

interface IProspect {
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

const TotalProspects: React.FC<ITotalProspectsProps> = ({ sp }) => {
  const navigate = useNavigate();
  const [prospects, setProspects] = useState<IProspect[]>([]); // <-- Fix: add setter
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prospects from SharePoint list "Prospect List"
        const items: IProspect[] = await sp.web.lists
          .getByTitle("Prospect List")
          .items.select("*")
          .orderBy("ID", false)
          .top(10)();  // limit to 10 entries per page here, you can add pagination later

        setProspects(items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [sp]);

  const filteredProspects = prospects.filter(p =>
    p.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ContactPersonName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Header */}
        <header className={styles.dashboardHeader}>
          <div className={styles.logoSection}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <div>
              <h1 className={styles.title}>Prospect Management</h1>
              <p className={styles.subtitle}>Track and manage all prospects</p>
            </div>
          </div>
          <nav className={styles.navBar}>
            <button className={styles.navButton} onClick={() => navigate('/prospectform')}>Prospect Form</button>
            <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button>
          </nav>
        </header>

        {/* Search */}
        <div className={styles.pageHeader}>
          <h2>Total Prospects</h2>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name or company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className={styles.tableContainer} style={{ overflowX: 'auto' }}>
          <table className={styles.clientTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Industry</th>
                <th>Location</th>
                <th>Date of First Contact</th>
                <th>Follow-up 1</th>
                <th>Follow-up 2</th>
                <th>Follow-up 3</th>
                <th>Meeting Date</th>
                <th>Next Steps</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProspects.map(p => (
                <tr key={p.ProspectID}>
                  <td>{p.ProspectID}</td>
                  <td>{p.CompanyName}</td>
                  <td>{p.ContactPersonName}</td>
                  <td>{p.Email}</td>
                  <td>{p.PhoneNumber}</td>
                  <td>{p.Industry}</td>
                  <td>{p.Location}</td>
                  <td>{p.DateofFirstContact ? new Date(p.DateofFirstContact).toLocaleDateString() : ''}</td>
                  <td>{p.FollowUpDate1 ? new Date(p.FollowUpDate1).toLocaleDateString() : ''}</td>
                  <td>{p.FollowUpDate2 ? new Date(p.FollowUpDate2).toLocaleDateString() : ''}</td>
                  <td>{p.FollowUpDate3 ? new Date(p.FollowUpDate3).toLocaleDateString() : ''}</td>
                  <td>{p.MeetingDate ? new Date(p.MeetingDate).toLocaleDateString() : ''}</td>
                  <td>{p.NextSteps}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => navigate(`/prospectform/edit/${p.ProspectID}`)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        © 2025 Prospect Management. All rights reserved.
      </footer>
    </div>
  );
};

export default TotalProspects;
