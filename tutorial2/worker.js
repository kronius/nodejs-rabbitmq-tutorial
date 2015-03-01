var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection({host:'localhost'}),
		queue = false;

connection.on( 'ready' , function(){
  console.log('rabbit connected');
	queue = connection.queue(
		'task_queue',
		{autoDelete:false},
		function( q ) {
			console.log( 'queue '+q.name+' defined. Wating for message...' );
			/*******************
			$channel->basic_qos(null, 1, null); //$prefetch_size, $prefetch_count, $a_global

			********************/
			q.subscribe(
				{prefetchCount: 1},
				function( message, headers, deliveryInfo, messageObj ) {
					var data=message.data.toString('utf-8');
					var sec=( data.split('.').length-1 );
					console.log( '[X]'+data+' ('+sec+' sec)' );
					setTimeout(
						function(){
							console.log('[x] Done');
						},
						( sec * 1000 )
					);
				}
			);
			q.on('basicQosOk',function(){
				console.log('basicQosOk!!!');
			});
		}
	);
  queue.on('error', function(e){
		console.log(e)
	} );
});
connection.on( 'error' , function(e){ console.log( 'Error:', e ); } );
connection.on( 'close' , function(){console.log( 'rabbit connection closed' ); }  );