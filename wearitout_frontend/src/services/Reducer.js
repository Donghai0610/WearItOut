import { CANCEL_ORDER_BY_ID_FAILURE, CANCEL_ORDER_BY_ID_REQUEST, CANCEL_ORDER_BY_ID_SUCCESS, GET_ORDER_DETAIL_BY_ORDER_ID_FAILURE, GET_ORDER_DETAIL_BY_ORDER_ID_REQUEST, GET_ORDER_DETAIL_BY_ORDER_ID_SUCCESS, GET_ORDER_LIST_BY_SHOP_FAILURE, GET_ORDER_LIST_BY_SHOP_REQUEST, GET_ORDER_LIST_BY_SHOP_SUCCESS, GET_ORDER_LIST_BY_USER_FAILURE, GET_ORDER_LIST_BY_USER_REQUEST, GET_ORDER_LIST_BY_USER_SUCCESS, GET_ORDER_SERVICES_FAILURE, GET_ORDER_SERVICES_REQUEST, GET_ORDER_SERVICES_SUCCESS, GET_ORDER_SHIPPING_STATUS_FAILURE, GET_ORDER_SHIPPING_STATUS_REQUEST, GET_ORDER_SHIPPING_STATUS_SUCCESS, SEND_ORDER_SHIPPING_REQUEST_TO_GHN_FAILURE, SEND_ORDER_SHIPPING_REQUEST_TO_GHN_REQUEST, SEND_ORDER_SHIPPING_REQUEST_TO_GHN_SUCCESS } from "./ActionTypes"

const initialState = {
    orders: [],
    orderDetails: [],
    shippingStatus: [],
    services: [],
    response: null,
    loading: false,
    error: null
}

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORDER_LIST_BY_SHOP_REQUEST:
        case GET_ORDER_DETAIL_BY_ORDER_ID_REQUEST:
        case GET_ORDER_LIST_BY_USER_REQUEST:
        case CANCEL_ORDER_BY_ID_REQUEST:
        case GET_ORDER_SHIPPING_STATUS_REQUEST:
        case GET_ORDER_SERVICES_REQUEST:
        case SEND_ORDER_SHIPPING_REQUEST_TO_GHN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case GET_ORDER_LIST_BY_SHOP_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                loading: false,
                error: null
            }
        case GET_ORDER_DETAIL_BY_ORDER_ID_SUCCESS:
            return {
                ...state,
                orderDetails: action.payload,
                loading: false,
                error: null
            }
        case GET_ORDER_LIST_BY_USER_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                loading: false,
                error: null
            }
        case CANCEL_ORDER_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            }
        case GET_ORDER_SHIPPING_STATUS_SUCCESS:
            return {
                ...state,
                shippingStatus: action.payload,
                loading: false,
                error: null
            }
        case GET_ORDER_SERVICES_SUCCESS:
            return {
                ...state,
                services: action.payload,
                loading: false,
                error: null
            }
        case SEND_ORDER_SHIPPING_REQUEST_TO_GHN_SUCCESS:
            return {
                ...state,
                response: action.payload,
                loading: false,
                error: null
            }
        case SEND_ORDER_SHIPPING_REQUEST_TO_GHN_FAILURE:
        case GET_ORDER_SERVICES_FAILURE:
        case GET_ORDER_SHIPPING_STATUS_FAILURE:
        case CANCEL_ORDER_BY_ID_FAILURE:
        case GET_ORDER_LIST_BY_USER_FAILURE:
        case GET_ORDER_LIST_BY_SHOP_FAILURE:
        case GET_ORDER_DETAIL_BY_ORDER_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export default orderReducer;