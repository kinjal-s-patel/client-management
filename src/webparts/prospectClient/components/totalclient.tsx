import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './totalclient.module.scss';
import logo from '../assets/LOGO.png';
import { WebPartContext } from '@microsoft/sp-webpart-base';


export interface ITotalClientsProps {
  sp: any; // spfi object passed from parent
  context: WebPartContext;
}

interface IClient {
  Id: number; // <- needed for React key & delete
  CLIENTId0: number;
  ClientName: string;
  SalesPersonName?: string;
  EmailAddress_x002d_Hiring: string;
  ContactPersonforHiring: string;
  Mobilenumber: string;
  ClientLocation_x003a_Name: string;
  ClientIndustry: string;
  DateofAgreement?: string;
  GSTNumber?: string | number;
  status: string;
  [key: string]: any;
}

const TotalClients: React.FC<ITotalClientsProps> = ({ sp }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<IClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' means all

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const items: IClient[] = await sp.web.lists
          .getByTitle("client list")
          .items
          .select(
            "Id",
            "CLIENTId0",
            "ClientName",
            "SalesPersonName",
            "ContactPersonforHiring",
            "EmailAddress_x002d_Hiring",
            "DateofAgreement",
            "GSTNumber",
            "status",
            "Mobilenumber",
            "ClientLocation_x003a_Name",
            "ClientIndustry"
          )
          .orderBy("Id", false)();

        setClients(items || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [sp]);

  // Delete by SharePoint Item Id
  const handleDelete = async (itemId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    try {
      await sp.web.lists.getByTitle("client list").items.getById(itemId).delete();
      setClients(prev => prev.filter(c => c.Id !== itemId));
      alert("Client deleted successfully.");
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client.");
    }
  };

  // Filter clients by search term and status
  const filteredClients = clients.filter(client =>
    (client.ClientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || (client.status || '').toLowerCase() === statusFilter.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
              <p className={styles.subtitle}>
                Streamlined Prospect and Client Management
              </p>
            </div>
          </div>
          <nav className={styles.navBar}>
            <button className={styles.navButton} onClick={() => navigate('/prospectform')}>Prospect Form</button>
            <button className={styles.navButton} onClick={() => navigate('/clientform')}>Customer Form</button>
            {/* <button className={styles.navButton} onClick={() => navigate('/agreementform')}>Generate Agreement</button> */}
            {/* <button className={styles.navButton} onClick={() => navigate('/reports')}>Reports</button> */}
            <button className={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
          </nav>
        </header>

        {/* Page Title, Search & Status Filter */}
        <div className={styles.pageHeader} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ flex: '1' }}>Total Clients</h2>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by client name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className={styles.searchInput}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Client Table */}
        <div className={styles.tableContainer} style={{ overflowX: 'auto' }}>
          <table className={styles.clientTable}>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Client Name</th>
                {/* <th>Salesperson</th> */}
                <th>Contact Person</th>
                <th>Email</th>
                <th>Agreement Date</th>
                <th>GST Number</th>
                <th>Status</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Industry</th>
                {/* <th>Agreement</th> */}
                 <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map(client => (
                <tr key={client.Id}>
                  <td>{client.CLIENTId0}</td>
                  <td>{client.ClientName}</td>
                  {/* <td>{client.SalesPersonName || ''}</td> */}
                  <td>{client.ContactPersonforHiring}</td>
                  <td>{client.EmailAddress_x002d_Hiring}</td>
                  <td>{client.DateofAgreement ? new Date(client.DateofAgreement).toLocaleDateString() : ''}</td>
                  <td>{client.GSTNumber ?? ''}</td>
                  <td>{client.status}</td>
                  <td>{client.Mobilenumber}</td>
                  <td>{client.ClientLocation_x003a_Name}</td>
                  <td>{client.ClientIndustry}</td>
                   {/* <td>
                    <button
                      className={styles.Button}
                      onClick={() => navigate(`/agreementform/${client.CLIENTId0}`)}
                    >
                      Generate Agreement
                    </button>
                  
                  </td> */}
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => navigate(`/clientform/${client.CLIENTId0}`)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      style={{ marginLeft: "8px", backgroundColor: "red", color: "white" }}
                      onClick={() => handleDelete(client.Id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

              {paginatedClients.length === 0 && (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '1rem' }}>
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
<div
  className={styles.pagination}
  style={{ marginTop: '2rem', textAlign: 'center', paddingBottom: '1rem' }}
>
  <button
    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
  >
    Previous
  </button>
  <span style={{ margin: '0 1rem' }}>
    Page {currentPage} of {totalPages}
  </span>
  <button
    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
  >
    Next
  </button>
</div>

      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        © 2025 customer and prospect management system. All rights reserved.
      </footer>
    </div>
  );
};

export default TotalClients;
