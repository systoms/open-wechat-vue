export default [
    {
        url: '/api/system/menu',
        method: 'get',
        response: () => {
            let number = 1;
            return {
                success: true,
                code: 200,
                message: '成功',
                data: {
                    menus: [
                        {
                            id: number++,
                            name: "MAIN NAVIGATION",
                            type: 0,
                        },
                        {
                            id: number++,
                            name: "微信管理",
                            type: 1,
                            icon: "fa fa-wechat",
                            children: [
                                {
                                    id: number++,
                                    name: "菜单管理",
                                    path: "/wechat/menu",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "拖拽管理",
                                    path: "/drag/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            name: "表格管理",
                            type: 1,
                            icon: "fa fa-table",
                            path: "/table/index",
                            children: []
                        },
                        {
                            id: number++,
                            name: "Dashboard",
                            type: 1,
                            icon: "fa fa-dashboard",
                            children: [
                                {
                                    id: number++,
                                    name: "Dashboard v1",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Dashboard v2",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            name: "Layout Options",
                            type: 1,
                            icon: "fa fa-files-o",
                            children: [
                                {
                                    id: number++,
                                    name: "Top Navigation",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Boxed",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Fixed",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Collapsed Sidebar",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            name: "Widgets",
                            type: 1,
                            icon: "fa fa-th",
                            children: []
                        },
                        {
                            id: number++,
                            name: "Charts",
                            type: 1,
                            icon: "fa fa-pie-chart",
                            children: [
                                {
                                    id: number++,
                                    name: "ChartJS",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Morris",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Flot",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Inline charts",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            name: "UI Elements",
                            type: 1,
                            icon: "fa fa-laptop",
                            children: [
                                {
                                    id: number++,
                                    name: "General",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Icons",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Buttons",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Sliders",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Timeline",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Modals",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            name: "Forms",
                            type: 1,
                            icon: "fa fa-edit",
                            children: [
                                {
                                    id: number++,
                                    name: "General Elements",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Advanced Elements",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Editors",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            name: "Tables",
                            type: 1,
                            icon: "fa fa-table",
                            children: [
                                {
                                    id: number++,
                                    name: "Simple tables",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Data tables",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            name: "Calendar",
                            type: 1,
                            icon: "fa fa-calendar",
                            children: []
                        },
                        {
                            id: number++,
                            name: "Mailbox",
                            type: 1,
                            icon: "fa fa-envelope",
                            children: []
                        },
                        {
                            id: number++,
                            name: "Examples",
                            type: 1,
                            icon: "fa fa-folder",
                            children: [
                                {
                                    id: number++,
                                    name: "Invoice",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Profile",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Login",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Register",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Lockscreen",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "404 Error",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "500 Error",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Blank Page",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    name: "Pace Page",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            name: "LABELS",
                            type: 0,
                        },
                        {
                            id: number++,
                            name: "Important",
                            type: 1,
                            icon: "fa fa-circle-o text-red",
                            children: []
                        },
                        {
                            id: number++,
                            name: "Warning",
                            type: 1,
                            icon: "fa fa-circle-o text-yellow",
                            children: []
                        },
                        {
                            id: number++,
                            name: "Information",
                            type: 1,
                            icon: "fa fa-circle-o text-aqua",
                            children: []
                        },
                    ],
                },
            };
        },
    },
];
