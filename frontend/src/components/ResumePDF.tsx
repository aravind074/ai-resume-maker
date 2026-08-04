import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: { marginBottom: 15, borderBottom: '1px solid #ddd', paddingBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  contactInfo: { fontSize: 9, color: '#4B5563', marginTop: 5, flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#374151', marginBottom: 5, borderBottom: '1px solid #e5e7eb', paddingBottom: 2, textTransform: 'uppercase' },
  itemContainer: { marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  itemTitle: { fontSize: 11, fontWeight: 'bold', color: '#111827' },
  itemSubtitle: { fontSize: 10, fontStyle: 'italic', color: '#4B5563' },
  itemDate: { fontSize: 9, color: '#6B7280' },
  description: { fontSize: 9, marginTop: 3, color: '#374151', lineHeight: 1.4 },
  summaryText: { fontSize: 9, lineHeight: 1.4, color: '#374151' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 3 },
  skillItem: { backgroundColor: '#f3f4f6', padding: '3 6', borderRadius: 3, fontSize: 9, color: '#374151' },
  link: { color: '#2563eb', textDecoration: 'none' }
});

export const ResumeDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo?.fullName || "Your Name"}</Text>
        <View style={styles.contactInfo}>
          {data.personalInfo?.email && <Text>{data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text> | {data.personalInfo.phone}</Text>}
          {data.personalInfo?.address && <Text> | {data.personalInfo.address}</Text>}
          {data.personalInfo?.linkedin && <Text> | {data.personalInfo.linkedin}</Text>}
          {data.personalInfo?.github && <Text> | {data.personalInfo.github}</Text>}
          {data.personalInfo?.portfolio && <Text> | {data.personalInfo.portfolio}</Text>}
        </View>
      </View>

      {/* Summary */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((exp: any) => (
            <View key={exp.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.position || "Position"}</Text>
                <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{exp.company || "Company"}</Text>
              {exp.description && <Text style={styles.description}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu: any) => (
            <View key={edu.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.institution || "Institution"}</Text>
                <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate}</Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {edu.degree ? edu.degree + (edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : "") : "Degree"}
              </Text>
              {edu.description && <Text style={styles.description}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects.map((proj: any) => (
            <View key={proj.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{proj.name || "Project Name"}</Text>
                {proj.link && (
                  <Link src={proj.link} style={styles.link}>
                    {proj.link}
                  </Link>
                )}
              </View>
              {proj.description && <Text style={styles.description}>{proj.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill: any) => (
              <View key={skill.id} style={styles.skillItem}>
                <Text>{skill.name}{skill.level ? ` (${skill.level})` : ""}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert: any) => (
            <View key={cert.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{cert.name || "Certification Name"}</Text>
                <Text style={styles.itemDate}>{cert.date}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{cert.issuer || "Issuer"}</Text>
            </View>
          ))}
        </View>
      )}

    </Page>
  </Document>
);

export const LivePreview = ({ data }: { data: any }) => {
  return (
    <div className="w-full h-full border rounded-lg overflow-hidden bg-white">
      {typeof window !== "undefined" && (
        <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
          <ResumeDocument data={data} />
        </PDFViewer>
      )}
    </div>
  );
};
