var EventType={
    None:0,
    Sound:1,
    AddEffect:2,
    RemoveEffect:3
};

var EventTypeNames={};
for(var k in EventType){
    EventTypeNames[EventType[k]]=k;
}

var EventLayerPrefix="{Event}_";