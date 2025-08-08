import * as React from 'react';
import styles from './dashboard.module.scss';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/LOGO.png';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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
            <h1 className={styles.title}>Engage360</h1>
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

      {/* Metric Cards */}
      <section className={styles.cardContainer}>
        <div className={styles.card}>
          <h3>Total Prospects</h3>
          <p>42</p>
        </div>
        <div className={styles.card}>
          <h3>Converted Clients</h3>
          <p>18</p>
        </div>
        <div className={styles.card}>
          <h3>Agreements Generated</h3>
          <p>10</p>
        </div>
        <div className={styles.card}>
          <h3>Pending Approvals</h3>
          <p>5</p>
        </div>
      </section>
    </div>
    </div>
  );
};

export default Dashboard;
