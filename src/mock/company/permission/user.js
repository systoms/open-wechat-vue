export default [
    {
        url: '/api/company/permission/user/info',
        method: 'get',
        response: () => {
            let number = 1;
            return {
                success: true,
                code: 200,
                message: '成功',
                data: {
                    user: {
                        avatar: '',
                    },
                    menus: [
                        {
                            id: number++,
                            label: "MAIN NAVIGATION",
                            type: 0,
                        },
                        {
                            id: number++,
                            label: "微信管理",
                            type: 1,
                            icon: "fa fa-wechat",
                            children: [
                                {
                                    id: number++,
                                    label: "菜单管理",
                                    path: "/wechat/menu",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "拖拽管理",
                                    path: "/drag/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            label: "表格管理",
                            type: 1,
                            icon: "fa fa-table",
                            path: "/table/index",
                            children: []
                        },
                        {
                            id: number++,
                            label: "Dashboard",
                            type: 1,
                            icon: "fa fa-dashboard",
                            children: [
                                {
                                    id: number++,
                                    label: "Dashboard v1",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Dashboard v2",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            label: "Layout Options",
                            type: 1,
                            icon: "fa fa-files-o",
                            children: [
                                {
                                    id: number++,
                                    label: "Top Navigation",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Boxed",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Fixed",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Collapsed Sidebar",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            label: "Widgets",
                            type: 1,
                            icon: "fa fa-th",
                            children: []
                        },
                        {
                            id: number++,
                            label: "Charts",
                            type: 1,
                            icon: "fa fa-pie-chart",
                            children: [
                                {
                                    id: number++,
                                    label: "ChartJS",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Morris",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Flot",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Inline charts",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            label: "UI Elements",
                            type: 1,
                            icon: "fa fa-laptop",
                            children: [
                                {
                                    id: number++,
                                    label: "General",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Icons",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Buttons",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Sliders",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Timeline",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Modals",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            label: "Forms",
                            type: 1,
                            icon: "fa fa-edit",
                            children: [
                                {
                                    id: number++,
                                    label: "General Elements",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Advanced Elements",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Editors",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            label: "Tables",
                            type: 1,
                            icon: "fa fa-table",
                            children: [
                                {
                                    id: number++,
                                    label: "Simple tables",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Data tables",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            label: "Calendar",
                            type: 1,
                            icon: "fa fa-calendar",
                            children: []
                        },
                        {
                            id: number++,
                            label: "Mailbox",
                            type: 1,
                            icon: "fa fa-envelope",
                            children: []
                        },
                        {
                            id: number++,
                            label: "Examples",
                            type: 1,
                            icon: "fa fa-folder",
                            children: [
                                {
                                    id: number++,
                                    label: "Invoice",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Profile",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Login",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Register",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Lockscreen",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "404 Error",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "500 Error",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Blank Page",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                                {
                                    id: number++,
                                    label: "Pace Page",
                                    path: "/index",
                                    icon: "fa fa-circle-o",
                                },
                            ]
                        },
                        {
                            id: number++,
                            label: "LABELS",
                            type: 0,
                        },
                        {
                            id: number++,
                            label: "Important",
                            type: 1,
                            icon: "fa fa-circle-o text-red",
                            children: []
                        },
                        {
                            id: number++,
                            label: "Warning",
                            type: 1,
                            icon: "fa fa-circle-o text-yellow",
                            children: []
                        },
                        {
                            id: number++,
                            label: "Information",
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
