package com.websocket.rabbitmq.mqbrokerimpl.model;



public class ServerChatMessage {

    private String content;
    private String groupName;
    private String timeStamp;

    public ServerChatMessage(String content,String timeStamp) {
        this.content = content;
        this.timeStamp = timeStamp;
    }

    public ServerChatMessage(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }
}

