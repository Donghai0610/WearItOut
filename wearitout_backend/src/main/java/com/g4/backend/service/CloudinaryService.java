package com.g4.backend.service;

import com.cloudinary.Cloudinary;
import com.g4.backend.dto.response.CloudinaryResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }
    @Transactional
    public CloudinaryResponseDTO uploadFile(final MultipartFile file, final String fileName) {
        try {
            final Map result   = this.cloudinary.uploader()
                    .upload(file.getBytes(),
                            Map.of("public_id",
                                    "dev/product/"
                                            + fileName));
            final String url      = (String) result.get("secure_url");
            final String publicId = (String) result.get("public_id");
            return CloudinaryResponseDTO.builder().publicId(publicId).url(url)
                    .build();

        } catch (final Exception e) {
            throw new RuntimeException("Failed to upload file");
        }
    }

    @Transactional
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, Map.of());
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from Cloudinary: " + e.getMessage());
        }
    }

}
