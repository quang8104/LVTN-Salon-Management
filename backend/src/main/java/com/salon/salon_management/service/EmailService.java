package com.salon.salon_management.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Mã OTP xác thực tài khoản Hair Salon");
        message.setText(
                "Xin chào,\n\n" +
                "Mã OTP xác thực tài khoản của bạn là: " + otp + "\n\n" +
                "Mã này có hiệu lực trong 5 phút.\n\n" +
                "Hair Salon"
        );

        mailSender.send(message);
    }

    public void sendForgotPasswordEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Mã OTP đặt lại mật khẩu Hair Salon");
        message.setText(
                "Xin chào,\n\n" +
                "Mã OTP đặt lại mật khẩu của bạn là: " + otp + "\n\n" +
                "Mã này có hiệu lực trong 5 phút.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Hair Salon"
        );

        mailSender.send(message);
    }
}