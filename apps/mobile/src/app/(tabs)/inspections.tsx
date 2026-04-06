import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const sampleInspections = [
  { id: '1', asset: 'V-0342 Ford F-150', type: 'Pre-Trip', result: 'pass', date: 'Today, 7:15 AM' },
  { id: '2', asset: 'V-0118 Chevy Tahoe', type: 'Pre-Trip', result: 'fail', date: 'Today, 6:45 AM' },
  { id: '3', asset: 'V-0567 Ram 2500', type: 'Post-Trip', result: 'pass_with_defects', date: 'Yesterday' },
];

const resultColors = {
  pass: '#16a34a',
  fail: '#dc2626',
  pass_with_defects: '#d97706',
};

export default function InspectionsTab() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.newButton}
        onPress={() => router.push('/inspection/new')}
      >
        <Text style={styles.newButtonText}>+ New Inspection</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Inspections</Text>

      <FlatList
        data={sampleInspections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/inspection/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.asset}</Text>
              <View style={[styles.resultBadge, { backgroundColor: resultColors[item.result as keyof typeof resultColors] + '20' }]}>
                <Text style={[styles.resultText, { color: resultColors[item.result as keyof typeof resultColors] }]}>
                  {item.result.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>{item.type} - {item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  newButton: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  newButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827', flex: 1 },
  resultBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  resultText: { fontSize: 11, fontWeight: '700' },
  cardMeta: { fontSize: 13, color: '#6b7280', marginTop: 6 },
});
