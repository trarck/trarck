/**
 * Dn.Internal package.
 *
 * @name Dn.Internal
 * @namespace
 * @description <p>Internal package contains modules for internal use.
 * </p>
 */

exports.Internal = {
	SecureRequest			: require('./Internal/SecureRequest').SecureRequest,
	VerUpNotifier			: require('./Internal/VerUpNotifier').VerUpNotifier,
	ProgressIndicator		: require('./Internal/ProgressIndicator').ProgressIndicator,
	EventNotifier			: require('./Internal/EventNotifier').EventNotifier,
	FriendScene				: require('./Internal/FriendScene').FriendScene
	//CreateSession:		r e q u i r e('./Internal/CreateSession').CreateSession
};
