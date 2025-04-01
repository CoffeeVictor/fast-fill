// src/game/game.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}

  private server: Server;

  handleConnection(client: Socket) {
    this.gameService.addPlayer(client);
    this.server.emit('stateUpdate', this.gameService.getGameState());
  }

  handleDisconnect(client: Socket) {
    this.gameService.removePlayer(client);
  }

  @SubscribeMessage('click')
  handleClick(
    @MessageBody() data: { row: number; col: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.handleSquareClick(client, data);
    this.server.emit('stateUpdate', this.gameService.getGameState());
  }

  afterInit(server: Server) {
    this.server = server;
  }
}
