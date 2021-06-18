package com.websocket.rabbitmq.mqbrokerimpl.controller;

import com.websocket.rabbitmq.mqbrokerimpl.model.ClientChatMessage;
import com.websocket.rabbitmq.mqbrokerimpl.model.ServerChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.text.SimpleDateFormat;
import java.util.Date;


@Controller
public class RabbitMQChatController {

        private final SimpMessagingTemplate simpMessagingTemplate;

        public RabbitMQChatController(SimpMessagingTemplate simpMessagingTemplate) {
            this.simpMessagingTemplate = simpMessagingTemplate;
        }


        @MessageMapping("/guestjoin")
        public void joinedUserMessage(ClientChatMessage clientChatMessage) throws InterruptedException{
            Thread.sleep(50);
            simpMessagingTemplate.convertAndSend( "/topic/guestnames",new ServerChatMessage(clientChatMessage.getMessage(),new SimpleDateFormat("hh:mm:ss a").format(new Date())));
        }


        @MessageMapping("/guestchat")
        public void handleMessage(ClientChatMessage clientChatMessage){
            simpMessagingTemplate.convertAndSend("/topic/guestchats", new ServerChatMessage(clientChatMessage.getMessage(),new SimpleDateFormat("hh:mm:ss a").format(new Date())));
        }

        @MessageMapping("/guestupdate")
        @SendTo("/topic/guestupdates")
        public ServerChatMessage handleUpdateMessage() {
            return new ServerChatMessage("Someone is Typing .....");
        }

        @MessageMapping("/guestleft")
        public void sendGuestLeft(ClientChatMessage clientChatMessage){
            simpMessagingTemplate.convertAndSend("/topic/guestsleft",new ServerChatMessage(clientChatMessage.getSenderName(),new SimpleDateFormat("hh:mm:ss a").format(new Date())));
        }




    }


