function ProductCard({ product }) {
    return (
        <div className="card h-100">
            <img
                src="https://picsum.photos/300/200"
                className="card-img-top"
            />

            <div className="card-body">

                <h5>{product.ten}</h5>

                <p>{product.gia}</p>

                <button className="btn btn-dark w-100">

                    Xem chi tiết

                </button>

            </div>

        </div>
    );
}

export default ProductCard;