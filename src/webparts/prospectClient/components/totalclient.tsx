import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './totalclient.module.scss';
import logo from '../assets/LOGO.png';

export interface ITotalClientsProps {
  sp: any; // spfi object passed from parent
}

interface IClient {
  Id: number;
  ClientName: string;
  EmailAddress_x002d_Hiring: string;
  ContactPersonforHiring: string;
  Mobilenumber: string;
  ClientLocation_x003a_Name: string;
  ClientIndustry: string;
  DateofAgreement: string;
  GSTNumber: number;
  status: string;
  [key: string]: any;
}

const TotalClients: React.FC<ITotalClientsProps> = ({ sp }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<IClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const items: IClient[] = await sp.web.lists
          .getByTitle("client list")
          .items.select("*")
          .orderBy("Id", false)();

        setClients(items);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [sp]);

  // Filter clients by search term
  const filteredClients = clients.filter(client =>
    client.ClientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page if searchTerm changes (optional)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
              <p className={styles.subtitle}>
                Streamlined Prospect and Client Management
              </p>
            </div>
          </div>
          <nav className={styles.navBar}>
            <button className={styles.navButton} onClick={() => navigate('/prospectform')}>Prospect Form</button>
            <button className={styles.navButton} onClick={() => navigate('/clientform')}>Client Form</button>
            <button className={styles.navButton} onClick={() => navigate('/generateagreement')}>Generate Agreement</button>
            <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button>
          </nav>
        </header>

        {/* Page Title and Search */}
        <div className={styles.pageHeader}>
          <h2>Total Clients</h2>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by client name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Client Table with horizontal scroll */}
        <div className={styles.tableContainer} style={{ overflowX: 'auto' }}>
          <table className={styles.clientTable}>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Client Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Agreement Date</th>
                <th>GST Number</th>
                <th>Status</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Industry</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map(client => (
                <tr key={client.Id}>
                  {/* <td>{client.Id}</td> */}
                  <td>{client.ClientName}</td>
                  <td>{client.ContactPersonforHiring}</td>
                  <td>{client.EmailAddress_x002d_Hiring}</td>
                  <td>{client.DateofAgreement ? new Date(client.DateofAgreement).toLocaleDateString() : ''}</td>
                  <td>{client.GSTNumber}</td>
                  <td>{client.status}</td>
                  <td>{client.Mobilenumber}</td>
                  <td>{client.ClientLocation_x003a_Name}</td>
                  <td>{client.ClientIndustry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className={styles.pagination} style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ marginRight: '1rem' }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ marginLeft: '1rem' }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        © 2025 Client Management. All rights reserved.
      </footer>
    </div>
  );
};

export default TotalClients;
