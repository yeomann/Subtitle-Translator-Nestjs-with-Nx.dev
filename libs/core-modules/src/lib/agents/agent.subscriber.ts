import { Agent } from '@subtitles-translator/entities';
import { hashSync } from 'bcrypt';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class AgentSubscriber implements EntitySubscriberInterface<Agent> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof Agent {
    return Agent;
  }

  beforeInsert(event: InsertEvent<Agent>): void {
    this.hashPassword(event.entity);
  }

  beforeUpdate(event: UpdateEvent<Agent>): void {
    if (
      event.entity.password &&
      event.entity.password !== event.databaseEntity.password
    ) {
      this.hashPassword(event.entity);
      event.entity.lastPasswordChange = new Date();
      event.entity.accessToken = null;
    }
  }

  private hashPassword(agent: Agent): void {
    agent.password = hashSync(agent.password, 10);
  }
}
