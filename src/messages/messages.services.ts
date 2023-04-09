import { Injectable } from '@nestjs/common';
import { MessageRepository } from './messages.repositories';

@Injectable()
export class MessageSerivice {

  constructor(public messageRepository: MessageRepository) { }

  findOne(id: string) {
    return this.messageRepository.findOne(id);
  }

  findAll() {
    return this.messageRepository.findAll();
  }

  create(content: string) {
    return this.messageRepository.create(content);
  }


}