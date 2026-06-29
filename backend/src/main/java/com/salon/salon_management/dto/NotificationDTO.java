package com.salon.salon_management.dto;

public class NotificationDTO {

    private String type;

    private String title;

    private String message;

    public NotificationDTO() {
    }

    public NotificationDTO(
            String type,
            String title,
            String message) {

        this.type = type;
        this.title = title;
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}