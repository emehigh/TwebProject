package com.mobylab.springbackend.exception;

public class NotificationServiceException extends RuntimeException {
    public NotificationServiceException(String message) {
        super(message);
    }

    public NotificationServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}