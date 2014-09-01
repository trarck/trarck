var dataAll={
    "InGameScreen":
    {
        "controllerName" : "InGameScreenController",
        "images":
        [
            {
                 "name"      : "rs_background",
                 "size_x"    : 1,
                 "size_y"    : 1,
                 "pos_origin": "lt",
                 "pos_x"     : 0,
                 "pos_y"     : 0,
                 "pos_z"     : 7.1,
                 "hide_idle" : true,
                 "tag"       : "display_player_hud"
             },
            {
                "name"      : "bb_background",
                "scaling"   : "keep_y",
                "size_x"    : 97.5,
                "size_y"    : 97.5,
                "pos_x"     : 854,
                "pos_y"     : 480,
                "pos_z"     : 7.1,
                "pos_origin": "rb",
                "asset"     : "InGameScreen/A_shared_build_icon.png",
                "hide_idle" : true,
                "tag"       : "slow_goto_screen",
                "args"      :
                {
                    "screen" : "BuildBuyScreen",
                    "sound"  : "buttonpress.wav"
                }
            },
            {
                "name"      : "bb_background_catchall",
                "size_x"    : 97.5,
                "size_y"    : 97.5,
                "pos_x"     : 854,
                "pos_y"     : 480,
                "pos_z"     : 7.0,
                "asset"     : "CommonUI/alpha.png",
                "hide_idle" : true,
                "tag"       : "empty_touch"
            },
            {
                "name"      : "test_bnner_aaaa",
                "size_x"    : 100,
                "size_y"    : 300,
                "pos_x"     : 20,
                "pos_y"     : 80,
                "pos_z"     : 7.0,
                "pos_origin": "lt",
                "asset"     : "CommonUI/black.png",
                "hide_idle" : true,
                "tag"       : "empty_touch"
            },
            {
                "name"      : "sm_foreground",
                "scaling"   : "keep_y",
                "size_x"    : 97.5,
                "size_y"    : 97.5,
                "pos_x"     : 0,
                "pos_y"     : 480,
                "pos_z"     : 7.1,
                "pos_origin": "lb",
                "hide_idle" : true,
                "asset"     : "InGameScreen/A_shared_social_icon.png",
                "tag"       : "goto_screen_social_map",
                "args"      :
                {
                    "sound" : "buttonpress.wav"
                }
            },
            {
                "name"      : "feed_button",
                "scaling"   : "keep_y",
                "size_x"    : 97.5,
                "size_y"    : 97.5,
                "pos_x"     : 120,
                "pos_y"     : 480,
                "pos_z"     : 7.1,
                "pos_origin": "lb",
                "hide_idle" : true,
                "asset"     : "FeedScreen/feed_icon.png",
                "tag"       : "goto_screen",
                "args"      :
                {
                    "screen" : "FeedScreen",
                    "sound" : "buttonpress.wav"
                }
            },
            {
                "name"      : "test_button",
                "scaling"   : "keep_y",
                "size_x"    : 97.5,
                "size_y"    : 97.5,
                "pos_x"     : 220,
                "pos_y"     : 480,
                "pos_z"     : 7.1,
                "pos_origin": "lb",
                "hide_idle" : true,
                "asset"     : "FeedScreen/feed_icon.png",
                "args"      :
                {
                    "screen" : "FeedScreen",
                    "sound" : "buttonpress.wav"
                }
            },
            {
                "name"      : "sm_foreground_catchall",
                "size_x"    : 97.5,
                "size_y"    : 97.5,
                "pos_x"     : 0,
                "pos_y"     : 480,
                "pos_z"     : 7.0,
                "hide_idle" : true,
                "asset"     : "CommonUI/alpha.png",
                "tag"       : "empty_touch"
            },
            {
                "name"      : "debug_foreground",
                "scaling"   : "keep_y",
                "size_x"    : 64,
                "size_y"    : 42,
                "pos_x"     : 25,
                "pos_y"     : 375,
                "pos_z"     : 7.1,
                "pos_origin": "lb",
                "hide_idle" : true,
                "thru_restriction" : true,
                "asset"     : "CommonUI/debug.png",
                "debugOnly" : true
            },
            {
                "name"      : "rf_foreground_catchall",
                "size_x"    : 111,
                "size_y"    : 111,
                "pos_x"     : 53,
                "pos_y"     : 336,
                "pos_z"     : 7.0,
                "hide_idle" : true,
                "asset"     : "CommonUI/alpha.png",
                "tag"       : "empty_touch"
            },
            {
                "name"      : "obj_foreground",
                "scaling"   : "keep_x",
                "size_x"    : 84,
                "size_y"    : 126,
                "pos_x"     : 104,
                "pos_y"     : 470,
                "pos_z"     : 7.1,
                "pos_origin": "lb",
                "hide_idle" : true,
                "thru_restriction" : true,
                "asset"     : "InGameScreen/BtnObjective.png",
                "tag"       : "goto_screen",
                "args"      :
                {
                    "screen" : "ObjectiveScreen",
                    "enabledTest" : "HasObjectives"
                }
            },
            {
                "name"      : "gs_background",
                "size_x"    : 138.8,
                "size_y"    : 39.75,
                "pos_origin": "rt",
                "pos_x"     : 854,
                "pos_y"     : 0,
                "pos_z"     : 7.2,
                "hide_idle" : true,
                "asset"     : "SPR_InGameScreen/money_base"
            },
            {
                "name"      : "gs_background_catchall",
                "size_x"    : 177,
                "size_y"    : 125,
                "pos_x"     : 780,
                "pos_y"     : 66,
                "pos_z"     : 7.0,
                "hide_idle" : true,
                "asset"     : "CommonUI/alpha.png",
                "tag"       : "empty_touch"
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
                "hide_idle" : true,
                "asset"     : "CommonUI/A_shared_small_coin_icon.png"
            },
            {
                "name"      : "rd_background",
                "scaling"   : "keep_y",
                "size_x"    : 38.3,
                "size_y"    : 39.8,
                "pos_origin": "rt",
                "pos_x"     : 767.7,
                "pos_y"     : 43.5,
                "pos_z"     : 7.1,
                "hide_idle" : true,
                "asset"     : "CommonUI/edit.png",
                "tag"       : "goto_screen",
                "args"      :
                {
                    "screen" : "RedesignScreen",
                    "enabledTest" : "MeetsLevelReq",
                    "sound" : "buttonpress.wav"
                }
            },
            {
                "name"      : "open_guidance",
                "scaling"   : "keep_y",
                "size_x"    : 38.3,
                "size_y"    : 39.8,
                "pos_origin": "rt",
                "pos_x"     : 845.1,
                "pos_y"     : 43.5,
                "pos_z"     : 7.1,
                "hide_idle" : true,
                "asset"     : "CommonUI/help_bt.png",
                "tag"       : "goto_screen",
                "args"      :
                {
                    "screen": "GuidanceScreen",
                    "sound" : "buttonpress.wav"
                }
            },
            {
                "name"      : "bb_background",
                "scaling"   : "keep_y",
                "size_x"    : 97.5,
                "size_y"    : 97.5,
                "pos_x"     : 854,
                "pos_y"     : 480,
                "pos_z"     : 7.1,
                "pos_origin": "rb",
                "asset"     : "InGameScreen/A_shared_build_icon.png",
                "hide_idle" : true,
                "tag"       : "slow_goto_screen",
                "args"      :
                {
                    "screen" : "BuildBuyScreen",
                    "sound"  : "buttonpress.wav"
                }
            },
            {
                "name"      : "mission",
                "size_x"    : 1,
                "size_y"    : 1,
                "pos_origin": "lt",
                "pos_x"     : 0,
                "pos_y"     : 0,
                "pos_z"     : 7.0,
                "hide_idle" : true,
                "tag"       : "display_mission_icon",
                "asset"     : "MissionScreen/goals_new_goals_btn.png",
                "args"      :
                {
                    "sound" : "goals_book_open.wav",
                    "cowidget" :
                    [
                        { "name" : "mission_button_body" },
                        { "name" : "mission_button_effect" },
                        { "name" : "mission_button_toast" }
                    ]
                }
            },
            {
                "name"      : "event_btn_ribbon_base",
                "scaling"   : "keep_y",
                "size_x"    : 121,
                "size_y"    : 56,
                "pos_origin": "rt",
                "pos_x"     : 832,
                "pos_y"     : 163,
                "pos_z"     : 7.1,
                "hide_idle" : true,
                "asset"     : "Event/001/event_btn_ribbon_base.png",
                "tag"       : "event_btn_ribbon_base"
            },
            {
                "name"      : "event_btn_ribbon_text",
                "scaling"   : "keep_y",
                "size_x"    : 121,
                "size_y"    : 56,
                "pos_origin": "rt",
                "pos_x"     : 832,
                "pos_y"     : 163,
                "pos_z"     : 7.1,
                "hide_idle" : true,
                "asset"     : "Event/001/event_btn_ribbon_open.png",
                "tag"       : "event_btn_ribbon_text"
            },
            {
                "name"      : "goto_event",
                "scaling"   : "keep_min",
                "size_x"    : 60,
                "size_y"    : 60,
                "pos_origin": "rt",
                "pos_x"     : 850,
                "pos_y"     : 165,
                "pos_z"     : 7.1,
                "hide_idle" : true,
                "asset"     : "Event/001/event_icon.png",
                "tag"       : "goto_event",
                "args"      :
                {
                    "sound" : "buttonpress.wav"
                }
            },
            {
                "name"      : "goto_dwarf_exchange_button",
                "scaling"   : "keep_min",
                "size_x"    : 60,
                "size_y"    : 60,
                "pos_origin": "rt",
                "pos_x"     : 850,
                "pos_y"     : 90,
                "pos_z"     : 7.1,
                "hide_idle" : true,
                "asset"     : "Dwarf/A_shared_dwarf_icon.png",
                "tag"       : "goto_dwarf_exchange",
                "args"      :
                {
                    "sound" : "buttonpress.wav"
                }
            }
        ],
        "labels":
        [
            {
                "name"      : "gs_gold_amount",
                "font_size" : 18,
                "size_x"    : 94,
                "size_y"    : 35,
                "pos_origin": "l",
                "pos_x"     : 748,
                "pos_y"     : 15,
                "pos_z"     : 9.9,
                "color_r"   : 95,
                "color_g"   : 80,
                "color_b"   : 23,
                "justify"   : "center",
                "hide_idle" : true,
                ".wrap"      : "shrink",
                "text"      : "0",
                "tag"       : "display_user_gold"
            }
        ],
        "composite" :
        [
             {
                 "name"              : "friend_request_count",
                 "size_x"            : 0,
                 "size_y"            : 0,
                 "pos_x"             : 0,
                 "pos_y"             : 382.5,
                 "pos_z"             : 7.3,
                 "hide_idle"         : true,
                 "controller"        : "simple_container",
                 "controller_args"   :
                 {
                     "items" :
                     [
                         {
                             "item_type"        : "notification_count",
                             "tag"              : "friend_request_count"
                         }
                     ]
                 }
             },
             {
                 "name"              : "user_info_pane",
                 "size_x"            : 0,
                 "size_y"            : 0,
                 "pos_origin"        : "lt",
                 "pos_x"             : 73,
                 "pos_y"             : 0,
                 "pos_z"             : 7.3,
                 "hide_idle"         : true,
                 "controller"        : "simple_container",
                 "controller_args"   :
                 {
                     "items" :
                     [
                         {
                             "item_type"         : "user_info_pane"
                         }
                     ]
                 }
             }
        ],
        "args" :
        {
            "CameraMovable" : 1,
            "ShowChrome" : 1,
            "LotEditable" : 0
        }
    },

    "items" :
    {
        "user_info_pane" :
        {
            "images":
            [
                 {
                     "name"      : "ps_background",
                     "size_x"    : 390,
                     "size_y"    : 78,
                     "pos_origin": "lt",
                     "scaling"   : "keep_y",
                     "pos_x"     : 0,
                     "pos_y"     : 0,
                     "pos_z"     : 7.1,
                     "asset"     : "SPR_InGameScreen/info_base"
                 },
                 {
                     "name"      : "ps_avatar",
                     "size_x"    : 55.5,
                     "size_x_ios": 57.5,
                     "size_y"    : 55.5,
                     "pos_origin": "lt",
                     "scaling"   : "keep_y",
                     "pos_x"     : 5,
                     "pos_y"     : 0,
                     "pos_z"     : 7.2,
                     "tag"       : "display_avatar_on_hud"
                 },
                 {
                     "name"      : "ps_avatar_catchall",
                     "size_x"    : 55.5,
                     "size_y"    : 55.5,
                     "pos_origin": "lt",
                     "pos_x"     : 5,
                     "pos_y"     : 0,
                     "pos_z"     : 7.2,
                     "thru_restriction" : true,
                     "asset"     : "CommonUI/alpha.png",
                     "tag"       : "goto_profile"
                 },
                 {
                     "name"      : "ps_xp_bar",
                     "size_x"    : 104,
                     "size_y"    : 20,
                     "pos_origin": "lt",
                     "pos_x"     : 105,
                     "pos_x_adj" : 20,
                     "pos_y"     : 29,
                     "pos_z"     : 7.2,
                     "asset"     : "SPR_InGameScreen/xp_bar_bg"
                 },
                 {
                     "name"      : "ps_xp_progress",
                     "size_x"    : 104,
                     "size_y"    : 20,
                     "pos_origin": "lt",
                     "pos_x"     : 105,
                     "pos_x_adj" : 20,
                     "pos_y"     : 29,
                     "pos_z"     : 7.3,
                     "asset"     : "InGameScreen/xp_bar.png",
                     "tag"       : "display_xp_progress",
                     "args"      :
                     {
                         "container_size_x" : "104"
                     }
                 },
                 {
                     "name"      : "ps_energy_bar",
                     "size_x"    : 91,
                     "size_y"    : 20,
                     "pos_origin": "lt",
                     "pos_x"     : 236,
                     "pos_x_adj" : 35,
                     "pos_y"     : 29,
                     "pos_z"     : 7.2,
                     "asset"     : "SPR_InGameScreen/energy_bar_bg"
                 },
                 {
                     "name"      : "ps_energy_progress",
                     "size_x"    : 91,
                     "size_y"    : 20,
                     "pos_origin": "lt",
                     "pos_x"     : 236,
                     "pos_x_adj" : 35,
                     "pos_y"     : 29,
                     "pos_z"     : 7.3,
                     "asset"     : "InGameScreen/energy_bar.png",
                     "tag"       : "display_energy_progress",
                     "args"      :
                     {
                         "container_size_x" : "91"
                     }
                 },
                 {
                     "name"      : "xp_icon",
                     "size_x"    : 29,
                     "size_y"    : 24,
                     "pos_origin": "lt",
                     "pos_x"     : 82,
                     "pos_x_adj" : 20,
                     "pos_y"     : 28,
                     "pos_z"     : 9.4,
                     "asset"     : "InGameScreen/xp_icn.png"
                 },
                 {
                     "name"      : "energy_icon",
                     "size_x"    : 24,
                     "size_y"    : 24,
                     "pos_origin": "lt",
                     "pos_x"     : 223,
                     "pos_x_adj" : 35,
                     "pos_y"     : 28,
                     "pos_z"     : 9.4,
                     "asset"     : "InGameScreen/resIcon_energy.png"
                 },
                 {
                     "name"      : "resource_icon",
                     "size_x"    : 28,
                     "size_y"    : 28,
                     "pos_origin": "lt",
                     "pos_x"     : 223,
                     "pos_x_adj" : 35,
                     "pos_y"     : 0,
                     "pos_z"     : 9.4,
                     "asset"     : "InGameScreen/resIcon_resource.png"
                 },
                 {
                     "name"      : "self_introduction_icon",
                     "scaling"   : "keep_y",
                     "size_x"    : 46,
                     "size_y"    : 61,
                     "pos_origin": "lt",
                     "pos_x"     : 459,
                     "pos_y"     : 0,
                     "pos_z"     : 9.4,
                     "hide_idle" : true,
                     "asset"     : "SPR_InGameScreen/user_introduction_initial_button",
                     "tag"       : "self_introduction",
                     "args"      :
                     {
                         "initial_asset" : "SPR_InGameScreen/user_introduction_initial_button",
                         "edit_asset" : "SPR_InGameScreen/user_introduction_edit_button"
                     }
                 }
            ],
            "labels":
            [
                 {
                     "name"      : "ps_kingdom_name",
                     "font_size" : 20,
                     "pos_origin": "l",
                     "pos_x"     : 83,
                     "pos_x_adj" : 20,
                     "pos_y"     : 14,
                     "pos_z"     : 8.2,
                     "size_x"    : 113,
                     "size_y"    : 30,
                     "color_r"   : 133,
                     "color_g"   : 90,
                     "color_b"   : 45,
                     "weight"    : "bold",
                     "text"      : "INVALID USER",
                     "justify"   : "left",
                     "tag"       : "display_user_name"
                 },
                 {
                     "name"      : "ps_kingdom_level_label",
                     "font_size" : 15,
                     "pos_origin": "l",
                     "scaling"   : "keep_y",
                     "pos_x"     : 5,
                     "pos_y"     : 63,
                     "pos_z"     : 8.2,
                     "size_x"    : 55,
                     "size_y"    : 23,
                     "color_r"   : 235,
                     "color_g"   : 220,
                     "color_b"   : 194,
                     "wrap"      : "shrink",
                     "weight"    : "bold",
                     "justify"   : "center",
                     "tag"       : "display_user_level"
                 },
                 {
                     "name"      : "ps_kingdom_xp_label",
                     "font_size" : 14,
                     "pos_origin": "l",
                     "pos_x"     : 110,
                     "pos_x_adj" : 20,
                     "pos_y"     : 39,
                     "pos_z"     : 9.2,
                     "size_x"    : 89,
                     "size_y"    : 26,
                     "color_r"   : 83,
                     "color_g"   : 86,
                     "color_b"   : 113,
                     "weight"    : "bold",
                     "justify"   : "center",
                     "text"      : "",
                     "tag"       : "display_user_xp"
                 },
                 {
                     "name"      : "rs_user_energy_label",
                     "font_size" : 14,
                     "pos_origin": "l",
                     "pos_x"     : 248,
                     "pos_x_adj" : 35,
                     "pos_y"     : 39,
                     "pos_z"     : 9.2,
                     "size_x"    : 69,
                     "size_y"    : 26,
                     "color_r"   : 140,
                     "color_g"   : 89,
                     "color_b"   : 34,
                     "weight"    : "bold",
                     "justify"   : "center",
                     "text"      : "0/0",
                     "tag"       : "display_user_energy",
                     "args"      :
                     {
                         "show_max": true
                     }
                 },
                 {
                     "name"      : "rs_user_energy_recover_time",
                     "font_size" : 14,
                     "pos_origin": "l",
                     "pos_x"     : 325,
                     "pos_x_adj" : 50,
                     "pos_y"     : 39,
                     "pos_z"     : 9.2,
                     "size_x"    : 60,
                     "size_y"    : 26,
                     "color_r"   : 140,
                     "color_g"   : 89,
                     "color_b"   : 34,
                     "weight"    : "bold",
                     "justify"   : "center",
                     "text"      : "00:00",
                     "tag"       : "energy_recover_time"
                 },
                 {
                     "name"      : "rs_user_resource_label",
                     "font_size" : 15,
                     "pos_origin": "l",
                     "pos_x"     : 255,
                     "pos_x_adj" : 35,
                     "pos_y"     : 14,
                     "pos_z"     : 8.2,
                     "size_x"    : 100,
                     "size_y"    : 26,
                     "color_r"   : 101,
                     "color_g"   : 98,
                     "color_b"   : 76,
                     "weight"    : "bold",
                     "justify"   : "left",
                     "text"      : "0/0",
                     "tag"       : "display_user_resource"
                 }
             ],
             "args" :
             {
                 "scaling" : "keep_min"
             }
        },
        "unlocked_buildings":
        {
            "images":
            [
                {
                    "name"      : "population_mark_bg",
                    "size_x"    : 854,
                    "size_y"    : 480,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 6.9,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "population_mark_dialog",
                    "scaling"   : "keep_y",
                    "size_x"    : 680,
                    "size_y"    : 340,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 7.1,
                    "asset"     : "SPR_InGameScreen/dialog_NEW-BUILDING_base"
                },
                {
                    "name"      : "population_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 60,
                    "size_y"    : 60,
                    "pos_origin": "r",
                    "pos_x"     : -20,
                    "pos_y"     : -90,
                    "pos_z"     : 7.2,
                    "asset"     : "InGameScreen/resIcon_population@2x.png"
                },
                {
                    "name"      : "population_mark_button",
                    "scaling"   : "keep_y",
                    "size_x"    : 200,
                    "size_y"    : 100,
                    "pos_origin": "rt",
                    "pos_x"     : 340,
                    "pos_y"     : 80,
                    "pos_z"     : 7.0,
                    "asset"     : "CommonUI/dialog_OK_bt.png",
                    "tag"       : "unlocked_buildings_button",
                    "args"      :
                    {
                        "sound" : "buttonpress.wav"
                    }
                }
            ],
            "labels":
            [
                {
                    "name"      : "population_number",
                    "font_size" : 24,
                    "size_x"    : 400,
                    "size_y"    : 40,
                    "pos_origin": "l",
                    "pos_x"     : 0,
                    "pos_y"     : -90,
                    "pos_z"     : 7.2,
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "justify"   : "left",
                    "text_key"  : "PopulationNumber",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "population_mark_desc",
                    "font_size" : 20,
                    "pos_x"     : 0,
                    "pos_y"     : 60,
                    "pos_z"     : 7.2,
                    "size_x"    : 500,
                    "size_y"    : 44,
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "text_key"  : "PopulationMarkDesc"
                }

            ],
            "composite" :
            [
                {
                    "name"              : "population_unlocked_list",
                    "size_x"            : 270,
                    "size_y"            : 80,
                    "pos_x"             : -100,
                    "pos_y"             : -70,
                    "pos_z"             : 7.3,
                    "controller"        : "scroll_area",
                    "controller_args"   :
                    {
                        "item_type"         : "proto_list_item",
                        "data_source_tag"   : "population_unlocked_list",
                        "orientation"       : "horizontal",
                        "elements_per_group": 1,
                        "item_size_x"       : 68,
                        "item_size_y"       : 120
                    }
                }
            ]
        },
        "rankup_popup":
        {
            "images":
            [
                {
                    "name"      : "rankup_dialog",
                    "scaling"   : "keep_y",
                    "size_x"    : 680,
                    "size_y"    : 400,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 7.1,
                    "asset"     : "SPR_InGameScreen/dialog_RANK-UP_base"
                },
                {
                    "name"      : "cityhall_image",
                    "scaling"   : "keep_min",
                    "size_x"    : 200,
                    "size_y"    : 200,
                    "pos_origin": "l",
                    "pos_x"     : -240,
                    "pos_y"     : -10,
                    "pos_z"     : 7.2,
                    "tag"       : "cityhall_image",
                    "statue_args" :
                    {
                        "pos_x"     : -200,
                        "scaling"   : "keep_y",
                        "size_x"    : 102,
                        "size_y"    : 180
                    }
                },
                {
                    "name"      : "rankup_button",
                    "scaling"   : "keep_y",
                    "size_x"    : 200,
                    "size_y"    : 100,
                    "pos_origin": "rt",
                    "pos_x"     : 340,
                    "pos_y"     : 100,
                    "pos_z"     : 7.0,
                    "asset"     : "CommonUI/dialog_OK_bt.png",
                    "tag"       : "rankup_button",
                    "args"      :
                    {
                        "sound" : "buttonpress.wav"
                    }
                }
            ],
            "labels":
            [
                {
                    "name"      : "rankup_desc",
                    "font_size" : 22,
                    "size_x"    : 400,
                    "size_y"    : 42,
                    "pos_origin": "r",
                    "pos_x"     : 250,
                    "pos_y"     : -50,
                    "pos_z"     : 7.3,
                    "weight"    : "bold",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "text_key"  : "RankUpDesc",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "rankup_max_energy_label",
                    "font_size" : 18,
                    "size_x"    : 400,
                    "size_y"    : 30,
                    "pos_origin": "r",
                    "pos_x"     : 150,
                    "pos_y"     : -20,
                    "pos_z"     : 7.3,
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "justify"   : "right",
                    "text_key"  : "RankUpMaxEnergy"
                },
                {
                    "name"      : "rankup_max_energy",
                    "font_size" : 22,
                    "size_x"    : 400,
                    "size_y"    : 36,
                    "pos_origin": "r",
                    "pos_x"     : 250,
                    "pos_y"     : -20,
                    "pos_z"     : 7.3,
                    "weight"    : "bold",
                    "color_r"   : 209,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "justify"   : "right",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "rankup_max_resource_label",
                    "font_size" : 18,
                    "size_x"    : 400,
                    "size_y"    : 30,
                    "pos_origin": "r",
                    "pos_x"     : 150,
                    "pos_y"     : 0,
                    "pos_z"     : 7.3,
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "justify"   : "right",
                    "text_key"  : "RankUpMaxResource"
                },
                {
                    "name"      : "rankup_max_resource",
                    "font_size" : 22,
                    "size_x"    : 400,
                    "size_y"    : 36,
                    "pos_origin": "r",
                    "pos_x"     : 250,
                    "pos_y"     : 0,
                    "pos_z"     : 7.3,
                    "weight"    : "bold",
                    "color_r"   : 209,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "justify"   : "right",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "rankup_castle",
                    "font_size" : 18,
                    "size_x"    : 400,
                    "size_y"    : 30,
                    "pos_origin": "r",
                    "pos_x"     : 250,
                    "pos_y"     : 30,
                    "pos_z"     : 7.3,
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "justify"   : "right",
                    "text_key"  : "RankUpCastle"
                },
                {
                    "name"      : "rankup_territory",
                    "font_size" : 18,
                    "size_x"    : 400,
                    "size_y"    : 30,
                    "pos_origin": "r",
                    "pos_x"     : 250,
                    "pos_y"     : 50,
                    "pos_z"     : 7.3,
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "justify"   : "right",
                    "text_key"  : "RankUpTerritory",
                    "tag"       : "label_value"
                }
            ]
        },
        "levelup_popup":
        {
            "images":
            [
                {
                    "name"      : "levelup_bg",
                    "size_x"    : 854,
                    "size_y"    : 480,
                    "pos_x"     : 427,
                    "pos_y"     : 240,
                    "pos_z"     : 6.8,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "levelup_dialog",
                    "scaling"   : "keep_y",
                    "size_x"    : 680,
                    "size_y"    : 400,
                    "pos_x"     : 427,
                    "pos_y"     : 260,
                    "pos_z"     : 7.1,
                    "asset"     : "SPR_InGameScreen/dialog_LEVEL-UP_base"
                },
                {
                    "name"      : "bg_cover",
                    "scaling"   : "keep_y",
                    "size_x"    : 500,
                    "size_y"    : 250,
                    "pos_x"     : 427,
                    "pos_y"     : 260,
                    "pos_z"     : 6.9,
                    "asset"     : "CommonUI/white.png"
                },
                {
                    "name"      : "levelup_button",
                    "size_x"    : 200,
                    "size_y"    : 100,
                    "scaling"   : "keep_y",
                    "pos_origin": "rt",
                    "pos_x"     : 780,
                    "pos_y"     : 360,
                    "pos_z"     : 7.0,
                    "asset"     : "CommonUI/dialog_OK_bt.png",
                    "tag"       : "levelup_button",
                    "args"      :
                    {
                        "sound" : "buttonpress.wav"
                    }
                }
            ],
            "labels":
            [
                {
                    "name"      : "levelup_text",
                    "font_size" : 18,
                    "pos_x"     : 427,
                    "pos_y"     : 165,
                    "pos_z"     : 7.2,
                    "size_x"    : 400,
                    "size_y"    : 30,
                    "justify"   : "center",
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "text_key"  : "LevelUpUnlockedItems",
                    "tag"       : "levelup_text",
                    "args"      :
                    {
                        "alternate_text_key" : "LevelUpNoneUnlocked"
                    }
                },
                {
                    "name"      : "levelup_title",
                    "font_size" : 30,
                    "pos_x"     : 427,
                    "pos_y"     : 297,
                    "pos_z"     : 7.2,
                    "size_x"    : 400,
                    "size_y"    : 50,
                    "justify"   : "center",
                    "weight"    : "bold",
                    "color_r"   : 0.0,
                    "color_g"   : 0.0,
                    "color_b"   : 0.0,
                    "color_a"   : 1.0,
                    "text_key"  : "LevelUpTitle",
                    "tag"       : "levelup_title"
                },
                {
                    "name"      : "levelup_full_energy",
                    "font_size" : 18,
                    "pos_x"     : 427,
                    "pos_y"     : 325,
                    "pos_z"     : 7.2,
                    "size_x"    : 400,
                    "size_y"    : 50,
                    "justify"   : "center",
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "text_key"  : "LevelUpFullEnergy"
                },
                {
                    "name"      : "levelup_max_population_label",
                    "font_size" : 18,
                    "pos_origin": "r",
                    "pos_x"     : 350,
                    "pos_y"     : 352,
                    "pos_z"     : 7.2,
                    "size_x"    : 410,
                    "size_y"    : 50,
                    "justify"   : "right",
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "text_key"  : "LevelUpMaxPopulation"
                },
                {
                    "name"      : "levelup_max_population",
                    "font_size" : 18,
                    "pos_origin": "l",
                    "pos_x"     : 350,
                    "pos_y"     : 352,
                    "pos_z"     : 7.2,
                    "size_x"    : 410,
                    "size_y"    : 50,
                    "justify"   : "left",
                    "weight"    : "bold",
                    "color_r"   : 209,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "levelup_max_population"
                },
                {
                    "name"      : "levelup_max_friend_label",
                    "font_size" : 18,
                    "pos_origin": "r",
                    "pos_x"     : 650,
                    "pos_y"     : 352,
                    "pos_z"     : 7.2,
                    "size_x"    : 400,
                    "size_y"    : 50,
                    "justify"   : "right",
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 37,
                    "color_b"   : 7,
                    "color_a"   : 1.0,
                    "text_key"  : "LevelUpMaxFriend"
                },
                {
                    "name"      : "levelup_max_friend",
                    "font_size" : 18,
                    "pos_origin": "l",
                    "pos_x"     : 650,
                    "pos_y"     : 352,
                    "pos_z"     : 7.2,
                    "size_x"    : 400,
                    "size_y"    : 50,
                    "justify"   : "left",
                    "weight"    : "bold",
                    "color_r"   : 209,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "levelup_max_friend"
                }
            ],
            "composite" :
            [
                {
                    "name"              : "unlocked_list",
                    "size_x"            : 275,
                    "size_y"            : 120,
                    "pos_origin"        : "t",
                    "pos_x"             : 275,
                    "pos_y"             : 100,
                    "pos_z"             : 7.0,
                    "controller"        : "scroll_area",
                    "controller_args"   :
                    {
                        "item_type"         : "proto_list_item",
                        "data_source_tag"   : "levelup_unlocked_list",
                        "orientation"       : "horizontal",
                        "elements_per_group": 1,
                        "item_size_x"       : 68,
                        "item_size_y"       : 120
                    }
                }
            ]
        },
        "proto_list_item" :
        {
            "images" :
            [
                 {
                     "name"      : "proto_list_item_image",
                     "scaling"   : "keep_min",
                     "size_x"    : 60,
                     "size_y"    : 60,
                     "pos_x"     : 0,
                     "pos_y"     : -9,
                     "pos_z"     : 8.1,
                     "tag"       : "proto_list_image"
                 }
            ],
            "labels" :
            [
                 {
                     "name"      : "proto_list_item_label",
                     "size_x"    : 68,
                     "size_y"    : 60,
                     "pos_origin": "t",
                     "pos_x"     : 0,
                     "pos_y"     : 21,
                     "pos_z"     : 8.1,
                     "font_size" : 12,
                     "color_r"   : 136,
                     "color_g"   : 98,
                     "color_b"   : 61,
                     "color_a"   : 1.0,
                     "v_align"   : "top",
                     "wrap"      : "newline",
                     "tag"       : "proto_list_label"
                 }
            ]
        },
        "job_item" :
        {
            "pos_z"             : 14,
            "scale_x"           : 0.75,
            "scale_y"           : 0.75,
            "images":
            [
                {
                    "name"      : "job_item",
                    "scaling"   : "keep_min",
                    "size_x"    : 50,
                    "size_y"    : 50,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 15,
                    "asset"     : "",
                    "tag"       : "obj_state_defined"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "job_item",
                    "font_size" : 18,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 30,
                    "pos_y"     : 3,
                    "pos_z"     : 6.2,
                    "text"      : "",
                    "justify"   : "right",
                    "weight"    : "bold",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "tag"       : "obj_state_defined"
                }
            ]
        },
        "job_bubble" :
        {
            "composite" :
            [
                {
                    "name"              : "job_bubble",
                    "scaling"           : "keep_min",
                    "size_x"            : 95,
                    "size_y"            : 95,
                    "pos_x"             : 0,
                    "pos_y"             : -16,
                    "pos_z"             : 12,
                    "controller"        : "anim_scale_enlarge",
                    "controller_args"   :
                    {
                        "item_type"         : "job_item",
                        "value_x"           : 1.035,
                        "value_y"           : 1.035,
                        "time"              : 1.0
                    },
                    "args" :
                    {
                        "background"        : "InGameScreen/smallIconBubble.png",
                        "pos_z"             : 0
                    }
                }
            ]
        },
        "avatar_item" :
        {
            "images":
            [
                {
                    "name"      : "avatar_item",
                    "scaling"   : "keep_x",
                    "pos_origin": "t",
                    "size_x"    : 47,
                    "size_y"    : 47,
                    "pos_x"     : 0,
                    "pos_y"     : 3,
                    "pos_z"     : 15,
                    "asset"     : "",
                    "tag"       : "obj_state_defined"
                },
                {
                    "name"      : "avatar_item",
                    "scaling"   : "keep_x",
                    "pos_origin": "t",
                    "size_x"    : 60,
                    "size_y"    : 75,
                    "pos_x"     : 0,
                    "pos_y"     : -3,
                    "pos_z"     : 16,
                    "asset"     : "InGameScreen/avatarbubble.png"
                }
            ]
        },
        "avatar_bubble" :
        {
            "composite" :
            [
                {
                    "name"              : "avatar_bubble",
                    "scaling"           : "keep_x",
                    "size_x"            : 60,
                    "size_y"            : 75,
                    "pos_x"             : 0,
                    "pos_y"             : -48,
                    "pos_z"             : 12,
                    "controller"        : "anim_scale_enlarge",
                    "controller_args"   :
                    {
                        "item_type"         : "avatar_item",
                        "value_x"           : 1.05,
                        "value_y"           : 1.05,
                        "time"              : 1.0
                    },
                    "args" :
                    {
                        "pos_z"             : 13
                    }
                }
            ]
        },
        "action_bubble" :
        {
            "pos_z"   : 0,
            "images" :
            [
                {
                    "name"      : "action_bubble_background",
                    "scaling"   : "keep_x",
                    "size_x"    : 190,
                    "size_y"    : 95,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 6.0,
                    "asset"     : "CommonUI/loadingBubble_.png"
                },
                {
                    "name"      : "action_bubble_type_image",
                    "scaling"           : "keep_min",
                    "size_x"    : 40,
                    "size_y"    : 40,
                    "pos_x"     : -76,
                    "pos_y"     : -10,
                    "pos_z"     : 6.2,
                    "asset"     : "",
                    "tag"       : "obj_state_image"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "action_bubble_time",
                    "font_size" : 14,
                    "pos_x"     : 65,
                    "pos_y"     : 9,
                    "pos_z"     : 6.2,
                    "text"      : "",
                    "justify"   : "center",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "obj_state_time_remaining_percent"
                },
                {
                    "name"      : "action_bubble_label",
                    "font_size" : 13,
                    "pos_x"     : 15,
                    "pos_y"     : -4,
                    "pos_z"     : 6.2,
                    "size_x"    : 130,
                    "size_y"    : 30,
                    "wrap"      : "shrink",
                    "text"      : "",
                    "justify"   : "center",
                    "v_align"   : "top",
                    "weight"    : "bold",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "tag"       : "obj_state_text"
                }
            ],
            "composite" :
            [
                  {
                      "name"              : "action_progress",
                      "size_x"            : 90,
                      "size_y"            : 12,
                      "pos_x"             : 0,
                      "pos_y"             : 16,
                      "pos_z"             : 6.8,
                      "controller"        : "progress_bar",
                      "controller_args"   :
                      {
                          "progress_image"    : "CommonUI/progressbar_blue.png",
                          "progress_bg_image" : "CommonUI/progressbar_base.png",
                          "progress_size"     :
                          {
                              "width": 170,
                              "left": 12,
                              "right": 12
                          }
                      },
                      "args" :
                      {
                          "background"        : "CommonUI/alpha.png"
                      }
                  }
              ]
        },
        "message_popup" :
        {
            "pos_z"   : 0,
            "images" :
            [
                {
                    "name"      : "message_popup_background",
                    "size_x"    : 237,
                    "size_y"    : 112,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 6.0,
                    "asset"     : "IntroScreen/xoom_loading_bubble_no_text.png"
                },
                {
                    "name"      : "message_popup_image",
                    "size_x"    : 40,
                    "size_y"    : 40,
                    "pos_x"     : -90,
                    "pos_y"     : -40,
                    "pos_z"     : 6.2,
                    "asset"     : "InGameScreen/resIcon_build.png"
                }

            ],
            "labels" :
            [
                {
                    "name"      : "message_popup_label",
                    "font_size" : 13,
                    "pos_x"     : 8,
                    "pos_y"     : -15,
                    "pos_z"     : 6.2,
                    "size_x"    : 140,
                    "size_y"    : 60,
                    "wrap"      : "wrap",
                    "text"      : "",
                    "justify"   : "left",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "message_popup_text"
                }
            ]
        },
        "decoration_popup" :
        {
            "images":
            [
                {
                    "name"      : "decoration_popup_bg",
                    "size_x"    : 300,
                    "size_y"    : 154,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 6.2,
                    "asset"     : "InGameScreen/bubble_pop_deco.png",
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "decoration_popup_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 80,
                    "size_y"    : 80,
                    "pos_x"     : -130,
                    "pos_y"     : -60,
                    "pos_z"     : 6.4,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "decoration_progress_bg",
                    "size_x"    : 170,
                    "size_y"    : 18,
                    "pos_origin": "l",
                    "pos_x"     : -115,
                    "pos_y"     : 5,
                    "pos_z"     : 6.3,
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "decoration_progress",
                    "size_x"    : 170,
                    "size_y"    : 18,
                    "pos_origin": "l",
                    "pos_x"     : -115,
                    "pos_y"     : 5,
                    "pos_z"     : 6.4,
                    "asset"     : "CommonUI/progressbar_orange.png",
                    "tag"       : "progress_percentage"
                }
            ],
            "labels":
            [
                {
                    "name"      : "decoration_effect_label",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : -105,
                    "pos_y"     : -55,
                    "pos_z"     : 6.3,
                    "size_x"    : 300,
                    "size_y"    : 30,
                    "justify"   : "left",
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0,
                    "text_key"  : "DecorationEffectLabel"
                },
                {
                    "name"      : "decoration_gain",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : -105,
                    "pos_y"     : -35,
                    "pos_z"     : 6.3,
                    "size_x"    : 250,
                    "size_y"    : 30,
                    "justify"   : "left",
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "decoration_remaining_percent",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : 60,
                    "pos_y"     : 5,
                    "pos_z"     : 6.3,
                    "size_x"    : 60,
                    "size_y"    : 30,
                    "justify"   : "center",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "decoration_remaining_count",
                    "font_size" : 16,
                    "pos_x"     : 0,
                    "pos_y"     : 30,
                    "pos_z"     : 6.3,
                    "size_x"    : 300,
                    "size_y"    : 30,
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "decoration_remaining_desc",
                    "font_size" : 12,
                    "pos_x"     : 0,
                    "pos_y"     : 50,
                    "pos_z"     : 6.3,
                    "size_x"    : 290,
                    "size_y"    : 30,
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0,
                    "wrap"      : "shrink",
                    "tag"       : "label_value"
                }
            ]
        },
        "cityhall_popup" :
        {
            "images" :
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
                    "name"      : "cityhall_popup_bg",
                    "size_x"    : 364,
                    "size_y"    : 463,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 9.1,
                    "asset"     : "SPR_CommonUI/castle_bubble_baseonly"
                },
                {
                    "name"      : "cityhall_image",
                    "scaling"   : "keep_min",
                    "size_x"    : 125,
                    "size_y"    : 125,
                    "pos_origin": "t",
                    "pos_x"     : 0,
                    "pos_y"     : -120,
                    "pos_z"     : 9.2,
                    "tag"       : "cityhall_image",
                    "statue_args" :
                    {
                        "pos_y"     : -125,
                        "scaling"   : "keep_y",
                        "size_x"    :  70,
                        "size_y"    : 125
                    }
                },
                {
                    "name"      : "energy_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 24,
                    "size_y"    : 24,
                    "pos_origin": "r",
                    "pos_x"     : 70,
                    "pos_y"     : 10,
                    "pos_z"     : 9.2,
                    "asset"     : "InGameScreen/resIcon_energy.png"
                },
                {
                    "name"      : "resource_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 24,
                    "size_y"    : 24,
                    "pos_origin": "r",
                    "pos_x"     : 70,
                    "pos_y"     : 35,
                    "pos_z"     : 9.2,
                    "asset"     : "InGameScreen/resIcon_resource@2x.png"
                },
                {
                    "name"      : "population_icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 40,
                    "size_y"    : 40,
                    "pos_origin": "l",
                    "pos_x"     : -140,
                    "pos_y"     : 120,
                    "pos_z"     : 9.2,
                    "asset"     : "InGameScreen/resIcon_population@2x.png"
                },
                {
                    "name"      : "population_progress_bg",
                    "size_x"    : 170,
                    "size_y"    : 18,
                    "pos_x"     : 0,
                    "pos_y"     : 120,
                    "pos_z"     : 9.2,
                    "asset"     : "CommonUI/progressbar_base.png"
                },
                {
                    "name"      : "population_progress",
                    "size_x"    : 170,
                    "size_y"    : 18,
                    "pos_x"     : 0,
                    "pos_y"     : 120,
                    "pos_z"     : 9.3,
                    "asset"     : "CommonUI/progressbar_blue.png",
                    "tag"       : "progress_percentage"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "cityhall_rank",
                    "font_size" : 28,
                    "pos_x"     : 0,
                    "pos_y"     : -140,
                    "pos_z"     : 9.2,
                    "size_x"    : 200,
                    "size_y"    : 50,
                    "justify"   : "center",
                    "weight"    : "bold",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "text_key"  : "CityhallRank",
                    "tag"       : "cityhall_rank"
                },
                {
                    "name"      : "max_energy_label",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : -140,
                    "pos_y"     : 10,
                    "pos_z"     : 9.2,
                    "size_x"    : 180,
                    "size_y"    : 40,
                    "justify"   : "left",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "text_key"  : "MaxEnergyLabel"
                },
                {
                    "name"      : "max_energy_value",
                    "font_size" : 16,
                    "pos_origin": "r",
                    "pos_x"     : 140,
                    "pos_y"     : 10,
                    "pos_z"     : 9.2,
                    "size_x"    : 300,
                    "size_y"    : 50,
                    "justify"   : "right",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "max_resource_label",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : -140,
                    "pos_y"     : 35,
                    "pos_z"     : 9.2,
                    "size_x"    : 180,
                    "size_y"    : 50,
                    "justify"   : "left",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "text_key"  : "MaxResourceLabel"
                },
                {
                    "name"      : "max_resource_value",
                    "font_size" : 16,
                    "pos_origin": "r",
                    "pos_x"     : 140,
                    "pos_y"     : 35,
                    "pos_z"     : 9.2,
                    "size_x"    : 300,
                    "size_y"    : 50,
                    "justify"   : "right",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "population_current_label",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : -140,
                    "pos_y"     : 60,
                    "pos_z"     : 9.2,
                    "size_x"    : 210,
                    "size_y"    : 50,
                    "justify"   : "left",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "text_key"  : "PopulationCurrent"
                },
                {
                    "name"      : "population_current_value",
                    "font_size" : 16,
                    "pos_origin": "r",
                    "pos_x"     : 140,
                    "pos_y"     : 60,
                    "pos_z"     : 9.2,
                    "size_x"    : 300,
                    "size_y"    : 50,
                    "justify"   : "right",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "population_required_label",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : -140,
                    "pos_y"     : 85,
                    "pos_z"     : 9.2,
                    "size_x"    : 210,
                    "size_y"    : 50,
                    "justify"   : "left",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "tag"  : "label_value"
                },
                {
                    "name"      : "population_required_value",
                    "font_size" : 16,
                    "pos_origin": "r",
                    "pos_x"     : 140,
                    "pos_y"     : 85,
                    "pos_z"     : 9.2,
                    "size_x"    : 300,
                    "size_y"    : 50,
                    "justify"   : "right",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "population_upgrade_percent",
                    "font_size" : 16,
                    "pos_origin": "r",
                    "pos_x"     : 140,
                    "pos_y"     : 120,
                    "pos_z"     : 9.2,
                    "size_x"    : 200,
                    "size_y"    : 50,
                    "justify"   : "right",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1.0,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "population_upgrade_desc",
                    "font_size" : 12,
                    "pos_x"     : 0,
                    "pos_y"     : 150,
                    "pos_z"     : 9.2,
                    "size_x"    : 400,
                    "size_y"    : 100,
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0,
                    "text_key"  : "PopulationUpgradeDesc"
                }
            ]
        },
        "harvest_selection" :
        {
            "images":
            [
                {
                    "name"      : "background_catchall",
                    "size_x"    : 3000,
                    "size_y"    : 3000,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 7.0,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "close_global_widget"
                },
                {
                    "name"      : "store_item_container",
                    "size_x"    : 250,
                    "size_y"    : 480,
                    "pos_x"     : 0,
                    "pos_y"     : 240,
                    "pos_z"     : 6.3,
                    "asset"     : "SPR_InGameScreen/A_shared_cropselect_window",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "store_item_container_top",
                    "size_x"    : 250,
                    "size_y"    : 63,
                    "pos_x"     : 0,
                    "pos_y"     : 26.5,
                    "pos_z"     : 7.5,
                    "asset"     : "SPR_InGameScreen/xoom_crop_select_top",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "store_item_container_bottom",
                    "size_x"    : 250,
                    "size_y"    : 50,
                    "pos_x"     : 3,
                    "pos_y"     : 458,
                    "pos_z"     : 7.5,
                    "asset"     : "SPR_InGameScreen/xoom_crop_select_bottom",
                    "tag"       : "empty_touch"
                }
            ],
            "labels"    :
            [
                {
                    "name"      : "harvest_title",
                    "font_size" : 24,
                    "pos_x"     : 0,
                    "pos_y"     : 24,
                    "pos_z"     : 59.9,
                    "size_x"    : 300,
                    "size_y"    : 50,
                    "text_key"  : "HarvestListTitle",
                    "justify"   : "center",
                    "weight"    : "bold",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255
                }
            ],
            "composite" :
            [
                {
                    "name"              : "harvest_list",
                    "size_x"            : 250,
                    "size_y"            : 380,
                    "pos_x"             : -177,
                    "pos_y"             : 53,
                    "pos_z"             : 7.3,
                    "controller"        : "scroll_area",
                    "controller_args"   :
                    {
                        "item_type"         : "harvest_item",
                        "data_source_tag"   : "build_harvest_list",
                        "orientation"       : "vertical",
                        "elements_per_group": 1,
                        "item_size_x"       : 250,
                        "item_size_y"       : 85,
                        "notify_children"   : true,
                        "save_last_position": true
                    }
                }
            ]
        },
        "harvest_item" :
        {
            "images" :
            [
                {
                    "name"      : "harvest_item_image",
                    "scaling"   : "keep_min",
                    "size_x"    : 60,
                    "size_y"    : 60,
                    "pos_x"     : -26,
                    "pos_y"     : -12,
                    "pos_z"     : 6.4,
                    "asset"     : "",
                    "tag"       : "proto_image",
                    "args"      :
                    {
                        "proto_tag"     : "icon_png"
                    }
                },
                {
                    "name"      : "harvest_item_cost",
                    "scaling"   : "keep_min",
                    "size_x"    : 22,
                    "size_y"    : 22,
                    "pos_x"     : -37,
                    "pos_y"     : 25,
                    "pos_z"     : 6.4,
                    "asset"     : "CommonUI/A_shared_small_coin_icon.png",
                    "tag"       : "is_crop_out_of_level"
                },
                {
                    "name"      : "harvest_item_background",
                    ".scaling"   : "keep_min",
                    "size_x"    : 229,
                    "size_y"    : 78,
                    "pos_x"     : 52,
                    "pos_y"     : 0,
                    "pos_z"     : 6.2,
                    "asset"     : "CommonUI/black.png",
                    "tag"       : "harvest_item_selected"
                },
                {
                    "name"      : "harvest_item_plate",
                    ".scaling"   : "keep_min",
                    "size_x"    : 229,
                    "size_y"    : 78,
                    "pos_x"     : 52,
                    "pos_y"     : 0,
                    "pos_z"     : 6.5,
                    "asset"     : "SPR_InGameScreen/A_shared_cropselect_eachPlate"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "harvest_item_name",
                    "font_size" : 18,
                    "pos_origin": "l",
                    "pos_x"     : 15,
                    "pos_y"     : -30,
                    "pos_z"     : 6.5,
                    "size_x"    : 160,
                    "size_y"    : 30,
                    "text"      : "",
                    "justify"   : "left",
                    "weight"    : "bold",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "tag"       : "proto_text",
                    "args"      :
                    {
                        "proto_tag"     : "proto_name",
                        "force_draw"    : true
                    }
                },
                {
                    "name"      : "harvest_item_cost_label",
                    "font_size" : 12,
                    "pos_origin": "l",
                    "pos_x"     : 15,
                    "pos_y"     : -9,
                    "pos_z"     : 6.5,
                    "size_x"    : 160,
                    "size_y"    : 22,
                    "text_key"  : "HarvestSellFor",
                    "justify"   : "left",
                    "tag"       : "harvest_cost",
                    "args"      :
                    {
                        "alternate_text_key" : "HarvestRequireLevel"
                    }
                },
                {
                    "name"      : "harvest_item_label",
                    "font_size" : 12,
                    "pos_origin": "l",
                    "pos_x"     : 15,
                    "pos_y"     : 9,
                    "pos_z"     : 6.5,
                    "size_x"    : 160,
                    "size_y"    : 22,
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "text_key"  : "HarvestItemTime",
                    "justify"   : "left",
                    "tag"       : "harvest_time"
                },
                {
                    "name"      : "harvest_item_gold",
                    "font_size" : 12,
                    "pos_x"     : -13,
                    "pos_y"     : 25,
                    "pos_z"     : 6.5,
                    "size_x"    : 70,
                    "size_y"    : 18,
                    "wrap"      : "shrink",
                    "text"      : "",
                    "justify"   : "right",
                    "tag"       : "proto_text",
                    "args"      :
                    {
                        "proto_tag"     : "gold_cost"
                    }
                }
            ]
        },
        "flying_message" :
        {
            "images" :
            [
                {
                    "name"      : "icon",
                    "scaling"   : "keep_min",
                    "size_x"    : 40,
                    "size_y"    : 40,
                    "pos_origin": "r",
                    "pos_x"     : 0,
                    "pos_y"     : 2,
                    "pos_z"     : 10.0,
                    "asset"     : "InGameScreen/resIcon_gold@2x.png",
                    "tag"       : "flying_message"
                }
            ],
            "labels" :
            [
               {
                    "name"      : "label",
                    "font_size" : 20,
                    "pos_origin": "l",
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 10.0,
                    "size_x"    : 350,
                    "size_y"    : 30,
                    "text"      : "-",
                    "justify"   : "left",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "tag"       : "flying_message"
               },
               {
                    "name"      : "shadow",
                    "font_size" : 20,
                    "pos_origin": "l",
                    "pos_x"     : 1,
                    "pos_y"     : 1,
                    "pos_z"     : 9.9,
                    "size_x"    : 350,
                    "size_y"    : 30,
                    "text"      : "-",
                    "justify"   : "left",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "weight"    : "bold",
                    "tag"       : "flying_message"
                }
            ]
        },
        "new_mission_popups" :
        {
            "images" :
            [
                {
                    "name"      : "background_catchall",
                    "size_x"    : 2048,
                    "size_y"    : 1536,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 0.0,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "back",
                    "size_x"    : 610,
                    "size_y"    : 320,
                    "scaling"   : "keep_y",
                    "pos_x"     : 0,
                    "pos_y"     : -20,
                    "pos_z"     : 60.0,
                    "asset"     : "SPR_MissionScreen/goals_popups_new_goal_bg@2x"
                },
                {
                    "name"      : "ok_exit",
                    "size_x"    : 220,
                    "size_y"    : 170,
                    "scaling"   : "keep_y",
                    "pos_origin": "rb",
                    "pos_x"     : 350,
                    "pos_y"     : 225,
                    "pos_z"     : 59.0,
                    "asset"     : "SPR_MissionScreen/goals_popups_ok_ribbon@2x",
                    "tag"       : "mission_popups_ok",
                    "args"      :
                    {
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "coin",
                    "size_x"    : 30,
                    "size_y"    : 30,
                    "scaling"   : "keep_y",
                    "pos_x"     : -45,
                    "pos_y"     : 68,
                    "pos_z"     : 61.0,
                    "asset"     : "CommonUI/A_shared_small_coin_icon.png",
                    "tag"       : "empty_touch"
                }
            ],
            "labels" :
            [
               {
                    "name"      : "title_label",
                    "font_size" : 24,
                    "pos_x"     : 0,
                    "pos_y"     : -65,
                    "pos_z"     : 61.0,
                    "size_x"    : 450,
                    "size_y"    : 40,
                    "color_r"   : 30,
                    "color_g"   : 30,
                    "color_b"   : 30,
                    "justify"   : "center",
                    "weight"    : "bold",
                    "tag"       : "display_mission_title_label"
               },
               {
                    "name"      : "desc_label",
                    "font_size" : 15,
                    "pos_x"     : 0,
                    "pos_y"     : 18,
                    "pos_z"     : 61.0,
                    "size_x"    : 350,
                    "size_y"    : 80,
                    "wrap"      : "newline",
                    "color_r"   : 30,
                    "color_g"   : 30,
                    "color_b"   : 30,
                    "justify"   : "left",
                    "v_align"   : "top",
                    "weight"    : "bold",
                    "tag"       : "display_mission_description_label"
               },
               {
                    "name"      : "reward_label",
                    "font_size" : 18,
                    "pos_x"     : 0,
                    "pos_y"     : 68,
                    "pos_z"     : 61.0,
                    "size_x"    : 70,
                    "size_y"    : 30,
                    "color_r"   : 30,
                    "color_g"   : 30,
                    "color_b"   : 30,
                    "justify"   : "right",
                    "weight"    : "bold",
                    "tag"       : "display_mission_reward_label"
               }
            ]
        },
        "completed_mission_popups" :
        {
            "images" :
            [
                {
                    "name"      : "background_catchall",
                    "size_x"    : 2048,
                    "size_y"    : 1536,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 0.0,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "back",
                    "scaling"   : "keep_y",
                    "size_x"    : 700,
                    "size_y"    : 410,
                    "pos_x"     : -20,
                    "pos_y"     : 5,
                    "pos_z"     : 60.0,
                    "asset"     : "SPR_MissionScreen/goals_popups_completed_bg@2x"
                },
                {
                    "name"      : "ok_exit",
                    "scaling"   : "keep_y",
                    "pos_origin": "rb",
                    "size_x"    : 220,
                    "size_y"    : 170,
                    "pos_x"     : 320,
                    "pos_y"     : 248,
                    "pos_z"     : 59.0,
                    "asset"     : "SPR_MissionScreen/goals_popups_ok_ribbon@2x",
                    "tag"       : "mission_popups_ok",
                    "args"      :
                    {
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "coin",
                    "size_x"    : 45,
                    "size_y"    : 45,
                    "pos_x"     : -24.5,
                    "pos_y"     : 58.5,
                    "pos_z"     : 61.0,
                    "scaling"   : "keep_y",
                    "asset"     : "CommonUI/A_shared_small_coin_icon.png",
                    "tag"       : "empty_touch"
                }
            ],
            "labels" :
            [
               {
                    "name"      : "mission_status_label",
                    "font_size" : 22,
                    "scale_x"   : 1.0,
                    "scale_y"   : 1.0,
                    "pos_x"     : 0,
                    "pos_y"     : -105,
                    "pos_z"     : 61.0,
                    "size_x"    : 250,
                    "size_y"    : 40,
                    "color_r"   : 30,
                    "color_g"   : 30,
                    "color_b"   : 30,
                    "justify"   : "center",
                    "text_key"  : "MissionCompleteTitle",
                    "weight"    : "bold"
               },
               {
                    "name"      : "title_label",
                    "font_size" : 18,
                    "scale_x"   : 1.0,
                    "scale_y"   : 1.0,
                    "pos_x"     : 0,
                    "pos_y"     : -65,
                    "pos_z"     : 61.0,
                    "size_x"    : 300,
                    "size_y"    : 30,
                    "color_r"   : 30,
                    "color_g"   : 30,
                    "color_b"   : 30,
                    "justify"   : "center",
                    "weight"    : "bold",
                    "tag"       : "display_mission_title_label"
               },
               {
                    "name"      : "completion_label",
                    "font_size" : 15,
                    "scale_x"   : 1.0,
                    "scale_y"   : 1.0,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 61.0,
                    "size_x"    : 350,
                    "size_y"    : 90,
                    "wrap"      : "newline",
                    "color_r"   : 30,
                    "color_g"   : 30,
                    "color_b"   : 30,
                    "justify"   : "left",
                    "v_align"   : "top",
                    "weight"    : "bold",
                    "tag"       : "display_mission_completion_text_label"
               },
               {
                    "name"      : "reward_label",
                    "font_size" : 22,
                    "scale_x"   : 1.0,
                    "scale_y"   : 1.0,
                    "pos_x"     : 30,
                    "pos_y"     : 62,
                    "pos_z"     : 61.0,
                    "size_x"    : 70,
                    "size_y"    : 36,
                    "color_r"   : 30,
                    "color_g"   : 30,
                    "color_b"   : 30,
                    "justify"   : "right",
                    "weight"    : "bold",
                    "tag"       : "display_mission_reward_label"
               }
            ]
        },
        "mission_button_effect":
        {
            "pos_z"             : 1.0,
            "images" :
            [
                {
                    "name"      : "glow1",
                    "scaling"   : "keep_y",
                    "size_x"    : 100,
                    "pos_x_adj" : -20,
                    "size_y"    : 100,
                    "pos_origin": "rb",
                    "pos_x"     : 765,
                    "pos_y"     : 486,
                    "pos_z"     : 0,
                    "asset"     : "MissionScreen/goals_book_btn_glow@2x.png",
                    "tag"       : "mission_button_glow",
                    "args"      :
                    {
                        "gap"   :  0,
                        "uv"    : [0, 0, 1, 1]
                    }
                },
                {
                    "name"      : "glow1",
                    "scaling"   : "keep_y",
                    "size_x"    : 100,
                    "pos_x_adj" : -20,
                    "size_y"    : 100,
                    "pos_origin": "rb",
                    "pos_x"     : 765,
                    "pos_y"     : 486,
                    "pos_z"     : 0,
                    "asset"     : "MissionScreen/goals_book_btn_glow@2x.png",
                    "tag"       : "mission_button_glow",
                    "args"      :
                    {
                        "gap"   :  1400,
                        "uv"    : [1, 1, -1, -1]
                    }
                }
            ]
        },
        "mission_button_toast":
        {
            "pos_z"             : 1.1,
            "images" :
            [
                {
                    "name"      : "toast",
                    "scaling"   : "keep_y",
                    "size_x"    : 1,
                    "size_y"    : 70,
                    "pos_origin": "rb",
                    "pos_x"     : 272,
                    "pos_y"     : 473,
                    "pos_z"     : 0.0,
                    "asset"     : "MissionScreen/goals_toast_tab@2x.png",
                    "tag"       : "mission_button_toast",
                    "args"      :
                    {
                        "sound" : "goals_task_complete.wav"
                    }
                }
            ],
            "labels" :
            [
               {
                    "name"      : "toast_label",
                    "font_size" : 18,
                    "pos_x"     : 480,
                    "pos_y"     : 435,
                    "pos_z"     : 1.0,
                    "size_x"    : 250,
                    "size_y"    : 80,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "text"      : "-",
                    "justify"   : "left",
                    "weight"    : "bold",
                    "tag"       : "mission_button_toast"
               },
               {
                    "name"      : "toast_label_shadow",
                    "font_size" : 18,
                    "pos_x"     : 482,
                    "pos_y"     : 437,
                    "pos_z"     : 0.0,
                    "size_x"    : 250,
                    "size_y"    : 80,
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "text"      : "-",
                    "justify"   : "left",
                    "weight"    : "bold",
                    "tag"       : "mission_button_toast"
               }
            ]
        },
        "mission_button_body":
        {
            "pos_z"             : 1.2,
            "images" :
            [
                {
                    "name"      : "mission",
                    "scaling"   : "keep_y",
                    "size_x"    : 97.5,
                    "size_y"    : 97.5,
                    "pos_origin": "rb",
                    "pos_x"     : 756.5,
                    "pos_x_adj" : -20,
                    "pos_y"     : 480,
                    "pos_z"     : 7.0,
                    "hide_idle" : true,
                    "tag"       : "mission_button_body",
                    "asset"     : "MissionScreen/goals_new_goals_btn.png",
                    "args"      :
                    {
                        "sound" : "goals_task_complete.wav"
                    }
                }
            ]
        },
        "wanderer_overhead_bubble" :
        {
            "pos_x"             : 0.0,
            "pos_y"             : -12.0,
            "pos_z"             : -1.0,
            "images":
            [
                {
                    "name"      : "wanderer_bubble",
                    "scaling"   : "keep_y",
                    "size_x"    : 96,
                    "size_y"    : 96,
                    "pos_x"     : 0,
                    "pos_y"     : -48,
                    "pos_z"     : 0,
                    "asset"     : "InGameScreen/smallIconBubble.png",
                    "tag"       : "overhead_bubble",
                    "func"      : "bubble"
                },
                {
                    "name"      : "wanderer_bubble",
                    "scaling"   : "keep_y",
                    "size_x"    : 46,
                    "size_y"    : 57.5,
                    "pos_x"     : 0,
                    "pos_y"     : -43,
                    "pos_z"     : 1.1,
                    "asset"     : "InGameScreen/avatarbubble.png",
                    "tag"       : "overhead_bubble",
                    "func"      : "frame"
                },
                {
                    "name"      : "wanderer_icon",
                    "scaling"   : "keep_y",
                    "size_x"    : 36,
                    "size_y"    : 36,
                    "pos_x"     : 0,
                    "pos_y"     : -48,
                    "pos_z"     : 1,
                    "tag"       : "overhead_bubble",
                    "func"      : "icon"
                }
            ]
        },
        "new_job_status" :
        {
            "pos_z"   : 1,
            "images":
            [
                {
                    "name"      : "background_catchall",
                    "size_x"    : 3000,
                    "size_y"    : 3000,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 7.0,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "close_global_widget"
                },
                {
                    "name"      : "status_background",
                    "pos_origin": "lt",
                    "size_x"    : 292,
                    "size_y"    : 350,
                    "pos_x"     : -149,
                    "pos_y"     : -175,
                    "pos_z"     : 7.5,
                    "asset"     : "CommonUI/bubble_pop_large_3.png",
                    "tag"       : "job_status_bg",
                    "args"      :
                    {
                        "alt_images" :
                        [
                            {
                                "asset"     : "CommonUI/bubble_pop_small_3.png",
                                "size_x"    : 292,
                                "size_y"    : 209
                            },
                            {
                                "asset"     : "CommonUI/bubble_pop_middle_3.png",
                                "size_x"    : 292,
                                "size_y"    : 281
                            }
                        ]
                    }
                },
                {
                    "name"      : "status_type_image",
                    "scaling"   : "keep_min",
                    "size_x"    : 75,
                    "size_y"    : 75,
                    "pos_x"     : -140,
                    "pos_y"     : -165,
                    "pos_z"     : 8,
                    "asset"     : "CommonUI/ad_coin@2x.png",
                    "tag"       : "obj_state_image"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "job_status_type_label",
                    "font_size" : 12,
                    "pos_x"     : 10,
                    "pos_y"     : -140,
                    "pos_z"     : 9,
                    "size_x"    : 220,
                    "size_y"    : 50,
                    "wrap"      : "newline",
                    "text"      : "钱不是人生的全部 有的话很好 没有的话不方便 当然方便的好啰",
                    "weight"    : "bold",
                    "justify"   : "left",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "tag"       : "obj_job_state_text"
                },
                {
                    "name"      : "job_status_time",
                    "font_size" : 14,
                    "size_x"    : 60,
                    "size_y"    : 50,
                    "pos_x"     : 83,
                    "pos_y"     : -95,
                    "pos_z"     : 9,
                    "text"      : "99%",
                    "justify"   : "center",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1,
                    "tag"       : "obj_state_time_remaining_percent"
                },
                {
                    "name"      : "job_status_time_remaining",
                    "font_size" : 12,
                    "pos_x"     : 0,
                    "pos_y"     : -75,
                    "pos_z"     : 9,
                    "text"      : "还有365天灭亡",
                    "size_x"    : 200,
                    "size_y"    : 50,
                    "justify"   : "center",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1,
                    "tag"       : "obj_state_time_remaining_full"
                }
            ],
            "composite" :
            [
                {
                    "name"              : "job_progress",
                    "size_x"            : 170,
                    "size_y"            : 18,
                    "pos_x"             : -24,
                    "pos_y"             : -85,
                    "pos_z"             : 8,
                    "controller"        : "progress_bar",
                    "controller_args"   :
                    {
                        "progress_image"    : "CommonUI/progressbar_blue.png",
                        "progress_bg_image" : "CommonUI/progressbar_base.png",
                        "progress_size"     :
                        {
                            "width": 170,
                            "left": 12,
                            "right": 12
                        }
                    },
                    "args" :
                    {
                        "background"        : "CommonUI/alpha.png"
                    }
                }
            ]
        },
        "new_job_status_boost" :
        {
            "images":
            [
                {
                    "name"      : "status_boost_button",
                    "scaling"   : "keep_min",
                    "size_x"    : 231,
                    "size_y"    : 41,
                    "pos_x"     : -17,
                    "pos_y"     : 126,
                    "pos_z"     : 8,
                    "asset"     : "CommonUI/btn_dialogue_green.png",
                    "tag"       : "job_status_shorten",
                    "args"      :
                    {
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "status_hourglass",
                    "scaling"   : "keep_min",
                    "size_x"    : 71,
                    "size_y"    : 63,
                    "pos_x"     : 103,
                    "pos_y"     : 129,
                    "pos_z"     : 8.1,
                    "asset"     : "CommonUI/item_hourGlass_btn.png"
                },
                {
                    "name"      : "status_hourglass",
                    "scaling"   : "keep_min",
                    "size_x"    : 260,
                    "size_y"    : 90,
                    "pos_x"     : -17,
                    "pos_y"     : 126,
                    "pos_z"     : 7.9,
                    "color_a"   : 0.0,
                    "asset"     : "CommonUI/white.png",
                    "tag"       : "empty_touch"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "job_status_shorten",
                    "font_size" : 19,
                    "pos_x"     : -34,
                    "pos_y"     : 125,
                    "pos_z"     : 9,
                    "text_key"  : "BoostButtonLabel",
                    "size_x"    : 200,
                    "size_y"    : 30,
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold"
                },
                {
                    "name"      : "job_status_shorten_cost",
                    "font_size" : 24,
                    "pos_x"     : 96.5,
                    "pos_y"     : 125.5,
                    "pos_z"     : 9.1,
                    "text"      : "?",
                    "size_x"    : 45,
                    "size_y"    : 45,
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "tag"       : "obj_state_time_shorten_cost"
                },
                {
                    "name"      : "job_status_shorten_cost",
                    "font_size" : 24,
                    "pos_x"     : 98.5,
                    "pos_y"     : 127.5,
                    "pos_z"     : 9,
                    "text"      : "?",
                    "size_x"    : 45,
                    "size_y"    : 45,
                    "color_r"   : 32,
                    "color_g"   : 32,
                    "color_b"   : 200,
                    "justify"   : "center",
                    "weight"    : "bold",
                    "tag"       : "obj_state_time_shorten_cost"
                }
            ]
        },
        "new_job_status_deco" :
        {
            "images":
            [
                {
                    "name"      : "status_plate_deco",
                    "scaling"   : "keep_min",
                    "size_x"    : 126,
                    "size_y"    : 52,
                    "pos_x"     : -71,
                    "pos_y"     : -18,
                    "pos_z"     : 8,
                    "asset"     : "CommonUI/dialogue_plate_01.png"
                },
                {
                    "name"      : "status_icon_deco",
                    "scaling"   : "keep_min",
                    "size_x"    : 46,
                    "size_y"    : 46,
                    "pos_x"     : -112,
                    "pos_y"     : -29,
                    "pos_z"     : 8.1,
                    "asset"     : "CommonUI/newIcon_deco.png"
                },
                {
                    "name"      : "status_text_deco",
                    "scaling"   : "keep_min",
                    "size_x"    : 120,
                    "size_y"    : 19,
                    "pos_x"     : -71,
                    "pos_y"     : -3,
                    "pos_z"     : 8.2,
                    "asset"     : "CommonUI/dialogue_text_01_02.png"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "job_status_desc",
                    "font_size" : 18,
                    "pos_x"     : -60,
                    "pos_y"     : -29,
                    "pos_z"     : 9,
                    "size_x"    : 80,
                    "size_y"    : 50,
                    "text"      : "+11%",
                    "justify"   : "center",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1,
                    "tag"       : "new_job_status_desc",
                    "args"      :
                    {
                        "func"      : "EffectGain"
                    }
                }
            ]
        },
        "new_job_status_prod" :
        {
            "images":
            [
                {
                    "name"      : "status_plate_prod_level",
                    "scaling"   : "keep_min",
                    "size_x"    : 126,
                    "size_y"    : 52,
                    "pos_x"     : 63,
                    "pos_y"     : -18,
                    "pos_z"     : 8,
                    "asset"     : "CommonUI/dialogue_plate_01.png"
                },
                {
                    "name"      : "status_icon_prod_level",
                    "scaling"   : "keep_min",
                    "size_x"    : 46,
                    "size_y"    : 46,
                    "pos_x"     : 26,
                    "pos_y"     : -29,
                    "pos_z"     : 8.1,
                    "asset"     : "CommonUI/newIcon_kyoka.png"
                },
                {
                    "name"      : "status_text_prod_level",
                    "scaling"   : "keep_min",
                    "size_x"    : 79,
                    "size_y"    : 19,
                    "pos_x"     : 63,
                    "pos_y"     : -3,
                    "pos_z"     : 8.1,
                    "asset"     : "CommonUI/dialogue_text_01_01.png"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "job_status_desc",
                    "font_size" : 18,
                    "pos_x"     : 76,
                    "pos_y"     : -27,
                    "pos_z"     : 9,
                    "size_x"    : 80,
                    "size_y"    : 50,
                    "text"      : "11",
                    "justify"   : "center",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1,
                    "tag"       : "new_job_status_desc",
                    "args"      :
                    {
                        "func"      : "ProductLevel"
                    }
                }
            ]
        },
        "new_job_status_help" :
        {
            "images":
            [
                {
                    "name"      : "status_icon_help",
                    "scaling"   : "keep_min",
                    "size_x"    : 56,
                    "size_y"    : 56,
                    "pos_x"     : -96,
                    "pos_y"     : 54,
                    "pos_z"     : 8.1,
                    "color_r"   : 1.0,
                    "asset"     : "CommonUI/white.png",
                    "tag"       : "new_job_status_desc",
                    "args"      :
                    {
                        "func"  : "helpedAvatarIcon"
                    }
                },
                {
                    "name"      : "status_plate_help",
                    "scaling"   : "keep_min",
                    "size_x"    : 256,
                    "size_y"    : 56,
                    "pos_x"     : -4,
                    "pos_y"     : 57,
                    "pos_z"     : 8,
                    "asset"     : "CommonUI/dialogue_plate_02.png"
                },
                {
                    "name"      : "status_text_help",
                    "scaling"   : "keep_min",
                    "size_x"    : 150,
                    "size_y"    : 19,
                    "pos_x"     : 26,
                    "pos_y"     : 74,
                    "pos_z"     : 8.1,
                    "asset"     : "CommonUI/dialogue_text_02.png"
                },
                {
                    "name"      : "status_text_help_harvest",
                    "scaling"   : "keep_min",
                    "size_x"    : 150,
                    "size_y"    : 19,
                    "pos_x"     : 26,
                    "pos_y"     : 74,
                    "pos_z"     : 0,
                    "asset"     : "CommonUI/dialogue_text_03.png"
                }
            ],
            "labels" :
            [
                {
                    "name"      : "job_status_desc",
                    "font_size" : 16,
                    "pos_x"     : 0,
                    "pos_y"     : 49,
                    "pos_z"     : 9,
                    "size_x"    : 120,
                    "size_y"    : 50,
                    "text_key"  : "JobStatusDidntHelp",
                    "justify"   : "left",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1,
                    "tag"       : "new_job_status_desc",
                    "args"      :
                    {
                        "func"      : "HelpedUserName"
                    }
                },
                {
                    "name"      : "job_status_desc",
                    "font_size" : 18,
                    "pos_x"     : 89,
                    "pos_y"     : 49,
                    "pos_z"     : 14,
                    "size_x"    : 80,
                    "size_y"    : 50,
                    "text"      : "+19%",
                    "justify"   : "center",
                    "color_r"   : 64,
                    "color_g"   : 64,
                    "color_b"   : 47,
                    "color_a"   : 1,
                    "tag"       : "new_job_status_desc",
                    "args"      :
                    {
                        "func"      : "RaisingRate"
                    }
                }
            ]
        },
        "LackEnergyContent":
        {
            "images":
            [
                {
                    "name"      : "go_social_bg",
                    "size_x"    : 450,
                    "size_y"    : 66,
                    "pos_x"     : 0,
                    "pos_y"     : 10,
                    "pos_z"     : 80.2,
                    "asset"     : "BuildBuyScreen/sheet_beige.png"
                },
                {
                    "name"      : "go_social_icon",
                    "scaling"   : "keep_y",
                    "size_x"    : 85,
                    "size_y"    : 73,
                    "pos_x"     : -180,
                    "pos_y"     : 10,
                    "pos_z"     : 80.3,
                    "asset"     : "CommonUI/item_crown.png"
                },
                {
                    "name"      : "go_social_button",
                    "size_x"    : 130,
                    "size_y"    : 40,
                    "pos_x"     : 145,
                    "pos_y"     : 10,
                    "pos_z"     : 80.3,
                    "asset"     : "CommonUI/BtnOrange_v2.png",
                    "func"      : "goSocial",
                    "tag"       : "confirm_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "buy_recover_bg",
                    "size_x"    : 450,
                    "size_y"    : 66,
                    "pos_x"     : 0,
                    "pos_y"     : 84,
                    "pos_z"     : 80.2,
                    "asset"     : "BuildBuyScreen/sheet_beige.png"
                },
                {
                    "name"      : "buy_recover_icon",
                    "scaling"   : "keep_y",
                    "size_x"    : 80,
                    "size_y"    : 80,
                    "pos_x"     : -180,
                    "pos_y"     : 84,
                    "pos_z"     : 80.3,
                    "asset"     : "BuildBuyScreen/item_energyPotion.png"
                },
                {
                    "name"      : "buy_recover_button",
                    "size_x"    : 130,
                    "size_y"    : 40,
                    "pos_x"     : 145,
                    "pos_y"     : 84,
                    "pos_z"     : 80.3,
                    "asset"     : "CommonUI/BtnGreen_v2.png",
                    "func"      : "buyRecover",
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
                    "name"      : "lack_energy_text",
                    "font_size" : 14,
                    "size_x"    : 440,
                    "size_y"    : 90,
                    "pos_x"     : 0,
                    "pos_y"     : -60,
                    "pos_z"     : 80.9,
                    "text"      : "",
                    "justify"   : "left",
                    "color_r"   : 44,
                    "color_g"   : 44,
                    "color_b"   : 44,
                    "color_a"   : 1.0,
                    "wrap"      : "newline",
                    "text_key"  : "LackEnergyPopUpText",
                    "line_len"  : 40,
                    "tag"       : "label_value"
                },
                {
                    "name"      : "go_social_desc",
                    "font_size" : 12,
                    "pos_x"     : -30,
                    "pos_y"     : 10,
                    "pos_z"     : 80.9,
                    "size_x"    : 200,
                    "size_y"    : 80,
                    "color_r"   : 44,
                    "color_g"   : 44,
                    "color_b"   : 44,
                    "color_a"   : 1.0,
                    "wrap"      : "newline",
                    "justify"   : "left",
                    "text_key"  : "PopUpGoSocialDesc"
                },
                {
                    "name"      : "go_social_label",
                    "font_size" : 20,
                    "pos_x"     : 145,
                    "pos_y"     : 10,
                    "pos_z"     : 80.9,
                    "size_x"    : 130,
                    "size_y"    : 50,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "justify"   : "center",
                    "wrap"      : "shrink",
                    "weight"    : "bold",
                    "text_key"  : "PopUpGoSocialLabel"
                },
                {
                    "name"      : "buy_recover_desc",
                    "font_size" : 12,
                    "pos_x"     : -30,
                    "pos_y"     : 84,
                    "pos_z"     : 80.9,
                    "size_x"    : 200,
                    "size_y"    : 80,
                    "color_r"   : 44,
                    "color_g"   : 44,
                    "color_b"   : 44,
                    "color_a"   : 1.0,
                    "wrap"      : "newline",
                    "justify"   : "left",
                    "text_key"  : "BuyRecoverDesc",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "buy_recover_button_label",
                    "font_size" : 20,
                    "pos_x"     : 145,
                    "pos_y"     : 84,
                    "pos_z"     : 80.9,
                    "size_x"    : 130,
                    "size_y"    : 50,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "wrap"      : "shrink",
                    "justify"   : "center",
                    "tag"       : "label_value"
                }
            ]
        },
        "ConfirmUseContent":
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
                    "name"      : "items_from_to_arrow",
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
                    "name"      : "confirm_use_item_desc",
                    "font_size" : 14,
                    "pos_origin": "l",
                    "pos_x"     : -20,
                    "pos_y"     : -50,
                    "pos_z"     : 80.9,
                    "size_x"    : 240,
                    "size_y"    : 120,
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "weight"    : "bold",
                    "wrap"      : "newline",
                    "justify"   : "left",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "confirm_use_item_count_label",
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
                    "name"      : "confirm_use_item_count_from",
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
                    "name"      : "confirm_use_item_count_to",
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
                }
            ]
        },
        "ConfirmRecoverEnergyContent":
        {
            "images":
            [
                {
                    "name"      : "energy_from_to_arrow2",
                    "size_x"    : 23,
                    "size_y"    : 25,
                    "pos_x"     : 50,
                    "pos_y"     : 40,
                    "pos_z"     : 80.3,
                    "asset"     : "CommonUI/arrow_brown.png"
                }
            ],
            "labels":
            [
                {
                    "name"      : "confirm_recover_energy_label",
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
                    "text_key"  : "EnergyLabel"
                },
                {
                    "name"      : "confirm_recover_energy_from",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : 0,
                    "pos_y"     : 40,
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
                    "name"      : "confirm_recover_energy_to",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : 80,
                    "pos_y"     : 40,
                    "pos_z"     : 80.9,
                    "size_x"    : 100,
                    "size_y"    : 50,
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "weight"    : "bold",
                    "justify"   : "left",
                    "tag"       : "label_value"
                }
            ]
        },
        "EnergyRecoveredContent":
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
                }
            ],
            "labels":
            [
                {
                    "name"      : "energy_recovered_desc",
                    "font_size" : 14,
                    "pos_origin": "l",
                    "pos_x"     : -20,
                    "pos_y"     : -50,
                    "pos_z"     : 80.9,
                    "size_x"    : 240,
                    "size_y"    : 120,
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "weight"    : "bold",
                    "wrap"      : "newline",
                    "justify"   : "left",
                    "text_key"  : "RecoverEnergyResultDesc",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "energy_recovered_item_count_label",
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
                    "name"      : "energy_recovered_item_count",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : 0,
                    "pos_y"     : 10,
                    "pos_z"     : 80.9,
                    "size_x"    : 200,
                    "size_y"    : 50,
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "weight"    : "bold",
                    "justify"   : "left",
                    "tag"       : "label_value"
                },
                {
                    "name"      : "energy_recovered_energy_label",
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
                    "text_key"  : "EnergyLabel"
                },
                {
                    "name"      : "energy_recovered_result",
                    "font_size" : 16,
                    "pos_origin": "l",
                    "pos_x"     : 0,
                    "pos_y"     : 40,
                    "pos_z"     : 80.9,
                    "size_x"    : 200,
                    "size_y"    : 50,
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "weight"    : "bold",
                    "justify"   : "left",
                    "text_key"  : "RecoverEnergyResultEnergy",
                    "tag"       : "label_value"
                }
            ]
        },


        "job_delivered" :
        {
            "images":
            [
                {
                    "name"      : "popup_background",
                    "size_x"    : 854,
                    "size_y"    : 480,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 500,
                    "size_y"    : 300,
                    "pos_x"     : 6,
                    "pos_y"     : 0,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/UI_372x232.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "popup_top",
                    "size_x"    : 500,
                    "size_y"    : 80,
                    "pos_x"     : 6,
                    "pos_y"     : -109,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/UI_372x232_3.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "delivered_item",
                    "size_x"    : 256,
                    "size_y"    : 128,
                    "pos_x"     : 0,
                    "pos_y"     : -16,
                    "pos_z"     : 9.2,
                    "asset"     : "cheer.png"
                },
                {
                    "name"      : "delivered_reward_gold",
                    "size_x"    : 30,
                    "size_y"    : 30,
                    "pos_x"     : -60,
                    "pos_y"     : 54,
                    "pos_z"     : 9.3,
                    "asset"     : "resIcon_gold.png"
                },
                {
                    "name"      : "delivered_reward_xp",
                    "size_x"    : 30,
                    "size_y"    : 30,
                    "pos_x"     : 30,
                    "pos_y"     : 54,
                    "pos_z"     : 9.3,
                    "asset"     : "resIcon_xp.png"
                },
                {
                    "name"      : "popup_yes_button",
                    "size_x"    : 190,
                    "size_y"    : 44,
                    "pos_x"     : 0,
                    "pos_y"     : 96,
                    "pos_z"     : 9.2,
                    "asset"     : "CommonUI/Btn_Blue_lrg.png",
                    "tag"       : "popup_yes_button",
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
                    "name"      : "delivered_text",
                    "font_size" : 20,
                    "scale_x"   : 1.1,
                    "scale_y"   : 1.1,
                    "pos_x"     : 0,
                    "pos_y"     : -110,
                    "pos_z"     : 9.9,
                    "size_x"    : 450,
                    "size_y"    : 50,
                    "wrap"      : "shrink",
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_1"
                },
                {
                    "name"      : "delivered_amount_coin",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 10,
                    "pos_y"     : 54,
                    "pos_z"     : 9.9,
                    "size_x"    : 100,
                    "size_y"    : 30,
                    "text"      : "",
                    "justify"   : "left",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "game_label_2"
                },
                {
                    "name"      : "delivered_amount_xp",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 98,
                    "pos_y"     : 54,
                    "pos_z"     : 9.9,
                    "size_x"    : 100,
                    "size_y"    : 30,
                    "text"      : "",
                    "justify"   : "left",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "game_label_3"
                },
                {
                    "name"      : "yes_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 94,
                    "pos_z"     : 9.9,
                    "size_x"    : 300,
                    "size_y"    : 50,
                    "text"      : "Hooray",
                    "weight"    : "bold",
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0
                }
            ]
        },
        "job_failed" :
        {
            "images":
            [
                {
                    "name"      : "popup_background",
                    "size_x"    : 854,
                    "size_y"    : 480,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 500,
                    "size_y"    : 300,
                    "pos_x"     : 6,
                    "pos_y"     : 0,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/UI_372x232.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "popup_top",
                    "size_x"    : 500,
                    "size_y"    : 80,
                    "pos_x"     : 6,
                    "pos_y"     : -109,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/UI_372x232_3.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "delivered_item",
                    "size_x"    : 256,
                    "size_y"    : 128,
                    "pos_x"     : 0,
                    "pos_y"     : -16,
                    "pos_z"     : 9.2,
                    "asset"     : "jeer.png"
                },
                {
                    "name"      : "delivered_reward_gold",
                    "size_x"    : 30,
                    "size_y"    : 30,
                    "pos_x"     : -60,
                    "pos_y"     : 54,
                    "pos_z"     : 9.3,
                    "asset"     : "resIcon_gold.png"
                },
                {
                    "name"      : "delivered_reward_xp",
                    "size_x"    : 30,
                    "size_y"    : 30,
                    "pos_x"     : 30,
                    "pos_y"     : 54,
                    "pos_z"     : 9.3,
                    "asset"     : "resIcon_xp.png"
                },
                {
                    "name"      : "popup_yes_button",
                    "size_x"    : 190,
                    "size_y"    : 44,
                    "pos_x"     : 0,
                    "pos_y"     : 96,
                    "pos_z"     : 9.2,
                    "asset"     : "CommonUI/Btn_Blue_lrg.png",
                    "tag"       : "popup_yes_button",
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
                    "name"      : "delivered_text",
                    "font_size" : 20,
                    "scale_x"   : 1.2,
                    "scale_y"   : 1.2,
                    "pos_x"     : 0,
                    "pos_y"     : -109,
                    "pos_z"     : 9.9,
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_1"
                },
                {
                    "name"      : "delivered_amount_coin",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : -30,
                    "pos_y"     : 57,
                    "pos_z"     : 9.9,
                    "text"      : "",
                    "justify"   : "left",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "game_label_2"
                },
                {
                    "name"      : "delivered_amount_xp",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 60,
                    "pos_y"     : 57,
                    "pos_z"     : 9.9,
                    "text"      : "",
                    "justify"   : "left",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "game_label_3"
                },
                {
                    "name"      : "yes_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 98,
                    "pos_z"     : 9.9,
                    "text"      : "Awww...",
                    "weight"    : "bold",
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0
                }
            ]
        },
        "job_completed" :
        {
            "images":
            [
                {
                    "name"      : "popup_background",
                    "size_x"    : 854,
                    "size_y"    : 480,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 500,
                    "size_y"    : 300,
                    "pos_x"     : 6,
                    "pos_y"     : 10,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/UI_372x232.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "popup_top",
                    "size_x"    : 500,
                    "size_y"    : 80,
                    "pos_x"     : 6,
                    "pos_y"     : -99,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/UI_372x232_2.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "delivered_item",
                    "size_x"    : 80,
                    "size_y"    : 80,
                    "pos_x"     : 0,
                    "pos_y"     : -20,
                    "pos_z"     : 9.2,
                    "asset"     : "",
                    "tag"       : "game_asset_1"
                },
                {
                    "name"      : "popup_yes_button",
                    "size_x"    : 190,
                    "size_y"    : 44,
                    "pos_x"     : 0,
                    "pos_y"     : 96,
                    "pos_z"     : 9.2,
                    "asset"     : "CommonUI/Btn_Blue_lrg.png",
                    "tag"       : "popup_yes_button",
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
                    "name"      : "popup_box_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 40,
                    "pos_z"     : 9.9,
                    "size_x"    : 460,
                    "size_y"    : 50,
                    "wrap"      : "shrink",
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_2"
                },
                {
                    "name"      : "requester_name_text",
                    "font_size" : 20,
                    "scale_x"   : 1.2,
                    "scale_y"   : 1.2,
                    "pos_x"     : 0,
                    "pos_y"     : -121,
                    "pos_z"     : 9.9,
                    "size_x"    : 460,
                    "size_y"    : 50,
                    "wrap"      : "shrink",
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_3"
                },
                {
                    "name"      : "hasdelivered_text",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : -96,
                    "pos_z"     : 9.9,
                    "size_x"    : 400,
                    "size_y"    : 34,
                    "text"      : "has delivered",
                    "color_r"   : 171,
                    "color_g"   : 209,
                    "color_b"   : 236,
                    "color_a"   : 1.0,
                    "justify"   : "center"
                },
                {
                    "name"      : "yes_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 94,
                    "pos_z"     : 9.9,
                    "size_x"    : 300,
                    "size_y"    : 50,
                    "text"      : "",
                    "tag"       : "game_label_1",
                    "weight"    : "bold",
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0
                }
            ]
        },
        "job_delivery_spoil" :
        {
            "images":
            [
                {
                    "name"      : "popup_background",
                    "size_x"    : 854,
                    "size_y"    : 480,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "popup_background",
                    "size_x"    : 500,
                    "size_y"    : 300,
                    "pos_x"     : 6,
                    "pos_y"     : 10,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/UI_372x232.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "popup_top",
                    "size_x"    : 500,
                    "size_y"    : 80,
                    "pos_x"     : 6,
                    "pos_y"     : -99,
                    "pos_z"     : 9.1,
                    "asset"     : "CommonUI/UI_372x232_2.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "delivered_item",
                    "size_x"    : 80,
                    "size_y"    : 80,
                    "pos_x"     : 0,
                    "pos_y"     : -20,
                    "pos_z"     : 9.2,
                    "asset"     : "",
                    "tag"       : "game_asset_1"
                },
                {
                    "name"      : "popup_yes_button",
                    "size_x"    : 190,
                    "size_y"    : 44,
                    "pos_x"     : 0,
                    "pos_y"     : 96,
                    "pos_z"     : 9.2,
                    "asset"     : "CommonUI/Btn_Blue_lrg.png",
                    "tag"       : "popup_yes_button",
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
                    "name"      : "popup_box_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 40,
                    "pos_z"     : 9.9,
                    "size_x"    : 460,
                    "size_y"    : 50,
                    "wrap"      : "shrink",
                    "weight"    : "bold",
                    "text"      : "",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_2"
                },
                {
                    "name"      : "requester_name_text",
                    "font_size" : 20,
                    "scale_x"   : 1.2,
                    "scale_y"   : 1.2,
                    "pos_x"     : 0,
                    "pos_y"     : -121,
                    "pos_z"     : 9.9,
                    "size_x"    : 460,
                    "size_y"    : 50,
                    "wrap"      : "shrink",
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_3"
                },
                {
                    "name"      : "failed_deliver_text",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : -96,
                    "size_x"    : 400,
                    "size_y"    : 34,
                    "pos_z"     : 9.9,
                    "text"      : "failed to deliver",
                    "color_r"   : 100,
                    "color_g"   : 100,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "justify"   : "center"
                },
                {
                    "name"      : "yes_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 94,
                    "pos_z"     : 9.9,
                    "size_x"    : 300,
                    "size_y"    : 50,
                    "weight"    : "bold",
                    "text"      : "",
                    "tag"       :   "game_label_1",
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0
                }
            ]
        },
        "accept_order" :
        {
            "pos_z"   : 7,
            "images":
            [
                {
                    "name"      : "order_background",
                    "size_x"    : 300,
                    "size_y"    : 427,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 7.1,
                    "asset"     : "InGameScreen/A_shared_clipboard.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "order_type",
                    "size_x"    : 64,
                    "size_y"    : 64,
                    "pos_x"     : -60,
                    "pos_y"     : -75,
                    "pos_z"     : 7.4,
                    "asset"     : "",
                    "tag"       : "game_asset_1"
                },
                {
                    "name"      : "order_reward_gold",
                    "size_x"    : 30,
                    "size_y"    : 29,
                    "pos_x"     : 10,
                    "pos_y"     : -65,
                    "pos_z"     : 7.7,
                    "asset"     : "CommonUI/A_shared_small_coin_icon.png"
                },
                {
                    "name"      : "popup_yes_button",
                    "size_x"    : 100,
                    "size_y"    : 50,
                    "pos_x"     : 60,
                    "pos_y"     : 135,
                    "pos_z"     : 9.2,
                    "asset"     : "CommonUI/BtnGreen_short@2x.png",
                    "tag"       : "popup_yes_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "popup_no_button",
                    "size_x"    : 100,
                    "size_y"    : 50,
                    "pos_x"     : -60,
                    "pos_y"     : 135,
                    "pos_z"     : 9.2,
                    "asset"     : "CommonUI/BtnRed_short@2x.png",
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
                    "name"      : "payment_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 40,
                    "pos_y"     : -106,
                    "pos_z"     : 7.74,
                    "size_x"    : 200,
                    "size_y"    : 30,
                    "text"      : "Payment:",
                    "justify"   : "center",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0
                },
                {
                    "name"      : "coin_label",
                    "font_size" : 14,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 80,
                    "pos_y"     : -78,
                    "pos_z"     : 7.74,
                    "size_x"    : 100,
                    "size_y"    : 20,
                    "justify"   : "left",
                    "text"      : "Coins",
                    "weight"    : "bold",
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0
                },
                {
                    "name"      : "coin_amount_label",
                    "font_size" : 16,
                    "scale_x"   : 1.1,
                    "scale_y"   : 1.1,
                    "pos_x"     : 85,
                    "pos_y"     : -62,
                    "pos_z"     : 7.74,
                    "size_x"    : 100,
                    "size_y"    : 40,
                    "text"      : "",
                    "justify"   : "left",
                    "weight"    : "bold",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "game_label_4"
                },
                {
                    "name"      : "job_label",
                    "font_size" : 16,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : -135,
                    "pos_z"     : 7.7,
                    "size_x"    : 280,
                    "size_y"    : 30,
                    "weight"    : "bold",
                    "text"      : "",
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_5"
                },
                {
                    "name"      : "job_friend",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : -10,
                    "pos_z"     : 7.78,
                    "size_x"    : 280,
                    "size_y"    : 50,
                    "wrap"      : "shrink",
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_3"
                },
                {
                    "name"      : "job_product",
                    "font_size" : 16,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 24,
                    "pos_z"     : 7.78,
                    "text"      : "",
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_2"
                },
                {
                    "name"      : "event_label",
                    "font_size" : 14,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 54,
                    "pos_z"     : 7.78,
                    "size_x"    : 280,
                    "size_y"    : 20,
                    "text"      : "",
                    "justify"   : "center",
                    "color_r"   : 95,
                    "color_g"   : 80,
                    "color_b"   : 23,
                    "color_a"   : 1.0,
                    "tag"       : "game_label_6"
                },
                {
                    "name"      : "accept_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 60,
                    "pos_y"     : 135,
                    "pos_z"     : 9.9,
                    "size_x"    : 200,
                    "size_y"    : 30,
                    "text"      : "Accept",
                    "tag"       : "popup_yes_button",
                    "weight"    : "bold",
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0
                },
                {
                    "name"      : "reject_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : -60,
                    "pos_y"     : 135,
                    "pos_z"     : 9.9,
                    "size_x"    : 200,
                    "size_y"    : 30,
                    "text"      : "Reject",
                    "tag"       : "popup_no_button",
                    "weight"    : "bold",
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0
                }
            ]
        },
        "place_order" :
        {
            "pos_z"   : 3,
            "images":
            [
                {
                    "name"      : "background_catchall",
                    "size_x"    : 3000,
                    "size_y"    : 3000,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 7.01,
                    "asset"     : "CommonUI/alpha.png",
                    "tag"       : "close_global_widget"
                },
                {
                    "name"      : "order_background",
                    "size_x"    : 300,
                    "size_y"    : 427,
                    "pos_x"     : 0,
                    "pos_y"     : 0,
                    "pos_z"     : 7.1,
                    "asset"     : "InGameScreen/A_shared_clipboard.png",
                    "tag"       : "empty_touch"
                },
                {
                    "name"      : "order_container",
                    "size_x"    : 250,
                    "size_y"    : 190,
                    "pos_x"     : 5,
                    "pos_y"     : -5,
                    "pos_z"     : 7.2,
                    "asset"     : "CommonUI/UI_372x232.png",
                    "tag"       : "request_job"
                },
                {
                    "name"      : "order_type",
                    "size_x"    : 64,
                    "size_y"    : 64,
                    "pos_x"     : 0,
                    "pos_y"     : -20,
                    "pos_z"     : 7.4,
                    "asset"     : "",
                    "tag"       : "game_asset_1"
                },
                {
                    "name"      : "order_reward_gold",
                    "size_x"    : 23,
                    "size_y"    : 22,
                    "pos_x"     : -16,
                    "pos_y"     : 53,
                    "pos_z"     : 7.7,
                    "asset"     : "CommonUI/A_shared_small_coin_icon.png"
                },
                {
                    "name"      : "order_reward_xp",
                    "size_x"    : 22,
                    "size_y"    : 22,
                    "pos_x"     : 44,
                    "pos_y"     : 53,
                    "pos_z"     : 7.7,
                    "asset"     : "InGameScreen/resIcon_XP.png"
                }
            ],
            "labels":
            [
                {
                    "name"      : "job_label",
                    "font_size" : 20,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : -135,
                    "pos_z"     : 7.7,
                    "size_x"    : 280,
                    "size_y"    : 40,
                    "text"      : "Place an Order",
                    "weight"    : "bold",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "justify"   : "center"
                },
                {
                    "name"      : "job_product",
                    "font_size" : 16,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : -72,
                    "pos_z"     : 7.78,
                    "size_x"    : 260,
                    "size_y"    : 40,
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_1"
                },
                {
                    "name"      : "job_product",
                    "font_size" : 16,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 0,
                    "pos_y"     : 22,
                    "pos_z"     : 7.78,
                    "size_x"    : 260,
                    "size_y"    : 20,
                    "text"      : "",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0,
                    "justify"   : "center",
                    "tag"       : "game_label_2"
                },
                {
                    "name"      : "job_reward_gold",
                    "font_size" : 14,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 9,
                    "pos_y"     : 55,
                    "pos_z"     : 7.78,
                    "size_x"    : 100,
                    "size_y"    : 20,
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "game_label_3"
                },
                {
                    "name"      : "job_reward_xp",
                    "font_size" : 14,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : 66,
                    "pos_y"     : 55,
                    "pos_z"     : 7.78,
                    "size_x"    : 100,
                    "size_y"    : 20,
                    "text"      : "",
                    "weight"    : "bold",
                    "color_r"   : 0,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "tag"       : "game_label_4"
                },
                {
                    "name"      : "job_reward_label",
                    "font_size" : 16,
                    "scale_x"   : 1,
                    "scale_y"   : 1,
                    "pos_x"     : -66,
                    "pos_y"     : 55,
                    "pos_z"     : 7.74,
                    "size_x"    : 100,
                    "size_y"    : 20,
                    "text"      : "Reward",
                    "weight"    : "bold",
                    "color_r"   : 163,
                    "color_g"   : 83,
                    "color_b"   : 24,
                    "color_a"   : 1.0
                }
            ]
        },
        "self_introduction" :
        {
            "images":
            [
                {
                    "name"      : "popup_background",
                    "scaling"   : "keep_x",
                    "size_x"    : 747,
                    "size_y"    : 424,
                    "pos_x"     : 20,
                    "pos_y"     : 20,
                    "pos_z"     : 80.1,
                    "asset"     : "SPR_IntroScreen/UI_372x232"
                },
                {
                    "name"      : "popup_header",
                    "scaling"   : "keep_x",
                    "size_x"    : 747,
                    "size_y"    : 69,
                    "size_y_ipad": 119,
                    "pos_x"     : 20,
                    "pos_y"     : -154,
                    "pos_z"     : 80.1,
                    "asset"     : "SPR_IntroScreen/UI_372x232_3"
                },
                {
                    "name"      : "close_button",
                    "scaling"   : "keep_min",
                    "size_x"    : 62,
                    "size_y"    : 62,
                    "pos_x"     : 312,
                    "pos_y"     : -155,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_IntroScreen/A_shared_mojostore_exit_btn",
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
                    "name"      : "confirm_yes_button",
                    "size_x"    : 130,
                    "size_y"    : 40,
                    "pos_x"     : 100,
                    "pos_y"     : 144,
                    "pos_y_ipad": 130,
                    "pos_z"     : 80.2,
                    "thru_restriction" : true,
                    "asset"     : "SPR_IntroScreen/BtnGreen_v2",
                    "func"      : "yes",
                    "tag"       : "confirm_button",
                    "args"      :
                    {
                        "exit_on_tap" : "1",
                        "sound" : "buttonpress.wav"
                    }
                },
                {
                    "name"      : "confirm_no_button",
                    "size_x"    : 130,
                    "size_y"    : 40,
                    "pos_x"     : -100,
                    "pos_y"     : 144,
                    "pos_y_ipad": 130,
                    "pos_z"     : 80.2,
                    "thru_restriction" : true,
                    "asset"     : "SPR_IntroScreen/BtnRed_v2",
                    "func"      : "no",
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
                    "name"      : "confirm_header",
                    "font_size" : 23,
                    "pos_x"     : -2,
                    "pos_y"     : -156,
                    "pos_z"     : 80.9,
                    "size_x"    : 460,
                    "size_y"    : 50,
                    "text"      : "",
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "tag"       : "confirm_ui",
                    "func"      : "header",
                    "color_a"   : 1.0
                },
                {
                    "name"      : "self_introduction_precaution",
                    "font_size" : 18,
                    "pos_origin": "l",
                    "pos_x"     : -235,
                    "pos_y"     : 60,
                    "pos_z"     : 89.9,
                    "size_x"    : 600,
                    "size_y"    : 300,
                    "text_key"  : "UserIntroductionPostPrecaution",
                    "justify"   : "left",
                    "v_align"   : "middle",
                    "color_r"   : 44,
                    "color_g"   : 44,
                    "color_b"   : 44,
                    "color_a"   : 1.0,
                    "line_len"  : 40,
                    "wrap"      : "newline"
                },
                {
                    "name"      : "self_introduction_error_message",
                    "font_size" : 20,
                    "pos_x"     : -97,
                    "pos_y"     : -10,
                    "pos_z"     : 89.9,
                    "size_x"    : 430,
                    "size_y"    : 0,
                    "text"      : "",
                    "justify"   : "left",
                    "v_align"   : "top",
                    "color_r"   : 255,
                    "color_g"   : 0,
                    "color_b"   : 0,
                    "color_a"   : 1.0,
                    "line_len"  : 40,
                    "wrap"      : "newline"
                },
                {
                    "name"      : "self_introduction_num_of_chars",
                    "font_size" : 20,
                    "pos_x"     : 345,
                    "pos_y"     : -10,
                    "pos_z"     : 89.9,
                    "size_x"    : 300,
                    "size_y"    : -5,
                    "text_key"  : "UserIntroductionPostDefaultTextLength",
                    "justify"   : "left",
                    "v_align"   : "top",
                    "color_r"   : 44,
                    "color_g"   : 44,
                    "color_b"   : 44,
                    "color_a"   : 1.0,
                    "line_len"  : 40,
                    "wrap"      : "newline"
                },
                {
                    "name"      : "confirm_yes",
                    "font_size" : 20,
                    "pos_x"     : 100,
                    "pos_y"     : 144,
                    "v_align_ipad": "top",
                    "pos_z"     : 80.9,
                    "size_x"    : 200,
                    "size_y"    : 50,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "text_key"  : "OkButtonLabel",
                    "justify"   : "center",
                    "weight"    : "bold",
                    "func"      : "yes"
                },
                {
                    "name"      : "confirm_no",
                    "font_size" : 20,
                    "pos_x"     : -100,
                    "pos_y"     : 144,
                    "v_align_ipad": "top",
                    "pos_z"     : 80.9,
                    "size_x"    : 200,
                    "size_y"    : 50,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "text_key"  : "CancelButtonLabel",
                    "weight"    : "bold",
                    "justify"   : "center",
                    "func"      : "no"
                }
            ],
            "controllerName" : "WeTextBoxController",
            "components" :
            [
                {
                    "name" : "self_introduction_input",
                    "className" : "WeTextBox",
                    "args" : {
                        "frame" : [ 115, 130, 630, 80 ],
                        "enterKeyType" : 1
                    }
                }
            ]
        },
        "self_introduction_update" :
        {
            "images":
            [
                {
                    "name"      : "popup_background",
                    "scaling"   : "keep_x",
                    "size_x"    : 747,
                    "size_y"    : 424,
                    "pos_x"     : 20,
                    "pos_y"     : 20,
                    "pos_z"     : 80.1,
                    "asset"     : "SPR_IntroScreen/UI_372x232"
                },
                {
                    "name"      : "popup_header",
                    "scaling"   : "keep_x",
                    "size_x"    : 747,
                    "size_y"    : 69,
                    "size_y_ipad": 119,
                    "pos_x"     : 20,
                    "pos_y"     : -154,
                    "pos_z"     : 80.1,
                    "asset"     : "SPR_IntroScreen/UI_372x232_3"
                },
                {
                    "name"      : "comment_bg",
                    "scaling"   : "keep_x",
                    "size_x"    : 608,
                    "size_y"    : 100,
                    "pos_x"     : 0,
                    "pos_y"     : -40,
                    "pos_z"     : 80.1,
                    "asset"     : "InGameScreen/comment_bg.png",
                    "tag"       : "simple_image"
                },
                {
                    "name"      : "close_button",
                    "scaling"   : "keep_min",
                    "size_x"    : 62,
                    "size_y"    : 62,
                    "pos_x"     : 312,
                    "pos_y"     : -155,
                    "pos_z"     : 80.2,
                    "asset"     : "SPR_IntroScreen/A_shared_mojostore_exit_btn",
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
                    "name"      : "confirm_ok_button",
                    "size_x"    : 190,
                    "size_y"    : 40,
                    "pos_x"     : 0,
                    "pos_y"     : 144,
                    "pos_y_ipad": 130,
                    "pos_z"     : 80.2,
                    "thru_restriction" : true,
                    "asset"     : "SPR_IntroScreen/BtnGreen_v2",
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
                    "name"      : "confirm_header",
                    "font_size" : 23,
                    "pos_x"     : -2,
                    "pos_y"     : -156,
                    "pos_z"     : 80.9,
                    "size_x"    : 460,
                    "size_y"    : 50,
                    "text"      : "",
                    "justify"   : "center",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "weight"    : "bold",
                    "tag"       : "confirm_ui",
                    "func"      : "header",
                    "color_a"   : 1.0
                },
                {
                    "name"      : "self_introduction_done",
                    "font_size" : 18,
                    "pos_x"     : 0,
                    "pos_y"     : 75,
                    "pos_z"     : 89.9,
                    "size_x"    : 600,
                    "size_y"    : 40,
                    "text_key"  : "UserIntroductionPostDone",
                    "justify"   : "center",
                    "v_align"   : "top",
                    "color_r"   : 44,
                    "color_g"   : 44,
                    "color_b"   : 44,
                    "color_a"   : 1.0,
                    "line_len"  : 40,
                    "wrap"      : "newline"
                },
                {
                    "name"      : "confirm_text",
                    "font_size" : 26,
                    "size_x"    : 540,
                    "size_y"    : 90,
                    "pos_x"     : 15,
                    "pos_y"     : -35,
                    "pos_z"     : 80.9,
                    "text"      : "",
                    "justify"   : "left",
                    "v_align"   : "top",
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "color_a"   : 1.0,
                    "tag"       : "confirm_ui",
                    "func"      : "text",
                    "wrap"      : "newline",
                    "line_len"  : 20
                },
                {
                    "name"      : "confirm_ok",
                    "font_size" : 20,
                    "pos_x"     : 0,
                    "pos_y"     : 144,
                    "pos_z"     : 80.9,
                    "size_x"    : 200,
                    "size_y"    : 50,
                    "color_r"   : 255,
                    "color_g"   : 255,
                    "color_b"   : 255,
                    "text"      : "OK",
                    "weight"    : "bold",
                    "justify"   : "center",
                    "func"      : "ok",
                    "tag"       : "confirm_ui"
                }
            ]
        }
    }
}
