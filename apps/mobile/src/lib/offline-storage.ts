import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'fleetpulse_offline_queue';

interface QueueItem {
  id: string;
  type: 'inspection' | 'work_order_update' | 'meter_reading' | 'fuel_transaction';
  payload: Record<string, unknown>;
  createdAt: string;
  retries: number;
}

export async function addToQueue(item: Omit<QueueItem, 'retries'>) {
  const queue = await getQueue();
  queue.push({ ...item, retries: 0 });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function getQueue(): Promise<QueueItem[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function removeFromQueue(id: string) {
  const queue = await getQueue();
  const filtered = queue.filter(item => item.id !== id);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
}

export async function clearQueue() {
  await AsyncStorage.removeItem(QUEUE_KEY);
}

export async function getQueueSize(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}
