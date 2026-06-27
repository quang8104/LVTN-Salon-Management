import { useEffect, useState } from "react";
import { datLich, getLichByKhachHang, getSlotRanh, huyLich, xacNhanLich, hoanTatLich, deleteLich } from "../api/lichApi";
import { getChiTietLich, themDichVuVaoLich } from "../api/chiTietLichApi";
import { getDichVu } from "../api/dichVuApi";
import { getNhanVien } from "../api/nhanVienApi";
import { formatDate, formatTime } from "../utils/format";

const emptyForm = {
  maKhachHang: "",
  maNhanVien: "",
  ngayHen: "",
  gioHen: "",
  ghiChu: "",
};

export default function LichHenPage() {
  const [form, setForm] = useState(emptyForm);
  const [lich, setLich] = useState([]);
  const [slots, setSlots] = useState([]);
  const [dichVuList, setDichVuList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState([]);
  const [selectedLichId, setSelectedLichId] = useState("");
  const [chiTiet, setChiTiet] = useState([]);

  const loadData = async () => {
    const [dichVuRes, nhanVienRes] = await Promise.all([getDichVu(), getNhanVien()]);
    setDichVuList(dichVuRes.data);
    setNhanVienList(nhanVienRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      if (!form.maNhanVien || !form.ngayHen) {
        setSlots([]);
        return;
      }

      const res = await getSlotRanh(form.maNhanVien, form.ngayHen);
      setSlots(res.data.data || res.data || []);
    };

    loadSlots();
  }, [form.maNhanVien, form.ngayHen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await datLich({
      ...form,
      maKhachHang: Number(form.maKhachHang),
      maNhanVien: Number(form.maNhanVien),
    });
    if (form.maKhachHang) {
      const res = await getLichByKhachHang(form.maKhachHang);
      setLich(res.data.data || res.data || []);
    }
  };

  const loadCustomerBookings = async () => {
    if (!form.maKhachHang) return;
    const res = await getLichByKhachHang(form.maKhachHang);
    setLich(res.data.data || res.data || []);
  };

  const loadChiTiet = async (id) => {
    setSelectedLichId(id);
    const res = await getChiTietLich(id);
    setChiTiet(res.data);
  };

  const handleAddService = async (maDichVu) => {
    if (!selectedLichId) return;
    await themDichVuVaoLich({ maLichHen: Number(selectedLichId), maDichVu: Number(maDichVu) });
    await loadChiTiet(selectedLichId);
  };

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <div className="eyebrow">Booking</div>
          <h2>Lịch hẹn</h2>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head"><h3>Đặt lịch mới</h3></div>
        <form className="form-grid booking-grid" onSubmit={handleSubmit}>
          <input placeholder="Mã khách hàng" value={form.maKhachHang} onChange={(e) => setForm({ ...form, maKhachHang: e.target.value })} onBlur={loadCustomerBookings} />
          <select value={form.maNhanVien} onChange={(e) => setForm({ ...form, maNhanVien: e.target.value })}>
            <option value="">Chọn nhân viên</option>
            {nhanVienList.map((item) => <option key={item.maNhanVien} value={item.maNhanVien}>{item.hoTen}</option>)}
          </select>
          <input type="date" value={form.ngayHen} onChange={(e) => setForm({ ...form, ngayHen: e.target.value })} />
          <input type="time" value={form.gioHen} onChange={(e) => setForm({ ...form, gioHen: e.target.value })} />
          <input placeholder="Ghi chú" value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} />
          <button className="primary-button" type="submit">Đặt lịch</button>
        </form>

        <div className="slot-list">
          {slots.map((slot) => <span key={slot}>{formatTime(slot)}</span>)}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h3>Lịch của khách hàng</h3></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Nhân viên</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lich.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.tenNhanVien}</td>
                  <td>{formatDate(item.ngayHen)}</td>
                  <td>{formatTime(item.gioHen)}</td>
                  <td>{item.trangThaiText}</td>
                  <td className="action-cell">
                    <button type="button" className="text-button" onClick={() => loadChiTiet(item.id)}>Chi tiết</button>
                    <button type="button" className="text-button" onClick={() => xacNhanLich(item.id)}>Xác nhận</button>
                    <button type="button" className="text-button" onClick={() => hoanTatLich(item.id)}>Hoàn tất</button>
                    <button type="button" className="text-button danger" onClick={() => huyLich(item.id)}>Hủy</button>
                    <button type="button" className="text-button danger" onClick={() => deleteLich(item.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Chi tiết lịch {selectedLichId || ""}</h3>
        </div>
        <div className="chip-row">
          {dichVuList.map((item) => (
            <button key={item.maDichVu} type="button" className="chip-button" onClick={() => handleAddService(item.maDichVu)}>
              {item.tenDichVu}
            </button>
          ))}
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {chiTiet.map((item) => (
                <tr key={item.maChiTiet || `${item.sanPham?.maSanPham}-${item.dichVu?.maDichVu}`}>
                  <td>{item.dichVu?.tenDichVu || item.sanPham?.tenSanPham || "-"}</td>
                  <td>{item.soLuong || 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}