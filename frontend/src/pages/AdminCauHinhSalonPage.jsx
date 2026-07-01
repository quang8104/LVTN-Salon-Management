import { useEffect, useState } from "react";
import {
    getCauHinhSalon,
    updateCauHinhSalon
} from "../api/cauHinhSalonApi";

function AdminCauHinhSalonPage() {
    const [form, setForm] = useState({
        gioMoCua: "",
        gioDongCua: "",
        buocSlot: 30,
        bufferPhut: 30,
        trangThai: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getCauHinhSalon();

        setForm({
            gioMoCua: res.data.gioMoCua?.slice(0, 5) || "",
            gioDongCua: res.data.gioDongCua?.slice(0, 5) || "",
            buocSlot: res.data.buocSlot || 30,
            bufferPhut: res.data.bufferPhut || 30,
            trangThai: res.data.trangThai || 1
        });
    };

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        await updateCauHinhSalon({
            ...form,
            buocSlot: Number(form.buocSlot),
            bufferPhut: Number(form.bufferPhut),
            trangThai: Number(form.trangThai)
        });

        alert("Cập nhật cấu hình salon thành công");
        loadData();
    };

    return (
        <div>
            <h2 className="mb-4">Cấu hình salon</h2>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white fw-bold">
                    Giờ hoạt động và thiết lập đặt lịch
                </div>

                <div className="card-body">
                    <form onSubmit={submit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Giờ mở cửa</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="gioMoCua"
                                    value={form.gioMoCua}
                                    onChange={change}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Giờ đóng cửa</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="gioDongCua"
                                    value={form.gioDongCua}
                                    onChange={change}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Bước slot</label>
                                <select
                                    className="form-select"
                                    name="buocSlot"
                                    value={form.buocSlot}
                                    onChange={change}
                                >
                                    <option value={15}>15 phút</option>
                                    <option value={30}>30 phút</option>
                                    <option value={60}>60 phút</option>
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Buffer giữa 2 lịch</label>
                                <select
                                    className="form-select"
                                    name="bufferPhut"
                                    value={form.bufferPhut}
                                    onChange={change}
                                >
                                    <option value={0}>0 phút</option>
                                    <option value={10}>10 phút</option>
                                    <option value={15}>15 phút</option>
                                    <option value={30}>30 phút</option>
                                    <option value={45}>45 phút</option>
                                    <option value={60}>60 phút</option>
                                </select>
                            </div>
                        </div>

                        <button className="btn btn-primary">
                            Lưu cấu hình
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminCauHinhSalonPage;