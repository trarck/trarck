var Core = require('../NGCore/Client/Core').Core;
var XHR = require('../NGCore/Client/Network').Network.XHR;

var jsc = Core.Time.getRealTime(),
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rnoContent = /^(?:GET|HEAD)$/,
	rbracket = /\[\]$/,
	jsre = /\=\?(&|$)/,
	rquery = /\?/,
	rts = /([?&])_=[^&]*/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,
	rhash = /#.*$/;
// Attach a bunch of functions for handling common AJAX events
//jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
//	jQuery.fn[o] = function( f ) {
//		return this.bind(o, f);
//	};
//});

var Ajax=exports.Ajax=Core.MessageEmitter.singleton({
	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if (typeof data=='function' ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return this.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},
	getJSON: function( url, data, callback ) {
		return this.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( typeof data=='function' ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return this.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},
	ajaxSettings: {
		url: "",
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		traditional: false,
		*/
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: function() {
			return new XHR();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	ajax: function( origSettings ) {
		var s = extend(true, {}, this.ajaxSettings, origSettings),
			status, data, type = s.type.toUpperCase(), noContent = rnoContent.test(type);

		s.url = s.url.replace( rhash, "" );

		// Use original (not extended) context object if it was provided
		s.context = origSettings && origSettings.context != null ? origSettings.context : s;

		// convert data if not already a string
        //Todo format by Content-Type 0.text/html(default),1.application/x-www-form-urlencoded,2.application/json,3.application/xml
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			//s.data=this.formatData(s.data,s.Content-Type,s.traditional);
            s.data = this.param( s.data, s.traditional );
		}

		if ( s.cache === false && noContent ) {
			var ts = Core.Time.getRealTime();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts);

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for GET/HEAD requests
		if ( s.data && noContent ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && Ajax.active++ === 0 ) {
			this.chain( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		if ( !xhr ) {
			return;
		}

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set content-type if data specified and content-body is valid for this type
			if ( (s.data != null && !noContent) || (origSettings && origSettings.contentType) ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
//			if ( s.ifModified ) {
//				if ( jQuery.lastModified[s.url] ) {
//					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
//				}
//
//				if ( jQuery.etag[s.url] ) {
//					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
//				}
//			}

			// Set header so the called script knows that it's an XMLHttpRequest
			// Only send the header if it's not a remote XHR
//			if ( !remote ) {
//				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
//			}

			// Set the Accepts header for the server, depending on the dataType
//			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
//				s.accepts[ s.dataType ] + ", */*; q=0.01" :
//				s.accepts._default );
		} catch( headerError ) {}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && Ajax.active-- === 1 ) {
				this.chain( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			this.chain("ajaxSend", [xhr, s] );
		}

		// Wait for a response to come back
		var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
			// The request was aborted
			if ( !xhr || xhr.readyState === 0 || isTimeout === "abort" ) {
				// Opera doesn't call onreadystatechange before this point
				// so we simulate the call
				if ( !requestDone ) {
					Ajax.handleComplete( s, xhr, status, data );
				}

				requestDone = true;
				if ( xhr ) {
					xhr.onreadystatechange = Ajax.noop;
				}

			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;
				xhr.onreadystatechange = Ajax.noop;

				status = isTimeout === "timeout" ?
					"timeout" :
					!Ajax.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && Ajax.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				var errMsg;

				if ( status === "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = Ajax.httpData( xhr, s.dataType, s );
					} catch( parserError ) {
						status = "parsererror";
						errMsg = parserError;
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success callback
                    Ajax.handleSuccess( s, xhr, status, data );
				} else {
					Ajax.handleError( s, xhr, status, errMsg );
				}

				// Fire the complete handlers
                Ajax.handleComplete( s, xhr, status, data );

				if ( isTimeout === "timeout" ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		// Override the abort handler, if we can (IE 6 doesn't allow it, but that's OK)
		// Opera doesn't fire onreadystatechange at all on abort
		try {
			var oldAbort = xhr.abort;
			xhr.abort = function() {
				if ( xhr ) {
					// oldAbort has no call property in IE7 so
					// just do it this way, which works in all
					// browsers
					Function.prototype.call.call( oldAbort, xhr );
				}

				onreadystatechange( "abort" );
			};
		} catch( abortError ) {}

		// Timeout checker
		if ( s.async && s.timeout > 0 ) {
			setTimeout(function() {
				// Check to see if the request is still happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}

		// Send the data
		try {
			xhr.send( noContent || s.data == null ? null : s.data );

		} catch( sendError ) {
			Ajax.handleError( s, xhr, null, sendError );

			// Fire the complete handlers
			Ajax.handleComplete( s, xhr, status, data );
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},
    formatData:function(data,contentType,traditional){
        var back;
        switch (contentType) {
            case "application/x-www-form-urlencoded":
                back=this.param(data,traditional);
                break;
            case "application/json":
                back=JSON.stringify(data);
                break;
            case "application/json-deflate":
                //TODO translate to json string by deflate
                break;
            case "application/xml":
                //TODO translate to xml string
                break;
        }
        return back;
    },
	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = typeof(value)=='function' ? value() : value;
				s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = this.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form elements.
		if ( a instanceof Array) {
			// Serialize the form elements
            for(var i=0,l=a.length;i<l;i++){
				add( a[i][0],a[i][1]);
			};
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	},
    
    // Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			Ajax.chain( s, "ajaxError", [xhr, s, e] );
		}
	},

	handleSuccess: function( s, xhr, status, data ) {
		// If a local callback was specified, fire it and pass it the data
		if ( s.success ) {
			s.success.call( s.context, data, status, xhr );
		}

		// Fire the global callback
		if ( s.global ) {
			Ajax.chain("ajaxSuccess", [xhr, s] );
		}
	},

	handleComplete: function( s, xhr, status ) {
		// Process result
		if ( s.complete ) {
			s.complete.call( s.context, xhr, status );
		}

		// The request was completed
		if ( s.global ) {
			Ajax.chain("ajaxComplete", [xhr, s] );
		}

		// Handle the global AJAX counter
		if ( s.global && Ajax.active-- === 1 ) {
			Ajax.chain( "ajaxStop" );
		}
	},
	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				xhr.status >= 200 && xhr.status < 300 ||
				xhr.status === 304 || xhr.status === 1223;
		} catch(e) {}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			Ajax.lastModified[url] = lastModified;
		}

		if ( etag ) {
			Ajax.etag[url] = etag;
		}

		return xhr.status === 304;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			data = xhr.responseText;

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = JSON.parse( data );

			}else if(type==='json-deflate'){
               //todo 
            }
		}

		return data;
	},
    noop: function() {},
    isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

});

function buildParams( prefix, obj, traditional, add ) {
    var v;
	if (obj instanceof Array && obj.length ) {
		// Serialize array item.
        for(var i=0,l=obj.length;i<l;i++){
            v=obj[i];
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || v instanceof Array ? i : "" ) + "]", v, traditional, add );
			}
        }
	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		if ( Ajax.isEmptyObject( obj ) ) {
			add( prefix, "" );

		// Serialize object item.
		} else {
            for(var k in obj){
			    v=obj[k];
				buildParams( prefix + "[" + k + "]", v, traditional, add );
			};
		}
					
	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
//extend
function extend() {
	 var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && typeof target!=="function" ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( (copyIsArray = copy instanceof Array) || typeof copy=="object"   ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && src instanceof Array ? src : [];

					} else {
						clone = src && typeof src=="object" ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	return target;
};
