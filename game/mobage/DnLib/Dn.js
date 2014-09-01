/**
 * Dn package.
 *
 * @name Dn
 * @namespace
 */
/*
 * Copyright (c) 2011 DeNA Co., Ltd.
 * Permission is hereby granted, free of charge, to any person to obtain a copy of
 * this software and associated documentation files (collectively called
 * the "Software"), in order to exploit the Software without restriction, including
 * without limitation the permission to use, copy, modify, merge, publish,
 * distribute, and/or sublicense copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS LICENSED TO YOU "AS IS" AND WITHOUT
 * WARRANTY OF ANY KIND. DENA CO., LTD. DOES NOT AND CANNOT
 * WARRANT THE PERFORMANCE OR RESULTS YOU MAY OBTAIN BY
 * USING THE SOFTWARE. EXCEPT FOR ANY WARRANTY, CONDITION,
 * REPRESENTATION OR TERM TO THE EXTENT TO WHICH THE SAME
 * CANNOT OR MAY NOT BE EXCLUDED OR LIMITED BY LAW APPLICABLE
 * TO YOU IN YOUR JURISDICTION, DENA CO., LTD., MAKES NO
 * WARRANTIES, CONDITIONS, REPRESENTATIONS OR TERMS, EXPRESS
 * OR IMPLIED, WHETHER BY STATUTE, COMMON LAW, CUSTOM, USAGE,
 * OR OTHERWISE AS TO THE SOFTWARE OR ANY COMPONENT
 * THEREOF, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * INTEGRATION, MERCHANTABILITY,SATISFACTORY QUALITY, FITNESS
 * FOR ANY PARTICULAR PURPOSE OR NON-INFRINGEMENT OF THIRD
 * PARTY RIGHTS. IN NO EVENT SHALL DENA CO., LTD. BE LIABLE FOR
 * ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * EXPLOITATION OF THE SOFTWARE.
 */

exports.Dn = {
	Audio:					require('./Dn/Audio').Audio,
	Core:					require('./Dn/Core').Core,
	Debug:					require('./Dn/Debug').Debug,
	GL2:					require('./Dn/GL2').GL2,
	GLUI:					require('./Dn/GLUI').GLUI,
	Internal:				require('./Dn/Internal').Internal,
	Network:				require('./Dn/Network').Network,
	Scene:					require('./Dn/Scene').Scene,
	Social:					require('./Dn/Social').Social,
	UI:						require('./Dn/UI').UI,
	utils:					require('./Dn/utils').utils,

	// Alias for compatibility
	// Audio
	AudioPlayer:			require('./Dn/Audio/AudioPlayer').AudioPlayer,
	// Core
	FontFamily:				require('./Dn/Core/FontFamily').FontFamily,
	NotificationCenter:		require('./Dn/Core/NotificationCenter').NotificationCenter,
	Sync:					require('./Dn/Core/Sync').Sync,
	Timekeeper:				require('./Dn/Core/Timekeeper').Timekeeper,
	// GL2 	
	Fade:					require('./Dn/GL2/Fade').Fade,
	CutScene:				require('./Dn/GL2/CutScene').CutScene,
	GlobalTouchEmitter:		require('./Dn/GL2/GlobalTouchEmitter').GlobalTouchEmitter,
	ImageFontFactory:		require('./Dn/GL2/ImageFontFactory').ImageFontFactory,
	LayerGroup:				require('./Dn/GL2/LayerGroup').LayerGroup,
	TouchHandler:			require('./Dn/GL2/TouchHandler').TouchHandler,
	VFX:					require('./Dn/GL2/VFX').VFX,
	URLSprite:				require('./Dn/GL2/URLSprite').URLSprite,
	// GLUI
	GLUIBuilder:			require('./Dn/GLUI/GLUIBuilder').GLUIBuilder,
	// Network
	Request:				require('./Dn/Network/Request').Request,
	// Scene
	SceneDirector:			require('./Dn/Scene/SceneDirector').SceneDirector,
	NGUIViewScene:			require('./Dn/Scene/NGUIViewScene').NGUIViewScene,
	UIViewScene:			require('./Dn/Scene/UIViewScene').UIViewScene,
	GLUIViewScene:			require('./Dn/Scene/GLUIViewScene').GLUIViewScene,
	// UI
	NGUIBuilder:			require('./Dn/UI/NGUIBuilder').NGUIBuilder,
	UIBuilder:				require('./Dn/UI/UIBuilder').UIBuilder,
	// Obsolute
	MultiLineText:			require('./Dn/Obsolute/MultiLineText').MultiLineText,
	WebListView:			require('./Dn/Obsolute/WebListView').WebListView,
	WindowManager:			require('./Dn/Obsolute/WindowManager').WindowManager,
	ScreenManager:			require('./Dn/Obsolute/ScreenManager').ScreenManager,
	// Internal
	SecureRequest:			require('./Dn/Internal/SecureRequest').SecureRequest,
	ProgressIndicator:		require('./Dn/Internal/ProgressIndicator').ProgressIndicator,
	VerUpNotifier:			require('./Dn/Internal/VerUpNotifier').VerUpNotifier,
	FriendScene:			require('./Dn/Internal/FriendScene').FriendScene
	//CreateSession:		r e q u i r e('./Dn/Internal/CreateSession').CreateSession
	// Social
	//PeopleWithCache:		r e q u i r e('./Dn/Social/PeopleWithCache').PeopleWithCache
};
