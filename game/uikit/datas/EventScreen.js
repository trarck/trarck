var data={
    "EventScreen" :
    {
        "components" :
        [
             {
                 "name"      : "event_content_view",
                 "className" : "WeEventWebView",
                 "args"      :
                 {
                     "depth" : 9.0,
                     "view_name" : "top",
                     "frame" : [ 0, 0, 854, 480 ]
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
        "EventContent":
        {
            "images" :
            [
                {
                    "name"      : "popup_background",
                    "size_x"    : 727,
                    "size_y"    : 428,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "SPR_Dwarf/dwf_common_woodPlate"
                },
                {
                    "name"      : "popup_header",
                    "size_x"    : 0,
                    "size_y"    : 0,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "CommonUI/alpha.png"
                },
                {
                    "name"      : "close_button",
                    "scaling"   : "keep_min",
                    "size_x"    : 42,
                    "size_y"    : 42,
                    "pos_x"     : 345,
                    "pos_y"     : -197,
                    "pos_z"     : 80.3,
                    "asset"     : "CommonUI/A_shared_mojostore_exit_btn.png",
                    "thru_restriction" : true,
                    "func"      : "close",
                    "tag"       : "close_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "title_image",
                    "scaling"   : "keep_min",
                    "size_x"    : 343,
                    "size_y"    : 27,
                    "pos_x"     : 98,
                    "pos_y"     : -181,
                    "pos_z"     : 80.2,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "title_line_top",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -204,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_common_line"
                },
                {
                    "name"      : "title_line_bottom",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -160,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_common_line"
                }
            ]
        },
        "EncounterContent":
        {
            "images" :
            [
                {
                    "name"      : "event_target_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 142,
                    "size_y"    : 175,
                    "pos_x"     : -237,
                    "pos_y"     : -89,
                    "pos_z"     : 80.3,
                    "asset"     : "SPR_Dwarf/dwf_nego_dwf"
                },
				{
					"name"		: "ribbon",
					"scaling"	: "keep_min",
					"size_x"	: 220,
					"size_y"	: 120,
					"pos_x"		: -280,
					"pos_y"		: -175,
					"pos_z"		: 80.4,
					"asset"		: "Dwarf/special_encounter_ribbon.png",
					"tag"		: "special_dwarf_ribbon",
					"is_hidden" : true
				},
                {
                    "name"      : "event_target_info_underlay",
                    "scaling"   : "keep_min",
                    "size_x"    : 251,
                    "size_y"    : 71,
                    "pos_x"     : -245,
                    "pos_y"     : 23,
                    "pos_z"     : 80.3,
                    "asset"     : "SPR_Dwarf/dwf_nego_pnl_dwfstt"
                },
                {
                    "name"      : "desc_bg",
                    "size_x"    : 662,
                    "size_y"    : 166,
                    "pos_x"     : 0,
                    "pos_y"     : -70,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_nego_waku"
                },
                {
                    "name"      : "avatar_bg",
                    "size_x"    : 333,
                    "size_y"    : 56,
                    "pos_x"     : 95,
                    "pos_y"     : -30,
                    "pos_z"     : 80.3,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "ps_avatar",
                    "scaling"   : "keep_min",
                    "size_x"    : 50,
                    "size_y"    : 50,
                    "pos_origin": "r",
                    "pos_x"     : -5,
                    "pos_y"     : -30,
                    "pos_z"     : 80.5,
                    "tag"       : "avatar_image"
                },
                {
                    "name"      : "subtitle_img",
                    "scaling"   : "keep_min",
                    "size_x"    : 120,
                    "size_y"    : 24,
                    "pos_x"     : 0,
                    "pos_y"     : 31,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_nego_subtitle"
                },
                {
                    "name"      : "paid_option_img",
                    "scaling"   : "keep_y",
                    "size_x"    : 166,
                    "size_y"    : 140,
                    "pos_x"     : 232,
                    "pos_y"     : 120,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_nego_item_03"
                },
                {
                    "name"      : "free_option_img",
                    "scaling"   : "keep_y",
                    "size_x"    : 166,
                    "size_y"    : 140,
                    "pos_x"     : 0,
                    "pos_y"     : 120,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_nego_item_02"
                },
                {
                    "name"      : "do_nothing_img",
                    "scaling"   : "keep_y",
                    "size_x"    : 166,
                    "size_y"    : 140,
                    "pos_x"     : -232,
                    "pos_y"     : 120,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_nego_item_01"
                },
                {
                    "name"      : "paid_option_button",
                    "scaling"   : "keep_y",
                    "size_x"    : 146,
                    "size_y"    : 34,
                    "pos_x"     : 232,
                    "pos_y"     : 165,
                    "pos_z"     : 80.3,
                    "asset"     : "CommonUI/BtnGreen_v2.png",
                    "func"      : "doPaidOption",
                    "tag"       : "confirm_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "free_option_button",
                    "scaling"   : "keep_y",
                    "size_x"    : 146,
                    "size_y"    : 34,
                    "pos_x"     : 0,
                    "pos_y"     : 165,
                    "pos_z"     : 80.3,
                    "asset"     : "CommonUI/BtnGreen_v2.png",
                    "func"      : "doFreeOption",
                    "tag"       : "confirm_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "do_nothing_button",
                    "scaling"   : "keep_y",
                    "size_x"    : 146,
                    "size_y"    : 34,
                    "pos_x"     : -232,
                    "pos_y"     : 165,
                    "pos_z"     : 80.3,
                    "asset"     : "CommonUI/BtnRed_v2.png",
                    "func"      : "doNothing",
                    "tag"       : "confirm_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "gold_icon",
                    "scaling"   : "keep_y",
                    "size_x"    : 25,
                    "size_y"    : 25,
                    "pos_x"     : -46,
                    "pos_y"     : 200,
                    "pos_z"     : 80.2,
                    "asset"     : "CommonUI/A_shared_small_coin_icon.png"
                },
                {
                    "name"      : "energy_icon",
                    "scaling"   : "keep_y",
                    "size_x"    : 25,
                    "size_y"    : 25,
                    "pos_x"     : 29,
                    "pos_y"     : 200,
                    "pos_z"     : 80.2,
                    "asset"     : "InGameScreen/resIcon_energy.png"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "encounter_desc",
                    "font_size" : 14,
                    "size_x"    : 420,
                    "size_y"    : 90,
                    "pos_x"     : 95,
                    "pos_y"     : -100,
                    "pos_z"     : 80.9,
                    "justify"   : "left",
                    "color_r"   : 29,
                    "color_g"   : 29,
                    "color_b"   : 29,
                    "color_a"   : 1.0,
                    "wrap"      : "newline",
                    "line_len"  : 40,
                    "tag"       : "label_value"
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
                    "color_r"   : 140,
                    "color_g"   : 92,
                    "color_b"   : 57,
                    "color_a"   : 1.0,
                    "justify"   : "left",
                    "tag"       : "avatar_text"
                },
                {
                    "name"      : "reserved_num",
                    "font_size" : 14,
                    "size_x"    : 173,
                    "size_y"    : 40,
                    "pos_origin": "b",
                    "pos_x"     : -234,
                    "pos_y"     : 17,
                    "pos_z"     : 80.4,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "center",
                    "v_align"   : "bottom",
                    "text_key"  : "DwarfEncounterReservedNum",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "product_gradeup_num",
                    "font_size" : 14,
                    "size_x"    : 173,
                    "size_y"    : 40,
                    "pos_origin": "t",
                    "pos_x"     : -234,
                    "pos_y"     : 17,
                    "pos_z"     : 80.4,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "justify"   : "center",
                    "v_align"   : "top",
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
                    "text_key"  : "DwarfEncounterPaidButton"
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
                    "text_key"  : "DwarfEncounterFreeButton"
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
                    "text_key"  : "DwarfEncounterDoNothingButton"
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
                    "tag"       : "label_value"
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
                    "tag"       : "label_value"
                }
            ]
        },
        "EventResultContent":
        {
            "images":
            [
                {
                    "name"      : "title_image",
                    "scaling"   : "keep_min",
                    "size_x"    : 290,
                    "size_y"    : 27,
                    "pos_origin": "r",
                    "pos_x"     : 300,
                    "pos_y"     : -181,
                    "pos_z"     : 80.3,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "result_waku",
                    "size_x"    : 662,
                    "size_y"    : 226,
                    "pos_x"     : 0,
                    "pos_y"     : -39,
                    "pos_z"     : 80.3,
                    "asset"     : "SPR_Dwarf/dwf_result_waku"
                },
                {
                    "name"      : "result_image",
                    "scaling"   : "keep_x",
                    "size_x"    : 303,
                    "size_y"    : 227,
                    "pos_x"     : -145,
                    "pos_y"     : -44,
                    "pos_z"     : 80.4,
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
                    "asset"     : "SPR_Dwarf/dwf_result_pnl_num"
                },
                {
                    "name"      : "event_target_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 42,
                    "size_y"    : 42,
                    "pos_x"     : 279,
                    "pos_y"     : 89,
                    "pos_z"     : 80.6,
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
                    "pos_y"     : -40,
                    "pos_z"     : 80.9,
                    "text"      : "",
                    "justify"   : "left",
                    "color_r"   : 48,
                    "color_g"   : 26,
                    "color_b"   : 3,
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
                    "pos_x"     : 258,
                    "pos_y"     : 94,
                    "pos_z"     : 80.9,
                    "justify"   : "right",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "text_key"  : "DwarfReservedCountLabel"
                },
                {
                    "name"      : "reserved_count",
                    "font_size" : 16,
                    "size_x"    : 200,
                    "size_y"    : 40,
                    "pos_origin": "l",
                    "pos_x"     : 300,
                    "pos_y"     : 94,
                    "pos_z"     : 80.9,
                    "justify"   : "left",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "text_key"  : "CountLabel",
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
                    "tag"       : "label_value"
                }
            ]
        },
        "DwarfReserveSuccessContent":
        {
			"images":
			[
				{
					"name"		: "success_ribbon",
					"scaling"	: "keep_min",
					"size_x"	: 220,
					"size_y"	: 120,
					"pos_x"		: -280,
					"pos_y"		: -175,
					"pos_z"		: 80.4,
					"asset"		: "Dwarf/special_success_ribbon.png",
					"tag"		: "special_dwarf_ribbon",
					"is_hidden" : true
				}
			],
            "sound": "dwarf_reserve_success.mp3"
        },
        "DwarfReserveFailContent":
        {
            "sound": "dwarf_reserve_failed.mp3"
        },
        "DwarfReserveDoNothingContent":
        {
            "sound": "dwarf_reserve_do_nothing.mp3"
        },
        "DwarfTransferSuccessContent":
        {
            "sound": "crowd_happy_1.mp3"
        },
        "DwarfTransferFailContent":
        {
            "sound": "crowd_sad_1.mp3"
        },
        "EventReserveSuccessContent":
        {
            "sound": "dwarf_reserve_success.mp3"
        },
        "StepCompleteContent":
        {
            "sound": "dwarf_reserve_success.mp3"
        },
        "EventReserveFailContent":
        {
            "sound": "dwarf_reserve_failed.mp3"
        },
        "EventReserveDoNothingContent":
        {
            "sound": "dwarf_reserve_do_nothing.mp3"
        },
        "EventTransferSuccessContent":
        {
            "sound": "crowd_happy_1.mp3"
        },
        "EventTransferMutationSuccessContent":
        {
            "sound": "crowd_happy_1.mp3"
        },
        "EventTransferFailContent":
        {
            "sound": "crowd_sad_1.mp3"
        },
        "EventMutationContent":
        {
            "sound": "mutation.mp3"
        },
        "FriendSelectionContent":
        {
            "images":
            [
                {
                    "name"      : "popup_background",
                    "size_x"    : 652,
                    "size_y"    : 435,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "SPR_Dwarf/dwf_send_woodPlate_c"
                },
                {
                    "name"      : "popup_bg_l",
                    "size_x"    : 101,
                    "size_y"    : 435,
                    "pos_x"     : -376,
                    "pos_y"     : 0,
                    "pos_z"     : 90.1,
                    "asset"     : "SPR_Dwarf/dwf_send_woodPlate_l"
                },
                {
                    "name"      : "popup_bg_r",
                    "size_x"    : 101,
                    "size_y"    : 435,
                    "pos_x"     : 376,
                    "pos_y"     : 0,
                    "pos_z"     : 90.1,
                    "asset"     : "SPR_Dwarf/dwf_send_woodPlate_r"
                },
                {
                    "name"      : "close_button",
                    "scaling"   : "keep_min",
                    "size_x"    : 42,
                    "size_y"    : 42,
                    "pos_x"     : 381,
                    "pos_y"     : -197,
                    "pos_z"     : 90.2,
                    "asset"     : "CommonUI/A_shared_mojostore_exit_btn.png",
                    "thru_restriction" : true,
                    "func"      : "close",
                    "tag"       : "close_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "desc_bg",
                    "size_x"    : 647,
                    "size_y"    : 68,
                    "pos_x"     : 0,
                    "pos_y"     : -113,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_send_waku_top"
                },
                {
                    "name"      : "composite_bg",
                    "scaling"   : "keep_y",
                    "size_x"    : 651,
                    "size_y"    : 238,
                    "pos_x"     : 0,
                    "pos_y"     : 65,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_Dwarf/dwf_send_waku_under"
                }
            ],
            "labels":
            [
                {
                    "name"      : "friend_selection_desc",
                    "font_size" : 14,
                    "pos_x"     : 0,
                    "pos_y"     : -113,
                    "pos_z"     : 80.9,
                    "size_x"    : 600,
                    "size_y"    : 68,
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "wrap"      : "newline",
                    "justify"   : "left",
                    "text_key"  : "DwarfFriendSelectionDesc"
                },
                {
                    "name"      : "loading_text",
                    "font_size" : 20,
                    "pos_x"     : 0,
                    "pos_y"     : 62,
                    "pos_z"     : 80.9,
                    "size_x"    : 651,
                    "size_y"    : 238,
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
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
                        "item_type"         : "friend_selection_item",
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
        "friend_selection_item":
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
                    "tag"       : "simple_image"
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
                    "color_r"   : 133,
                    "color_g"   : 90,
                    "color_b"   : 45,
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
                    "color_r"   : 133,
                    "color_g"   : 90,
                    "color_b"   : 45,
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
                    "color_r"   : 133,
                    "color_g"   : 90,
                    "color_b"   : 45,
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
        "EventContent_base":
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
                    "asset"     : "Event/Common/eve_limited.png"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 727,
                    "size_y"    : 428,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "Event/Common/eve_common_woodPlate.png"
                },
                {
                    "name"      : "title_line_top",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -204,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/Common/eve_common_line.png"
                },
                {
                    "name"      : "title_line_bottom",
                    "scaling"   : "keep_min",
                    "size_x"    : 705,
                    "size_y"    : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -160,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/Common/eve_common_line.png"
                }
            ]
        },
        "FriendSelectionContent_base":
        {
            "images":
            [
                {
                    "name"      : "popup_background",
                    "size_x"    : 652,
                    "size_y"    : 435,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 80.1,
                    "asset"     : "Event/Common/eve_send_woodPlate_c.png"
                },
                {
                    "name"      : "popup_bg_l",
                    "size_x"    : 101,
                    "size_y"    : 435,
                    "pos_x"     : -376,
                    "pos_y"     : 0,
                    "pos_z"     : 90.1,
                    "asset"     : "Event/Common/eve_send_woodPlate_l.png"
                },
                {
                    "name"      : "popup_bg_r",
                    "size_x"    : 101,
                    "size_y"    : 435,
                    "pos_x"     : 376,
                    "pos_y"     : 0,
                    "pos_z"     : 90.1,
                    "asset"     : "Event/Common/eve_send_woodPlate_r.png"
                },
                {
                    "name"      : "desc_bg",
                    "size_x"    : 647,
                    "size_y"    : 68,
                    "pos_x"     : 0,
                    "pos_y"     : -113,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/Common/eve_send_waku_top.png"
                },
                {
                    "name"      : "composite_bg",
                    "scaling"   : "keep_y",
                    "size_x"    : 651,
                    "size_y"    : 238,
                    "pos_x"     : 0,
                    "pos_y"     : 65,
                    "pos_z"     : 80.2,
                    "asset"     : "Event/Common/eve_send_waku_under.png"
                }
            ]
        }
    }
}
