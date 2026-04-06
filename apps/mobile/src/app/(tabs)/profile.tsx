import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ProfileTab() {
  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JS</Text>
        </View>
        <Text style={styles.name}>John Smith</Text>
        <Text style={styles.role}>Driver</Text>
        <Text style={styles.department}>Facilities Department</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Inspections</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Work Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>Pass Rate</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Assigned Vehicle</Text>
        <Text style={styles.vehicleText}>V-0342 - 2023 Ford F-150 XLT</Text>
        <Text style={styles.vehicleMeta}>Odometer: 34,521 mi</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: '700', color: '#111827' },
  role: { fontSize: 14, color: '#2563eb', fontWeight: '500', marginTop: 2 },
  department: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, alignSelf: 'flex-start' },
  vehicleText: { fontSize: 16, fontWeight: '500', color: '#111827', alignSelf: 'flex-start' },
  vehicleMeta: { fontSize: 13, color: '#6b7280', marginTop: 4, alignSelf: 'flex-start' },
  logoutButton: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  logoutText: { color: '#dc2626', fontSize: 16, fontWeight: '600' },
});
