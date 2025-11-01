import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.scss';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/LOGO.png';

import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Props interface to accept SPFx context from WebPart
interface IDashboardProps {
  context: any;
}

const Dashboard: React.FC<IDashboardProps> = ({ context }) => {
  const navigate = useNavigate();
  const [totalProspects, setTotalProspects] = useState<number>(0);
  const [convertedClients, setConvertedClients] = useState<number>(0);
  const [, setAgreementsGenerated] = useState<number>(0);
  // const [pendingApprovals, setPendingApprovals] = useState<number>(0);

  // Hide SharePoint chrome
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

  // Fetch list counts from SharePoint

const sp = React.useMemo(() => spfi().using(SPFx(context)), [context]);


useEffect(() => {
  const fetchCounts = async () => {
    try {
      const prospects = await sp.web.lists.getByTitle("Prospect List").items();
     const clients = await sp.web.lists.getByTitle("client list").items();
      const agreements = await sp.web.lists.getByTitle("Agreements").items();
      // const approvals = await sp.web.lists
      //   .getByTitle("Prospect List")
      //   .items.filter(`Status eq 'Pending'`).select("Id")();

      setTotalProspects(prospects.length);
      setConvertedClients(clients.length);
      setAgreementsGenerated(agreements.length);
      // setPendingApprovals(approvals.length);
        console.log("Client list items:", clients);
    } catch (err) {
      console.error("Error fetching counts:", err);
    
    }
  };

  fetchCounts();
}, [sp]); // include sp as dependency

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
              <h1 className={styles.title}>Customer and Prospect Management System</h1>
              <p className={styles.subtitle}>Streamlined Prospect and Client Management</p>
            </div>
          </div>
          <nav className={styles.navBar}>
            <button className={styles.navButton} onClick={() => navigate('/prospectform')}>Prospect Form</button>
            <button className={styles.navButton} onClick={() => navigate('/clientform')}>Customer Form</button>
            {/* <button className={styles.navButton} onClick={() => navigate('/agreementform')}>Generate Agreement</button> */}
            {/* <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button> */}
          </nav>
        </header>

           {/* Onboarding Message for New Users */}
<section
  style={{
    background: '#e8f1fb',
    color: '#032c4d',
    textAlign: 'center',
    padding: '10px 0',
    fontSize: '0.95rem',
    borderTop: '1px solid #cfe0f5',
    borderBottom: '1px solid #cfe0f5',
    marginTop: '15px'
  }}
>
  <h2 style={{ color: '#032c4d', fontSize: '1.3rem', marginBottom: '8px' }}>
    Welcome to the Customer and Prospect Management System
  </h2>
  <p style={{ color: '#333', fontSize: '1rem', marginBottom: '12px' }}>
    To access and manage customer or prospect data, please ensure your Microsoft 365 account has SharePoint permissions.
  </p>
  <div>
    <a
      href="https://jmstech.co/contact/"
      style={{ color: '#0078d4', textDecoration: 'underline', marginRight: '20px' }}
    >
      Contact Us
    </a>
    <a
      href="mailto:kinjal@jmsadvisory.in?subject=Request%20Access%20to%Customer-Prospect%20Management%20System"
      style={{ color: '#0078d4', textDecoration: 'underline' }}
    >
      Request Access
    </a>
  </div>
</section>

        {/* Cards */}
        <section className={styles.cardContainer}>
          <button className={styles.card} onClick={() => navigate('/totalprospects')}>
            <h3>Total Prospects</h3>
            <p>{totalProspects}</p>
          </button>
          <button className={styles.card} onClick={() => navigate('/totalclient')}>
            <h3>Converted Clients</h3>
            <p>{convertedClients}</p>
          </button>
          {/* <button className={styles.card} onClick={() => navigate('/agreements')}>
            <h3>Agreements Generated</h3>
            <p>{agreementsGenerated}</p>
          </button> */}
          {/* <button className={styles.card} onClick={() => navigate('/pending-approvals')}>
            <h3>Pending Approvals</h3> */}
            {/* <p>{pendingApprovals}</p> */}
            {/* <p>5</p>
          </button> */}
        </section>
   </div>


        {/* Footer */}
        <footer className={styles.footer}>
          © 2025 customer and prospect management. All rights reserved.
        </footer>
      </div>

  );
};

export default Dashboard;

