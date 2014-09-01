var IntroScreen={
    "groups" : [
        {
            "name" : "mainPanel",
            "groupDefinition": "mainPanel",
            "pos_x" : 0,
            "pos_y" : 0
        },
        {
            "name" : "cardPanel",
            "groupDefinition" : "cardPanel",
            "pos_x" : 0,
            "pos_y" : 0,
            "depth" : -1
        },
        {
            "name" : "backPanel",
            "groupDefinition" : "backPanel",
            "pos_x" : 0,
            "pos_y" : 0,
            "depth" : -2
        }
    ],
    "images":
    [
        {
            "name"      : "overlay_background",
            "size_x"    : 3000,
            "size_y"    : 3000,
            "pos_x"     : 426,
            "pos_y"     : 240,
            "pos_z"     : 0.5,
            "asset"     : "IntroScreen/black.png",
            "tag"       : "empty_touch"       ,
            "args"      :
            {
                "proto_name":"sdsfd"
            }
        },
        {
            "name"      : "loading_background",
            "scaling"   : "keep_y",
            "size_x"    : 854,
            "size_y"    : 480,
            "pos_x"     : 427,
            "pos_y"     : 240,
            "size_x_ios": 480,
            "size_y_ios": 320,
            "size_x_ipad":720,
            "size_y_ipad":480,
            "pos_z"     : 1,
            "asset"     : "IntroScreen/Default854x480.png",
            "asset_ios" : "IntroScreen/introScreen_960x640_iOS.png",
            "tag"       : "empty_touch"
        },
        {
            "name"      : "loading_background",
            "scaling"   : "keep_min",
            "size_x"    : 237,
            "size_y"    : 75,
            "pos_x"     : 427,
            "pos_y"     : 240,
            "pos_z"     : 2,
            "asset"     : "IntroScreen/xoom_loading_bubble_no_text.png",
            "tag"       : "empty_touch"
        }
    ],
    "labels":
    [
        {
            "name"      : "Get Status",
            "font_size" : 14,
            "scale_x"   : 1,
            "scale_y"   : 1,
            "pos_x"     : 427,
            "pos_y"     : 232,
            "pos_z"     : 3,
            "size_x"    : 237,
            "size_y"    : 112,
            "color_r"   : 10,
            "color_g"   : 0,
            "color_b"   : 0,
            "color_a"   : 0.5,
            "weight"    : "blod",
            "text"      : "这里是很长的文字\n很长的文字\n100%",
            "tag"       : "status_message"
        }
    ],
    "args" :
    {
        "CameraMovable" : 0,
        "ShowChrome" : 1,
        "LotEditable" : 0
    }
};
