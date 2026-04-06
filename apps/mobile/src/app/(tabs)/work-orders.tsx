import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const sampleWorkOrders = [
  { id: '1', wo_number: 'WO-2026-00142', title: 'Oil & Filter Change', asset: 'V-0342', status: 'in_progress', priority: 'normal' },
  { id: '2', wo_number: 'WO-2026-00141', title: 'Replace Alternator', asset: 'V-0118', status: 'parts_pending', priority: 'high' },
  { id: '3', wo_number: 'WO-2026-00140', title: 'DVIR Defects - Brakes', asset: 'V-0567', status: 'open', priority: 'critical' },
];

const statusColors: Record<string, string> = {
  open: '#6b7280', assigned: '#2563eb', in_progress: '#2563eb',
  parts_pending: '#d97706', completed: '#16a34a',
};

const priorityColors: Record<string, string> = {
  low: '#16a34a', normal: '#6b7280', high: '#d97706', critical: '#dc2626',
};

export default function WorkOrdersTab() {
  return (
    <View style={styles.container}>
      <FlatList
        data={sampleWorkOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/work-order/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.woNumber}>{item.wo_number}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] + '20' }]}>
                <Text style={[styles.priorityText, { color: priorityColors[item.priority] }]}>
                  {item.priority.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.assetText}>Asset: {item.asset}</Text>
              <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] }]} />
              <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
                {item.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  woNumber: { fontSize: 13, fontWeight: '600', color: '#2563eb' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 8 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 },
  assetText: { fontSize: 13, color: '#6b7280', marginRight: 'auto' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '500' },
});
