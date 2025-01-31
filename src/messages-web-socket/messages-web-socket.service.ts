import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]: { Socket, user: User }
}

@Injectable()
export class MessagesWebSocketService {
    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        if (!user.isActive) throw new Error('User not active');
        this.checkUserConnection(user);
        this.connectedClients[client.id] = { Socket: client, user };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);
    }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnection(user: User) {
        for (const client of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[client];
            if (connectedClient.user.id === user.id) {
                connectedClient.Socket.disconnect();
                break;
            }
        }
    }
}
