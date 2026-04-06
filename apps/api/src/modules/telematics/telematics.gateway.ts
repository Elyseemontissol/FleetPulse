import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { TelematicsService } from './telematics.service';

@WebSocketGateway({
  namespace: '/ws/telematics',
  cors: { origin: '*' },
})
export class TelematicsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private telematicsService: TelematicsService) {}

  handleConnection(client: Socket) {
    console.log(`Telematics client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Telematics client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe_positions')
  handleSubscribe(client: Socket, orgId: string) {
    client.join(`org:${orgId}`);
    return { event: 'subscribed', data: { orgId } };
  }

  @SubscribeMessage('device_event')
  async handleDeviceEvent(client: Socket, payload: any) {
    const result = await this.telematicsService.ingestEvent(payload);

    if (result.success && result.assetId) {
      // Broadcast position update to all subscribers
      this.server.emit('position_update', {
        assetId: result.assetId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        speedMph: payload.speedMph,
        heading: payload.heading,
        eventType: payload.eventType,
        timestamp: new Date().toISOString(),
      });
    }

    return result;
  }

  broadcastPositionUpdate(data: any) {
    this.server.emit('position_update', data);
  }
}
