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
                    "company": {
                        "name": "测试"
                    },
                    "user": {
                        "rand_id": "0",
                        "fullname": "测试"
                    },
                    "menus": [
                        {
                            "id": 10000,
                            "parent_id": 0,
                            "label": "控制台",
                            "code": " ",
                            "icon": "fa fa-circle-o",
                            "route": "/",
                            "component": null,
                            "redirect": "/",
                            "type": "",
                            "children": []
                        },
                        {
                            "id": 20000,
                            "parent_id": 0,
                            "label": "授权管理",
                            "code": " ",
                            "icon": "fa fa-circle-o",
                            "route": null,
                            "component": null,
                            "redirect": null,
                            "type": "",
                            "children": [
                                {
                                    "id": 21000,
                                    "parent_id": 20000,
                                    "label": "微信公众号管理",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": "/wechat/offiaccount",
                                    "component": null,
                                    "redirect": "/wechat/offiaccount",
                                    "type": "",
                                    "children": []
                                },
                                {
                                    "id": 22000,
                                    "parent_id": 20000,
                                    "label": "微信小程序管理",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": "/wechat/miniprogram",
                                    "component": null,
                                    "redirect": "/wechat/miniprogram",
                                    "type": "",
                                    "children": []
                                },
                                {
                                    "id": 23000,
                                    "parent_id": 20000,
                                    "label": "微信商户管理",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": "/wechat/pay",
                                    "component": null,
                                    "redirect": "/wechat/pay",
                                    "type": "",
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": 30000,
                            "parent_id": 0,
                            "label": "页面管理",
                            "code": " ",
                            "icon": "fa fa-circle-o",
                            "route": "/page/index",
                            "component": null,
                            "redirect": "/page/index",
                            "type": "",
                            "children": []
                        },
                        {
                            "id": 40000,
                            "parent_id": 0,
                            "label": "业务管理",
                            "code": " ",
                            "icon": "fa fa-circle-o",
                            "route": null,
                            "component": null,
                            "redirect": null,
                            "type": "",
                            "children": [
                                {
                                    "id": 41000,
                                    "parent_id": 40000,
                                    "label": "CPS业务",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": null,
                                    "component": null,
                                    "redirect": null,
                                    "type": "",
                                    "children": []
                                },
                                {
                                    "id": 42000,
                                    "parent_id": 40000,
                                    "label": "CPA业务",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": null,
                                    "component": null,
                                    "redirect": null,
                                    "type": "",
                                    "children": []
                                },
                                {
                                    "id": 43000,
                                    "parent_id": 40000,
                                    "label": "运营商业务",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": null,
                                    "component": null,
                                    "redirect": null,
                                    "type": "",
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": 50000,
                            "parent_id": 0,
                            "label": "财务管理",
                            "code": " ",
                            "icon": "fa fa-circle-o",
                            "route": null,
                            "component": null,
                            "redirect": null,
                            "type": "",
                            "children": [
                                {
                                    "id": 51000,
                                    "parent_id": 50000,
                                    "label": "账户预览",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": null,
                                    "component": null,
                                    "redirect": null,
                                    "type": "",
                                    "children": []
                                },
                                {
                                    "id": 52000,
                                    "parent_id": 50000,
                                    "label": "账户实名",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": null,
                                    "component": null,
                                    "redirect": null,
                                    "type": "",
                                    "children": []
                                },
                                {
                                    "id": 53000,
                                    "parent_id": 50000,
                                    "label": "收款账户",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": null,
                                    "component": null,
                                    "redirect": null,
                                    "type": "",
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": 60000,
                            "parent_id": 0,
                            "label": "用户管理",
                            "code": " ",
                            "icon": "fa fa-circle-o",
                            "route": null,
                            "component": null,
                            "redirect": null,
                            "type": "",
                            "children": [
                                {
                                    "id": 61000,
                                    "parent_id": 60000,
                                    "label": "手机号用户管理",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": null,
                                    "component": null,
                                    "redirect": null,
                                    "type": "",
                                    "children": []
                                },
                                {
                                    "id": 62000,
                                    "parent_id": 60000,
                                    "label": "微信用户管理",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": null,
                                    "component": null,
                                    "redirect": null,
                                    "type": "",
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": 70000,
                            "parent_id": 0,
                            "label": "系统管理",
                            "code": " ",
                            "icon": "fa fa-circle-o",
                            "route": null,
                            "component": null,
                            "redirect": null,
                            "type": "",
                            "children": [
                                {
                                    "id": 71000,
                                    "parent_id": 70000,
                                    "label": "用户管理",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": "/system/user",
                                    "component": null,
                                    "redirect": "/system/user",
                                    "type": "",
                                    "children": []
                                },
                                {
                                    "id": 72000,
                                    "parent_id": 70000,
                                    "label": "角色管理",
                                    "code": " ",
                                    "icon": "fa fa-circle-o",
                                    "route": "/system/role",
                                    "component": null,
                                    "redirect": "/system/role",
                                    "type": "",
                                    "children": []
                                }
                            ]
                        }
                    ]
                },
            };
        },
    },
];
