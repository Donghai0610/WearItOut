package com.g4.backend.exception;

public enum ErrorCode {
    USER_NOT_FOUND(404, "User not found"),
    INVALID_CREDENTIALS(401, "Invalid credentials"),
    EMAIL_ALREADY_EXISTS(400, "Email already exists"),
    USERNAME_ALREADY_EXISTS(400, "Username already exists"),
    PHONE_ALREADY_EXISTS(400, "Phone number already exists"),
    WEAK_PASSWORD(400, "Password does not meet security requirements"),
    INVALID_TOKEN(401, "Invalid or expired token"),
    ACCESS_DENIED(403, "Access denied"),
    INTERNAL_SERVER_ERROR(500, "Internal server error"),
    INVALID_INPUT(400, "Invalid input data"),
    RESOURCE_NOT_FOUND(404, "Resource not found"),
    OPERATION_NOT_ALLOWED(403, "Operation not allowed"),
    DUPLICATE_RESOURCE(409, "Duplicate resource"),
    SERVICE_UNAVAILABLE(503, "Service unavailable"),
    UNCATEGORIZED_EXCEPTION(500, "Uncategorized exception"),
    UNAUTHORIZED(401, "Unauthorized"),
    STOCK_NOT_ENOUGH(400, "Stock not enough"),
    CART_ITEM_NOT_FOUND(404, "Cart item not found"),
    PRODUCT_NOT_EXISTS_IN_CART(404, "Sản phẩm không tồn tại trong giỏ hàng"),
    EXPORT_FAIL(500, "Failed to export Excel file"),


            ;

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
