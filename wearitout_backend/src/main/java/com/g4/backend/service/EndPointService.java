package com.g4.backend.service;

public class EndPointService {
    public static final String[] publicPostEndPoint = {
            "/api/v1/auth/login",
            "/api/v1/auth/logout",
            "/api/v1/user/register",

    };

    public static final String[] adminGetEndPoint = {
            "/api/v1/admin/search",
            "/api/v1/admin/{userId}",
            "/api/v1/admin/shops",
            "/api/v1/admin/shop/search",
            "/api/v1/admin/shop/{shopId}",
            "/api/v1/admin/users/setting-type/{settingId}",
    };
    public static final String[] adminPostEndPoint = {
            "/api/v1/admin/shop/create",
            "/api/v1/admin/update/**",
            "/api/v1/admin/update-active/**",
            "/api/v1/admin/updateshop/{shopId}"

    };
    public static final String[] publicGetEndPoint = {
            "/api/v1/product/search",
            "/api/v1/product/{productId}",
            "/api/v1/shop/create_payment/vn-pay/{orderId}",
            "/api/v1/shop/vn-pay-callback",
            "/api/v1/shop/shop-payment/{shopId}",
            "/api/v1/admin/settings/{typeId}",
            "/api/v1/product/shops",
            "/swagger-ui/**",
            "/api/v1/product/top-rated",
            "/api/v1/product/category/{typeId}",
            "api/v1/product/trending",
            "/api/v1/product/same-product/{productId}"
    };
    public static final String[] adminShopGetEndPoint = {
            "/api/v1/product/productofshop/**",
            "/api/v1/product/shop/*/detail/*",
            "/api/v1/product/delete/**",
            "/api/v1/admin/settings/{typeId}",
            "/api/v1/shop/search/{userId}",


    };
    public static final String[] adminShopPostEndPoint = {
            "/api/v1/product/add",
            "/api/v1/product/update/**",
    };

    public static final  String[]  userPostEndPoint ={
            "/api/v1/cart/{userId}/add",
            "/api/v1/cart/{userId}/update",
            "/api/v1/cart/{userId}/remove/{productId}",
    };
    public static final  String[] userGetEndPoint ={
            "/api/v1/cart/{userId}",
            "/api/v1/cart/{cartId}/count-products"
    };
}
