var uniqueLabels = [];
var uniqueRLabels = [];
var uniqueTags = [];
var uniqueRTags = [];
var foodDeps = new Tracker.Dependency();
var recipesDeps = new Tracker.Dependency();
var labelsBH;
var RlabelsBH;
var tagsBH;
var RtagsBH;

function getFood(in_fridge, limit) {
	var l   = limit ? limit : 0;
	var inf = in_fridge ? true : false;
	foodDeps.changed();

	if (in_fridge === 'All') {
		return food.find({}, {sort: {createdAt: -1}, limit: l});
	}

	return food.find({in_fridge: inf}, {sort: {createdAt: -1}, limit: l});
}

function getRecipes(limit) {
	var l = limit ? limit : 0;

	return recipes.find({}, {sort: {createdAt: -1}, limit: l});
}


function uniqueElems(all, prop) {
	var everything = all.fetch().map(function(x) {
		if (prop) {
			return x[prop];
		}

		return x;
	})
	var merged = [].concat.apply([], everything);

	return _.uniq(merged, false);
}


Template.registerHelper('url', function(routeName) {
	return FlowRouter.path(routeName);
});



Template.home.helpers({
	food: function() {
		return getFood(true, 5);
	},
	recipes: function() {
		return getRecipes(5);
	},
	lists: function() {
		return ['<li class="collection-item">', 'No shopping list in your notebook...', "<li>"].join('');
	}
});


Template.myfood.helpers({
	food: function() {
		return getFood(true);
	},
	nomore: function() {
		return getFood(false);
	},
	tagfilter: function() {
		uniqueTags = uniqueElems(food.find({tags: {$exists:true, $ne:[]}}, {fields:{tags:1}}), 'tags');

		return uniqueTags;
	},
	dynElUpdate: function() {
		foodDeps.depend();

		uniqueLabels = uniqueElems(food.find({}), 'label');

		if (!labelsBH) {
			labelsBH = new Bloodhound({
				local: uniqueLabels,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.whitespace
			});
		} else {
			labelsBH.clear();
			labelsBH.local = uniqueLabels;
		}

		if (!tagsBH) {
			tagsBH = new Bloodhound({
				local: uniqueTags,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.whitespace
			});
		} else {
			tagsBH.clear();
			tagsBH.local = uniqueTags;
		}

		labelsBH.initialize(true);
		tagsBH.initialize(true);

		Meteor.defer(function() {
			$('#search').typeahead(null, {
				source: labelsBH.ttAdapter()
			});

			$('select').material_select();

			$('input#tags').materialtags({
		 		confirmKeys: [188, 190],
				typeaheadjs: {
					source: tagsBH.ttAdapter()
				}
			});
		});
	}
});


Template.myrecipes.onRendered(function() {
	$('select').material_select();
});

Template.myrecipes.helpers({
	recipes: function() {
		return getRecipes();
	},
	tagfilter: function() {
		uniqueRTags = uniqueElems(recipes.find({tags: {$exists:true, $ne:[]}}, {fields:{tags:1}}), 'tags');

		return uniqueRTags;
	},
	dynElUpdate: function() {
		recipesDeps.depend();

		uniqueLabels = uniqueElems(food.find({}), 'label');

		if (!labelsBH) {
			labelsBH = new Bloodhound({
				local: uniqueLabels,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.whitespace
			});
		} else {
			labelsBH.clear();
			labelsBH.local = uniqueLabels;
		}

		uniqueRLabels = uniqueElems(recipes.find({}), 'label');

		if (!RlabelsBH) {
			RlabelsBH = new Bloodhound({
				local: uniqueRLabels,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.whitespace
			});
		} else {
			RlabelsBH.clear();
			RlabelsBH.local = uniqueRLabels;
		}


		if (!RtagsBH) {
			RtagsBH = new Bloodhound({
				local: uniqueTags,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.whitespace
			});
		} else {
			RtagsBH.clear();
			RtagsBH.local = uniqueTags;
		}

		labelsBH.initialize(true);
		RlabelsBH.initialize(true);
		RtagsBH.initialize(true);

		Meteor.defer(function() {
			$('#search').typeahead(null, {
				source: RlabelsBH.ttAdapter()
			});

			$('select').material_select();

			$('input#tags').materialtags({
		 		confirmKeys: [188, 190],
				typeaheadjs: {
					source: RtagsBH.ttAdapter()
				}
			});
		});
	}
});




Template.recipe.helpers({
	recipe: function() {
		var id = FlowRouter.current().params.id;
		return recipes.find({_id:id});
	}
});



Template.whattocook.onRendered(function() {
	$('#ilist').materialtags();
});

Template.whattocook.suggested_recipesDeps = new Tracker.Dependency();


Template.whattocook.helpers({
	food: function() {
		return getFood('All');
	},
	recipes: function() {
		Template.whattocook.suggested_recipesDeps.depend();

		var values = $('#ilist').materialtags('items');
		var vals = values ? values.map(function(e) { return new RegExp(['.*',e,'.*'].join(''), 'i'); }) : [];

		if ($('#allmandatory').prop('checked')) {
			return recipes.find({ingredients:{$all:vals}});
		}

		return recipes.find({ingredients:{$in:vals}});
	},
	tagfilter: function() {
		uniqueTags = uniqueElems(food.find({tags: {$exists:true, $ne:[]}}, {fields:{tags:1}}), 'tags');

		return uniqueTags;
	},
	dynElUpdate: function() {
		foodDeps.depend();

		uniqueLabels = uniqueElems(food.find({}), 'label');

		if (!labelsBH) {
			labelsBH = new Bloodhound({
				local: uniqueLabels,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.whitespace
			});
		} else {
			labelsBH.clear();
			labelsBH.local = uniqueLabels;
		}

		if (!tagsBH) {
			tagsBH = new Bloodhound({
				local: uniqueTags,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.whitespace
			});
		} else {
			tagsBH.clear();
			tagsBH.local = uniqueTags;
		}

		labelsBH.initialize(true);
		tagsBH.initialize(true);

		Meteor.defer(function() {
			$('#search').typeahead(null, {
				source: labelsBH.ttAdapter()
			});

			$('select').material_select();

			$('input#tags').materialtags({
		 		confirmKeys: [188, 190],
				typeaheadjs: {
					source: tagsBH.ttAdapter()
				}
			});
		});
	}
});