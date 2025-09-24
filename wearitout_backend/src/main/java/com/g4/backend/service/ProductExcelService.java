package com.g4.backend.service;

import com.g4.backend.dto.request.NewProductRequestDTO;
import com.g4.backend.dto.response.NewProductResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductExcelService {
    final  ProductService productService;
    public ByteArrayInputStream exportProductsToExcel(List<NewProductResponseDTO> products) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Products");

            // Create header
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "ID", "Product Name", "Description", "Price",
                    "Stock Quantity", "Status", "Rating", "Setting", "Shop"
            };

            CellStyle headerStyle = createHeaderStyle(workbook);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Create data rows
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle centerStyle = createCenterStyle(workbook);

            for (int i = 0; i < products.size(); i++) {
                Row row = sheet.createRow(i + 1);
                NewProductResponseDTO product = products.get(i);

                row.createCell(0).setCellValue(product.getProductId());
                row.createCell(1).setCellValue(product.getProductName());
                row.createCell(2).setCellValue(product.getDescription());

                Cell priceCell = row.createCell(3);
                priceCell.setCellValue(product.getPrice());
                priceCell.setCellStyle(currencyStyle);

                row.createCell(4).setCellValue(product.getStockQuantity());

                Cell statusCell = row.createCell(5);
                statusCell.setCellValue(product.getStatus());
                statusCell.setCellStyle(centerStyle);

                row.createCell(6).setCellValue(product.getRating());
                row.createCell(7).setCellValue(product.getSettingName());
                row.createCell(8).setCellValue(product.getShopName());
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Failed to export Excel file", e);
        }
    }

    // Import products from Excel
    public List<NewProductRequestDTO> importProductsFromExcel(MultipartFile file) {
        List<NewProductRequestDTO> products = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            // Skip header row
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                NewProductRequestDTO product = NewProductRequestDTO.builder()
                        .productName(getCellStringValue(row.getCell(1)))
                        .description(getCellStringValue(row.getCell(2)))
                        .price(getCellNumericValue(row.getCell(3)))
                        .stockQuantity((int) getCellNumericValue(row.getCell(4)))
                        .status(getCellStringValue(row.getCell(5)))
                        .rating(getCellNumericValue(row.getCell(6)))
                        .settingName(getCellStringValue(row.getCell(7)))
                        .shopName(getCellStringValue(row.getCell(8)))
                        .build();

                // Validation
                if (isValidProduct(product)) {
                    products.add(product);
                }
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Excel file", e);
        }

        return products;
    }

    // Generate import template
    public ByteArrayInputStream generateTemplate() {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Product Import Template");

            // Create header
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "ID (Leave Empty)", "Product Name*", "Description", "Price*",
                    "Stock Quantity*", "Status*", "Rating", "Setting Name*", "Shop Name*"
            };

            CellStyle headerStyle = createHeaderStyle(workbook);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Add sample data
            Row sampleRow = sheet.createRow(1);
            sampleRow.createCell(0).setCellValue("");
            sampleRow.createCell(1).setCellValue("Sample Product");
            sampleRow.createCell(2).setCellValue("Sample description");
            sampleRow.createCell(3).setCellValue(100000.0);
            sampleRow.createCell(4).setCellValue(50);
            sampleRow.createCell(5).setCellValue("true");
            sampleRow.createCell(6).setCellValue(4.5);
            sampleRow.createCell(7).setCellValue("Electronics");
            sampleRow.createCell(8).setCellValue("Tech Shop");

            // Add instructions
            Row instructionRow = sheet.createRow(3);
            instructionRow.createCell(0).setCellValue("Instructions:");
            instructionRow.createCell(1).setCellValue("* Required fields");

            Row instructionRow2 = sheet.createRow(4);
            instructionRow2.createCell(0).setCellValue("Status:");
            instructionRow2.createCell(1).setCellValue("true/false");

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Failed to generate template", e);
        }
    }

    // Helper methods
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);

        style.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);

        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("#,##0 \"VND\""));
        return style;
    }

    private CellStyle createCenterStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private double getCellNumericValue(Cell cell) {
        if (cell == null) return 0.0;
        return switch (cell.getCellType()) {
            case NUMERIC -> cell.getNumericCellValue();
            case STRING -> {
                try {
                    yield Double.parseDouble(cell.getStringCellValue());
                } catch (NumberFormatException e) {
                    yield 0.0;
                }
            }
            default -> 0.0;
        };
    }

    private boolean isValidProduct(NewProductRequestDTO product) {
        return product.getProductName() != null && !product.getProductName().trim().isEmpty()
                && product.getPrice() != null && product.getPrice() > 0
                && product.getStockQuantity() != null && product.getStockQuantity() >= 0
                && product.getSettingName() != null && !product.getSettingName().trim().isEmpty()
                && product.getShopName() != null && !product.getShopName().trim().isEmpty();
    }

}
