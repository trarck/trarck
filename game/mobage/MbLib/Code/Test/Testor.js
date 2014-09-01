var Core = require('../../NGCore/Client/Core').Core;
var UI = require('../../NGCore/Client/UI').UI;

var EventListenerManager = require('../../MbLib/Event/EventListenerManager').EventListenerManager;
var EventObject = require('../../MbLib/Event/EventObject').EventObject;

exports.Testor=Core.Class.subclass({

    classname:"Testor",

    initialize:function  (options) {
        this._errorNum=0;
        this._successNum=0;
        this._frame=options.frame;

        this.createList();
    },
    assertEqual:function  (exp1,exp2,message) {
        if(exp1===exp2){
            this.sucess(message)
        }else{
            this.error(message)
        }
    },
    assertGreaterThan:function  (exp1,exp2,message) {
        if(exp1>exp2){
            this.sucess(message)
        }else{
            this.error(message)
        }
    },
    assertGreaterEqual:function  (exp1,exp2,message) {
        if(exp1>=exp2){
            this.sucess(message)
        }else{
            this.error(message)
        }
    },
    assertLessThan:function  (exp1,exp2,message) {
        if(exp1<exp2){
            this.sucess(message)
        }else{
            this.error(message)
        }
    },
    assertLessEqual:function  (exp1,exp2,message) {
        if(exp1<=exp2){
            this.sucess(message)
        }else{
            this.error(message)
        }
    },
    assertTrue:function  (exp1,message) {
       this.assertEqual(exp1,true,message);
    },
    assertFalse:function  (exp1,message) {
        this.assertEqual(exp1,false,message);
    },
    sucess:function  (text) {
        this._successNum++;
        this.addItem("success:"+text,"success");
    },
    error:function  (text) {
        this._errorNum++;
        this.addItem("error:"+text,"error");
    },
    createList:function  () {

        this._content=new UI.ListView({
            frame:this._frame,
            backgroundColor:"FFFF"
        });
        this._header=new UI.Label({
			'frame': [0, 0, this._frame[2], 40],
			'text': "",
			'textColor': "FF",
			'textShadow': "FF00 2.0 {0,-1}",
			'textGravity': [0, 0.5],
			'textInsets': [3, 3, 3, 3],
			'gradient': {
				'gradient': ["F0C0 0.0", "F080 1.0"],
				'innerShadow': "FF00 1.0 {0,0}"
			}
		});
        this._content.addChild(this._header);

        var sections = [];
        this._listSection = new UI.ListViewSection({
            'rowHeight':  20,
            'titleView': this._header,
            'items': []
        });
        sections.push(this._listSection);
        this._content.setSections(sections);

        UI.Window.document.addChild(this._content);
    },
    addItem:function(text,state){
        var num=this._successNum+this._errorNum;
        this._header.setText("success:"+this._successNum+"/"+num);

        var items =this._listSection.getItems();
        var item = new myListItem();
        item.data={content:text,state:state};
        items.push(item);
        this._listSection.setItems(items);
        this._listSection.flush();
        this._content.reloadData();
        this._content.reloadData();
    }
    
});
var cellBaseProperties = {
    'textSize': 16,
    'textInsets': [0, 3, 0, 3],
  //  'titleShadow': "C000 1.0 {0,-1}",
    'normalTextColor': "00"
};
var stateColor={"success":"FF006600","error":"FFFF1122"};

var myListItem = UI.ListViewItem.subclass({
    
    initialize: function()
    {
        this.setOnCreateView( this._onCreateView );
        this.setOnSetView( this._onSetView );
    },
    
    _onCreateView: function() {
        // Create and return a cell that is compatible with the data.
        return new UI.Label(cellBaseProperties);
    },

    _onSetView: function(cell) {
        cell.setText(this.data.content)
            .setTextColor(stateColor[this.data.state])
        //.setBackgroundColor(stateColor[this.data.state]);
    },
});