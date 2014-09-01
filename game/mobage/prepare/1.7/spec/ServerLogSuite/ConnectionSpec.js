describe('Connection Manager', function () {
	
	var connections = new clientLogger.Connections();
	var connectId = 'bob';
	var messages = [{id: 0, data:JSON.stringify({type:3, 
	                                             text:'first message'})},
	                {id: 1, data:JSON.stringify({type:3,
	                                             text:'second message'})},
	                {id: 2, data:JSON.stringify({type:3,
	                                             text:'third message'})},
	                {id: 3, data:JSON.stringify({type:3,
	                                             text:'fourth message'})},
	                {id: 4, data:JSON.stringify({type:3,
	                                             text:'fifth message'})},
	                {id: 5, data:JSON.stringify({type:3,
	                                             text:'sixth message'})}];
	                                             
	var resultMessages = [{id: 0, text:'first message'},
	                      {id: 1, text:'second message'},
	                      {id: 2, text:'third message'},
	                      {id: 3, text:'fourth message'},
						  {id: 4, text:'fifth message'},
						  {id: 5, text:'sixth message'}];
	
	var log;
	
	it('should create a client connection named "bob" with console output', function () {

		var id = connections.add(connectId, clientLogger.OutputFormat.Console);
		expect(id).toEqual(connectId);
		expect(connections.getConnection(connectId).outputFormat).toEqual(
			clientLogger.OutputFormat.Console);
	});
	
	// fuctionality has been disabled
	xit('should give a new unique id if there is an existing connection with the same id', function () {
		var id = connections.add(connectId, clientLogger.OutputFormat.File);
		this.after(function () { connections.delete(id); })
		expect(id).not.toEqual(connectId);
		expect(connections.getConnection(id).outputFormat).toEqual(clientLogger.OutputFormat.File);
	});

	it('should handle a few messages in order by immediately printing them out', function () {
		var messageId = 0;
		var conn = connections.getConnection(connectId);
		expect(conn).toBeTruthy();
		
		conn.setOutputFormat(clientLogger.OutputFormat.Debug);
		
		conn.addMsg({id: messageId++, data: messages[0].data}, 'log_start');
		conn.addMsg({id: messageId++, data: messages[1].data});
		conn.addMsg({id: messageId++, data: messages[2].data}, 'log_end');
		
		
		log = clientLogger.debugLog.getMessageArray();
		expect(log).toEqual(resultMessages.slice(0,3));
		clientLogger.debugLog.clear();
				
		connections.delete(connectId);
		
	});
	
	it('should handle out of order messages (small set)', function () {
		connections.add(connectId, clientLogger.OutputFormat.Debug);
		var conn = connections.getConnection(connectId);
		expect(conn).toBeTruthy();
		
		
		conn.addMsg(messages[0], 'log_start');
		conn.addMsg(messages[1]);
		conn.addMsg(messages[3], 'log_end');
		conn.addMsg(messages[2]);
	    log = clientLogger.debugLog.getMessageArray();
		expect(log).toEqual(resultMessages.slice(0,4));
		clientLogger.debugLog.clear();
		connections.delete(connectId);
	});
	
	it('should delete a connection', function () {
		connections.add(connectId, clientLogger.OutputFormat.Debug);
		connections.delete(connectId);
		expect(connections.getConnection(connectId)).not.toBeDefined();
	});
	
	it('should not add messages before a "log_start"', function () {
		connections.add(connectId, clientLogger.OutputFormat.Debug);
		var conn = connections.getConnection(connectId);
		conn.addMsg(messages[1]);
		conn.addMsg(messages[0]);
	    log = clientLogger.debugLog.getMessageArray();		
		expect(log).toEqual([]);
		conn.addMsg(messages[2], "log_start");
	    log = clientLogger.debugLog.getMessageArray();		
		expect(log).toEqual(resultMessages.slice(2,3));
		clientLogger.debugLog.clear();
	});
	
	it('should not log any repeat messages', function () {
		connections.add(connectId, clientLogger.OutputFormat.Debug);
		var conn = connections.getConnection(connectId);
		conn.addMsg(messages[0], 'log_start');
		conn.addMsg(messages[1]);
		conn.addMsg(messages[2], "log_start");
		conn.addMsg(messages[3], 'log_end');
	    log = clientLogger.debugLog.getMessageArray();		
		expect(log).toEqual([resultMessages[3]]);
		clientLogger.debugLog.clear();
	});
	
	it('should allow a second log', function () {
		var conn = connections.getConnection(connectId);
		conn.addMsg(messages[4], 'log_start');
		conn.addMsg(messages[5], 'log_end');
	    log = clientLogger.debugLog.getMessageArray();
		expect(log).toEqual(resultMessages.slice(4,6));		
		clientLogger.debugLog.clear();
		connections.delete(connectId);
	});
	
	it('should handle a bunch of messages', function () {

	    
	    connections.add(connectId, clientLogger.OutputFormat.Debug);
	    var conn = connections.getConnection(connectId);
	    
	    // create messages
	    var lotsOMessages = [];
	    var lotsOfResultMessages = [];
	    var command = '';
	    for(var i = 0; i < 15; i++) {
	        lotsOMessages[i] = {id:i, data: JSON.stringify({type: 3,
	                            text:"message" + i})};
	        lotsOfResultMessages[i] = {id:i, text:"message" + i};
	        if(i == 0) {
				command = 'log_start';
			} else if(i == 14) {
				command = 'log_end';
			} else {command = '';}
			
			conn.addMsg(lotsOMessages[i], command);
	    };
	    log = clientLogger.debugLog.getMessageArray();
	    expect(log).toEqual(lotsOfResultMessages);
	});
	
});
