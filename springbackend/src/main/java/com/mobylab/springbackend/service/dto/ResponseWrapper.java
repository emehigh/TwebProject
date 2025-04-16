package com.mobylab.springbackend.service.dto;

public class ResponseWrapper<T> {
    private T response;

    public ResponseWrapper(T response) {
        this.response = response;
    }

    public T getResponse() {
        return response;
    }

    public void setResponse(T response) {
        this.response = response;
    }
}
