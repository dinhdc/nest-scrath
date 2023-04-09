import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessageRepository } from './messages.repositories';
import { MessageSerivice } from './messages.services';

@Module({
  controllers: [MessagesController],
  providers: [MessageRepository, MessageSerivice]
})
export class MessagesModule { }
