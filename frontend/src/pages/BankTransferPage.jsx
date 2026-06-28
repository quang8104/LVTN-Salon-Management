import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDonHangById } from "../api/donHangApi";

function BankTransferPage() {
    const { id } = useParams();

    const [donHang, setDonHang] = useState(null);

    const BANK_CODE = "TPB";
    const ACCOUNT_NO = "0333046032";
    const ACCOUNT_NAME = "NGUYEN DUC QUANG";

    useEffect(() => {
        loadDonHang();
    }, [id]);

    const loadDonHang = async () => {
        try {
            const res = await getDonHangById(id);
            setDonHang(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const noiDung = `DH${id}`;
    const soTien = donHang?.tongTien || 0;

    const qrUrl =
        `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NO}-compact2.png` +
        `?amount=${soTien}` +
        `&addInfo=${encodeURIComponent(noiDung)}` +
        `&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

    const copy = async (text) => {
        await navigator.clipboard.writeText(text);
        alert("Đã sao chép");
    };

    if (!donHang) {
        return (
            <div className="container py-5 text-center">
                Đang tải thông tin thanh toán...
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "720px" }}>
                <div className="card-body p-4">
                    <h2 className="text-center mb-3">
                        Thanh toán chuyển khoản
                    </h2>

                    <p className="text-center text-muted">
                        Vui lòng quét mã QR bên dưới để thanh toán đơn hàng.
                    </p>

                    <div className="text-center mb-4">
                        <img
                            src={qrUrl}
                            alt="VietQR"
                            style={{
                                maxWidth: "360px",
                                width: "100%",
                                borderRadius: "12px",
                                border: "1px solid #eee"
                            }}
                        />
                    </div>

                    <div className="border rounded p-3 bg-light">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Ngân hàng</span>
                            <strong>TPBank</strong>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span>Số tài khoản</span>
                            <div>
                                <strong>{ACCOUNT_NO}</strong>
                                <button
                                    className="btn btn-sm btn-outline-dark ms-2"
                                    onClick={() => copy(ACCOUNT_NO)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span>Chủ tài khoản</span>
                            <strong>{ACCOUNT_NAME}</strong>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span>Số tiền</span>
                            <strong className="text-danger">
                                {Number(soTien).toLocaleString()} VNĐ
                            </strong>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span>Nội dung chuyển khoản</span>
                            <div>
                                <strong>{noiDung}</strong>
                                <button
                                    className="btn btn-sm btn-outline-dark ms-2"
                                    onClick={() => copy(noiDung)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-warning mt-4 mb-0">
                        Sau khi chuyển khoản, đơn hàng sẽ chờ admin kiểm tra và xác nhận thanh toán.
                    </div>

                    <div className="d-flex gap-3 mt-4">
                        <Link to="/" className="btn btn-outline-dark w-50">
                            Về trang chủ
                        </Link>

                        <Link to="/don-hang-cua-toi" className="btn btn-dark w-50">
                            Xem đơn hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BankTransferPage;