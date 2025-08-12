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
  const [agreementsGenerated, setAgreementsGenerated] = useState<number>(0);
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
              <h1 className={styles.title}>Client Management</h1>
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
          <button className={styles.card} onClick={() => navigate('/agreements')}>
            <h3>Agreements Generated</h3>
            <p>{agreementsGenerated}</p>
          </button>
          <button className={styles.card} onClick={() => navigate('/pending-approvals')}>
            <h3>Pending Approvals</h3>
            {/* <p>{pendingApprovals}</p> */}
            <p>5</p>
          </button>
        </section>
   </div>

        {/* Footer */}
        <footer className={styles.footer}>
          © 2025 Client Management. All rights reserved.
        </footer>
      </div>

  );
};

export default Dashboard;
