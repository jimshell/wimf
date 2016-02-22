var Future = Npm.require( 'fibers/future' );


Meteor.methods({
	insertFood: function (name, tags, in_fridge) {
		food.insert({
				label: name.toLowerCase(),
				tags: tags,
				in_fridge: in_fridge,
				createdAt: new Date
			},
			function(error, result) {
				return false;
			}
		);
	},
	updateFood: function (id, data) {
		food.update({
				_id: id
			},
			{
				$set: data
			},
			function(error, result) {
				console.log(error, result);
			}
		);
	},
	deleteFood: function (id) {
		food.remove({_id: id},
			function(error, result) {
				console.log(error, result);
			}
		);
	},

	insertRecipe: function (name, data, ingredients, process, tags, sharelevel) {
		recipes.insert({
				label: name.toLowerCase(),
				data: data,
				ingredients: ingredients,
				process: process,
				tags: tags,
				shareLevel: sharelevel,
				createdAt: new Date
			},
			function(error, result) {
				return false;
			}
		);
	},
	updateRecipe: function (id, data) {
		recipes.update({
				_id: id
			},
			{
				$set: data
			},
			function(error, result) {
				console.log(error, result);
			}
		);
	},
	deleteRecipe: function (id) {
		recipes.remove({_id: id},
			function(error, result) {
				console.log(error, result);
			}
		);
	},

	fetchRecipe: function(url) {

	    var future = new Future();

		HTTP.call('GET', url, {}, function(error, response) {
			if (error) {
				future.return(error);
			} else {
				future.return(response.content);
			}
		});

	    return future.wait();
	}

});