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
  Email: string;
  MobileNumber: string;
  Industry: string;
  Location: string;
  ContactPerson: string;
  AgreementDate: string;
  Status: string;
  [key: string]: any; // for additional dynamic fields
}

const TotalClients: React.FC<ITotalClientsProps> = ({ sp }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<IClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const items = await sp.web.lists.getByTitle("client-list").items
          .select("*")
          .orderBy("Id", false)();
        setClients(items);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [sp]);

  const filteredClients = clients.filter(client =>
    client.ClientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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

      {/* Client Table */}
      <div className={styles.tableContainer}>
        <table className={styles.clientTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Industry</th>
              <th>Location</th>
              <th>Contact Person</th>
              <th>Agreement Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.Id}>
                <td>{client.Id}</td>
                <td>{client.ClientName}</td>
                <td>{client.Email}</td>
                <td>{client.MobileNumber}</td>
                <td>{client.Industry}</td>
                <td>{client.Location}</td>
                <td>{client.ContactPerson}</td>
                <td>{client.AgreementDate}</td>
                <td>{client.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        © 2025 Engage360. All rights reserved.
      </footer>
    </div>
  );
};

export default TotalClients; 