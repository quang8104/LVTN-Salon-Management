package com.salon.salon_management.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jwt.JwtUtil;
import com.salon.salon_management.dto.LoginRequest;
import com.salon.salon_management.dto.LoginResponse;
import com.salon.salon_management.dto.RegisterRequest;
import com.salon.salon_management.dto.VerifyOtpRequest;
import com.salon.salon_management.entity.KhachHang;
import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.repository.KhachHangRepository;
import com.salon.salon_management.repository.NhanVienRepository;
import com.salon.salon_management.dto.ForgotPasswordRequest;
import com.salon.salon_management.dto.ResetPasswordRequest;
import com.salon.salon_management.dto.ChangePasswordRequest;

@Service
public class KhachHangService {
    private final KhachHangRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final NhanVienRepository nhanVienRepository;
    private final EmailService emailService;
    private final OtpService otpService;

    public KhachHangService(
            KhachHangRepository repository,
            PasswordEncoder passwordEncoder,
            NhanVienRepository nhanVienRepository,
            EmailService emailService,
            OtpService otpService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.nhanVienRepository = nhanVienRepository;
        this.emailService = emailService;
        this.otpService = otpService;
    }

    public String register(RegisterRequest request) {
        validateRegister(request);

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }

        if (repository.findBySdt(request.getSdt()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        String otp = otpService.generateOtp(request.getEmail(), request);
        emailService.sendOtpEmail(request.getEmail(), otp);

        return "Mã OTP đã được gửi về email. Vui lòng kiểm tra Gmail.";
    }

    public String verifyOtp(VerifyOtpRequest request) {
        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!valid) {
            throw new RuntimeException("OTP không đúng hoặc đã hết hạn");
        }

        RegisterRequest registerRequest = otpService.getRegisterRequest(request.getEmail());

        if (registerRequest == null) {
            throw new RuntimeException("Không tìm thấy thông tin đăng ký");
        }

        if (repository.findByEmail(registerRequest.getEmail()).isPresent()) {
            otpService.clear(request.getEmail());
            throw new RuntimeException("Email đã tồn tại");
        }

        if (repository.findBySdt(registerRequest.getSdt()).isPresent()) {
            otpService.clear(request.getEmail());
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        KhachHang kh = new KhachHang();
        kh.setHoTen(registerRequest.getHoTen());
        kh.setEmail(registerRequest.getEmail());
        kh.setSdt(registerRequest.getSdt());
        kh.setDiaChi(registerRequest.getDiaChi());
        kh.setMatKhau(passwordEncoder.encode(registerRequest.getMatKhau()));
        kh.setNgayTao(LocalDateTime.now());

        repository.save(kh);

        otpService.clear(request.getEmail());

        return "Đăng ký thành công";
    }

    private void validateRegister(RegisterRequest request) {
        if (request.getHoTen() == null || request.getHoTen().trim().isEmpty()) {
            throw new RuntimeException("Họ tên không được để trống");
        }

        if (request.getEmail() == null || !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Email không đúng định dạng");
        }

        if (request.getSdt() == null || !request.getSdt().matches("^(03|05|07|08|09)[0-9]{8}$")) {
            throw new RuntimeException("Số điện thoại không đúng định dạng Việt Nam");
        }

        if (request.getMatKhau() == null || request.getMatKhau().length() < 6) {
            throw new RuntimeException("Mật khẩu phải có ít nhất 6 ký tự");
        }
    }

    public LoginResponse login(LoginRequest request) {
        KhachHang kh = repository.findByEmail(request.getEmail()).orElse(null);

        if (kh != null) {
            boolean dungMatKhau = passwordEncoder.matches(
                    request.getMatKhau(),
                    kh.getMatKhau()
            );

            if (!dungMatKhau) {
                throw new RuntimeException("Sai mật khẩu");
            }

            String token = JwtUtil.generateToken(kh.getEmail());

            return new LoginResponse(
                    token,
                    "KHACH_HANG",
                    kh.getMaKhachHang(),
                    kh.getHoTen()
            );
        }

        NhanVien nv = nhanVienRepository.findByEmail(request.getEmail()).orElse(null);

        if (nv != null) {
            boolean dungMatKhau = passwordEncoder.matches(
                    request.getMatKhau(),
                    nv.getMatKhau()
            );

            if (!dungMatKhau) {
                throw new RuntimeException("Sai mật khẩu");
            }

            String token = JwtUtil.generateToken(nv.getEmail());

            return new LoginResponse(
                    token,
                    nv.getVaiTro(),
                    nv.getMaNhanVien(),
                    nv.getHoTen()
            );
        }

        throw new RuntimeException("Email không tồn tại");
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        KhachHang kh = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String otp = otpService.generateOtpOnly(kh.getEmail());

        emailService.sendForgotPasswordEmail(kh.getEmail(), otp);

        return "Mã OTP đặt lại mật khẩu đã được gửi về Gmail";
    }

    public String resetPassword(ResetPasswordRequest request) {
        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!valid) {
            throw new RuntimeException("OTP không đúng hoặc đã hết hạn");
        }

        String regex ="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!?.*_])[A-Za-z\\d@#$%^&+=!?.*_]{8,32}$";

        if (!request.getMatKhauMoi().matches(regex)) {

            throw new RuntimeException(
                "Mật khẩu phải từ 8-32 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
            );

        }

        KhachHang kh = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        kh.setMatKhau(passwordEncoder.encode(request.getMatKhauMoi()));

        repository.save(kh);

        otpService.clear(request.getEmail());

        return "Đặt lại mật khẩu thành công";
    }

    public KhachHang getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
    }

    public KhachHang updateProfile(Integer id, KhachHang request) {
        KhachHang kh = getById(id);

        if (request.getHoTen() == null || request.getHoTen().trim().isEmpty()) {
            throw new RuntimeException("Họ tên không được để trống");
        }

        if (request.getSdt() == null || !request.getSdt().matches("^(03|05|07|08|09)[0-9]{8}$")) {
            throw new RuntimeException("Số điện thoại không đúng định dạng Việt Nam");
        }

        repository.findBySdt(request.getSdt()).ifPresent(existing -> {
            if (!existing.getMaKhachHang().equals(id)) {
                throw new RuntimeException("Số điện thoại đã tồn tại");
            }
        });

        kh.setHoTen(request.getHoTen());
        kh.setSdt(request.getSdt());
        kh.setDiaChi(request.getDiaChi());

        return repository.save(kh);
    }

    public String changePassword(Integer id, ChangePasswordRequest request) {
        KhachHang kh = getById(id);

        boolean dungMatKhauCu = passwordEncoder.matches(
                request.getMatKhauCu(),
                kh.getMatKhau()
        );

        if (!dungMatKhauCu) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        String regex =
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!?.*_])[A-Za-z\\d@#$%^&+=!?.*_]{8,32}$";

        if (request.getMatKhauMoi() == null || !request.getMatKhauMoi().matches(regex)) {
            throw new RuntimeException(
                    "Mật khẩu mới phải từ 8-32 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
            );
        }

        if (passwordEncoder.matches(request.getMatKhauMoi(), kh.getMatKhau())) {
            throw new RuntimeException("Mật khẩu mới không được trùng mật khẩu cũ");
        }

        kh.setMatKhau(passwordEncoder.encode(request.getMatKhauMoi()));

        repository.save(kh);

        return "Đổi mật khẩu thành công";
    }   
}