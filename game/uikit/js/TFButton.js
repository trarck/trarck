(function () {

    var Node = yhge.renderer.html.Node;
    var Sprite = yhge.renderer.html.Sprite;
    var Text = yhge.renderer.html.Text;
    var Button = uikit.Button;

    var TFButton = yhge.core.Class(Button, {

        classname:"TFButton",

        centerOfButtonImage:0.5,

        initialize:function (image, text,type) {
            type= typeof type=="undefined"?1:type;

            this._originalSize = {width:105, height:105};
            this._originalButtonSize = {width:this._originalSize.width * 3, height:this._originalSize.height};
            this._buttonSize = {width:this._originalSize.width * 3, height:this._originalSize.height};

            this.setType(type);

            TFButton._super_.initialize.apply(this, arguments);

            this._createImage();
        },

        setType:function (type) {
            this._type = type;
            if ((this._type >= 1) && (this._type <= 4)){
                // Center of button on types 1-4 is slightly higher on the image
                this.centerOfButtonImage = 0.43;
            }
            return this;
        },
        getType:function () {
            return this._type;
        },

        _createImage:function () {
            if (this._imageNode) {
                this.removeChild(this._imageNode);
                this._imageNode.destroy();
            }

            this._imageNode = new Node();

            var middleComponent = new Sprite();
            middleComponent.setZOrder(1);
            this._imageNode.addChild(middleComponent);

            if (this._type == 0) {
                middleComponent.setImageFile('./Content/Images2x/UI/button/btn_tf2_middle_a.png');
                middleComponent.setContentSize(this._originalSize);
                middleComponent.setAnchor(0.5, 0);

            } else if (this._type >= 1 && this._type <= 4) {
                middleComponent.setImageFile('./Content/Images2x/UI/button/btn_tf_middle_a.png');
                middleComponent.setContentSize(this._originalSize);
                middleComponent.setAnchor(0.5, 0);
            } else if (this._type >= 5 && this._type <= 8) {
                middleComponent.setImageFile('./Content/Images2x/UI/button/btn_tf2_middle_a.png');
                middleComponent.setContentSize(this._originalSize);
                middleComponent.setAnchor(0.5, 0);
            } else if (this._type >= 9 && this._type <= 12) {
                middleComponent.setImageFile('./Content/Images2x/UI/button/button03_reg_mid.png');
                middleComponent.setContentSize(this._originalSize);
                middleComponent.setAnchor(0.5, 0);
            }
            middleComponent.setPosition(this._originalButtonSize.width / 2, 0);

            this._imageNode.middleComponent = middleComponent;

            var leftComponent = new Sprite();
            leftComponent.setZOrder(1);
//                leftComponent.setRelativeTransformOrigin(true);

            this._imageNode.addChild(leftComponent);

            if (this._type == 0) {
                leftComponent.setImageFile('./Content/Images2x/UI/button/btn_tf2_left_c.png');
                leftComponent.setContentSize(this._originalSize);
                leftComponent.setAnchor(0, 0);
            } else if (this._type == 3 || this._type == 4) {
                leftComponent.setImageFile('./Content/Images2x/UI/button/btn_tf_right_a.png');
                leftComponent.setContentSize(this._originalSize);
                leftComponent.setAnchor(0, 0);
                leftComponent.setFlipX(true);
            } else if (this._type == 1 || this._type == 2) {
                leftComponent.setImageFile('./Content/Images2x/UI/button/btn_tf_left_a.png');
                leftComponent.setContentSize(this._originalSize);
                leftComponent.setAnchor(0, 0);
            } else if (this._type == 8 || this._type == 7) {
                leftComponent.setImageFile('./Content/Images2x/UI/button/btn_tf2_right_a.png');
                leftComponent.setContentSize(this._originalSize);
                leftComponent.setAnchor(0, 0);
                leftComponent.setFlipX(true);
            } else if (this._type == 5 || this._type == 6) {
                leftComponent.setImageFile('./Content/Images2x/UI/button/btn_tf2_left_a.png');
                leftComponent.setContentSize(this._originalSize);
                leftComponent.setAnchor(0, 0);
            } else if (this._type == 12 || this._type == 11) {
                leftComponent.setImageFile('./Content/Images2x/UI/button/button03_reg_right.png');
                leftComponent.setContentSize(this._originalSize);
                leftComponent.setAnchor(0, 0);
                leftComponent.setFlipX(true);
            } else if (this._type == 9 || this._type == 10) {
                leftComponent.setImageFile('./Content/Images2x/UI/button/button03_reg_left.png');
                leftComponent.setContentSize(this._originalSize);
                leftComponent.setAnchor(0, 0);
            }
            this._imageNode.leftComponent = leftComponent;

            var rightComponent = new Sprite();
            rightComponent.setZOrder(1);
//                rightComponent.setRelativeTransformOrigin(true);

            this._imageNode.addChild(rightComponent);
            if (this._type == 0){
                rightComponent.setImageFile('./Content/Images2x/UI/button/btn_tf2_left_a.png');
                rightComponent.setContentSize(this._originalSize);
                rightComponent.setAnchor(1, 0);
                rightComponent.setFlipX(true);
            }else if (this._type == 2 || this._type == 4){
                rightComponent.setImageFile('./Content/Images2x/UI/button/btn_tf_left_a.png');
                rightComponent.setContentSize(this._originalSize);
                rightComponent.setAnchor(1, 0);
                rightComponent.setFlipX(true);
            }else if (this._type == 1 || this._type == 3){
                rightComponent.setImageFile('./Content/Images2x/UI/button/btn_tf_right_a.png');
                rightComponent.setContentSize(this._originalSize);
                rightComponent.setAnchor(1, 0);
            }else if (this._type == 6 || this._type == 8){
                rightComponent.setImageFile('./Content/Images2x/UI/button/btn_tf2_left_a.png');
                rightComponent.setContentSize(this._originalSize);
                rightComponent.setAnchor(1, 0);
                rightComponent.setFlipX(true);
            }else if (this._type == 5 || this._type == 7){
                rightComponent.setImageFile('./Content/Images2x/UI/button/btn_tf2_right_a.png');
                rightComponent.setContentSize(this._originalSize);
                rightComponent.setAnchor(1, 0);
            }else if (this._type == 10 || this._type == 12){
                rightComponent.setImageFile('./Content/Images2x/UI/button/button03_reg_left.png');
                rightComponent.setContentSize(this._originalSize);
                rightComponent.setAnchor(1, 0);
                rightComponent.setFlipX(true);
            }else if (this._type == 9 || this._type == 11){
                rightComponent.setImageFile('./Content/Images2x/UI/button/button03_reg_right.png');
                rightComponent.setContentSize(this._originalSize);
                rightComponent.setAnchor(1, 0);
            }
            rightComponent.setPosition(this._originalButtonSize.width, 0);
            this._imageNode.rightComponent = rightComponent;

            var anchor=this.getAnchor();
//                this._imageNode.setPosition( anchor.x*-this._originalButtonSize.width , anchor.y*-this._originalButtonSize.height);
            this.addChild(this._imageNode);

        },

        setText: function(/**String*/newText)
        {
            this._text = newText;

            if ( this._text !== undefined )
            {
                if ( !this._textNode )
                {
                    this._textNode =new Text();
                    this._textNode.setZOrder( 2 );
                    this.addChild( this._textNode );
                    this._textNode.setVisible(true);
//                    this._textNode.setAnchor(0.5,0.5);
//                    // Center of button is slightly above the image midpoint
//                    this._textNode.setPosition(this._contentSize.width/2, this._contentSize.height* this.centerOfButtonImage);
                    this._textNode.setHorizontalAlign(Text.HorizontalAlign.Center);
                    this._textNode.setVerticalAlign(Text.VerticalAlign.Middle);
                    if ((this._type >= 1) && (this._type <= 4)){
                        this._textNode.setColor( 130, 237, 247 );
                    }
                    else if ((this._type >= 5) && (this._type <= 8)){
                        this._textNode.setColor( 183, 226, 240 );
                    }
                }
                this._textNode.setText(this._text);
            } else {
                if ( this._textNode )
                {
                    this.removeChild( this._textNode );
                    this._textNode.destroy();
                    this._textNode = undefined;
                }
            }
        },

        setContentSize: function ( size )
        {
            TFButton._super_.setContentSize.apply(this, arguments);

//            if( this._textNode )
//            {
//                this._textNode.setPosition(size.width/2, size.height*this.centerOfButtonImage);
//            }

            this._buttonSize =this._contentSize;
            var centerWidth = this._buttonSize.width - this._originalSize.width * 2;
            if( this._imageNode )
            {
                if (centerWidth > 0){
                    this._imageNode.middleComponent.setVisible( true );
                    this._imageNode.middleComponent.setScale(centerWidth / this._originalSize.width ,1);
                    this._imageNode.middleComponent.setPosition(this._buttonSize.width/2,0);

                    this._imageNode.leftComponent.setScale(1, 1);
                    this._imageNode.rightComponent.setScale(1, 1);
                }
                else{
                    var scale=(this._buttonSize.width * 0.5) / this._originalSize.width;
                    this._imageNode.leftComponent.setScale(scale, 1);
                    this._imageNode.rightComponent.setScale(scale, 1);

                    this._imageNode.middleComponent.setVisible( false );
                }

                this._imageNode.rightComponent.setPosition(this._buttonSize.width,0);
//                this._imageNode.setPosition(this._anchor.x*-this._buttonSize.width , this._anchor.y*-this._buttonSize.height);
                this._imageNode.setScale(1, this._buttonSize.height/this._originalButtonSize.height);
            }
            if( this._altpicNode )
            {
                this._altpicNode.rightComponent.setPosition(this._buttonSize.width,0);

                if (centerWidth > 0){
                    this._altpicNode.middleComponent.setScale(centerWidth / this._originalSize.width ,1);
                    this._altpicNode.middleComponent.setPosition(this._buttonSize.width/2,0);
                }
                else{
                    this._altpicNode.leftComponent.setScale((this._buttonSize.width * 0.5) / this._originalSize.width, 1);
                    this._altpicNode.rightComponent.setScale((this._buttonSize.width * 0.5) / this._originalSize.width, 1);
                    this._altpicNode.middleComponent.setVisible( false );
                }

                this._altpicNode.setPosition(this._anchor.x*-this._buttonSize.width ,this._anchor.y*-this._buttonSize.height );
                this._altpicNode.setScale(1, this._buttonSize.height/this._originalButtonSize.height);
            }
        },
        setWidth:function(width){
            var size=this.getContentSize();
            size.width=width;
            this.setContentSize(size);
        },
        setHeight:function(height){
            var size=this.getContentSize();
            size.height=height;
            this.setContentSize(size);
        },
        setScaleX:function(){
            console.log("arguments:",arguments);
            TFButton._super_.setScaleX.apply(this,arguments);
        },
        setScaleY:function(){
            console.log("arguments:",arguments);
            TFButton._super_.setScaleY.apply(this,arguments);
        },
        setScale:function(){
            console.log("arguments:",arguments);
            TFButton._super_.setScale.apply(this,arguments);
        },
        setColor:function(){
//            TFButton._super_.setColor.apply(this,arguments);
        }

    });

    uikit.TFButton = TFButton;

})();