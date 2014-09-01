/**
 * Dn.GL2 package.
 *
 * @name Dn.GL2
 * @namespace
 * @description <p>UI modules built on GL2. It contains following classes:
 * 
 * <ul>
 * <li><code>{@link Dn.GL2.AvatarSprite}</code>: Extended GL2.Sprite it can accept user id as file path.</li>
 * <li><code>{@link Dn.GL2.AvatarSpriteManager}</code>: This class get several avatar URLs together.</li>
 * <li><code>{@link Dn.GL2.CutScene}</code>: CutScene makes creating cut scene easily.</li>
 * <li><code>{@link Dn.GL2.Fade}</code>: It show effect to whole screen.</li>
 * <li><code>{@link Dn.GL2.GlobalTouchEmitter}</code>: It enables several targets touch.</li>
 * <li><code>{@link Dn.GL2.ImageFontFactory}</code>: It create text image with bitmap font.
 * <li><code>{@link Dn.GL2.LayerGroup}</code>: It organizes node objects into layer and group.
 * <li><code>{@link Dn.GL2.TouchHandler}</code>: It enables smart phone like touch event like swipe, pinch in and so on.</li>
 * <li><code>{@link Dn.GL2.URLSprite}</code>: Extended GL2.Sprite it can accept URL as file path.</li>
 * <li><code>{@link Dn.GL2.VFX}</code>: Easy to use to attach animation and transformation to GL2.Node.</li>
 * </ul>
 * </p>
 */

/* Copyright (c) 2011 DeNA Co., Ltd.
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

exports.GL2 = {
	//AvatarSprite        : r e q u i r e('./GL2/AvatarSprite').AvatarSprite,
	//AvatarSpriteManager : r e q u i r e('./GL2/AvatarSpriteManager').AvatarSpriteManager
	CutScene			: require('./GL2/CutScene').CutScene,
	Fade				: require('./GL2/Fade').CutScene,
	GlobalTouchEmitter	: require('./GL2/GlobalTouchEmitter').GlobalTouchEmitter,
	ImageFontFactory	: require('./GL2/ImageFontFactory').ImageFontFactory,
	LayerGroup			: require('./GL2/LayerGroup').LayerGroup,
	TouchHandler		: require('./GL2/TouchHandler').TouchHandler,
	URLSprite			: require('./GL2/URLSprite').URLSprite,
	VFX					: require('./GL2/VFX').VFX
};
