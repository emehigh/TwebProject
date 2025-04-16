package com.mobylab.springbackend.exception;

public class NotFollowingException extends RuntimeException {
    public NotFollowingException(String message) {
        super(message);
    }
}