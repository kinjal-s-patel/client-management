import * as React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "bold",
  },
  bodyText: {
    marginBottom: 8,
    lineHeight: 1.5,
  },
  signatures: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    borderTop: "1pt solid black",
    textAlign: "center",
    paddingTop: 5,
  },
});

// Reusable PDF component
const AgreementDocument = ({ formData, clientData, agreementId }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Service Agreement</Text>

      {/* Client & Sales Info */}
      <Text style={styles.sectionHeader}>Parties</Text>
      <Text style={styles.bodyText}>
        Client: {clientData.ClientName} (ID: {clientData.CLIENTId0})
      </Text>
      <Text style={styles.bodyText}>Location: {clientData.ClientLocation}</Text>
      <Text style={styles.bodyText}>
        Salesperson: {clientData.SalesPersonName}
      </Text>
      <Text style={styles.bodyText}>
        Agreement ID: {agreementId}
      </Text>
      <Text style={styles.bodyText}>
        Agreement Date: {formData.AgreementDate}
      </Text>

      {/* Clauses */}
      <Text style={styles.sectionHeader}>1. Term</Text>
      <Text style={styles.bodyText}>
        This Agreement shall commence on {formData.AgreementDate} and continue
        until terminated.
      </Text>

      <Text style={styles.sectionHeader}>2. Requirements</Text>
      <Text style={styles.bodyText}>
        {formData.AdditionalRequirements || "No special requirements provided."}
      </Text>

      <Text style={styles.sectionHeader}>3. Special Terms</Text>
      <Text style={styles.bodyText}>
        {formData.SpecialTerms || "No special terms provided."}
      </Text>

      {/* Signatures */}
      <View style={styles.signatures}>
        <View style={styles.signatureBox}>
          <Text>Client Signature</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text>Company Representative</Text>
        </View>
      </View>
    </Page>
  </Document>
);


export default AgreementDocument;
