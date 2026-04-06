import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { DVIR_CATEGORIES } from '@fleetpulse/shared';

type ItemStatus = 'not_inspected' | 'pass' | 'fail' | 'not_applicable';

interface InspectionItem {
  category: string;
  status: ItemStatus;
  defectDescription: string;
  photos: string[];
}

const statusColors: Record<ItemStatus, string> = {
  not_inspected: '#d1d5db',
  pass: '#16a34a',
  fail: '#dc2626',
  not_applicable: '#9ca3af',
};

const statusLabels: Record<ItemStatus, string> = {
  not_inspected: '?',
  pass: 'OK',
  fail: 'X',
  not_applicable: 'N/A',
};

export default function NewInspectionScreen() {
  const [items, setItems] = useState<InspectionItem[]>(
    DVIR_CATEGORIES.map((cat) => ({
      category: cat,
      status: 'not_inspected',
      defectDescription: '',
      photos: [],
    }))
  );
  const [notes, setNotes] = useState('');
  const [odometer, setOdometer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function cycleStatus(index: number) {
    const order: ItemStatus[] = ['not_inspected', 'pass', 'fail', 'not_applicable'];
    setItems((prev) => {
      const updated = [...prev];
      const current = order.indexOf(updated[index].status);
      updated[index] = {
        ...updated[index],
        status: order[(current + 1) % order.length],
      };
      return updated;
    });
  }

  async function takePhoto(index: number) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setItems((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          photos: [...updated[index].photos, result.assets[0].uri],
        };
        return updated;
      });
    }
  }

  function updateDefect(index: number, text: string) {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], defectDescription: text };
      return updated;
    });
  }

  async function handleSubmit() {
    const uninspected = items.filter(i => i.status === 'not_inspected');
    if (uninspected.length > 0) {
      Alert.alert(
        'Incomplete Inspection',
        `${uninspected.length} item(s) have not been inspected. Continue anyway?`,
        [
          { text: 'Go Back', style: 'cancel' },
          { text: 'Submit Anyway', onPress: submitInspection },
        ]
      );
      return;
    }
    submitInspection();
  }

  async function submitInspection() {
    setSubmitting(true);
    try {
      // TODO: Navigate to signature screen, then submit via API
      // For now, show success
      Alert.alert('Success', 'Inspection submitted successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit inspection.');
    } finally {
      setSubmitting(false);
    }
  }

  const passCount = items.filter(i => i.status === 'pass').length;
  const failCount = items.filter(i => i.status === 'fail').length;
  const inspectedCount = items.filter(i => i.status !== 'not_inspected').length;

  return (
    <ScrollView style={styles.container}>
      {/* Vehicle Selection & Odometer */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Vehicle</Text>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectText}>Select Vehicle...</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 120 }}>
            <Text style={styles.label}>Odometer</Text>
            <TextInput
              style={styles.input}
              value={odometer}
              onChangeText={setOdometer}
              keyboardType="numeric"
              placeholder="Miles"
            />
          </View>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <Text style={styles.progressText}>
          {inspectedCount}/{items.length} inspected | {passCount} pass | {failCount} fail
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(inspectedCount / items.length) * 100}%` }]} />
        </View>
      </View>

      {/* Checklist Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspection Checklist</Text>
        {items.map((item, index) => (
          <View key={item.category} style={styles.itemCard}>
            <View style={styles.itemRow}>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: statusColors[item.status] }]}
                onPress={() => cycleStatus(index)}
              >
                <Text style={styles.statusButtonText}>
                  {statusLabels[item.status]}
                </Text>
              </TouchableOpacity>
              <Text style={styles.itemName}>{item.category}</Text>
              {item.status === 'fail' && (
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => takePhoto(index)}
                >
                  <Text style={styles.cameraText}>
                    {item.photos.length > 0 ? `${item.photos.length} pic` : 'Photo'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {item.status === 'fail' && (
              <TextInput
                style={styles.defectInput}
                placeholder="Describe the defect..."
                value={item.defectDescription}
                onChangeText={(text) => updateDefect(index, text)}
                multiline
              />
            )}
          </View>
        ))}
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional notes..."
          multiline
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Sign & Submit Inspection</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, fontSize: 15 },
  fieldRow: { flexDirection: 'row', gap: 12 },
  selectButton: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12 },
  selectText: { color: '#9ca3af', fontSize: 15 },
  progressBar: { marginHorizontal: 16, marginTop: 16 },
  progressText: { fontSize: 13, color: '#6b7280', marginBottom: 6 },
  progressTrack: { height: 6, backgroundColor: '#e5e7eb', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#2563eb', borderRadius: 3 },
  itemCard: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingVertical: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusButton: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  statusButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  itemName: { flex: 1, fontSize: 14, color: '#111827' },
  cameraButton: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  cameraText: { color: '#2563eb', fontSize: 12, fontWeight: '600' },
  defectInput: { marginTop: 8, marginLeft: 46, borderWidth: 1, borderColor: '#fecaca', borderRadius: 8, padding: 8, fontSize: 14, backgroundColor: '#fef2f2' },
  submitButton: { backgroundColor: '#2563eb', marginHorizontal: 16, marginTop: 20, borderRadius: 12, padding: 16, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
