var foodSchema = new SimpleSchema({
	label: {
		type: String,
		label: 'Name'
	},
	tags: {
		type: [String],
		label: 'Tags',
		optional: true
	},
	in_fridge: {
		type: Boolean,
		label: 'In my Fridge',
		defaultValue: true
	},
	createdAt: {
		type: Date,
		optional: true
	}
});

food = new Mongo.Collection('food');
food.attachSchema(foodSchema);


var recipeSchema = new SimpleSchema({
	label: {
		type: String,
		label: 'Name'
	},
	ingredients: {
		type: [String],
		label: 'Ingredients'
	},
	data: {
		type: [String],
		label: 'Cooking Data'
	},
	process: {
		type: [String],
		label: 'Cooking Process'
	},
	tags: {
		type: [String],
		label: 'Tags',
		optional: true
	},
	shareLevel: {
		type: String,
		label: 'Share Level'
	},
	createdAt: {
		type: Date,
		optional: true
	}
});

recipes = new Mongo.Collection('recipes');
recipes.attachSchema(recipeSchema);