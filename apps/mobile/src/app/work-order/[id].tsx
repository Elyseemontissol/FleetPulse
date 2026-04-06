import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function WorkOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.woNumber}>WO-2026-00142</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>IN PROGRESS</Text>
          </View>
        </View>
        <Text style={styles.title}>Oil & Filter Change</Text>
        <Text style={styles.assetText}>V-0342 - 2023 Ford F-150 XLT</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>Preventive</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Priority</Text>
          <Text style={styles.value}>Normal</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Assigned To</Text>
          <Text style={styles.value}>Mike Johnson</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Scheduled</Text>
          <Text style={styles.value}>Apr 5, 2026</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Odometer</Text>
          <Text style={styles.value}>34,521 mi</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Task Checklist</Text>
        {[
          'Drain engine oil',
          'Replace oil filter',
          'Refill with specified oil',
          'Check for leaks',
          'Reset maintenance light',
        ].map((task, i) => (
          <TouchableOpacity key={i} style={styles.taskItem}>
            <View style={styles.checkbox} />
            <Text style={styles.taskText}>{task}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeText}>Mark as Complete</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  card: { backgroundColor: '#fff', margin: 16, marginBottom: 0, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  woNumber: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
  statusBadge: { backgroundColor: '#dbeafe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#2563eb', fontSize: 11, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 8 },
  assetText: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  label: { fontSize: 14, color: '#6b7280' },
  value: { fontSize: 14, fontWeight: '500', color: '#111827' },
  taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#d1d5db', borderRadius: 6, marginRight: 12 },
  taskText: { fontSize: 14, color: '#111827' },
  buttonRow: { margin: 16 },
  completeButton: { backgroundColor: '#16a34a', borderRadius: 12, padding: 16, alignItems: 'center' },
  completeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
