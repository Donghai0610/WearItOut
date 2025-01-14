package com.g4.backend.utils;
import com.g4.backend.dto.response.UserInfoResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CassoUtil {
    public String parseOrderId(boolean caseInsensitive, String transactionPrefix, String description) {
        String orderIdString = extractOrderCodes(description);

        if (orderIdString == null) {
            return null;
        }

        // Convert orderIdString to an integer if needed
        long orderId = Long.parseLong(orderIdString);
        System.out.println("OrderId: " + orderId);

        // Optionally, you can validate if the substring is numeric
        if (!orderIdString.isEmpty() && orderIdString.matches("\\d+")) {
            return orderIdString; // Return the order ID as a String
        }

        return null; // Return null if the order ID is not valid
    }

    public static String extractOrderCodes(String input) {
        List<String> orderCodes = new ArrayList<>();
        int index = 0;

        while ((index = input.indexOf("OD", index)) != -1) {
            int start = index;
            index += 2; // Move past "OD"

            // Capture the number part following "OD"
            StringBuilder number = new StringBuilder();
            while (index < input.length() && Character.isDigit(input.charAt(index))) {
                number.append(input.charAt(index));
                index++;
            }

            // Collect the full "OD" code if digits were found after "OD"
            if (number.length() > 0) {
                orderCodes.add("OD" + number);
                return number.toString();
            }

            // Continue searching after the last found index
            index++;
        }

        return null;
    }
}
