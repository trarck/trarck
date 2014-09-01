1 listener
如果是在别的系统(类似事件的机制)上进行扩展,使用EventListenerManager比较合适。
如果是自己开发的系统，使用EventTarget或EventListenerManager或IEventTarget和EventListenerManager。
一、单独使用EventTarget，则要求所有需要事件的地对像都要继承自EventTarget，对一些存在的对象或无多继承的系统，使用起来还要做额外的功作，即使用混合。混合无法加入EventTarget构造函数，所以EventTarget无构造函数或不要太复杂。
二、EventListenerManager，虽无大问题，但使用不是很方便，每个地方都要引入EventListenerManager。
三、IEventTarget作为接口，各类实现其中方法。比较好的方法，实现的方法直接调用EventListenerManager中相应方法。  
    在已有的系统上也可以引入IEventTarget接口。
2 event
  bubbles 能否冒泡。true，表示可以冒泡，过程中可以被stopPropagation掉。
                    false，不可以冒泡，stopPropagation自然也没有用处。
  cancelable 能否取消默认操作。
                    true，可以取消。preventDefault有效果。最后默认操作执不执行，取决于preventDefault有没有调用。
                    false，不可以取消，默认操作必然执行。