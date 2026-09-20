package com.scheduling.schedulingservice.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class EncryptionUtil {

    @Value("${sch.secret.encrypt-secret}")
    private String secretKeyString;

    private static final String ALGORITHM = "AES";
    private static final int TAG_LENGTH = 128; // bits
    private static final int IV_LENGTH = 12;   // bytes

    private SecretKeySpec getSecretKeySpec() throws NoSuchAlgorithmException {
        // Hash the environment variable to exactly 32 bytes (256-bit) using SHA-256
        java.security.MessageDigest sha = java.security.MessageDigest.getInstance("SHA-256");
        byte[] keyBytes = sha.digest(secretKeyString.getBytes(StandardCharsets.UTF_8));
        return new SecretKeySpec(keyBytes, ALGORITHM);
    }

    public String encrypt(String plainText) throws IllegalBlockSizeException, BadPaddingException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException {
        if (plainText == null) return null;
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        SecretKeySpec keySpec = getSecretKeySpec();
        
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec gcmSpec = new GCMParameterSpec(TAG_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);
        
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
        byte[] combined = new byte[iv.length + encryptedBytes.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(encryptedBytes, 0, combined, iv.length, encryptedBytes.length);
        return Base64.getEncoder().encodeToString(combined);
    }
    
    public String decrypt(String encryptedText) throws NoSuchPaddingException, NoSuchAlgorithmException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException, InvalidKeyException {
        if (encryptedText == null) return null;
        byte[] decodedCipher = Base64.getDecoder().decode(encryptedText);
        byte[] iv = new byte[12];
        byte[] cipherText = new byte[decodedCipher.length - 12];
        System.arraycopy(decodedCipher, 0, iv, 0, 12);
        System.arraycopy(decodedCipher, 12, cipherText, 0, cipherText.length);
        
        SecretKeySpec keySpec = getSecretKeySpec();
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec paramSpec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.DECRYPT_MODE, keySpec, paramSpec);
        
        byte[] plainText = cipher.doFinal(cipherText);
        return new String(plainText, StandardCharsets.UTF_8);
    }
}
