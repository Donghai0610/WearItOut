package com.g4.backend.utils;

public class AddressPart {
    public String getAddressPart(String address, String part) {
        String[] addressParts = address.split(",\\s*");
        int length = addressParts.length;
        if (part.equalsIgnoreCase("province")) return addressParts[length - 1];
        if (part.equalsIgnoreCase("district")) return addressParts[length - 2];
        if (part.equalsIgnoreCase("ward")) return addressParts[length - 3];
        return "";
    }
}
