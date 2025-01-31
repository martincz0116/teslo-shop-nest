import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWebSocketService } from './messages-web-socket.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWebSocketService: MessagesWebSocketService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(token);
      client.data = payload;
      await this.messagesWebSocketService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesWebSocketService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messagesWebSocketService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWebSocketService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {

    //? Emitir unicamente al cliente que envia
    // client.emit('message-from-server', payload.message); 

    //? Emitir a todos menos al que envia
    // client.broadcast.emit('message-from-server', payload.message);

    //? Emitir a todos
    const fullName = this.messagesWebSocketService.getUserFullName(client.id);
    const message = payload.message;
    this.wss.emit('message-from-server', { fullName, message });
  }
}
