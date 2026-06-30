import { Link } from "react-router-dom";

function ServiceCard({service}){

    return(

        <div className="card h-100 shadow">

            <img
                src={
                    service.anhGioiThieu ||
                    "https://picsum.photos/400/250"
                }
                className="card-img-top"
                style={{
                    height:"220px",
                    objectFit:"cover"
                }}
            />

            <div className="card-body">

                <h5>

                    {service.tenDichVu}

                </h5>
                

                <p className="text-danger fw-bold">

                    {service.gia?.toLocaleString()} VNĐ

                </p>

                <p>

                    {service.thoiGianThucHien} phút

                </p>

                <Link
                    className="btn btn-dark w-100"
                    to={`/dichvu/${service.maDichVu}`}
                >

                    Xem chi tiết

                </Link>

            </div>

        </div>

    )

}

export default ServiceCard;