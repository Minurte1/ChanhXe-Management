/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import axios from 'axios';
import Cookies from "js-cookie"
const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [menuData, setMenuData] = useState<AppMenuItem[]>([]);
    const accessToken = typeof window !== "undefined" ? Cookies.get("accessToken") : null;

    useEffect(() => {
        const fetchMenu = async () => {
            if (accessToken) {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_SERVER}/menu`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    console.log('response',response)
                    if (response.data.EC === 1) {
                        const formattedMenu = response.data.DT.map((item: any) => ({
                            label: item.label,
                            icon: item.icon,
                            to: item.url || undefined,
                            items: item.items?.map((subItem: any) => ({
                                label: subItem.label,
                                to: subItem.url || undefined
                            }))
                        }));
                        setMenuData(formattedMenu);
                    }
                } catch (error) {
                    console.error('Error fetching menu:', error);
                }
            }
        };

        fetchMenu();
    }, [accessToken]);

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {menuData.map((item, i) => (
                    <AppMenuitem item={item} root={true} index={i} key={item.label} />
                ))}

              
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
