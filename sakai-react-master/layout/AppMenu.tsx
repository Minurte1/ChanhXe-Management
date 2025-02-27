/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [menuData, setMenuData] = useState([]);
    const accessToken = typeof window !== 'undefined' ? Cookies.get('accessToken') : null;
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            if (accessToken) {
                try {
                    const url = `${process.env.NEXT_PUBLIC_URL_SERVER}/menu${selectedRole ? `?selectedRole=${selectedRole}` : ''}`;

                    const response = await axios.get(url, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

               

                    if (response.data.EC === 1) {
                        const formattedMenu = response.data.DT.map((item) => ({
                            label: item.label,
                            icon: item.icon,
                            to: item.url || undefined,
                            items: item.items?.map((subItem) => ({
                                label: subItem.label,
                                to: subItem.url || undefined,
                                icon: item.icon,
                                admin: subItem.admin || '0',
                                role: subItem.role || '',
                            })),
                        }));
                        setMenuData(formattedMenu);
                    }
                } catch (error) {
                    console.error('Error fetching menu:', error);
                }
            }
        };

        fetchMenu();
    }, [accessToken, selectedRole]);

 
    const handleRoleChange = (role) => {
    
        setSelectedRole(role);
    };

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {menuData.map((item, i) => (
                    <AppMenuitem
                        item={item}
                        root={true}
                        index={i}
                        key={item.label}
                        selectedRole={selectedRole}
                        onRoleChange={handleRoleChange} // Xác nhận callback được truyền
                    />
                ))}
            </ul>
            {/* Nếu là admin, hiển thị danh sách chọn role con */}
        </MenuProvider>
    );
};

export default AppMenu;