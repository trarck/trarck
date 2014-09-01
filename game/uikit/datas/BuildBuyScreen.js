var BuildBuyScreen={
    "BuildBuyScreen":
    {
        "images":
            [
                {
                    "name"      : "store_background",
                    "size_x"    : 854,
                    "size_y"    : 480,
                    "pos_x"     : 427,
                    "pos_y"     : 240,
                    "pos_z"     : 7.0,
                    "asset"     : "SPR_BuildBuyScreen/A_800_buildstore_bg",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "user_info_bg",
                    "size_x"    : 564.89,
                    "size_y"    : 72,
                    "pos_origin": "lt",
                    "pos_x"     : 100,
                    "pos_y"     : 5,
                    "pos_z"     : 7.1,
                    "asset"     : "SPR_BuildBuyScreen/store_statusArea"
                },
                {
                    "name"      : "level_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 32,
                    "size_y"    : 32,
                    "pos_origin": "l",
                    "pos_x"     : 130,
                    "pos_y"     : 22,
                    "pos_z"     : 7.2,
                    "asset"     : "CommonUI/resIcon_level.png"
                },
                {
                    "name"      : "energy_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 32,
                    "size_y"    : 32,
                    "pos_origin": "l",
                    "pos_x"     : 130,
                    "pos_y"     : 56,
                    "pos_z"     : 7.2,
                    "asset"     : "InGameScreen/resIcon_energy.png"
                },
                {
                    "name"      : "xp_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 32,
                    "size_y"    : 27,
                    "pos_origin": "l",
                    "pos_x"     : 255,
                    "pos_y"     : 24,
                    "pos_z"     : 7.2,
                    "asset"     : "InGameScreen/xp_icn.png"
                },
                {
                    "name"      : "population_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 32,
                    "size_y"    : 32,
                    "pos_origin": "l",
                    "pos_x"     : 255,
                    "pos_y"     : 56,
                    "pos_z"     : 7.2,
                    "asset"     : "InGameScreen/resIcon_population.png"
                },
                {
                    "name"      : "recover_energy_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 32,
                    "size_y"    : 32,
                    "pos_origin": "l",
                    "pos_x"     : 445,
                    "pos_y"     : 22,
                    "pos_z"     : 7.2,
                    "asset"     : "SPR_BuildBuyScreen/resIcon_energyPotion"
                },
                {
                    "name"      : "dwarf_item_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 32,
                    "size_y"    : 32,
                    "pos_origin": "l",
                    "pos_x"     : 445,
                    "pos_y"     : 56,
                    "pos_z"     : 7.2,
                    "asset"     : "Dwarf/resIcon_cake.png"
                },
                {
                    "name"      : "hour_glass_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 32,
                    "size_y"    : 32,
                    "pos_origin": "l",
                    "pos_x"     : 555,
                    "pos_y"     : 22,
                    "pos_z"     : 7.2,
                    "asset"     : "CommonUI/resIcon_hourglass.png"
                },
                {
                    "name"      : "event_item_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 32,
                    "size_y"    : 32,
                    "pos_origin": "l",
                    "pos_x"     : 560,
                    "pos_y"     : 56,
                    "pos_z"     : 7.2,
                    "tag"       : "event_icon"
                },
                {
                    "name"      : "gs_background",
                    "size_x"    : 138.8,
                    "size_y"    : 39.75,
                    "pos_origin": "rt",
                    "pos_x"     : 854,
                    "pos_y"     : 0,
                    "pos_z"     : 7.2,
                    "asset"     : "SPR_InGameScreen/money_base"
                },
                {
                    "name"      : "gs_gold",
                    "scaling"   : "keep_y",
                    "size_x"    : 25,
                    "size_y"    : 25,
                    "pos_origin": "r",
                    "pos_x"     : 755,
                    "pos_y"     : 15,
                    "pos_z"     : 7.3,
                    "asset"     : "CommonUI/A_shared_small_coin_icon.png"
                },
                {
                    "name"      : "gs_show_balance",
                    "scaling"   : "keep_y",
                    "size_x"    : 150,
                    "size_y"    : 50,
                    "pos_origin": "rt",
                    "pos_x"     : 854,
                    "pos_y"     : 40,
                    "pos_z"     : 7.3,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "show_balance"
                },
                {
                    "name"      : "tab_cancel",
                    "scaling"   : "keep_x",
                    "size_x"    : 96,
                    "size_y"    : 86,
                    "pos_origin": "rt",
                    "pos_x"     : 844,
                    "pos_y"     : 115,
                    "pos_z"     : 7.3,
                    "asset"     : "SPR_BuildBuyScreen/A_shared_store_close_tab",
                    "tag"       : "goto_screen",
                    "args"      :
                    {
                        "screen" : "InGameScreen",
                        "chrome" : 1,
                        "sound"  : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "tab_dwelling",
                    "scaling"   : "keep_x",
                    "size_x"    : 128,
                    "size_y"    : 128,
                    "pos_origin": "lb",
                    "pos_x"     : 5,
                    "pos_y"     : 185,
                    "pos_z"     : 7.2,
                    "asset"     : "SPR_BuildBuyScreen/A_shared_dwelling_tab",
                    "tag"       : "load_proto_tab",
                    "args"      :
                    {
                        "enabled"           : 1,
                        "enabled_delta_y"   : -12,
                        "proto_tab"         : "Dwelling",
                        "bg_color"			:
                        {
                            "color_r"       : 0.54,
                            "color_g"       : 0.76,
                            "color_b"       : 0.83
                        },
                        "sound"             : "buttonpress.wav",
                        "composite"         : "store_display"
                    }
                },
                {
                    "name"      : "tab_building",
                    "scaling"   : "keep_x",
                    "size_x"    : 128,
                    "size_y"    : 128,
                    "pos_origin": "lb",
                    "pos_x"     : 133,
                    "pos_y"     : 185,
                    "pos_z"     : 7.2,
                    "asset"     : "SPR_BuildBuyScreen/A_shared_building_tab",
                    "tag"       : "load_proto_tab",
                    "args"      :
                    {
                        "enabled"           : 0,
                        "enabled_delta_y"   : -12,
                        "proto_tab"         : "Building",
                        "bg_color"			:
                        {
                            "color_r"       : 1.0,
                            "color_g"       : 0.71,
                            "color_b"       : 0.55
                        },
                        "sound"             : "buttonpress.wav",
                        "composite"         : "store_display"
                    }
                },
                {
                    "name"      : "tab_decoration",
                    "scaling"   : "keep_x",
                    "size_x"    : 128,
                    "size_y"    : 128,
                    "pos_origin": "lb",
                    "pos_x"     : 266,
                    "pos_y"     : 185,
                    "pos_z"     : 7.2,
                    "asset"     : "SPR_BuildBuyScreen/A_shared_deco_tab",
                    "tag"       : "load_proto_tab",
                    "args"      :
                    {
                        "enabled"           : 0,
                        "enabled_delta_y"   : -12,
                        "proto_tab"         : "Decoration",
                        "bg_color"			:
                        {
                            "color_r"       : 0.82,
                            "color_g"       : 0.92,
                            "color_b"       : 0.63
                        },
                        "sound"             : "buttonpress.wav",
                        "composite"         : "store_display"
                    }
                },
                {
                    "name"      : "tab_paid",
                    "scaling"   : "keep_x",
                    "size_x"    : 128,
                    "size_y"    : 128,
                    "pos_origin": "lb",
                    "pos_x"     : 394,
                    "pos_y"     : 185,
                    "pos_z"     : 7.2,
                    "asset"     : "SPR_BuildBuyScreen/special_tab@2x",
                    "tag"       : "load_proto_tab",
                    "args"      :
                    {
                        "enabled"           : 0,
                        "enabled_delta_y"   : -12,
                        "proto_tab"         : "Paid",
                        "bg_color"          :
                        {
                            "color_r"       : 0.63,
                            "color_g"       : 0.62,
                            "color_b"       : 0.47
                        },
                        "sound"             : "buttonpress.wav",
                        "composite"         : "store_display",
                        "item_type"         : "paid_store_item",
                        "data_source_tag"   : "build_paid_store_list",
                        "elements_per_group": 1,
                        "item_size_x"       : 245,
                        "item_size_y"       : 261
                    }
                },
                {
                    "name"      : "tab_package",
                    "scaling"   : "keep_x",
                    "size_x"    : 128,
                    "size_y"    : 128,
                    "pos_origin": "lb",
                    "pos_x"     : 522,
                    "pos_y"     : 185,
                    "pos_z"     : 7.2,
                    "asset"     : "SPR_BuildBuyScreen/A_shared_building_tab",
                    "tag"       : "load_proto_tab",
                    "args"      :
                    {
                        "enabled"           : 0,
                        "enabled_delta_y"   : -12,
                        "proto_tab"         : "Building",
                        "bg_color"			:
                        {
                            "color_r"       : 1.0,
                            "color_g"       : 0.71,
                            "color_b"       : 0.55
                        },
                        "sound"             : "buttonpress.wav",
                        "composite"         : "store_display"
                    }
                },
                {
                    "name"      : "scroller_background",
                    "size_x"    : 854,
                    "size_y"    : 310,
                    "pos_origin": "lt",
                    "pos_x"     : 0,
                    "pos_y"     : 170,
                    "pos_z"     : 7.3,
                    "color_r"   : 0.54,
                    "color_g"   : 0.76,
                    "color_b"   : 0.83,
                    "asset"     : "CommonUI/white.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "tokusho_button",
                    "scaling"   : "keep_min",
                    "size_x"    : 101,
                    "size_y"    : 26,
                    "pos_origin": "lb",
                    "pos_x"     : 15,
                    "pos_y"     : 475,
                    "pos_z"     : 7.4,
                    "asset"     : "SPR_BuildBuyScreen/button_tokusho_2",
                    "tag"       : "open_community_function",
                    "is_hidden" : true,
                    "args"      :
                    {
                        "path" : "/thisgame/tokushoho"
                    }
                }
            ],
        "labels":
            [
                {
                    "name"      : "level_label",
                    "font_size" : 15,
                    "pos_origin": "r",
                    "pos_x"     : 210,
                    "pos_y"     : 24,
                    "pos_z"     : 8.2,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "right",
                    "text"      : "0",
                    "tag"       : "display_user_level",
                    "args"      :
                    {
                        "no_label": true
                    }
                },
                {
                    "name"      : "energy_label",
                    "font_size" : 15,
                    "pos_origin": "r",
                    "pos_x"     : 210,
                    "pos_y"     : 56,
                    "pos_z"     : 8.2,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "right",
                    "text"      : "0",
                    "tag"       : "display_user_energy"
                },
                {
                    "name"      : "xp_label",
                    "font_size" : 15,
                    "pos_origin": "r",
                    "pos_x"     : 410,
                    "pos_y"     : 24,
                    "pos_z"     : 8.2,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "right",
                    "text"      : "0",
                    "tag"       : "display_user_xp"
                },
                {
                    "name"      : "population_label",
                    "font_size" : 15,
                    "pos_origin": "r",
                    "pos_x"     : 410,
                    "pos_y"     : 56,
                    "pos_z"     : 8.2,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "right",
                    "tag"       : "display_user_population"
                },
                {
                    "name"      : "rs_full_energy_item_number",
                    "font_size" : 15,
                    "pos_origin": "r",
                    "pos_x"     : 530,
                    "pos_y"     : 24,
                    "pos_z"     : 8.2,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "right",
                    "text"      : "0",
                    "tag"       : "possessions_count",
                    "args"      :
                    {
                        "proto_id" : 1
                    }
                },
                {
                    "name"      : "dwarf_item_number",
                    "font_size" : 15,
                    "pos_origin": "r",
                    "pos_x"     : 530,
                    "pos_y"     : 56,
                    "pos_z"     : 8.2,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "right",
                    "text"      : "0",
                    "tag"       : "possessions_count",
                    "args"      :
                    {
                        "proto_id" : 2
                    }
                },
                {
                    "name"      : "hour_glass_number",
                    "font_size" : 15,
                    "pos_origin": "r",
                    "pos_x"     : 640,
                    "pos_y"     : 24,
                    "pos_z"     : 8.2,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "right",
                    "text"      : "0",
                    "tag"       : "possessions_count",
                    "args"      :
                    {
                        "proto_id" : 3
                    }
                },
                {
                    "name"      : "event_item_number",
                    "font_size" : 15,
                    "pos_origin": "r",
                    "pos_x"     : 640,
                    "pos_y"     : 56,
                    "pos_z"     : 8.2,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "right",
                    "tag"       : "possessions_count",
                    "args"      :
                    {
                        "is_event_item" : true
                    }
                },
                {
                    "name"      : "gs_gold_amount",
                    "font_size" : 18,
                    "size_x"    : 94,
                    "size_y"    : 30,
                    "pos_origin": "l",
                    "pos_x"     : 748,
                    "pos_y"     : 15,
                    "pos_z"     : 9.9,
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "justify"   : "center",
                    ".wrap"      : "shrink",
                    "text"      : "0",
                    "tag"       : "display_user_gold"
                }
            ],
        "nativeUI" :
            [
                {
                    "name"      : "mobclix",
                    "size_x"    : 320,
                    "size_y"    : 50,
                    "pos_x"     : 18,
                    "pos_y"     : 16,
                    "pos_z"     : 9,
                    "tag"       : "ad_view"
                }
            ],
        "composite" :
            [
                {
                    "name"              : "store_display",
                    "size_x"            : 854,
                    "size_y"            : 300,
                    "pos_x"             : 0,
                    "pos_y"             : 180,
                    "pos_z"             : 7.4,
                    "controller"        : "scroll_area",
                    "controller_args"   :
                    {
                        "item_type"         : "store_item",
                        "data_source_tag"   : "build_store_list",
                        "orientation"       : "horizontal",
                        "elements_per_group": 2,
                        "item_size_x"       : 190,
                        "item_size_y"       : 150,
                        "data_source_args"  :
                        {
                            "type"          : "Dwelling"
                        }
                    }
                }
            ],
        "args" :
        {
            "CameraMovable" : 0,
            "ShowChrome" : 1,
            "LotEditable" : 0
        }
    },

    "items" :
    {
        "store_item" :
        {
            "images":
                [
                    {
                        "name"      : "store_item_container",
                        "scaling"   : "keep_min",
                        "size_x"    : 190,
                        "size_y"    : 145,
                        "pos_x"     : 0,
                        "pos_y"     : 0,
                        "pos_z"     : 8.1,
                        "asset"     : "SPR_BuildBuyScreen/A_shared_store_item_bubble",
                        "tag"       : "store_item_bought",
                        "args"      :
                        {
                            "screen"    : "InGameScreen",
                            "sound"     : "buttonpress.wav",
                            "proto_tags": ["proto_name", "produce_duration", "produce_cap", "produce_population",  "store_image_url", "xp_reward", "gold_cost", "energy_cost", "resource_cost", "effect_gain", "effect_cap", "entity_type"]
                        }
                    },
                    {
                        "name"      : "store_item_lock",
                        "scaling"   : "keep_min",
                        "size_x"    : 80,
                        "size_y"    : 80,
                        "pos_x"     : -35,
                        "pos_y"     : 10,
                        "pos_z"     : 8.4,
                        "asset"     : "",
                        "tag"       : "store_item_con"
                    },
                    {
                        "name"      : "store_item_image",
                        "scaling"   : "keep_min",
                        "size_x"    : 80,
                        "size_y"    : 80,
                        "pos_x"     : -35,
                        "pos_y"     : 10,
                        "pos_z"     : 8.2,
                        "asset"     : "",
                        "tag"       : "proto_image",
                        "args"      :
                        {
                            "store_item"    : true,
                            "proto_tag"     : "store_image_url"
                        }
                    },
                    {
                        "name"      : "store_item_cost",
                        "scaling"   : "keep_min",
                        "size_x"    : 40,
                        "size_y"    : 40,
                        "pos_x"     : 45,
                        "pos_y"     : -10,
                        "pos_z"     : 8.2,
                        "asset"     : "",
                        "tag"       : "proto_image_select",
                        "args"      :
                        {
                            "store_item"        : true,
                            "select_len"        : 2,
                            "select_type"       : "largest",
                            "proto_tag_1"       : "gold_cost",
                            "proto_tag_2"       : "mana_cost",
                            "asset_select_1"    : "CommonUI/A_shared_small_coin_icon.png",
                            "asset_select_2"    : "CommonUI/A_shared_small_mojo_icon.png"
                        }
                    }
                ],
            "labels":
                [
                    {
                        "name"      : "store_item_name",
                        "font_size" : 16,
                        "pos_x"     : 0,
                        "pos_y"     : -45,
                        "pos_y_adj" : 4,
                        "pos_z"     : 8.6,
                        "size_x"    : 170,
                        "size_y"    : 50,
                        "color_r"   : 163,
                        "color_g"   : 83,
                        "color_b"   : 24,
                        "weight"    : "bold",
                        "text"      : "",
                        "justify"   : "center",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "proto_tag"     : "proto_name"
                        }
                    },
                    {
                        "name"      : "store_item_cost",
                        "font_size" : 12,
                        "scale_x"   : 1,
                        "scale_y"   : 1,
                        "pos_x"     : 45,
                        "pos_y"     : 22,
                        "pos_z"     : 8.2,
                        "size_x"    : 80,
                        "size_y"    : 25,
                        "wrap"      : "shrink",
                        "text"      : "",
                        "justify"   : "center",
                        "tag"       : "proto_text_select",
                        "args"      :
                        {
                            "select_len"                : 2,
                            "select_type"               : "largest",
                            "proto_tag_1"               : "gold_cost",
                            "proto_tag_2"               : "mana_cost",
                            "insufficient_funds_color"  : "200,0,0",
                            "locked_color"              : "90,90,90",
                            "unlocked_color"            : "0,0,0"
                        }
                    }
                ]
        },
        "paid_store_item" :
        {
            "images":
                [
                    {
                        "name"      : "store_item_container",
                        ".scaling"   : "keep_min",
                        "size_x"    : 235,
                        "size_y"    : 261,
                        "pos_x"     : 5,
                        "pos_y"     : 0,
                        "pos_z"     : 8.1,
                        "asset"     : "SPR_BuildBuyScreen/store_item_frame_blue",
                        "tag"       : "paid_item_clicked",
                        "args"      :
                        {
                            "screen"    : "InGameScreen",
                            "sound"     : "buttonpress.wav",
                            "proto_tags": ["proto_name", "description", "price", "store_image_url", "num_items"]
                        }
                    },
                    {
                        "name"      : "store_item_bg",
                        "scaling"   : "keep_min",
                        "size_x"    : 150,
                        "size_y"    : 100,
                        "pos_x"     : 5,
                        "pos_y"     : -10,
                        "pos_z"     : 8.2,
                        "asset"     : "SPR_BuildBuyScreen/specialItem_zabuton"
                    },
                    {
                        "name"      : "store_item_image",
                        "scaling"   : "keep_min",
                        "size_x"    : 100,
                        "size_y"    : 100,
                        "pos_x"     : 5,
                        "pos_y"     : -10,
                        "pos_z"     : 8.2,
                        "asset"     : "",
                        "tag"       : "proto_image",
                        "args"      :
                        {
                            "store_item"    : true,
                            "proto_tag"     : "store_image_url"
                        }
                    },
                    {
                        "name"      : "store_item_cost",
                        "scaling"   : "keep_min",
                        "size_x"    : 24,
                        "size_y"    : 24,
                        "pos_origin": "r",
                        "pos_x"     : -38,
                        "pos_y"     : 70,
                        "pos_z"     : 8.2,
                        "asset"     : "CommonUI/mobaCoin.png",
                        "asset_ios" : "CommonUI/iOS_Coin.png"
                    }
                ],
            "labels":
                [
                    {
                        "name"      : "store_item_name",
                        "font_size" : 20,
                        "pos_x"     : 5,
                        "pos_y"     : -90,
                        "pos_z"     : 8.6,
                        "size_x"    : 170,
                        "size_y"    : 50,
                        "color_r"   : 255,
                        "color_g"   : 245,
                        "color_b"   : 72,
                        "weight"    : "bold",
                        "text"      : "",
                        "justify"   : "center",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "proto_tag"     : "proto_name"
                        }
                    },
                    {
                        "name"      : "store_item_cost",
                        "font_size" : 15,
                        "pos_origin": "l",
                        "pos_x"     : -35,
                        "pos_y"     : 70,
                        "pos_z"     : 8.2,
                        "size_x"    : 140,
                        "size_y"    : 40,
                        "color_r"   : 255,
                        "color_g"   : 255,
                        "color_b"   : 255,
                        ".wrap"      : "shrink",
                        "text_key"  : "BuyPaidItemMobacoinAmount",
                        "justify"   : "left",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "proto_tag"     : "price_currency"
                        }
                    }
                ]
        },
        "build_buy_select_confirm" :
        {
            "images":
                [
                    {
                        "name"      : "background_catchall",
                        "size_x"    : 3000,
                        "size_y"    : 3000,
                        "pos_x"     : 0,
                        "pos_y"     : 0,
                        "pos_z"     : 9.0,
                        "asset"     : "CommonUI/alpha.png",
                        "tag"       : "close_global_widget"
                    },
                    {
                        "name"      : "popup_background",
                        "size_x"    : 500,
                        "size_y"    : 300,
                        "pos_x"     : 10,
                        "pos_y"     : 0,
                        "pos_z"     : 9.1,
                        "asset"     : "CommonUI/UI_372x232.png"
                    },
                    {
                        "name"      : "popup_header",
                        "size_x"    : 500,
                        "size_y"    : 52,
                        "pos_x"     : 10,
                        "pos_y"     : -124,
                        "pos_z"     : 9.1,
                        "asset"     : "CommonUI/UI_372x232_3.png"
                    },
                    {
                        "name"      : "popup_yes_button",
                        "size_x"    : 130,
                        "size_y"    : 40,
                        "pos_x"     : 100,
                        "pos_y"     : 84,
                        "pos_z"     : 9.2,
                        "asset"     : "CommonUI/BtnGreen_v2.png",
                        "func"      : "yes",
                        "tag"       : "popup_yes_button",
                        "args"      :
                        {
                            "exit_on_tap" : "1",
                            "sound" : "buttonpress.wav"
                        }
                    },
                    {
                        "name"      : "popup_no_button",
                        "size_x"    : 130,
                        "size_y"    : 40,
                        "pos_x"     : -100,
                        "pos_y"     : 84,
                        "pos_z"     : 9.2,
                        "asset"     : "CommonUI/BtnRed_v2.png",
                        "func"      : "no",
                        "tag"       : "popup_no_button",
                        "args"      :
                        {
                            "exit_on_tap" : "1",
                            "sound" : "buttonpress.wav"
                        }
                    },
                    {
                        "name"      : "store_item_image",
                        "scaling"   : "keep_x",
                        "size_x"    : 86,
                        "size_y"    : 86,
                        "pos_x"     : -98,
                        "pos_y"     : -48,
                        "pos_z"     : 9.2,
                        "asset"     : "",
                        "tag"       : "proto_image",
                        "args"      :
                        {
                            "proto_tag"     : "store_image_url"
                        }
                    },
                    {
                        "name"      : "gs_gold",
                        "scaling"   : "keep_x",
                        "size_x"    : 30,
                        "size_y"    : 30,
                        "pos_origin": "lt",
                        "pos_x"     : -142,
                        "pos_y"     : -2,
                        "pos_z"     : 9.2,
                        "asset"     : "CommonUI/A_shared_small_coin_icon.png"
                    },
                    {
                        "name"      : "energy",
                        "scaling"   : "keep_x",
                        "size_x"    : 30,
                        "size_y"    : 30,
                        "pos_origin": "lt",
                        "pos_x"     : -142,
                        "pos_y"     : 28,
                        "pos_z"     : 9.2,
                        "asset"     : "InGameScreen/resIcon_energy.png"
                    }
                ],
            "labels" :
                [
                    {
                        "name"      : "popup_box_label",
                        "font_size" : 24,
                        "pos_x"     : -2,
                        "pos_y"     : -126,
                        "pos_z"     : 80.9,
                        "size_x"    : 460,
                        "size_y"    : 45,
                        "text"      : "",
                        "justify"   : "center",
                        "color_r"   : 255,
                        "color_g"   : 255,
                        "color_b"   : 255,
                        "weight"    : "bold",
                        "tag"       : "popup_label"
                    },
                    {
                        "name"      : "yes_label",
                        "font_size" : 20,
                        "pos_x"     : 100,
                        "pos_y"     : 84,
                        "pos_z"     : 9.9,
                        "size_x"    : 200,
                        "size_y"    : 50,
                        "text"      : "YES",
                        "tag"       : "popup_yes_button",
                        "justify"   : "center",
                        "weight"    : "bold",
                        "color_r"   : 255,
                        "color_g"   : 255,
                        "color_b"   : 255,
                        "color_a"   : 1.0
                    },
                    {
                        "name"      : "no_label",
                        "font_size" : 20,
                        "pos_x"     : -102,
                        "pos_y"     : 84,
                        "pos_z"     : 9.9,
                        "size_x"   : 200,
                        "size_y"    : 50,
                        "text"      : "NO",
                        "weight"    : "bold",
                        "tag"       : "popup_no_button",
                        "justify"   : "center",
                        "color_r"   : 255,
                        "color_g"   : 255,
                        "color_b"   : 255,
                        "color_a"   : 1.0
                    },
                    {
                        "name"      : "store_item_name",
                        "font_size" : 22,
                        "pos_origin": "t",
                        "pos_x"     : 90,
                        "pos_y"     : -92,
                        "pos_z"     : 9.9,
                        "size_x"    : 200,
                        "size_y"    : 40,
                        "color_r"   : 163,
                        "color_g"   : 83,
                        "color_b"   : 24,
                        "weight"    : "bold",
                        "text"      : "",
                        "justify"   : "left",
                        "v_align"   : "middle",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "proto_tag"     : "proto_name"
                        }
                    },
                    {
                        "name"      : "store_item_gold_cost",
                        "font_size" : 16,
                        "pos_origin": "lt",
                        "pos_x"     : -112,
                        "pos_y"     : 4,
                        "pos_z"     : 9.9,
                        "size_x"    : 50,
                        "size_y"    : 25,
                        "text"      : "",
                        "justify"   : "right",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "proto_tag"     : "gold_cost"
                        }
                    },
                    {
                        "name"      : "store_item_energy_cost",
                        "font_size" : 16,
                        "pos_origin": "lt",
                        "pos_x"     : -112,
                        "pos_y"     : 34,
                        "pos_z"     : 9.9,
                        "size_x"    : 50,
                        "size_y"    : 25,
                        "text"      : "",
                        "justify"   : "right",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "proto_tag"     : "energy_cost"
                        }
                    }
                ],
            "composite" :
                [
                    {
                        "name"              : "store_item_info_list",
                        "size_x"            : 200,
                        "size_y"            : 200,
                        "pos_x"             : 40,
                        "pos_y"             : -47,
                        "pos_z"             : 9.9,
                        "controller"        : "store_item_info_list",
                        "controller_args"   :
                        {
                            "item_type"     : "store_item_info",
                            "proto_list"    :
                                [
                                    {
                                        "proto_tag"    : "produce_population",
                                        "pre_text_key" : "Population"
                                    },
                                    {
                                        "proto_tag"    : "produce_cap",
                                        "pre_text_key" : "Payback"
                                    },
                                    {
                                        "proto_tag"    : "xp_reward",
                                        "pre_text_key" : "XP"
                                    },
                                    {
                                        "proto_tag"    : "produce_duration",
                                        "is_duration"  : true,
                                        "pre_text_key" : "ProduceIn"
                                    },
                                    {
                                        "proto_tag"    : "resource_cost",
                                        "pre_text_key" : "ResourceCost"
                                    },
                                    {
                                        "proto_tag"    : "effect_gain",
                                        "is_percent"   : true,
                                        "pre_text_key" : "EffectGain"
                                    },
                                    {
                                        "proto_tag"    : "effect_cap",
                                        "pre_text_key" : "EffectCap"
                                    },
                                    {
                                        "proto_tag"    : "effect_description",
                                        "pre_text_key" : "EffectDescription"
                                    },
                                    {
                                        "proto_tag"    : "effect_infinite",
                                        "is_percent"   : true,
                                        "pre_text_key" : "EffectInfinite"
                                    },
                                    {
                                        "proto_tag"    : "effect_until",
                                        "pre_text_key" : "EffectUntil"
                                    },
                                    {
                                        "proto_tag"    : "effect_since",
                                        "pre_text_key" : "EffectSince"
                                    }
                                ]
                        }
                    }
                ]
        },
        "store_item_info" :
        {
            "labels" :
                [
                    {
                        "name"      : "store_item_info",
                        "font_size" : 13,
                        "pos_origin": "lt",
                        "pos_x"     : -50,
                        "pos_y"     : 0,
                        "pos_z"     : 10.0,
                        "size_x"    : 80,
                        "size_y"    : 24,
                        "text"      : "",
                        "justify"   : "left",
                        "v_align"   : "middle",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "column" : "label",
                            "ignore_pre_text_if_null" : true
                        }
                    },
                    {
                        "name"      : "store_item_info",
                        "font_size" : 13,
                        "pos_origin": "lt",
                        "pos_x"     : 30,
                        "pos_y"     : 0,
                        "pos_z"     : 10.0,
                        "size_x"    : 120,
                        "size_y"    : 24,
                        "text"      : "",
                        "justify"   : "left",
                        "v_align"   : "middle",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "column" : "value",
                            "ignore_pre_text_if_null" : true
                        }
                    },
                    {
                        "name"      : "store_item_info",
                        "font_size" : 13,
                        "pos_origin": "lt",
                        "pos_x"     : -50,
                        "pos_y"     : 0,
                        "pos_z"     : 10.0,
                        "size_x"    : 200,
                        "size_y"    : 24,
                        "text"      : "",
                        "justify"   : "left",
                        "v_align"   : "middle",
                        "tag"       : "proto_text",
                        "args"      :
                        {
                            "column" : "all",
                            "ignore_pre_text_if_null" : true
                        }
                    }
                ]
        },

        "PaidItemContent":
        {
            "images":
                [
                    {
                        "name"      : "paid_item_bg",
                        "size_x"    : 150,
                        "size_y"    : 100,
                        "pos_x"     : -130,
                        "pos_y"     : -40,
                        "pos_z"     : 80.2,
                        "asset"     : "SPR_BuildBuyScreen/specialItem_zabuton"
                    },
                    {
                        "name"      : "paid_item_img",
                        "scaling"   : "keep_y",
                        "size_x"    : 100,
                        "size_y"    : 100,
                        "pos_x"     : -130,
                        "pos_y"     : -40,
                        "pos_z"     : 80.3,
                        "tag"       : "paid_item_image"
                    },
                    {
                        "name"      : "paid_currency_icon",
                        "scaling"   : "keep_min",
                        "size_x"    : 24,
                        "size_y"    : 24,
                        "pos_x"     : -190,
                        "pos_y"     : 30,
                        "pos_z"     : 80.2,
                        "asset"     : "CommonUI/mobaCoin.png",
                        "asset_ios" : "CommonUI/iOS_Coin.png"
                    },
                    {
                        "name"      : "button_tokusho",
                        "size_x"    : 101,
                        "size_y"    : 26,
                        "pos_x"     : 160,
                        "pos_y"     : 30,
                        "pos_z"     : 80.2,
                        "asset"     : "SPR_BuildBuyScreen/button_tokusho",
                        "tag"       : "open_community_function",
                        "args"      :
                        {
                            "path" : "/thisgame/tokushoho"
                        }
                    },
                    {
                        "name"      : "sheet_beige",
                        "size_x"    : 450,
                        "size_y"    : 66,
                        "pos_x"     : 0,
                        "pos_y"     : 84,
                        "pos_z"     : 80.2,
                        "asset"     : "BuildBuyScreen/sheet_beige.png"
                    },
                    {
                        "name"      : "decrease_5_icon",
                        "scaling"   : "keep_min",
                        "size_x"    : 43,
                        "size_y"    : 45,
                        "pos_x"     : -195,
                        "pos_y"     : 84,
                        "pos_z"     : 80.2,
                        "asset"     : "SPR_BuildBuyScreen/button_arrow_backward_5",
                        "tag"       : "change_item_count",
                        "args"      :
                        {
                            "delta" : -5,
                            "sound" : "buttonpress.wav"
                        }
                    },
                    {
                        "name"      : "decrease_icon",
                        "scaling"   : "keep_min",
                        "size_x"    : 43,
                        "size_y"    : 45,
                        "pos_x"     : -145,
                        "pos_y"     : 84,
                        "pos_z"     : 80.2,
                        "asset"     : "SPR_BuildBuyScreen/button_arrow_forward_1",
                        "tag"       : "change_item_count",
                        "flip"      : "x",
                        "args"      :
                        {
                            "delta" : -1,
                            "sound" : "buttonpress.wav"
                        }
                    },
                    {
                        "name"      : "item_quantity_bg",
                        "scaling"   : "keep_min",
                        "size_x"    : 43,
                        "size_y"    : 45,
                        "pos_x"     : -95,
                        "pos_y"     : 84,
                        "pos_z"     : 80.2,
                        "asset"     : "CommonUI/white.png"
                    },
                    {
                        "name"      : "increase_icon",
                        "scaling"   : "keep_min",
                        "size_x"    : 43,
                        "size_y"    : 45,
                        "pos_x"     : -45,
                        "pos_y"     : 84,
                        "pos_z"     : 80.2,
                        "asset"     : "SPR_BuildBuyScreen/button_arrow_forward_1",
                        "tag"       : "change_item_count",
                        "args"      :
                        {
                            "delta" : 1,
                            "sound" : "buttonpress.wav"
                        }
                    },
                    {
                        "name"      : "increase_5_icon",
                        "scaling"   : "keep_min",
                        "size_x"    : 43,
                        "size_y"    : 45,
                        "pos_x"     : 5,
                        "pos_y"     : 84,
                        "pos_z"     : 80.2,
                        "asset"     : "SPR_BuildBuyScreen/button_arrow_forward_5",
                        "tag"       : "change_item_count",
                        "args"      :
                        {
                            "delta" : 5,
                            "sound" : "buttonpress.wav"
                        }
                    },
                    {
                        "name"      : "confirm_yes_button",
                        "size_x"    : 180,
                        "size_y"    : 40,
                        "pos_x"     : 125,
                        "pos_y"     : 84,
                        "pos_z"     : 80.2,
                        "asset"     : "CommonUI/BtnGreen_v2.png",
                        "func"      : "buy",
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
                        "name"      : "paid_item_title",
                        "font_size" : 18,
                        "pos_origin": "l",
                        "pos_x"     : -35,
                        "pos_y"     : -75,
                        "pos_z"     : 80.9,
                        "size_x"    : 250,
                        "size_y"    : 40,
                        "color_r"   : 163,
                        "color_g"   : 83,
                        "color_b"   : 24,
                        "weight"    : "bold",
                        "justify"   : "left",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "paid_item_desc",
                        "font_size" : 14,
                        "pos_origin": "l",
                        "pos_x"     : -35,
                        "pos_y"     : -25,
                        "pos_z"     : 80.9,
                        "size_x"    : 250,
                        "size_y"    : 80,
                        "color_r"   : 0,
                        "color_g"   : 0,
                        "color_b"   : 0,
                        "weight"    : "bold",
                        "justify"   : "left",
                        "wrap"      : "newline",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "paid_item_cost",
                        "font_size" : 16,
                        "pos_origin": "l",
                        "pos_x"     : -170,
                        "pos_y"     : 30,
                        "pos_z"     : 80.9,
                        "size_x"    : 200,
                        "size_y"    : 50,
                        "color_r"   : 0,
                        "color_g"   : 0,
                        "color_b"   : 0,
                        "weight"    : "bold",
                        "justify"   : "left",
                        "text_key"  : "BuyPaidItemMobacoinAmount",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "paid_item_quantity",
                        "font_size" : 20,
                        "pos_x"     : -95,
                        "pos_y"     : 84,
                        "pos_z"     : 80.9,
                        "size_x"    : 43,
                        "size_y"    : 45,
                        "color_r"   : 0,
                        "color_g"   : 0,
                        "color_b"   : 0,
                        "weight"    : "bold",
                        "justify"   : "center",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "quantity_label",
                        "font_size" : 12,
                        "pos_origin": "r",
                        "pos_x"     : -75,
                        "pos_y"     : 102,
                        "pos_z"     : 80.9,
                        "size_x"    : 100,
                        "size_y"    : 45,
                        "color_r"   : 0,
                        "color_g"   : 0,
                        "color_b"   : 0,
                        "weight"    : "bold",
                        "justify"   : "right",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "confirm_ok",
                        "font_size" : 18,
                        "pos_x"     : 125,
                        "pos_y"     : 84,
                        "pos_z"     : 80.9,
                        "size_x"    : 180,
                        "size_y"    : 50,
                        "color_r"   : 255,
                        "color_g"   : 255,
                        "color_b"   : 255,
                        "weight"    : "bold",
                        "justify"   : "center",
                        "text_key"  : "BuyPaidItemMobacoinButton",
                        "tag"       : "label_value"
                    }
                ]
        },
        "PaidItemResultContent":
        {
            "images":
                [
                    {
                        "name"      : "paid_item_bg",
                        "size_x"    : 120,
                        "size_y"    : 80,
                        "pos_x"     : -110,
                        "pos_y"     : -50,
                        "pos_z"     : 80.2,
                        "asset"     : "SPR_BuildBuyScreen/specialItem_zabuton"
                    },
                    {
                        "name"      : "paid_item_img",
                        "scaling"   : "keep_y",
                        "size_x"    : 80,
                        "size_y"    : 80,
                        "pos_x"     : -110,
                        "pos_y"     : -50,
                        "pos_z"     : 80.3,
                        "tag"       : "paid_item_image"
                    },
                    {
                        "name"      : "from_to_arrow",
                        "size_x"    : 23,
                        "size_y"    : 25,
                        "pos_x"     : 50,
                        "pos_y"     : 10,
                        "pos_z"     : 80.3,
                        "asset"     : "CommonUI/arrow_brown.png"
                    }
                ],
            "labels":
                [
                    {
                        "name"      : "buy_paid_item_result_desc",
                        "font_size" : 14,
                        "pos_origin": "l",
                        "pos_x"     : -20,
                        "pos_y"     : -50,
                        "pos_z"     : 80.9,
                        "size_x"    : 220,
                        "size_y"    : 120,
                        "color_r"   : 0,
                        "color_g"   : 0,
                        "color_b"   : 0,
                        "weight"    : "bold",
                        "wrap"      : "newline",
                        "justify"   : "left",
                        "text_key"  : "BuyPaidItemResultDesc",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "buy_paid_item_result_count_label",
                        "font_size" : 16,
                        "pos_origin": "l",
                        "pos_x"     : -150,
                        "pos_y"     : 10,
                        "pos_z"     : 80.9,
                        "size_x"    : 300,
                        "size_y"    : 50,
                        "color_r"   : 196,
                        "color_g"   : 110,
                        "color_b"   : 53,
                        "weight"    : "bold",
                        "justify"   : "left",
                        "text_key"  : "BuyPaidItemResultCount"
                    },
                    {
                        "name"      : "buy_paid_item_result_count_from",
                        "font_size" : 16,
                        "pos_origin": "l",
                        "pos_x"     : 0,
                        "pos_y"     : 10,
                        "pos_z"     : 80.9,
                        "size_x"    : 100,
                        "size_y"    : 50,
                        "color_r"   : 0,
                        "color_g"   : 0,
                        "color_b"   : 0,
                        "weight"    : "bold",
                        "justify"   : "left",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "buy_paid_item_result_count_to",
                        "font_size" : 16,
                        "pos_origin": "l",
                        "pos_x"     : 80,
                        "pos_y"     : 10,
                        "pos_z"     : 80.9,
                        "size_x"    : 100,
                        "size_y"    : 50,
                        "color_r"   : 0,
                        "color_g"   : 0,
                        "color_b"   : 0,
                        "weight"    : "bold",
                        "justify"   : "left",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "buy_paid_item_result_used_label",
                        "font_size" : 16,
                        "pos_origin": "l",
                        "pos_x"     : -150,
                        "pos_y"     : 40,
                        "pos_z"     : 80.9,
                        "size_x"    : 300,
                        "size_y"    : 50,
                        "color_r"   : 196,
                        "color_g"   : 110,
                        "color_b"   : 53,
                        "weight"    : "bold",
                        "justify"   : "left",
                        "text_key"  : "MobacoinLabel",
                        "tag"       : "label_value"
                    },
                    {
                        "name"      : "buy_paid_item_result_used",
                        "font_size" : 16,
                        "pos_origin": "l",
                        "pos_x"     : 0,
                        "pos_y"     : 40,
                        "pos_z"     : 80.9,
                        "size_x"    : 300,
                        "size_y"    : 50,
                        "color_r"   : 0,
                        "color_g"   : 0,
                        "color_b"   : 0,
                        "weight"    : "bold",
                        "justify"   : "left",
                        "text_key"  : "BuyPaidItemResultUsed",
                        "tag"       : "label_value"
                    }
                ]
        },
		"SellItemContent":
         {
            "images":
                    [
                        {
                            "name"      : "sheet_beige",
                            "size_x"    : 262,
                            "size_y"    : 66,
                            "pos_x"     : -10,
                            "pos_y"     : -40,
                            "pos_z"     : 80.2,
                            "asset"     : "BuildBuyScreen/sheet_beige.png"
                        },
                        {
                            "name"      : "decrease_5_icon",
                            "scaling"   : "keep_min",
                            "size_x"    : 43,
                            "size_y"    : 45,
                            "pos_x"     : -109,
                            "pos_y"     : -40,
                            "pos_z"     : 80.2,
                            "asset"     : "SPR_BuildBuyScreen/button_arrow_backward_5",
                            "tag"       : "change_item_count",
                            "args"      :
                            {
                                "delta" : -5,
                                "sound" : "buttonpress.wav"
                            }
                        },
                        {
                            "name"      : "decrease_icon",
                            "scaling"   : "keep_min",
                            "size_x"    : 43,
                            "size_y"    : 45,
                            "pos_x"     : -59,
                            "pos_y"     : -40,
                            "pos_z"     : 80.2,
                            "asset"     : "SPR_BuildBuyScreen/button_arrow_forward_1",
                            "tag"       : "change_item_count",
                            "flip"      : "x",
                            "args"      :
                            {
                                "delta" : -1,
                                "sound" : "buttonpress.wav"
                            }
                        },
                        {
                            "name"      : "item_quantity_bg",
                            "scaling"   : "keep_min",
                            "size_x"    : 43,
                            "size_y"    : 45,
                            "pos_x"     : -9,
                            "pos_y"     : -40,
                            "pos_z"     : 80.2,
                            "asset"     : "CommonUI/white.png"
                        },
                        {
                            "name"      : "increase_icon",
                            "scaling"   : "keep_min",
                            "size_x"    : 43,
                            "size_y"    : 45,
                            "pos_x"     : 41,
                            "pos_y"     : -40,
                            "pos_z"     : 80.2,
                            "asset"     : "SPR_BuildBuyScreen/button_arrow_forward_1",
                            "tag"       : "change_item_count",
                            "args"      :
                            {
                                "delta" : 1,
                                "sound" : "buttonpress.wav"
                            }
                        },
                        {
                            "name"      : "increase_5_icon",
                            "scaling"   : "keep_min",
                            "size_x"    : 43,
                            "size_y"    : 45,
                            "pos_x"     : 91,
                            "pos_y"     : -40,
                            "pos_z"     : 80.2,
                            "asset"     : "SPR_BuildBuyScreen/button_arrow_forward_5",
                            "tag"       : "change_item_count",
                            "args"      :
                            {
                                "delta" : 5,
                                "sound" : "buttonpress.wav"
                            }
                        },
                        {
                            "name"      : "popup_yes_button",
                            "size_x"    : 130,
                            "size_y"    : 40,
                            "pos_x"     : 100,
                            "pos_y"     : 84,
                            "pos_z"     : 9.2,
                            "asset"     : "CommonUI/BtnGreen_v2.png",
                            "func"      : "yes",
                            "tag"       : "popup_yes_button",
                            "args"      :
                            {
                                "exit_on_tap" : "1",
                                "sound" : "buttonpress.wav"
                            }
                        },
                        {
                            "name"      : "popup_no_button",
                            "size_x"    : 130,
                            "size_y"    : 40,
                            "pos_x"     : -100,
                            "pos_y"     : 84,
                            "pos_z"     : 9.2,
                            "asset"     : "CommonUI/BtnRed_v2.png",
                            "func"      : "no",
                            "tag"       : "popup_no_button",
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
                            "name"      : "sell_item_title",
                            "font_size" : 18,
                            "pos_origin": "l",
                            "pos_x"     : -35,
                            "pos_y"     : -75,
                            "pos_z"     : 80.9,
                            "size_x"    : 250,
                            "size_y"    : 40,
                            "color_r"   : 163,
                            "color_g"   : 83,
                            "color_b"   : 24,
                            "weight"    : "bold",
                            "justify"   : "left",
                            "text"      : "你要买东西吗？"
                        },
                        {
                            "name"      : "sell_desc",
                            "font_size" : 14,
                            "pos_origin": "l",
                            "pos_x"     : -35,
                            "pos_y"     : -25,
                            "pos_z"     : 80.9,
                            "size_x"    : 250,
                            "size_y"    : 80,
                            "color_r"   : 0,
                            "color_g"   : 0,
                            "color_b"   : 0,
                            "weight"    : "bold",
                            "justify"   : "left",
                            "wrap"      : "newline",
                            "text"      : "总价格"
                        },
                        {
                            "name"      : "sell_price",
                            "font_size" : 16,
                            "pos_origin": "l",
                            "pos_x"     : -170,
                            "pos_y"     : 30,
                            "pos_z"     : 80.9,
                            "size_x"    : 200,
                            "size_y"    : 50,
                            "color_r"   : 0,
                            "color_g"   : 0,
                            "color_b"   : 0,
                            "weight"    : "bold",
                            "justify"   : "left",
                            "text"      : "12"
                        },
                        {
                            "name"      : "quantity_label",
                            "font_size" : 12,
                            "pos_origin": "r",
                            "pos_x"     : 11,
                            "pos_y"     : -22,
                            "pos_z"     : 80.9,
                            "size_x"    : 100,
                            "size_y"    : 45,
                            "color_r"   : 0,
                            "color_g"   : 0,
                            "color_b"   : 0,
                            "weight"    : "bold",
                            "justify"   : "right",
                            "text"      : "1"
                        },
                        {
                            "name"      : "yes_label",
                            "font_size" : 20,
                            "pos_x"     : 100,
                            "pos_y"     : 84,
                            "pos_z"     : 9.9,
                            "size_x"    : 200,
                            "size_y"    : 50,
                            "text"      : "YES",
                            "tag"       : "popup_yes_button",
                            "justify"   : "center",
                            "weight"    : "bold",
                            "color_r"   : 255,
                            "color_g"   : 255,
                            "color_b"   : 255,
                            "color_a"   : 1.0
                        },
                        {
                            "name"      : "no_label",
                            "font_size" : 20,
                            "pos_x"     : -102,
                            "pos_y"     : 84,
                            "pos_z"     : 9.9,
                            "size_x"   : 200,
                            "size_y"    : 50,
                            "text"      : "NO",
                            "weight"    : "bold",
                            "tag"       : "popup_no_button",
                            "justify"   : "center",
                            "color_r"   : 255,
                            "color_g"   : 255,
                            "color_b"   : 255,
                            "color_a"   : 1.0
                        }
                    ]
        }
    }
}