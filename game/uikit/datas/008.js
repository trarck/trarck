var data={
    "items" :
    {
        "EncounterContent_008":
        {
            "images" :
            [
                {
                    "name"      : "limited_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 200,
                    "size_y"    : 80,
                    "pos_x"     : -278,
                    "pos_y"     : -190,
                    "pos_z"     : 80.3,
                    "asset"     : "Event/008/limited.png"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 727,
                    "size_y"    : 445,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "Event/008/base_plate.png"
                },
                {
                    "name"      : "event_target_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 142,
                    "size_y"    : 175,
                    "pos_x"     : -237,
                    "pos_y"     : -89,
                    "pos_z"     : 80.3,
                    "asset"     : "Event/008/event_target_frame.png",
                    "tag"       : "conditional_image",
                    "args"      :
                    {
                        "params" : {
                            "42" : "rare",
                            "43" : "rare",
                            "47" : "rare",
                            "48" : "rare"
                        },
                        "alt_images" : {
                            "rare" : "Event/008/rare_event_target_frame.png"
                        }
                    }
                },
                {
                    "name"      : "result_image_animal",
                    "scaling"   : "keep_x",
                    "size_x"    : 157,
                    "size_y"    : 143,
                    "pos_x"     : -248,
                    "pos_y"     : -77,
                    "pos_z"     : 80.4,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "event_target_info_underlay",
                    "scaling"   : "keep_min",
                    "size_x"    : 251,
                    "size_y"    : 71,
                    "pos_x"     : -245,
                    "pos_y"     : 23,
                    "pos_z"     : 80.3,
                    "asset"     : "Event/008/event_target_num.png"
                },
                {
                    "name"      : "desc_bg",
                    "scaling"   : "keep_x",
                    "size_x"    : 656,
                    "size_y"    : 185,
                    "pos_x"     : -10,
                    "pos_y"     : -76,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/008/encounter_text_frame.png"
                },
                {
                    "name"      : "subtitle_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 173,
                    "size_y"    : 24,
                    "pos_x"     : 0,
                    "pos_y"     : 31,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/008/encounter_subtitle.png"
                },
                {
                    "name"      : "paid_option_img",
                    "scaling"   : "keep_y",
                    "size_x"    : 166,
                    "size_y"    : 140,
                    "pos_x"     : 232,
                    "pos_y"     : 120,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/008/paid_item_frame.png"
                },
                {
                    "name"      : "free_option_img",
                    "scaling"   : "keep_y",
                    "size_x"    : 166,
                    "size_y"    : 140,
                    "pos_x"     : 0,
                    "pos_y"     : 120,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/008/free_item_frame.png"
                },
                {
                    "name"      : "do_nothing_img",
                    "scaling"   : "keep_y",
                    "size_x"    : 166,
                    "size_y"    : 140,
                    "pos_x"     : -232,
                    "pos_y"     : 120,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/008/do_notjhing_frame.png"
                },
                {
                    "name"      : "title_line_top",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -204,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/alpha.png"
                },
                {
                    "name"      : "title_line_bottom",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -160,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/alpha.png"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "encounter_desc",
                    "font_size" : 14,
                    "size_x"    : 386,
                    "size_y"    : 90,
                    "pos_x"     : 78,
                    "pos_y"     : -100,
                    "pos_z"     : 80.9,
                    "justify"   : "left",
                    "color_r"   : 2,
                    "color_g"   : 5,
                    "color_b"   : 58,
                    "color_a"   : 1.0,
                    "wrap"      : "newline",
                    "line_len"  : 40,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "reserved_num",
                    "font_size" : 14,
                    "size_x"    : 173,
                    "size_y"    : 40,
                    "pos_x"     : -240,
                    "pos_y"     : 20,
                    "pos_z"     : 80.4,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "center",
                    "text_key"  : "EncounterReservedNum_008",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "paid_option_button",
                    "font_size" : 16,
                    "size_x"    : 146,
                    "size_y"    : 34,
                    "pos_x"     : 232,
                    "pos_y"     : 165,
                    "pos_z"     : 80.4,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    ".wrap"      : "shrink",
                    "justify"   : "center",
                    "text_key"  : "EncounterPaidButton_008"
                },
                {
                    "name"      : "free_option_button",
                    "font_size" : 16,
                    "size_x"    : 146,
                    "size_y"    : 34,
                    "pos_x"     : 0,
                    "pos_y"     : 165,
                    "pos_z"     : 80.4,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    ".wrap"      : "shrink",
                    "justify"   : "center",
                    "text_key"  : "EncounterFreeButton_008"
                },
                {
                    "name"      : "do_nothing_button",
                    "font_size" : 16,
                    "size_x"    : 146,
                    "size_y"    : 34,
                    "pos_x"     : -232,
                    "pos_y"     : 165,
                    "pos_z"     : 80.4,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    ".wrap"      : "shrink",
                    "justify"   : "center",
                    "text_key"  : "EncounterDoNothingButton_008"
                },
                {
                    "name"      : "avatar_desc",
                    "font_size" : 14,
                    "pos_origin": "l",
                    "pos_x"     : 5,
                    "pos_y"     : -30,
                    "pos_z"     : 80.6,
                    "size_x"    : 250,
                    "size_y"    : 80,
                    "color_r"   : 19,
                    "color_g"   : 61,
                    "color_b"   : 154,
                    "color_a"   : 1.0,
                    "justify"   : "left",
                    "tag"       : "avatar_text"
                },
                {
                    "name"      : "free_required_gold",
                    "font_size" : 16,
                    "size_x"    : 90,
                    "size_y"    : 25,
                    "pos_origin": "l",
                    "pos_x"     : -33,
                    "pos_y"     : 200,
                    "pos_z"     : 80.2,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "wrap"      : "shrink",
                    "justify"   : "left",
                    "text"       : "0"
                },
                {
                    "name"      : "free_required_energy",
                    "font_size" : 16,
                    "size_x"    : 90,
                    "size_y"    : 25,
                    "pos_origin": "l",
                    "pos_x"     : 42,
                    "pos_y"     : 200,
                    "pos_z"     : 80.2,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "wrap"      : "shrink",
                    "justify"   : "left",
                    "text"       : "0"
                }
            ]
        },
        "EventResultContent_008":
        {
            "images":
            [
                {
                    "name"      : "limited_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 200,
                    "size_y"    : 80,
                    "pos_x"     : -278,
                    "pos_y"     : -190,
                    "pos_z"     : 80.3,
                    "asset"     : "Event/008/limited.png"
                },
                {
                    "name"      : "title_image",
                    "scaling"   : "keep_min",
                    "size_x"    : 375,
                    "size_y"    : 27,
                    "pos_origin": "r",
                    "pos_x"     : 300,
                    "pos_y"     : -181,
                    "pos_z"     : 80.3,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 727,
                    "size_y"    : 438,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "Event/008/base_plate.png"
                },
                {
                    "name"      : "result_waku",
                    "size_x"    : 662,
                    "size_y"    : 226,
                    "pos_x"     : 0,
                    "pos_y"     : -39,
                    "pos_z"     : 80.3,
                    "asset"     : "Event/008/result_text_frame.png"
                },
                {
                    "name"      : "result_image",
                    "scaling"   : "keep_y",
                    "size_x"    : 267,
                    "size_y"    : 200,
                    "pos_x"     : -145,
                    "pos_y"     : -44,
                    "pos_z"     : 80.4,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "result_image_animal",
                    "scaling"   : "keep_x",
                    "size_x"    : 178,
                    "size_y"    : 162,
                    "pos_x"     : -157,
                    "pos_y"     : -46,
                    "pos_z"     : 80.5,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "event_target_count",
                    "scaling"   : "keep_min",
                    "size_x"    : 250,
                    "size_y"    : 75,
                    "pos_x"     : 255,
                    "pos_y"     : 100,
                    "pos_z"     : 80.5,
                    "asset"     : "Event/008/event_target_num.png"
                },
                {
                    "name"      : "title_line_top",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -204,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/alpha.png"
                },
                {
                    "name"      : "title_line_bottom",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -160,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/alpha.png"
                },
                {
                    "name"      : "confirm_ok_button",
                    "size_x"    : 232,
                    "size_y"    : 34,
                    "pos_x"     : 0,
                    "pos_y"     : 165,
                    "pos_z"     : 80.2,
                    "thru_restriction" : true,
                    "asset"     : "CommonUI/Btn_Blue_lrg.png",
                    "func"      : "ok",
                    "tag"       : "confirm_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                }
            ],
            "labels":
            [
                {
                    "name"      : "confirm_text",
                    "font_size" : 14,
                    "size_x"    : 265,
                    "size_y"    : 191,
                    "pos_x"     : 150,
                    "pos_y"     : -50,
                    "pos_z"     : 80.9,
                    "text"      : "",
                    "justify"   : "left",
                    "color_r"   : 2,
                    "color_g"   : 5,
                    "color_b"   : 58,
                    "color_a"   : 1.0,
                    "wrap"      : "newline",
                    "line_len"  : 40,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "reserved_label",
                    "font_size" : 16,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "pos_origin": "r",
                    "pos_x"     : 290,
                    "pos_y"     : 100,
                    "pos_z"     : 80.9,
                    "justify"   : "right",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "text_key"  : ""
                },
                {
                    "name"      : "reserved_count",
                    "font_size" : 16,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "pos_x"     : 255,
                    "pos_y"     : 100,
                    "pos_z"     : 80.9,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "text_key"  : "EncounterReservedNum_008",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "ok_label",
                    "font_size" : 17,
                    "size_x"    : 230,
                    "size_y"    : 34,
                    "pos_x"     : 0,
                    "pos_y"     : 165,
                    "pos_z"     : 80.3,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "center",
                    "tag"       : "label_value"
                }
            ]
        },
        "EventReserveFailContent_008":
        {
            "images":
            [
                {
                    "name"      : "result_image_animal",
                    "scaling"   : "keep_x",
                    "size_x"    : 1,
                    "size_y"    : 1,
                    "pos_x"     : -145,
                    "pos_y"     : -35,
                    "pos_z"     : 80.5,
                    "asset"     : "CommonUI/alpha.png"
                }
            ]
        },
        "EventTransferFailContent_008":
        {
            "images":
            [
                {
                    "name"      : "result_image_animal",
                    "scaling"   : "keep_x",
                    "size_x"    : 1,
                    "size_y"    : 1,
                    "pos_x"     : -145,
                    "pos_y"     : -35,
                    "pos_z"     : 80.5,
                    "asset"     : "CommonUI/alpha.png"
                }
            ]
        },
        "EventReserveDoNothingContent_008":
        {
            "images":
            [
                {
                    "name"      : "result_image_animal",
                    "scaling"   : "keep_x",
                    "size_x"    : 1,
                    "size_y"    : 1,
                    "pos_x"     : -145,
                    "pos_y"     : -35,
                    "pos_z"     : 80.5,
                    "asset"     : "CommonUI/alpha.png"
                }
            ]
        },
        "FriendSelectionContent_008":
        {
            "images":
            [
                {
                    "name"      : "limited_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 200,
                    "size_y"    : 80,
                    "pos_x"     : -278,
                    "pos_y"     : -190,
                    "pos_z"     : 90.3,
                    "asset"     : "Event/008/limited.png"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 652,
                    "size_y"    : 435,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "Event/008/transfer_base_plate_c.png"
                },
                {
                    "name"      : "popup_bg_l",
                    "size_x"    : 101,
                    "size_y"    : 435,
                    "pos_x"     : -376,
                    "pos_y"     : 0,
                    "pos_z"     : 90.1,
                    "asset"     : "Event/008/transfer_base_plate_l.png"
                },
                {
                    "name"      : "popup_bg_r",
                    "size_x"    : 101,
                    "size_y"    : 435,
                    "pos_x"     : 376,
                    "pos_y"     : 0,
                    "pos_z"     : 90.1,
                    "asset"     : "Event/008/transfer_base_plate_r.png"
                },
                {
                    "name"      : "desc_bg",
                    "size_x"    : 647,
                    "size_y"    : 68,
                    "pos_x"     : 0,
                    "pos_y"     : -113,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/008/transfer_top_frame.png"
                },
                {
                    "name"      : "composite_bg",
                    "scaling"   : "keep_y",
                    "size_x"    : 651,
                    "size_y"    : 238,
                    "pos_x"     : 0,
                    "pos_y"     : 65,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/008/base_plate_under.png"
                },
                {
                    "name"      : "title_line_top",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -204,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/alpha.png"
                },
                {
                    "name"      : "title_line_bottom",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -160,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/alpha.png"
                }

            ],
            "labels":
            [
                {
                    "name"      : "friend_selection_desc",
                    "font_size" : 14,
                    "pos_x"     : 22,
                    "pos_y"     : -113,
                    "pos_z"     : 80.9,
                    "size_x"    : 600,
                    "size_y"    : 68,
                    "color_r"   : 2,
                    "color_g"   : 5,
                    "color_b"   : 58,
                    "color_a"   : 1.0,
                    "wrap"      : "newline",
                    "justify"   : "left",
                    "text_key"  : "FriendSelectionDesc_008"
                },
                {
                    "name"      : "loading_text",
                    "font_size" : 20,
                    "pos_x"     : 0,
                    "pos_y"     : 62,
                    "pos_z"     : 80.9,
                    "size_x"    : 651,
                    "size_y"    : 238,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "text_key"  : "LoadingLabel"
                }
            ],
            "composite" :
            [
                {
                    "name"              : "friend_selection_list",
                    "size_x"            : 652,
                    "size_y"            : 230,
                    "pos_x"             : -326,
                    "pos_y"             : 0,
                    "pos_z"             : 80.3,
                    "controller"        : "scroll_area",
                    "controller_args"   :
                    {
                        "item_type"         : "friend_selection_item006",
                        "data_source_tag"   : "friend_selection_list",
                        "async"             : true,
                        "no_refresh"        : true,
                        "orientation"       : "horizontal",
                        "elements_per_group": 1,
                        "item_size_x"       : 131,
                        "item_size_y"       : 230
                    }
                }
            ]
        },
        "friend_selection_item006":
        {
            "images":
            [
                {
                    "name"      : "bg_img",
                    "scaling"   : "keep_y",
                    "size_x"    : 131,
                    "size_y"    : 230,
                    "pos_x"     : 0,
                    "pos_y"     : -50,
                    "pos_z"     : 80.4,
                    "asset"     : "Event/008/transfer_user_widget_frame.png"
                },
                {
                    "name"      : "ps_avatar",
                    "scaling"   : "keep_min",
                    "size_x"    : 75,
                    "size_y"    : 75,
                    "pos_x"     : -7,
                    "pos_y"     : -100,
                    "pos_z"     : 80.5,
                    "tag"       : "avatar_image"
                },
                {
                    "name"      : "event_target_img",
                    "scaling"   : "keep_x",
                    "size_x"    : 45,
                    "size_y"    : 45,
                    "pos_x"     : -23,
                    "pos_y"     : -17,
                    "pos_z"     : 80.5,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "friend_button",
                    "size_x"    : 100,
                    "size_y"    : 34,
                    "pos_origin": "t",
                    "pos_x"     : -7,
                    "pos_y"     : 20,
                    "pos_z"     : 80.5,
                    "asset"     : "CommonUI/BtnGreen_v2.png",
                    "tag"       : "avatar_selected",
                    "args"      :
                    {
                        "sound" : "buttonpress.wav"
                    }
                }
            ],
            "labels":
            [
                {
                    "name"      : "avatar_name",
                    "font_size" : 16,
                    "pos_origin": "b",
                    "pos_x"     : -7,
                    "pos_y"     : -133,
                    "pos_z"     : 80.6,
                    "size_x"    : 110,
                    "size_y"    : 35,
                    "color_r"   : 2,
                    "color_g"   : 5,
                    "color_b"   : 58,
                    "color_a"   : 1.0,
                    "text"      : "user name",
                    "tag"       : "avatar_text"
                },
                {
                    "name"      : "user_level",
                    "font_size" : 16,
                    "pos_origin": "t",
                    "pos_x"     : -7,
                    "pos_y"     : -63,
                    "pos_z"     : 80.6,
                    "size_x"    : 110,
                    "size_y"    : 40,
                    "v_align"   : "top",
                    "color_r"   : 2,
                    "color_g"   : 5,
                    "color_b"   : 58,
                    "color_a"   : 1.0,
                    "text_key"  : "UserInfoLevel",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "event_target_count",
                    "font_size" : 16,
                    "size_x"    : 58,
                    "size_y"    : 34,
                    "pos_origin": "t",
                    "pos_x"     : 27,
                    "pos_y"     : -23,
                    "pos_z"     : 80.6,
                    "color_r"   : 2,
                    "color_g"   : 5,
                    "color_b"   : 58,
                    "color_a"   : 1.0,
                    "wrap"      : "shrink",
                    "text_key"  : "CompLabel",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "friend_button_label",
                    "font_size" : 16,
                    "size_x"    : 100,
                    "size_y"    : 34,
                    "pos_origin": "t",
                    "pos_x"     : -8,
                    "pos_y"     : 20,
                    "pos_z"     : 80.6,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "wrap"      : "shrink",
                    "tag"       : "label_value"
                }
            ]
        },
        "StepCompleteContent_008":
        {
            "images" :
            [
                {
                    "name"      : "limited_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 200,
                    "size_y"    : 80,
                    "pos_x"     : -278,
                    "pos_y"     : -190,
                    "pos_z"     : 90.3,
                    "asset"     : "Event/008/limited.png"
                },
                {
                    "name"      : "title_image",
                    "scaling"   : "keep_min",
                    "size_x"    : 375,
                    "size_y"    : 27,
                    "pos_origin": "r",
                    "pos_x"     : 300,
                    "pos_y"     : -181,
                    "pos_z"     : 80.2,
                    "asset"    : "Event/008/step_clear_title.png"
                },
                {
                    "name"      : "bg_img",
                    "size_x"    : 713,
                    "size_y"    : 293,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.2,
                    "asset"    : "Event/008/step_clear_frame.png"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 727,
                    "size_y"    : 428,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "Event/008/base_plate.png"
                },
                {
                    "name"      : "title_line_top",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -204,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/alpha.png"
                },
                {
                    "name"      : "title_line_bottom",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -160,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/alpha.png"
                },
                {
                    "name"      : "ribbon_img",
                    "scaling"   : "keep_x",
                    "size_x"    : 713,
                    "size_y"    : 178,
                    "pos_x"     : 0,
                    "pos_y"     : -80,
                    "pos_z"     : 80.3,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "deco_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 189,
                    "size_y"    : 130,
                    "pos_x"     : 0,
                    "pos_y"     : 25,
                    "pos_z"     : 80.2,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "confirm_ok_button",
                    "size_x"    : 173,
                    "size_y"    : 34,
                    "pos_x"     : 0,
                    "pos_y"     : 165,
                    "pos_z"     : 80.2,
                    "thru_restriction" : true,
                    "asset"     : "CommonUI/BtnGreen_v2.png",
                    "func"      : "ok",
                    "tag"       : "confirm_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                }
            ],
            "labels" :
            [
                {
                    "name"      : "completed_times",
                    "font_size" : 20,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "pos_x"     : 0,
                    "pos_y"     : -70,
                    "pos_z"     : 80.9,
                    "color_r"   : 0,
                    "color_g"   : 104,
                    "color_b"   : 158,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "deco_desc",
                    "font_size" : 20,
                    "size_x"    : 300,
                    "size_y"    : 40,
                    "pos_x"     : 0,
                    "pos_y"     : 105,
                    "pos_z"     : 80.9,
                    "color_r"   : 2,
                    "color_g"   : 5,
                    "color_b"   : 58,
                    "color_a"   : 1.0,
                    "text_key"  : "StepCompleteDecoDesc_008",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "ok_label",
                    "font_size" : 20,
                    "size_x"    : 173,
                    "size_y"    : 34,
                    "pos_x"     : 0,
                    "pos_y"     : 165,
                    "pos_z"     : 80.3,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "center",
                    "text_key"  : "StepCompleteButton_008"
                }
            ]
        }
    }
}
