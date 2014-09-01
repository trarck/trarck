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

var Class = require('../../../NGCore/Client/Core/Class').Class;
var Capabilities = require('../../../NGCore/Client/Core/Capabilities').Capabilities;
var Music = require('../../../NGCore/Client/Audio/Music').Music;
var Effect = require('../../../NGCore/Client/Audio/Effect').Effect;
var ActiveEffect = require('../../../NGCore/Client/Audio/ActiveEffect').ActiveEffect;


exports.AudioPlayer = Class.singleton(
/** @lends AudioPlayer.prototype */
{
	classname: 'AudioPlayer',
	/**
	 * @class Manage audio instance and play them.
	 * @author Tatsuya Koyama
	 */
	initialize: function() {
		
		this.effects  = {};
		this.basePathEffect = 'resources/sound/';
		this.basePathMusic  = 'resources/sound/';
		
		this.volume = {
			master: 1.0,
			effect: 1.0,
			music : 1.0
		};
		this.muteModeEffect = false;
		this.muteModeMusic  = false;
		
		this.numPlayingEffect  =  0;
		this.maxPlayingEffect  = 10;
		this.playingMusicPath  = '';
		this.isMusicContinuous = false;
		
		this.oggMode = false;
	},

	/**
	 * Set SE format .ogg.
	 * @param {Boolean} mode
	 */
	setOggMode: function( mode ) {
		if (Capabilities.getPlatformOS() === 'Android') {
			this.oggMode = mode;
		}
	},
	
	_switchOgg: function( filePath ) {
		if (this.oggMode) {
			return filePath.replace( ".wav", ".ogg" );
		}
		return filePath;
	},

	/**
	 * Setting folder path.
	 * You should append last "/".
	 *
	 * @param {String} pathForEffect folder path for effect
	 * @param {String} pathForMusic folder path for music
	 */
	setBasePath: function( pathForEffect, pathForMusic ) {
		this.basePathEffect = pathForEffect;
		this.basePathMusic  = pathForMusic;
	},
	
	/**
	 * Setting mute mode.
	 * You should append last "/".
	 *
	 * @param {Boolean} modeMusic true: mute
	 * @param {Boolean} modeEffect true: mute
	 */
	setMuteMode: function( modeMusic, modeEffect ) {
		if (modeEffect === undefined) { 
			modeEffect = modeMusic;
		}
		this.muteModeEffect = modeEffect;
		this.muteModeMusic  = modeMusic;
	},
	
	/** 
	 * Toggle music mute mode(not affect to effect). 
	 */
	toggleMuteMode: function() {
		//this.muteModeEffect =  !this.muteModeMusic;
		this.muteModeMusic  =  !this.muteModeMusic;
	},
	
	/**
	 * Load effect file.
	 *
	 * @param {String} filePath effect file path
	 */
	loadEffect: function( filePath ) {

		filePath = this._switchOgg( filePath ); //workaround

		//----- already loaded
		if (this.effects[ filePath ]) { return; }
		
		this.effects[ filePath ] = new Effect( this.basePathEffect + filePath );
		this.monitorLoadedEffects(); //debug
	},
	
	/** 
	 * Load music
	 *
	 * This function doesn't load when mute, because of Android's bug.
	 *
	 * @param {String} filePath music file path
	 */
	loadMusic: function( filePath ) {
		
		//----- Android のバグが治るまで load もしない
		if (this.muteModeMusic) { return; }
		
		var path = this.basePathMusic + filePath;
		this.isMusicContinuous = (this.playingMusicPath === path);
		this.playingMusicPath  = path;
		
		if (! this.isMusicContinuous) {
			Music.setPath( path );
		}
	},
	
	/**
	 * Purge effects. 
	 *
 	 * @param {String} filePath effect file path
	 */
	purgeEffect: function( filePath ) {
	
		//----- Android の SoundPool の問題で、256 個以上の音に id を振れない問題がある。
		//----- id のカウントは Java 側で一度 SoundPool.release() しないとリセットされない。
		//----- そのため動的に load/unload を繰り返しているといつか id が 256 以上になって
		//----- 音が再生されない状態になってしまう。
		//----- ここでは一時回避として purge を行わないようにする
		return;

		filePath = this._switchOgg( filePath ); //workaround

		if (this.effects[ filePath ]) {
			this.effects[ filePath ].destroy();
			delete this.effects[ filePath ];
		}
		this.monitorLoadedEffects(); //debug
	},

	/**
	 * Play effects.
	 *  
	 * if the effect instance has not been loaded yet,
	 * try to load automatically.
	 */
	playEffect: function( filePath ) {

		filePath = this._switchOgg( filePath ); //workaround

		if (this.muteModeEffect) { 
			return; 
		}
		if (this.numPlayingEffect >= this.maxPlayingEffect) { 
			return; 
		}
		
		//----- 
		if (! this.effects[ filePath ]) { 
			this.loadEffect( filePath ); 
		}
		
		var ae = new ActiveEffect( this.effects[ filePath ] );
		ae.setVolume( this.volume.effect * this.volume.master );
		ae.play();

		this.numPlayingEffect++;
		var self = this;
		ae.getPlayCompleteEmitter().addListener( this, function() {
			self.numPlayingEffect--;
			ae.getPlayCompleteEmitter().removeListener(self);
			ae.destroy();
        });
	},

	/** 
	 * Play music.
	 */
	playMusic: function() {
		if (this.muteModeMusic) { 
			return;
		}
		if (Music.getIsPlaying() && this.isMusicContinuous) { 
			return;
		}
		Music.play();
	},
	
	/** 
	 * Stop music.
	 */
	stopMusic: function() {
		this.isMusicContinuous = false;
		if (this.muteModeMusic) { return; } //※ 一時的なAndroid のバグ対策
		Audio.Music.stop();
	},
	
	monitorLoadedEffects: function() {
		/*
		NgLogD( "############################### effects #####" );
		for (var key in this.effects) {
			NgLogD( key );
		}
		NgLogD( "############################### /effects ####" );
		*/
	}
	
});

