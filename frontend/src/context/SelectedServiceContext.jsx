import { createContext, useContext, useState } from "react";

const SelectedServiceContext = createContext();

export function SelectedServiceProvider({ children }) {

    const [selectedServices, setSelectedServices] = useState([]);

    // Thêm dịch vụ
    const addService = (service) => {

        const exists = selectedServices.some(
            item => item.maDichVu === service.maDichVu
        );

        if (exists) {
            return;
        }

        setSelectedServices(prev => [...prev, service]);
    };

    // Xóa dịch vụ
    const removeService = (maDichVu) => {

        setSelectedServices(prev =>
            prev.filter(item => item.maDichVu !== maDichVu)
        );

    };

    

    // Xóa tất cả
    const clearServices = () => {

        setSelectedServices([]);

    };

    return (

        <SelectedServiceContext.Provider
            value={{
                selectedServices,
                addService,
                removeService,
                clearServices
            }}
        >

            {children}

        </SelectedServiceContext.Provider>

    );

}

export function useSelectedService() {

    return useContext(SelectedServiceContext);

}