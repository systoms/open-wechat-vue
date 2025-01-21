export default [
    {
        url: '/api/company/page/list',
        method: 'get',
        response: () => {
            return {
                success: true,
                code: 200,
                message: '成功',
                data: {
                    "items": [
                        {
                            "company_id": 0,
                            "company_page_id": 2,
                            "title": "页面标题11",
                            "description": "页面描述11",
                            "components": [
                                {
                                    "type": "vant-swipe",
                                    "props": {
                                        "images": [
                                            {
                                                "alt": "图片1",
                                                "uid": 1737302281314,
                                                "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-1.jpeg",
                                                "status": "success"
                                            },
                                            {
                                                "alt": "图片2",
                                                "uid": 1737302281315,
                                                "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-2.jpeg",
                                                "status": "success"
                                            },
                                            {
                                                "alt": "图片3",
                                                "uid": 1737302281316,
                                                "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-3.jpeg",
                                                "status": "success"
                                            }
                                        ],
                                        "autoplay": 3000
                                    }
                                },
                                {
                                    "type": "vant-icon",
                                    "props": {
                                        "icons": [
                                            {
                                                "uid": 1737302309209,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/kfc_style1.png",
                                                "name": "kfc",
                                                "label": "肯德基",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737302309210,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/mcdonalds_style1.png",
                                                "name": "mcdonalds",
                                                "label": "麦当劳",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737302309211,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/starbucks_style1.png",
                                                "name": "starbucks",
                                                "label": "星巴克",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737302309212,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/luckinCoffee_style1.png",
                                                "name": "ruixing",
                                                "label": "瑞幸",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737302309213,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/naixue_style1.png",
                                                "name": "nayuki",
                                                "label": "奈雪",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737302309214,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/heytear_style1.png",
                                                "name": "heytea",
                                                "label": "喜茶",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737302309215,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/movie_style1.png",
                                                "name": "movie",
                                                "label": "电影",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737302309216,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/share_style1.png",
                                                "name": "share",
                                                "label": "分享",
                                                "status": "success"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "type": "vant-icon",
                                    "props": {
                                        "icons": [
                                            {
                                                "uid": 1737386934080,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/kfc_style1.png",
                                                "name": "kfc",
                                                "label": "肯德基",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737386934084,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/naixue_style1.png",
                                                "name": "nayuki",
                                                "label": "奈雪",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737386934085,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/heytear_style1.png",
                                                "name": "heytea",
                                                "label": "喜茶",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737386934086,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/movie_style1.png",
                                                "name": "movie",
                                                "label": "电影",
                                                "status": "success"
                                            },
                                            {
                                                "uid": 1737386934087,
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/share_style1.png",
                                                "name": "share",
                                                "label": "分享",
                                                "status": "success"
                                            }
                                        ]
                                    }
                                }
                            ],
                            "sort": 0,
                            "status": 1,
                            "created_at": "2025-01-11 16:04:39",
                            "updated_at": "2025-01-20 15:29:01",
                            "deleted_at": null
                        },
                        {
                            "company_id": 1,
                            "company_page_id": 1,
                            "title": "页面标题1",
                            "description": "页面描述1",
                            "components": [
                                {
                                    "type": "vant-swipe",
                                    "props": {
                                        "images": [
                                            {
                                                "alt": "图片1",
                                                "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-1.jpeg"
                                            },
                                            {
                                                "alt": "图片2",
                                                "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-2.jpeg"
                                            },
                                            {
                                                "alt": "图片3",
                                                "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-3.jpeg"
                                            }
                                        ],
                                        "autoplay": 3000
                                    }
                                },
                                {
                                    "type": "vant-icon",
                                    "props": {
                                        "icons": [
                                            {
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/kfc_style1.png",
                                                "name": "kfc",
                                                "label": "肯德基"
                                            },
                                            {
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/mcdonalds_style1.png",
                                                "name": "mcdonalds",
                                                "label": "麦当劳"
                                            },
                                            {
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/starbucks_style1.png",
                                                "name": "starbucks",
                                                "label": "星巴克"
                                            },
                                            {
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/luckinCoffee_style1.png",
                                                "name": "ruixing",
                                                "label": "瑞幸"
                                            },
                                            {
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/naixue_style1.png",
                                                "name": "nayuki",
                                                "label": "奈雪"
                                            },
                                            {
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/heytear_style1.png",
                                                "name": "heytea",
                                                "label": "喜茶"
                                            },
                                            {
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/movie_style1.png",
                                                "name": "movie",
                                                "label": "电影"
                                            },
                                            {
                                                "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/share_style1.png",
                                                "name": "share",
                                                "label": "分享"
                                            }
                                        ]
                                    }
                                }
                            ],
                            "sort": 0,
                            "status": 1,
                            "created_at": "2025-01-11 23:23:59",
                            "updated_at": "2025-01-11 16:04:47",
                            "deleted_at": null
                        }
                    ],
                    "pageInfo": {
                        "total": 2,
                        "currentPage": 1,
                        "totalPage": 1
                    }
                },
            };
        },
    },
    {
        url: '/company/page/read/2',
        method: 'get',
        response: () => {
            return {
                success: true,
                code: 200,
                message: '成功',
                data: {
                    "company_id": 0,
                    "company_page_id": 2,
                    "title": "页面标题11",
                    "description": "页面描述11",
                    "components": [
                        {
                            "type": "vant-swipe",
                            "props": {
                                "images": [
                                    {
                                        "alt": "图片1",
                                        "uid": 1737302281314,
                                        "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-1.jpeg",
                                        "status": "success"
                                    },
                                    {
                                        "alt": "图片2",
                                        "uid": 1737302281315,
                                        "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-2.jpeg",
                                        "status": "success"
                                    },
                                    {
                                        "alt": "图片3",
                                        "uid": 1737302281316,
                                        "url": "https:\/\/fastly.jsdelivr.net\/npm\/@vant\/assets\/apple-3.jpeg",
                                        "status": "success"
                                    }
                                ],
                                "autoplay": 3000
                            }
                        },
                        {
                            "type": "vant-icon",
                            "props": {
                                "icons": [
                                    {
                                        "uid": 1737302309209,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/kfc_style1.png",
                                        "name": "kfc",
                                        "label": "肯德基",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737302309210,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/mcdonalds_style1.png",
                                        "name": "mcdonalds",
                                        "label": "麦当劳",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737302309211,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/starbucks_style1.png",
                                        "name": "starbucks",
                                        "label": "星巴克",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737302309212,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/luckinCoffee_style1.png",
                                        "name": "ruixing",
                                        "label": "瑞幸",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737302309213,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/naixue_style1.png",
                                        "name": "nayuki",
                                        "label": "奈雪",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737302309214,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/heytear_style1.png",
                                        "name": "heytea",
                                        "label": "喜茶",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737302309215,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/movie_style1.png",
                                        "name": "movie",
                                        "label": "电影",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737302309216,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/share_style1.png",
                                        "name": "share",
                                        "label": "分享",
                                        "status": "success"
                                    }
                                ]
                            }
                        },
                        {
                            "type": "vant-icon",
                            "props": {
                                "icons": [
                                    {
                                        "uid": 1737386934080,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/kfc_style1.png",
                                        "name": "kfc",
                                        "label": "肯德基",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737386934084,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/naixue_style1.png",
                                        "name": "nayuki",
                                        "label": "奈雪",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737386934085,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/heytear_style1.png",
                                        "name": "heytea",
                                        "label": "喜茶",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737386934086,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/movie_style1.png",
                                        "name": "movie",
                                        "label": "电影",
                                        "status": "success"
                                    },
                                    {
                                        "uid": 1737386934087,
                                        "url": "https:\/\/img.yunzhanxinxi.com\/static\/home\/icon\/topdining\/share_style1.png",
                                        "name": "share",
                                        "label": "分享",
                                        "status": "success"
                                    }
                                ]
                            }
                        }
                    ],
                    "sort": 0,
                    "status": 1,
                    "created_at": "2025-01-11 16:04:39",
                    "updated_at": "2025-01-20 15:29:01",
                    "deleted_at": null
                },
            };
        },
    },
    {
        url: '/company/page/update/2',
        method: 'put',
        response: () => {
            return {
                success: true,
                code: 200,
                message: '成功',
                data: [],
            };
        },
    },
];
