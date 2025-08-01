package com.whatsapp.Whatsapp.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.whatsapp.Whatsapp.OtpStorage.OtpStorage;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public String sendOtp(String email) {
        String otp = generateOtp();


        OtpStorage.otpMap.put(email, otp);
        OtpStorage.otpVerified.put(email, false);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Reset Password OTP");
        message.setText("Your OTP is: " + otp);
        message.setFrom("your_email@gmail.com");

        mailSender.send(message);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        if (OtpStorage.otpMap.containsKey(email)) {
            String storedOtp = OtpStorage.otpMap.get(email).trim();
            String inputOtp = otp.trim();
            if (storedOtp.equals(inputOtp)) {
                OtpStorage.otpVerified.put(email, true);
                System.out.println("email"+email);
                return true;
            }
        }
        return false;
    }


    public boolean isOtpVerified(String email) {
        return OtpStorage.otpVerified.getOrDefault(email, false);
    }

    public void clearOtp(String email) {
        OtpStorage.otpMap.remove(email);
        OtpStorage.otpVerified.remove(email);
    }

    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));

    }


}
