import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageSerivice } from './messages.services';

@Controller('messages')
export class MessagesController {

  constructor(public messageService: MessageSerivice) {}


  @Get('/')
  listMessage() {
    return this.messageService.findAll();
  }

  @Post('/')
  createMessage(@Body() body: CreateMessageDto) {
    return this.messageService.create(body.content);
  }

  @Get('/:id/')
  async getMessage(@Param('id') id: string) {
    const message = await this.messageService.findOne(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }
}
