import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { text } from '@fortawesome/fontawesome-svg-core';
import { size } from 'lodash';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
export const MyDocument = () => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.section}>
        <Text>This is a text in a PDF!</Text>
      </View>
    </Page>
  </Document>
);
