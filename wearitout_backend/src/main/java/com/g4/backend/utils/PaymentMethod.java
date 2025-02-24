package com.g4.backend.utils;

public enum PaymentMethod {
    COD("COD"),
    TRANSFER_TO_Web("Chuyển khoản cho website"),
    TRANSFER_TO_SHOP_AUTOMATIC("Chuyển khoản cho shop tự động")
    ;

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
