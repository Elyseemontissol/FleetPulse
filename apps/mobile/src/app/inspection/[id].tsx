import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function InspectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Inspection #{id}</Text>
        <Text style={styles.subtitle}>V-0342 Ford F-150 - Pre-Trip</Text>

        <View style={styles.resultBadge}>
          <Text style={styles.resultText}>PASS</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Inspector</Text>
          <Text style={styles.value}>John Smith</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>Apr 5, 2026 7:15 AM</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Odometer</Text>
          <Text style={styles.value}>34,521 mi</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Checklist Items</Text>
        {['Air Compressor', 'Brakes', 'Lights', 'Tires', 'Steering'].map((item) => (
          <View key={item} style={styles.checkItem}>
            <View style={styles.passDot} />
            <Text style={styles.checkText}>{item}</Text>
            <Text style={styles.checkStatus}>PASS</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Signatures</Text>
        <View style={styles.sigBox}>
          <Text style={styles.sigLabel}>Inspector Signature</Text>
          <View style={styles.sigPlaceholder}>
            <Text style={styles.sigText}>John Smith - Signed</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  card: { backgroundColor: '#fff', margin: 16, marginBottom: 0, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  resultBadge: { alignSelf: 'flex-start', backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 12 },
  resultText: { color: '#16a34a', fontWeight: '700', fontSize: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  label: { fontSize: 14, color: '#6b7280' },
  value: { fontSize: 14, fontWeight: '500', color: '#111827' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  passDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16a34a', marginRight: 12 },
  checkText: { flex: 1, fontSize: 14, color: '#111827' },
  checkStatus: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
  sigBox: { marginTop: 8 },
  sigLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6 },
  sigPlaceholder: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 16, alignItems: 'center', backgroundColor: '#f9fafb' },
  sigText: { color: '#374151', fontStyle: 'italic' },
});
